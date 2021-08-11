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
exports.WorkerChecker = void 0;
var cancelable_promise_1 = __importDefault(require("cancelable-promise"));
var WorkerChecker = /** @class */ (function () {
    /**
     *
     * Start a worker checking job.
     * It will use a list of plugins to accomplish the checking.
     * @param plugins List of plugins
     * @param concurrency Number of jobs start running together
     */
    function WorkerChecker(plugins, concurrency) {
        this.plugins = plugins;
        this.concurrency = concurrency;
    }
    /**
     * Checking helper function
     * @param index
     * @param worker
     * @param condition
     * @param callbacks
     * @private
     */
    WorkerChecker.prototype.doCheckingHelper = function (index, worker, condition, callbacks) {
        var _this = this;
        var onDone = callbacks.onDone;
        return new cancelable_promise_1.default(function (resolve, reject, onCancel) { return __awaiter(_this, void 0, void 0, function () {
            var results, pluginIndex, _i, _a, plugin, result;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        results = [];
                        pluginIndex = 0;
                        _i = 0, _a = this.plugins;
                        _b.label = 1;
                    case 1:
                        if (!(_i < _a.length)) return [3 /*break*/, 4];
                        plugin = _a[_i];
                        return [4 /*yield*/, plugin.doChecking(worker, condition)];
                    case 2:
                        result = _b.sent();
                        if (onDone) {
                            onDone(result, index, pluginIndex);
                        }
                        results.push(result);
                        pluginIndex += 1;
                        _b.label = 3;
                    case 3:
                        _i++;
                        return [3 /*break*/, 1];
                    case 4:
                        resolve(results);
                        return [2 /*return*/];
                }
            });
        }); });
    };
    /***
     * Check workers using plugins based on condition
     * @param workers
     * @param condition
     * @param callbacks List of callbacks
     */
    WorkerChecker.prototype.doChecking = function (workers, condition, callbacks) {
        var _this = this;
        return new cancelable_promise_1.default(function (resolve, reject, onCancel) { return __awaiter(_this, void 0, void 0, function () {
            var copiedWorkers, returnResults, totalIndex, _loop_1, this_1;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        copiedWorkers = JSON.parse(JSON.stringify(workers));
                        returnResults = [];
                        totalIndex = 0;
                        _loop_1 = function () {
                            var splitWorkers, promises, results;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        splitWorkers = copiedWorkers.splice(0, this_1.concurrency);
                                        promises = splitWorkers.map(function (r, index) {
                                            return _this.doCheckingHelper(index + totalIndex, splitWorkers[index], condition, callbacks);
                                        });
                                        onCancel(function () {
                                            for (var _i = 0, promises_1 = promises; _i < promises_1.length; _i++) {
                                                var p = promises_1[_i];
                                                p.cancel();
                                            }
                                        });
                                        return [4 /*yield*/, cancelable_promise_1.default.all(promises)];
                                    case 1:
                                        results = _a.sent();
                                        returnResults = returnResults.concat(results);
                                        totalIndex += splitWorkers.length;
                                        return [2 /*return*/];
                                }
                            });
                        };
                        this_1 = this;
                        _a.label = 1;
                    case 1:
                        if (!(copiedWorkers.length > 0)) return [3 /*break*/, 3];
                        return [5 /*yield**/, _loop_1()];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 1];
                    case 3:
                        resolve(returnResults);
                        return [2 /*return*/];
                }
            });
        }); });
    };
    return WorkerChecker;
}());
exports.WorkerChecker = WorkerChecker;
