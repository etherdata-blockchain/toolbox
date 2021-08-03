"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Logger = void 0;
var chalk_1 = __importDefault(require("chalk"));
var moment_1 = __importDefault(require("moment"));
var Logger = /** @class */ (function () {
    function Logger() {
    }
    Logger.info = function (message) {
        console.log("[" + chalk_1.default.blue('INFO') + "] " + chalk_1.default.gray(moment_1.default().format('hh:mm:ss')) + " " + message);
    };
    Logger.warning = function (message) {
        console.log("[" + chalk_1.default.yellow('WARNING') + "] " + chalk_1.default.gray(moment_1.default().format('hh:mm:ss')) + " " + message);
    };
    Logger.error = function (message) {
        console.log("[" + chalk_1.default.red('Error') + "] " + chalk_1.default.gray(moment_1.default().format('hh:mm:ss')) + " " + message);
    };
    return Logger;
}());
exports.Logger = Logger;
