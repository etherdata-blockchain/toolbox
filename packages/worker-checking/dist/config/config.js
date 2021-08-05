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
exports.ConfigParser = void 0;
var fs_1 = __importDefault(require("fs"));
var yaml_1 = __importDefault(require("yaml"));
var logger_1 = __importDefault(require("../logger"));
var remote_1 = require("../remote/remote");
var cancelable_promise_1 = __importDefault(require("cancelable-promise"));
var ConfigParser = /** @class */ (function () {
    function ConfigParser(_a) {
        var filePath = _a.filePath, concurrency = _a.concurrency;
        this.filePath = filePath;
        this.concurrency = concurrency;
    }
    /**
     * Read config from file
     */
    ConfigParser.prototype.readFile = function () {
        var file = fs_1.default.readFileSync(this.filePath, "utf-8");
        var config = yaml_1.default.parse(file);
        logger_1.default.info("Finish reading configuration file");
        this.config = config;
        return this;
    };
    /**
     * Read config from content
     * @param content YML String
     */
    ConfigParser.prototype.readString = function (content) {
        var config = yaml_1.default.parse(content);
        logger_1.default.info("Finish reading configuration string");
        this.config = config;
        return this;
    };
    ConfigParser.prototype.checkAndFixConfig = function () {
        if (this.config === undefined) {
            throw new Error("Config should not be null");
        }
        // Check if the yaml file meets the requirement
        if (this.config.logger === undefined) {
            this.config.logger = { output: "./" };
            logger_1.default.info("Use default logger output");
        }
        if (this.config.remote.length === 0) {
            throw new Error("You need to set your remote ip address");
        }
        if (this.config.steps.length === 0) {
            throw new Error("You need to set your step");
        }
        if (this.config.start_from === undefined) {
            this.config.start_from = 0;
        }
        if (this.config.login === undefined ||
            this.config.login.password === undefined ||
            this.config.login.username === undefined) {
            throw new Error("You need to set your username and password in loggin section");
        }
    };
    /**
     * Private helper method to run command
     * @param remoteIp Remote IP address
     * @param count current remote's index
     * @param onError This callback will be called when encounter error
     * @param onCommandOutput This callback will be called when command has output
     * @param onCommandEnd This callback will be called when command ends
     * @param onCommandStart This callback will be called when command starts
     * @param onDone This callback will be called when action done
     * @private
     */
    ConfigParser.prototype.runCommandHelper = function (remoteIp, count, _a) {
        var _this = this;
        var onError = _a.onError, onCommandOutput = _a.onCommandOutput, onCommandEnd = _a.onCommandEnd, onCommandStart = _a.onCommandStart, onDone = _a.onDone;
        return new cancelable_promise_1.default(function (resolve, reject, onCancel) { return __awaiter(_this, void 0, void 0, function () {
            var results, remote_2, stepLength, currentStepNumber, _i, _a, step, progress, files, directory, run, cwd, env, catch_err, name_1, with_root, result, err_1, reason;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        results = [];
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 13, , 14]);
                        onCancel(function () {
                            logger_1.default.error("Job is canceled");
                            remote_2.close();
                        });
                        if (this.config === undefined) {
                            resolve([]);
                            return [2 /*return*/];
                        }
                        remote_2 = new remote_1.Remote({
                            showOutput: this.config.output,
                            remoteIP: remoteIp,
                            password: this.config.login.password,
                            username: this.config.login.username,
                            concurrency: this.concurrency,
                        });
                        return [4 /*yield*/, remote_2.connect()];
                    case 2:
                        _b.sent();
                        logger_1.default.warning(remoteIp + ": Connected");
                        stepLength = this.config.steps.length;
                        currentStepNumber = 0;
                        _i = 0, _a = this.config.steps;
                        _b.label = 3;
                    case 3:
                        if (!(_i < _a.length)) return [3 /*break*/, 12];
                        step = _a[_i];
                        progress = currentStepNumber / (stepLength - 1);
                        files = step.files, directory = step.directory, run = step.run, cwd = step.cwd, env = step.env, catch_err = step.catch_err, name_1 = step.name, with_root = step.with_root;
                        result = undefined;
                        if (!(run !== undefined)) return [3 /*break*/, 5];
                        // Start command callback
                        if (onCommandStart !== undefined) {
                            onCommandStart(count, run, progress);
                        }
                        return [4 /*yield*/, remote_2.runCommand(count, currentStepNumber, {
                                command: run,
                                cwd: cwd,
                                envs: env,
                                catchErr: catch_err !== null && catch_err !== void 0 ? catch_err : false,
                                withRoot: with_root !== null && with_root !== void 0 ? with_root : false,
                            }, { onError: onError, onCommandOutput: onCommandOutput })];
                    case 4:
                        result = _b.sent();
                        return [3 /*break*/, 10];
                    case 5:
                        if (!(files !== undefined)) return [3 /*break*/, 7];
                        return [4 /*yield*/, remote_2.putFiles(count, currentStepNumber, files, {
                                onError: onError,
                                onCommandOutput: onCommandOutput,
                            })];
                    case 6:
                        result = _b.sent();
                        return [3 /*break*/, 10];
                    case 7:
                        if (!(directory !== undefined)) return [3 /*break*/, 9];
                        return [4 /*yield*/, remote_2.putDirectory(count, currentStepNumber, directory, {
                                onCommandOutput: onCommandOutput,
                                onError: onError,
                            })];
                    case 8:
                        result = _b.sent();
                        return [3 /*break*/, 10];
                    case 9:
                        logger_1.default.error("Nothing to run");
                        _b.label = 10;
                    case 10:
                        currentStepNumber += 1;
                        if (result) {
                            results.push(result);
                            if (onCommandEnd) {
                                onCommandEnd(count, run !== null && run !== void 0 ? run : "", progress);
                            }
                        }
                        _b.label = 11;
                    case 11:
                        _i++;
                        return [3 /*break*/, 3];
                    case 12:
                        if (onDone) {
                            onDone(count, results);
                        }
                        resolve(results);
                        return [3 /*break*/, 14];
                    case 13:
                        err_1 = _b.sent();
                        reason = "Cannot run set up on remote " + remoteIp + " because" + err_1;
                        logger_1.default.error(reason);
                        if (onError) {
                            onError(reason, count, -1, "connection", true);
                        }
                        resolve(results);
                        return [3 /*break*/, 14];
                    case 14: return [2 /*return*/];
                }
            });
        }); });
    };
    /**
     * Run Command.
     * Will run command in parallel if config.concurrency is set
     */
    ConfigParser.prototype.runRemoteCommand = function (param) {
        var _this = this;
        return new cancelable_promise_1.default(function (resolve, reject, onCancel) { return __awaiter(_this, void 0, void 0, function () {
            var returnResults, concurrency, remoteAddresses, count, _loop_1;
            var _this = this;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        returnResults = [];
                        if (this.config === undefined) {
                            throw new Error("You need to read config file first");
                        }
                        this.checkAndFixConfig();
                        logger_1.default.info("Starting job " + this.config.name);
                        concurrency = (_a = this.config.concurrency) !== null && _a !== void 0 ? _a : 1;
                        remoteAddresses = JSON.parse(JSON.stringify(this.config.remote));
                        remoteAddresses.splice(0, this.config.start_from);
                        count = 0;
                        _loop_1 = function () {
                            var remotes, promises, results;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        remotes = remoteAddresses.splice(0, concurrency);
                                        promises = remotes.map(function (r, index) {
                                            return _this.runCommandHelper(r, index + count, param);
                                        });
                                        onCancel(function () {
                                            promises.forEach(function (p) {
                                                p.cancel();
                                            });
                                        });
                                        return [4 /*yield*/, cancelable_promise_1.default.all(promises)];
                                    case 1:
                                        results = _a.sent();
                                        returnResults = returnResults.concat(results);
                                        count += remotes.length;
                                        return [2 /*return*/];
                                }
                            });
                        };
                        _b.label = 1;
                    case 1:
                        if (!(remoteAddresses.length > 0)) return [3 /*break*/, 3];
                        return [5 /*yield**/, _loop_1()];
                    case 2:
                        _b.sent();
                        return [3 /*break*/, 1];
                    case 3:
                        resolve(returnResults);
                        return [2 /*return*/];
                }
            });
        }); });
    };
    return ConfigParser;
}());
exports.ConfigParser = ConfigParser;
