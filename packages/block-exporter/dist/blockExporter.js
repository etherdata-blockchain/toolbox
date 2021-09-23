"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlockExporter = void 0;
var cancelable_promise_1 = __importDefault(require("cancelable-promise"));
var etherdata_typescript_1 = require("etherdata-typescript");
var fs_1 = __importDefault(require("fs"));
var BlockExporter = /** @class */ (function () {
    function BlockExporter(base, port, output, concurrency) {
        this.rpc = new etherdata_typescript_1.Json_rpc_methods(base, port);
        this.blocks = [];
        this.output = output;
        this.concurrency = concurrency;
        console.log("Starting block exporter with concurrency " + this.concurrency);
    }
    BlockExporter.prototype.decimalToHexString = function (num) {
        if (num < 0) {
            num = 0xffffffff + num + 1;
        }
        return "0x" + num.toString(16).toUpperCase();
    };
    BlockExporter.prototype.checkHelper = function (blockNumber) {
        return __awaiter(this, void 0, void 0, function () {
            var blockPromises, blocks, blockString, index, _i, blocks_1, b;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        blockPromises = Array.from(Array(this.concurrency)).map(function (_, index) { return __awaiter(_this, void 0, void 0, function () {
                            var block, unclePromises, result;
                            var _this = this;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, this.rpc.getBlockByNumber(this.decimalToHexString(index + blockNumber), false)];
                                    case 1:
                                        block = _a.sent();
                                        unclePromises = block.uncles.map(function (u, i) {
                                            return _this.rpc.getUncleByBlockHashAndIndex(block.hash, _this.decimalToHexString(i));
                                        });
                                        return [4 /*yield*/, Promise.all(unclePromises)];
                                    case 2:
                                        result = _a.sent();
                                        //@ts-ignore
                                        block.uncles = result;
                                        return [2 /*return*/, block];
                                }
                            });
                        }); });
                        return [4 /*yield*/, Promise.all(blockPromises)];
                    case 1:
                        blocks = _a.sent();
                        blocks = blocks.sort(function (a, b) { return parseInt(a.number) - parseInt(b.number); });
                        blockString = "";
                        index = 0;
                        for (_i = 0, blocks_1 = blocks; _i < blocks_1.length; _i++) {
                            b = blocks_1[_i];
                            if (index > 0) {
                                blockString += ",";
                            }
                            blockString += JSON.stringify(b, null, 2);
                            index += 1;
                        }
                        return [2 /*return*/, [blocks, blockString]];
                }
            });
        });
    };
    BlockExporter.prototype.check = function (onChecking, onError) {
        var _this = this;
        return new cancelable_promise_1.default(function (resolve, reject, oncancel) { return __awaiter(_this, void 0, void 0, function () {
            var writeStream, blockNumber, _a, number, stop, _b, blocks, blockString, e_1;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        writeStream = fs_1.default.createWriteStream(this.output);
                        writeStream.write("[\n");
                        _a = parseInt;
                        return [4 /*yield*/, this.rpc.blockNumber()];
                    case 1:
                        blockNumber = _a.apply(void 0, [_c.sent()]);
                        number = 0;
                        stop = false;
                        oncancel(function () {
                            stop = true;
                        });
                        _c.label = 2;
                    case 2:
                        if (!(number < blockNumber && !stop)) return [3 /*break*/, 7];
                        _c.label = 3;
                    case 3:
                        _c.trys.push([3, 5, , 6]);
                        if (number > 1) {
                            writeStream.write(",");
                        }
                        return [4 /*yield*/, this.checkHelper(number)];
                    case 4:
                        _b = _c.sent(), blocks = _b[0], blockString = _b[1];
                        writeStream.write(blockString);
                        onChecking(number + this.concurrency, blockNumber, blocks);
                        number += this.concurrency;
                        return [3 /*break*/, 6];
                    case 5:
                        e_1 = _c.sent();
                        onError(e_1);
                        return [3 /*break*/, 6];
                    case 6: return [3 /*break*/, 2];
                    case 7:
                        writeStream.write("\n]");
                        resolve();
                        return [2 /*return*/];
                }
            });
        }); });
    };
    return BlockExporter;
}());
exports.BlockExporter = BlockExporter;
