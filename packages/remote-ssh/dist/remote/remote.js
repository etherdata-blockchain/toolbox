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
exports.Remote = void 0;
var logger_1 = __importDefault(require("../logger"));
var node_ssh_1 = require("node-ssh");
var Remote = /** @class */ (function () {
    function Remote(_a) {
        var remoteIP = _a.remoteIP, username = _a.username, password = _a.password, concurrency = _a.concurrency, showOutput = _a.showOutput;
        this.remoteIP = remoteIP;
        this.username = username;
        this.password = password;
        this.concurrency = concurrency;
        this.showOutput = showOutput;
    }
    Remote.prototype.connect = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.ssh = new node_ssh_1.NodeSSH();
                        return [4 /*yield*/, this.ssh.connect({
                                host: this.remoteIP,
                                username: this.username,
                                password: this.password,
                            })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    Remote.prototype.close = function () {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_b) {
                (_a = this.ssh) === null || _a === void 0 ? void 0 : _a.dispose();
                return [2 /*return*/];
            });
        });
    };
    Remote.prototype.runCommand = function (index, progress, _a, _b) {
        var command = _a.command, envs = _a.envs, cwd = _a.cwd, catchErr = _a.catchErr, withRoot = _a.withRoot, name = _a.name;
        var onCommandOutput = _b.onCommandOutput, onError = _b.onError;
        return __awaiter(this, void 0, void 0, function () {
            var cmdName, newCommand, onErrorOutput, onStdOut, cmds;
            var _this = this;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        if (this.ssh === undefined) {
                            throw new Error("You need to connect to the remote server first");
                        }
                        cmdName = name !== null && name !== void 0 ? name : command;
                        logger_1.default.info(this.remoteIP + ": Running command " + cmdName);
                        newCommand = this.replacePlaceHolder(command, { index: index });
                        onErrorOutput = function (err) {
                            if (catchErr) {
                                if (onError) {
                                    onError(err.toString(), index, progress, cmdName, true);
                                }
                                throw new Error(err.toString());
                            }
                            else {
                                if (onError) {
                                    onError(err.toString(), index, progress, cmdName, false);
                                }
                                logger_1.default.error(err.toString());
                            }
                        };
                        onStdOut = function (out) {
                            if (onCommandOutput) {
                                onCommandOutput(index, progress, out.toString());
                            }
                            if (_this.showOutput) {
                                console.log(out.toString());
                            }
                        };
                        if (envs) {
                            // set environments
                        }
                        if (!withRoot) return [3 /*break*/, 2];
                        cmds = newCommand.split(" ");
                        return [4 /*yield*/, this.ssh.exec("sudo", cmds, {
                                cwd: cwd,
                                stdin: this.password + "\n",
                                execOptions: {
                                    pty: true,
                                },
                                onStdout: onStdOut,
                                onStderr: onErrorOutput,
                            })];
                    case 1:
                        _c.sent();
                        return [3 /*break*/, 4];
                    case 2: return [4 /*yield*/, this.ssh.execCommand(newCommand, {
                            cwd: cwd,
                            onStdout: onStdOut,
                            onStderr: onErrorOutput,
                        })];
                    case 3:
                        _c.sent();
                        _c.label = 4;
                    case 4: return [2 /*return*/, {
                            name: cmdName,
                            type: "command",
                            success: true,
                            remote: this.remoteIP,
                        }];
                }
            });
        });
    };
    Remote.prototype.putFiles = function (index, progress, files, _a) {
        var onCommandOutput = _a.onCommandOutput, onError = _a.onError;
        return __awaiter(this, void 0, void 0, function () {
            var newFiles, err_1;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (this.ssh === undefined) {
                            throw new Error("You need to connect to the remote server first");
                        }
                        newFiles = files.map(function (f) {
                            return {
                                local: _this.replacePlaceHolder(f.local, { index: index }),
                                remote: _this.replacePlaceHolder(f.remote, { index: index }),
                            };
                        });
                        logger_1.default.info(this.remoteIP + ": Copy local files " + newFiles.map(function (f) { return f.local; }));
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.ssh.putFiles(newFiles, {
                                concurrency: this.concurrency,
                            })];
                    case 2:
                        _b.sent();
                        return [2 /*return*/, {
                                remote: this.remoteIP,
                                type: "file",
                                success: true,
                                files: newFiles,
                            }];
                    case 3:
                        err_1 = _b.sent();
                        logger_1.default.error(this.remoteIP + ": " + err_1);
                        if (onError !== undefined) {
                            onError(err_1, index, progress, this.remoteIP + ": Copy local files " + newFiles.map(function (f) { return f.local; }), false);
                        }
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    Remote.prototype.putDirectory = function (index, progress, _a, _b) {
        var local = _a.local, remote = _a.remote;
        var onCommandOutput = _b.onCommandOutput, onError = _b.onError;
        return __awaiter(this, void 0, void 0, function () {
            var result, err_2;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        if (this.ssh === undefined) {
                            throw new Error("You need to connect to the remote server first");
                        }
                        _c.label = 1;
                    case 1:
                        _c.trys.push([1, 3, , 4]);
                        logger_1.default.info(this.remoteIP + ": Putting directory " + local + " to " + remote);
                        return [4 /*yield*/, this.ssh.putDirectory(local, remote, {
                                concurrency: this.concurrency,
                            })];
                    case 2:
                        result = _c.sent();
                        return [2 /*return*/, {
                                type: "directory",
                                remote: this.remoteIP,
                                success: result,
                            }];
                    case 3:
                        err_2 = _c.sent();
                        if (onError !== undefined) {
                            logger_1.default.error(this.remoteIP + ": " + err_2);
                            onError(err_2, index, progress, this.remoteIP + ": Putting directory " + local + " to " + remote, false);
                        }
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Replace command according to environments.
     * For example, docker run {name} will be replaced to docker run username.
     * When environment for name is set to username
     *
     * @param name command name
     * @param index current remote index
     */
    Remote.prototype.replacePlaceHolder = function (name, _a) {
        var index = _a.index;
        var newNameWithoutIndex = name.replace("{index}", "" + index);
        var newName = newNameWithoutIndex;
        var expression = new RegExp(/\{[^\}]*\}/g);
        while (true) {
            var arr = expression.exec(newNameWithoutIndex);
            if (arr === null) {
                break;
            }
            else {
                // {docker_username}
                var variable = arr[0];
                // docker_username
                var pureVariable = arr[0].replace("{", "").replace("}", "");
                // some_username
                var value = process.env[pureVariable];
                if (value !== undefined) {
                    // new: docker login -u {docker_username} -> docker login -u some_username
                    newName = newName.replace(variable, value);
                }
            }
        }
        return newName;
    };
    return Remote;
}());
exports.Remote = Remote;
