"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BasePlugin = void 0;
var BasePlugin = /** @class */ (function () {
    function BasePlugin() {
    }
    BasePlugin.prototype.getDefaultWorkerStatus = function (worker) {
        return {
            remote: worker.remote,
            title: this.pluginName,
            message: "No Such Checkin type",
            success: false,
        };
    };
    BasePlugin.prototype.equal = function (foundValue, expectValue, errorMessage) {
        if (foundValue === expectValue) {
            return [true, undefined];
        }
        else {
            return [false, errorMessage + ", found " + foundValue + ", expect equals to " + expectValue];
        }
    };
    BasePlugin.prototype.greaterThan = function (foundValue, expectValue, errorMessage) {
        if (foundValue > expectValue) {
            return [true, undefined];
        }
        else {
            return [false, errorMessage + ", found " + foundValue + ", expect greater than " + expectValue];
        }
    };
    BasePlugin.prototype.lessThan = function (foundValue, expectValue, errorMessage) {
        if (foundValue < expectValue) {
            return [true, undefined];
        }
        else {
            return [false, errorMessage + ", found " + foundValue + ", expect less than " + expectValue];
        }
    };
    return BasePlugin;
}());
exports.BasePlugin = BasePlugin;
