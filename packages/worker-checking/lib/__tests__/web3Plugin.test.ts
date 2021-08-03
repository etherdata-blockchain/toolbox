import {Web3Plugin} from "../plugin";
import {Worker, WorkerCondition} from "../interfaces";
import {Web3PluginAcceptType} from "../plugin/plugins/web3Plugin";

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

describe("Test Web3 plugin block number", ()=>{
    let plugin: Web3Plugin
    let worker: Worker = {
        remote: "192.168.1.100:8547",
    }

    beforeEach(()=>{
        plugin = new Web3Plugin();
    })

    test("Test block Number = 1", async ()=>{
        let condition: WorkerCondition<Web3PluginAcceptType> = {
            comparison: "equal", value: "200", workingType: "blockNumber"
        }
        let result = await plugin.doChecking(worker, condition)
        expect(result.success).toBe(true)
    })

    test("Test block Number = 2", async ()=>{
        let condition: WorkerCondition<Web3PluginAcceptType> = {
            comparison: "equal", value: 200, workingType: "blockNumber"
        }
        let result = await plugin.doChecking(worker, condition)
        expect(result.success).toBe(true)
    })

    test("Test block Number != 1", async ()=>{
        let condition: WorkerCondition<Web3PluginAcceptType> = {
            comparison: "equal", value: "300", workingType: "blockNumber"
        }
        let result = await plugin.doChecking(worker, condition)
        expect(result.success).toBe(false)
    })

    test("Test block Number !=", async ()=>{
        let condition: WorkerCondition<Web3PluginAcceptType> = {
            comparison: "equal", value: 300, workingType: "blockNumber"
        }
        let result = await plugin.doChecking(worker, condition)
        expect(result.success).toBe(false)
    })

    test("Test block Number < 1", async ()=>{
        let condition: WorkerCondition<Web3PluginAcceptType> = {
            comparison: "less", value: 300, workingType: "blockNumber"
        }
        let result = await plugin.doChecking(worker, condition)
        expect(result.success).toBe(true)
    })

    test("Test block Number < 2", async ()=>{
        let condition: WorkerCondition<Web3PluginAcceptType> = {
            comparison: "less", value: '100', workingType: "blockNumber"
        }
        let result = await plugin.doChecking(worker, condition)
        expect(result.success).toBe(false)
    })

    test("Test block Number > 1", async ()=>{
        let condition: WorkerCondition<Web3PluginAcceptType> = {
            comparison: "greater", value: 300, workingType: "blockNumber"
        }
        let result = await plugin.doChecking(worker, condition)
        expect(result.success).toBe(false)
    })

    test("Test block Number > 2", async ()=>{
        let condition: WorkerCondition<Web3PluginAcceptType> = {
            comparison: "greater", value: '100', workingType: "blockNumber"
        }
        let result = await plugin.doChecking(worker, condition)
        expect(result.success).toBe(true)
    })

    test("Test block Number error", async ()=>{
        let condition: WorkerCondition<Web3PluginAcceptType> = {
            comparison: "greater", value: 'abc', workingType: "blockNumber"
        }
        let result = await plugin.doChecking(worker, condition)
        expect(result.success).toBe(false)
    })
})

describe("Test Web3 plugin peer count", ()=>{
    let plugin: Web3Plugin
    let worker: Worker = {
        remote: "192.168.1.100:8547",
    }

    beforeEach(()=>{
        plugin = new Web3Plugin();
    })

    test("Test Peer count = 1", async ()=>{
        let condition: WorkerCondition<Web3PluginAcceptType> = {
            comparison: "equal", value: "3", workingType: "peerCount"
        }
        let result = await plugin.doChecking(worker, condition)
        expect(result.success).toBe(true)
    })

    test("Test Peer count = 2", async ()=>{
        let condition: WorkerCondition<Web3PluginAcceptType> = {
            comparison: "equal", value: 3, workingType: "peerCount"
        }
        let result = await plugin.doChecking(worker, condition)
        expect(result.success).toBe(true)
    })

    test("Test Peer count != 1", async ()=>{
        let condition: WorkerCondition<Web3PluginAcceptType> = {
            comparison: "equal", value: "4", workingType: "peerCount"
        }
        let result = await plugin.doChecking(worker, condition)
        expect(result.success).toBe(false)
    })

    test("Test Peer count !=", async ()=>{
        let condition: WorkerCondition<Web3PluginAcceptType> = {
            comparison: "equal", value: 4, workingType: "peerCount"
        }
        let result = await plugin.doChecking(worker, condition)
        expect(result.success).toBe(false)
    })

    test("Test Peer count < 1", async ()=>{
        let condition: WorkerCondition<Web3PluginAcceptType> = {
            comparison: "less", value: 4, workingType: "peerCount"
        }
        let result = await plugin.doChecking(worker, condition)
        expect(result.success).toBe(true)
    })

    test("Test Peer count < 2", async ()=>{
        let condition: WorkerCondition<Web3PluginAcceptType> = {
            comparison: "less", value: 1, workingType: "peerCount"
        }
        let result = await plugin.doChecking(worker, condition)
        expect(result.success).toBe(false)
    })

    test("Test Peer count > 1", async ()=>{
        let condition: WorkerCondition<Web3PluginAcceptType> = {
            comparison: "greater", value: 4, workingType: "peerCount"
        }
        let result = await plugin.doChecking(worker, condition)
        expect(result.success).toBe(false)
    })

    test("Test Peer count > 2", async ()=>{
        let condition: WorkerCondition<Web3PluginAcceptType> = {
            comparison: "greater", value: 1, workingType: "peerCount"
        }
        let result = await plugin.doChecking(worker, condition)
        expect(result.success).toBe(true)
    })

    test("Test Peer count error", async ()=>{
        let condition: WorkerCondition<Web3PluginAcceptType> = {
            comparison: "greater", value: 'abc', workingType: "peerCount"
        }
        let result = await plugin.doChecking(worker, condition)
        expect(result.success).toBe(false)
    })
})

describe("Test Web3 plugin is syncing/mining", ()=>{
    let plugin: Web3Plugin
    let worker: Worker = {
        remote: "192.168.1.100:8547",
    }

    beforeEach(()=>{
        plugin = new Web3Plugin();
    })

    test("Test is mining", async ()=>{
        let condition: WorkerCondition<Web3PluginAcceptType> = {
            comparison: "equal", value: 'true', workingType: "isMining"
        }
        let result = await plugin.doChecking(worker, condition)
        expect(result.success).toBe(true)
    })

    test("Test is syncing", async ()=>{
        let condition: WorkerCondition<Web3PluginAcceptType> = {
            comparison: "equal", value: 'true', workingType: "isSyncing"
        }
        let result = await plugin.doChecking(worker, condition)
        expect(result.success).toBe(true)
    })

})

describe("Test Web3 plugin check chain id", ()=>{
    let plugin: Web3Plugin
    let worker: Worker = {
        remote: "192.168.1.100:8547",
    }

    beforeEach(()=>{
        plugin = new Web3Plugin();
    })

    test("Test check chain id", async ()=>{
        let condition: WorkerCondition<Web3PluginAcceptType> = {
            comparison: "equal", value: '1', workingType: "chainID"
        }
        let result = await plugin.doChecking(worker, condition)
        expect(result.success).toBe(false)
    })

    test("Test check chain id 2", async ()=>{
        let condition: WorkerCondition<Web3PluginAcceptType> = {
            comparison: "equal", value: '3900', workingType: "chainID"
        }
        let result = await plugin.doChecking(worker, condition)
        expect(result.success).toBe(true)
    })

})