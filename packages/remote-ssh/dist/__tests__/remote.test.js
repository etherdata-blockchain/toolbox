"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var remote_1 = __importDefault(require("../remote"));
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
describe("Remote replacing test", function () {
    var ENV = process.env;
    beforeEach(function () {
        process.env = __assign(__assign({}, ENV), { docker_user: "username", docker_password: "password" });
    });
    afterEach(function () {
        process.env = ENV;
    });
    test("Simple test 1", function () {
        var remote = new remote_1.default({ concurrency: 0, password: "", remoteIP: "", showOutput: false, username: "" });
        var oldCommand = "docker login -u {docker_user} -p {docker_password}";
        var newCommand = remote.replacePlaceHolder(oldCommand, { index: 0 });
        expect(newCommand).toBe("docker login -u username -p password");
    });
    test("Simple test 2", function () {
        var remote = new remote_1.default({ concurrency: 0, password: "", remoteIP: "", showOutput: false, username: "" });
        var oldCommand = "docker login -u";
        var newCommand = remote.replacePlaceHolder(oldCommand, { index: 0 });
        expect(newCommand).toBe("docker login -u");
    });
    test("Simple test 3", function () {
        var remote = new remote_1.default({ concurrency: 0, password: "", remoteIP: "", showOutput: false, username: "" });
        var oldCommand = "";
        var newCommand = remote.replacePlaceHolder(oldCommand, { index: 0 });
        expect(newCommand).toBe("");
    });
});
