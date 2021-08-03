import {Worker, WorkerCondition, WorkerStatus} from "../interfaces";
import {Web3Plugin, Web3PluginAcceptType} from "../plugin/plugins/web3Plugin";
import {WorkerChecker} from "../checker/workerChecker";

jest.mock("web3", () => {
    return function () {
        return {
            setProvider: jest.fn(),
            eth: {
                getBlockNumber: jest.fn().mockResolvedValue(200),
                getChainId: jest.fn().mockResolvedValue(3900),
                isSyncing: jest.fn().mockResolvedValue(true),
                isMining: jest.fn().mockResolvedValue(true),
                net: {
                    getPeerCount: jest.fn().mockResolvedValue(3)
                }
            },

        };
    };
});

describe("Simple Worker Checker Tests", ()=>{
    let worker: Worker = {
        remote: "192.168.1.1:8547",
    }

    let condition: WorkerCondition<Web3PluginAcceptType> = {
        comparison: "equal", value: "3", workingType: "peerCount"
    }

    test("Simple Test", async()=>{
        let checker = new WorkerChecker([new Web3Plugin()], 1)
        let onDoneFunc = jest.fn()
        await checker.doChecking([worker], condition, {onDone: onDoneFunc})
        expect(onDoneFunc.mock.calls.length).toBe(1)
        expect(onDoneFunc.mock.calls[0][0].success).toBe(true)
    })

})