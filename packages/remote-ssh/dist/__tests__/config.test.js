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
var config_1 = __importDefault(require("../config"));
jest.mock("../logger/logger", function () {
    return {
        Logger: {
            info: jest.fn(),
            warning: jest.fn(),
            error: jest.fn()
        }
    };
});
jest.mock("node-ssh", function () {
    return {
        NodeSSH: jest.fn().mockImplementation(function () {
            return {
                connect: jest.fn().mockResolvedValue({}),
                exec: jest.fn().mockResolvedValue({}),
                execCommand: jest.fn().mockResolvedValue({}),
                putFiles: jest.fn().mockResolvedValue({})
            };
        })
    };
});
test("Simple test with concurrency 1", function () { return __awaiter(void 0, void 0, void 0, function () {
    var config, results;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                config = new config_1.default({ filePath: "/", concurrency: 3 });
                config.config = {
                    logger: undefined, login: { username: "user", password: "pass" },
                    name: "Test",
                    output: false,
                    concurrency: 1,
                    steps: [{
                            name: "My Command",
                            run: "ls"
                        }],
                    remote: ["1", "2"]
                };
                return [4 /*yield*/, config.runRemoteCommand({})];
            case 1:
                results = _a.sent();
                expect(results === null || results === void 0 ? void 0 : results.length).toBe(2);
                expect(results[0][0].type).toBe("command");
                return [2 /*return*/];
        }
    });
}); });
test("Simple test with concurrency 2", function () { return __awaiter(void 0, void 0, void 0, function () {
    var config, results;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                config = new config_1.default({ filePath: "/", concurrency: 3 });
                config.config = {
                    logger: undefined, login: { username: "user", password: "pass" },
                    name: "Test",
                    output: false,
                    concurrency: 2,
                    steps: [{
                            name: "My Command",
                            run: "ls"
                        }],
                    remote: ["1", "2"]
                };
                return [4 /*yield*/, config.runRemoteCommand({})];
            case 1:
                results = _a.sent();
                expect(results === null || results === void 0 ? void 0 : results.length).toBe(2);
                return [2 /*return*/];
        }
    });
}); });
test("test put files", function () { return __awaiter(void 0, void 0, void 0, function () {
    var config, results;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                config = new config_1.default({ filePath: "/", concurrency: 3 });
                config.config = {
                    logger: undefined, login: { username: "user", password: "pass" },
                    name: "Test",
                    output: false,
                    concurrency: 2,
                    steps: [{
                            files: [{
                                    local: "/a",
                                    remote: "/a"
                                }]
                        }],
                    remote: ["1", "2"]
                };
                return [4 /*yield*/, config.runRemoteCommand({})];
            case 1:
                results = _a.sent();
                expect(results === null || results === void 0 ? void 0 : results.length).toBe(2);
                return [2 /*return*/];
        }
    });
}); });
test("test start from config", function () { return __awaiter(void 0, void 0, void 0, function () {
    var config, results;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                config = new config_1.default({ filePath: "/", concurrency: 3 });
                config.config = {
                    logger: undefined, login: { username: "user", password: "pass" },
                    name: "Test",
                    output: false,
                    concurrency: 2,
                    start_from: 2,
                    steps: [{
                            files: [{
                                    local: "/a",
                                    remote: "/a"
                                }]
                        }],
                    remote: ["1", "2", "3", "4"]
                };
                return [4 /*yield*/, config.runRemoteCommand({})];
            case 1:
                results = _a.sent();
                expect(results === null || results === void 0 ? void 0 : results.length).toBe(2);
                return [2 /*return*/];
        }
    });
}); });
test("test put files with {index}", function () { return __awaiter(void 0, void 0, void 0, function () {
    var config, results;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                config = new config_1.default({ filePath: "/", concurrency: 3 });
                config.config = {
                    logger: undefined, login: { username: "user", password: "pass" },
                    name: "Test",
                    output: false,
                    concurrency: 2,
                    steps: [{
                            files: [{
                                    local: "/a-{index}.md",
                                    remote: "/a"
                                }]
                        }],
                    remote: ["1", "2"]
                };
                return [4 /*yield*/, config.runRemoteCommand({})];
            case 1:
                results = _a.sent();
                expect(results === null || results === void 0 ? void 0 : results.length).toBe(2);
                expect(results[0][0].files[0].local).toBe("/a-0.md");
                expect(results[1][0].files[0].local).toBe("/a-1.md");
                return [2 /*return*/];
        }
    });
}); });
describe("Test callbacks", function () {
    var configurations = {
        logger: undefined, login: { username: "user", password: "pass" },
        name: "Test",
        output: false,
        concurrency: 2,
        steps: [{
                files: [{
                        local: "/a-{index}.md",
                        remote: "/a"
                    }]
            }, {
                run: "ls"
            }],
        remote: ["1", "2"]
    };
    test("On start callback", function () { return __awaiter(void 0, void 0, void 0, function () {
        var onCommandStartCallback, config;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    onCommandStartCallback = jest.fn();
                    config = new config_1.default({ concurrency: 1, filePath: "" });
                    config.config = configurations;
                    return [4 /*yield*/, config.runRemoteCommand({ onCommandStart: onCommandStartCallback })
                        // two remotes
                    ];
                case 1:
                    _a.sent();
                    // two remotes
                    expect(onCommandStartCallback.mock.calls.length).toBe(2);
                    expect(onCommandStartCallback.mock.calls[0][0]).toBe(0);
                    expect(onCommandStartCallback.mock.calls[0][1]).toBe("ls");
                    expect(onCommandStartCallback.mock.calls[0][2]).toBe(1);
                    expect(onCommandStartCallback.mock.calls[1][0]).toBe(1);
                    expect(onCommandStartCallback.mock.calls[1][1]).toBe("ls");
                    expect(onCommandStartCallback.mock.calls[1][2]).toBe(1);
                    return [2 /*return*/];
            }
        });
    }); });
    test("On done callback", function () { return __awaiter(void 0, void 0, void 0, function () {
        var onDoneCallback, config;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    onDoneCallback = jest.fn();
                    config = new config_1.default({ concurrency: 1, filePath: "" });
                    config.config = configurations;
                    return [4 /*yield*/, config.runRemoteCommand({ onDone: onDoneCallback })
                        // two remotes
                    ];
                case 1:
                    _a.sent();
                    // two remotes
                    expect(onDoneCallback.mock.calls.length).toBe(2);
                    expect(onDoneCallback.mock.calls[0][0]).toBe(0);
                    expect(onDoneCallback.mock.calls[1][0]).toBe(1);
                    return [2 /*return*/];
            }
        });
    }); });
});
