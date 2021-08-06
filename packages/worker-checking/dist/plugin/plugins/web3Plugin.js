"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
exports.Web3Plugin = void 0;
var base_1 = require("../base");
var web3_1 = __importDefault(require("web3"));
var logger_1 = __importDefault(require("../../logger"));
var Web3Plugin = /** @class */ (function (_super) {
    __extends(Web3Plugin, _super);
    function Web3Plugin() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.pluginName = "Web3 Plugin";
        return _this;
    }
    Web3Plugin.prototype.getWeb3URL = function (ip) {
        return "http://" + ip;
    };
    /**
     * Check whether worker is mining
     * @param worker
     * @private
     */
    Web3Plugin.prototype.checkIsMining = function (worker) {
        return __awaiter(this, void 0, void 0, function () {
            var web3, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        web3 = new web3_1.default(this.getWeb3URL(worker.remote));
                        return [4 /*yield*/, web3.eth.isMining()];
                    case 1: return [2 /*return*/, [_a.sent(), undefined]];
                    case 2:
                        err_1 = _a.sent();
                        logger_1.default.error(this.pluginName + ": " + worker.remote + " => " + err_1);
                        return [2 /*return*/, [false, err_1.toString()]];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Check whether worker is syncing
     * @param worker
     * @private
     */
    Web3Plugin.prototype.checkIsSyncing = function (worker) {
        return __awaiter(this, void 0, void 0, function () {
            var web3, err_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        web3 = new web3_1.default(this.getWeb3URL(worker.remote));
                        return [4 /*yield*/, web3.eth.isSyncing()];
                    case 1: return [2 /*return*/, [(_a.sent()) === true, undefined]];
                    case 2:
                        err_2 = _a.sent();
                        logger_1.default.error(this.pluginName + ": " + worker.remote + " => " + err_2);
                        return [2 /*return*/, [false, err_2.toString()]];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Check whether two worker's version is the same
     * @param worker
     * @param condition
     * @private
     */
    Web3Plugin.prototype.checkNodeVersion = function (worker, condition) {
        return __awaiter(this, void 0, void 0, function () {
            var comparison, value, admin, version, err_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        comparison = condition.comparison, value = condition.value;
                        if (!(comparison === "equal")) return [3 /*break*/, 5];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        admin = new web3_1.default(this.getWeb3URL(worker.remote));
                        return [4 /*yield*/, admin.eth.getNodeInfo()];
                    case 2:
                        version = _a.sent();
                        return [2 /*return*/, this.equal(version, value, "Node Version is not equal")];
                    case 3:
                        err_3 = _a.sent();
                        logger_1.default.error(this.pluginName + ": " + worker.remote + " -> " + err_3);
                        return [2 /*return*/, [false, err_3.toString()]];
                    case 4: return [3 /*break*/, 6];
                    case 5: return [2 /*return*/, [false, "Can only do equal checking on node version"]];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Check chain id is equal
     * @param worker
     * @param condition
     * @private
     */
    Web3Plugin.prototype.checkChainID = function (worker, condition) {
        return __awaiter(this, void 0, void 0, function () {
            var comparison, value, admin, chain, err_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        comparison = condition.comparison, value = condition.value;
                        if (!(comparison === "equal")) return [3 /*break*/, 5];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        admin = new web3_1.default(this.getWeb3URL(worker.remote));
                        return [4 /*yield*/, admin.eth.getChainId()];
                    case 2:
                        chain = _a.sent();
                        return [2 /*return*/, this.equal("" + chain, value, "Chain ID is not equal")];
                    case 3:
                        err_4 = _a.sent();
                        logger_1.default.error(this.pluginName + ": " + worker.remote + " -> " + err_4);
                        return [2 /*return*/, [false, err_4.toString()]];
                    case 4: return [3 /*break*/, 6];
                    case 5: return [2 /*return*/, [false, "Can only do equal checking on chainID"]];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Check chain id is equal
     * @param worker
     * @param condition
     * @private
     */
    Web3Plugin.prototype.checkCoinbase = function (worker, condition) {
        return __awaiter(this, void 0, void 0, function () {
            var comparison, value, admin, coinbase, err_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        comparison = condition.comparison, value = condition.value;
                        if (!(comparison === "equal")) return [3 /*break*/, 5];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        admin = new web3_1.default(this.getWeb3URL(worker.remote));
                        return [4 /*yield*/, admin.eth.getCoinbase()];
                    case 2:
                        coinbase = _a.sent();
                        return [2 /*return*/, this.equal("" + coinbase, value, "Coinbase is not equal")];
                    case 3:
                        err_5 = _a.sent();
                        logger_1.default.error(this.pluginName + ": " + worker.remote + " -> " + err_5);
                        return [2 /*return*/, [false, err_5.toString()]];
                    case 4: return [3 /*break*/, 6];
                    case 5: return [2 /*return*/, [false, "Can only do equal checking on coinbase"]];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Check block number
     * @param worker
     * @param condition
     * @private
     */
    Web3Plugin.prototype.checkBlockNumber = function (worker, condition) {
        return __awaiter(this, void 0, void 0, function () {
            var comparison, value, web3, blockNumber, err_6;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        comparison = condition.comparison, value = condition.value;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        web3 = new web3_1.default(this.getWeb3URL(worker.remote));
                        return [4 /*yield*/, web3.eth.getBlockNumber()];
                    case 2:
                        blockNumber = _a.sent();
                        if (comparison === "greater") {
                            return [2 /*return*/, this.greaterThan(blockNumber, parseInt(value), "Block Number checking failed")];
                        }
                        else if (comparison === "less") {
                            return [2 /*return*/, this.lessThan(blockNumber, parseInt(value), "Block Number checking failed")];
                        }
                        else if (comparison === "equal") {
                            return [2 /*return*/, this.equal(blockNumber, parseInt(value), "Block Number checking failed")];
                        }
                        else {
                            return [2 /*return*/, [false, "No such method"]];
                        }
                        return [3 /*break*/, 4];
                    case 3:
                        err_6 = _a.sent();
                        logger_1.default.error(this.pluginName + ": " + worker.remote + " -> " + err_6);
                        return [2 /*return*/, [false, err_6.toString()]];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Check peer count
     * @param worker
     * @param condition
     * @private
     */
    Web3Plugin.prototype.checkPeerCount = function (worker, condition) {
        return __awaiter(this, void 0, void 0, function () {
            var comparison, value, web3, peerCount, err_7;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        comparison = condition.comparison, value = condition.value;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        web3 = new web3_1.default(this.getWeb3URL(worker.remote));
                        return [4 /*yield*/, web3.eth.net.getPeerCount()];
                    case 2:
                        peerCount = _a.sent();
                        if (comparison === "greater") {
                            return [2 /*return*/, this.greaterThan(peerCount, parseInt(value), "Peer Count checking failed")];
                        }
                        else if (comparison === "less") {
                            return [2 /*return*/, this.lessThan(peerCount, parseInt(value), "Peer Count checking failed")];
                        }
                        else if (comparison === "equal") {
                            return [2 /*return*/, this.equal(peerCount, parseInt(value), "Peer Count checking failed")];
                        }
                        else {
                            return [2 /*return*/, [false, "No such method"]];
                        }
                        return [3 /*break*/, 4];
                    case 3:
                        err_7 = _a.sent();
                        logger_1.default.error(this.pluginName + ": " + worker.remote + " -> " + err_7);
                        return [2 /*return*/, [false, err_7.toString()]];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    Web3Plugin.prototype.doChecking = function (worker, condition) {
        return __awaiter(this, void 0, void 0, function () {
            var remote, workingType, comparison, _a, _b, isMining, miningErr, _c, isSyncing, syncingErr, _d, isNodeEqual, nodeErr, _e, isChainIDEqual, chainIDErr, _f, isCoinbaseEqual, coinbaseErr, _g, blockNumberResult, blockNumberErr, _h, peerCountResult, peerCountErr;
            return __generator(this, function (_j) {
                switch (_j.label) {
                    case 0:
                        remote = worker.remote;
                        workingType = condition.workingType, comparison = condition.comparison;
                        _a = workingType;
                        switch (_a) {
                            case "isMining": return [3 /*break*/, 1];
                            case "isSyncing": return [3 /*break*/, 3];
                            case "nodeVersion": return [3 /*break*/, 5];
                            case "chainID": return [3 /*break*/, 7];
                            case "coinbase": return [3 /*break*/, 9];
                            case "blockNumber": return [3 /*break*/, 11];
                            case "peerCount": return [3 /*break*/, 13];
                        }
                        return [3 /*break*/, 15];
                    case 1: return [4 /*yield*/, this.checkIsMining(worker)];
                    case 2:
                        _b = _j.sent(), isMining = _b[0], miningErr = _b[1];
                        return [2 /*return*/, {
                                remote: remote,
                                title: "Is Mining",
                                message: miningErr !== null && miningErr !== void 0 ? miningErr : "" + isMining,
                                success: isMining,
                            }];
                    case 3: return [4 /*yield*/, this.checkIsSyncing(worker)];
                    case 4:
                        _c = _j.sent(), isSyncing = _c[0], syncingErr = _c[1];
                        return [2 /*return*/, {
                                remote: remote,
                                title: "Is Syncing",
                                message: syncingErr !== null && syncingErr !== void 0 ? syncingErr : "" + isSyncing,
                                success: isSyncing,
                            }];
                    case 5: return [4 /*yield*/, this.checkNodeVersion(worker, condition)];
                    case 6:
                        _d = _j.sent(), isNodeEqual = _d[0], nodeErr = _d[1];
                        return [2 /*return*/, {
                                remote: remote,
                                title: "Node Version",
                                message: nodeErr !== null && nodeErr !== void 0 ? nodeErr : "" + isNodeEqual,
                                success: isNodeEqual,
                            }];
                    case 7: return [4 /*yield*/, this.checkChainID(worker, condition)];
                    case 8:
                        _e = _j.sent(), isChainIDEqual = _e[0], chainIDErr = _e[1];
                        return [2 /*return*/, {
                                remote: remote,
                                title: "ChainID",
                                message: chainIDErr !== null && chainIDErr !== void 0 ? chainIDErr : "" + isChainIDEqual,
                                success: isChainIDEqual,
                            }];
                    case 9: return [4 /*yield*/, this.checkChainID(worker, condition)];
                    case 10:
                        _f = _j.sent(), isCoinbaseEqual = _f[0], coinbaseErr = _f[1];
                        return [2 /*return*/, {
                                remote: remote,
                                title: "Coinbase",
                                message: coinbaseErr !== null && coinbaseErr !== void 0 ? coinbaseErr : "" + isCoinbaseEqual,
                                success: isCoinbaseEqual,
                            }];
                    case 11: return [4 /*yield*/, this.checkBlockNumber(worker, condition)];
                    case 12:
                        _g = _j.sent(), blockNumberResult = _g[0], blockNumberErr = _g[1];
                        return [2 /*return*/, {
                                remote: remote,
                                title: "Block Number",
                                message: blockNumberErr !== null && blockNumberErr !== void 0 ? blockNumberErr : "" + blockNumberResult,
                                success: blockNumberResult,
                            }];
                    case 13: return [4 /*yield*/, this.checkPeerCount(worker, condition)];
                    case 14:
                        _h = _j.sent(), peerCountResult = _h[0], peerCountErr = _h[1];
                        return [2 /*return*/, {
                                remote: remote,
                                title: "Peer Count",
                                message: peerCountErr !== null && peerCountErr !== void 0 ? peerCountErr : "" + peerCountResult,
                                success: peerCountResult,
                            }];
                    case 15: return [2 /*return*/, this.getDefaultWorkerStatus(worker)];
                }
            });
        });
    };
    return Web3Plugin;
}(base_1.BasePlugin));
exports.Web3Plugin = Web3Plugin;
