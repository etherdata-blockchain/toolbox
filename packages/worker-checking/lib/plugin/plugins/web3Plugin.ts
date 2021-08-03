import {BasePlugin} from "../base";
import {WorkerCondition, WorkerStatus, Worker} from "../../interfaces";
import Web3 from "web3"
import {Admin} from 'web3-eth-admin';
import Logger from "../../logger";

export type Web3PluginAcceptType = "isMining" | "isSyncing" | "coinbase" | "nodeVersion" | "chainID"

export class Web3Plugin extends BasePlugin{

    pluginName: string = "Web3 Plugin"

    private getWeb3URL(ip: string): string{
        return `http://${ip}`
    }

    /**
     * Check whether worker is mining
     * @param worker
     * @private
     */
    private async checkIsMining(worker: Worker): Promise<[boolean, string | undefined]>{
        try{
            let web3 = new Web3(this.getWeb3URL(worker.remote))
            return [await web3.eth.isMining(), undefined]
        } catch (err){
            Logger.error(`${this.pluginName}: ${worker.remote} => ${err}`)
            return [false, err.toString()]
        }
    }

    /**
     * Check whether worker is syncing
     * @param worker
     * @private
     */
    private async checkIsSyncing(worker: Worker): Promise<[boolean, string | undefined]>{
        try{
            let web3 = new Web3(this.getWeb3URL(worker.remote))
            return [await web3.eth.isSyncing() === false, undefined]
        } catch (err){
            Logger.error(`${this.pluginName}: ${worker.remote} => ${err}`)
            return [false, err.toString()]
        }
    }

    /**
     * Check whether two worker's version is the same
     * @param worker
     * @param condition
     * @private
     */
    private async checkNodeVersion(worker: Worker, condition: WorkerCondition<Web3PluginAcceptType>): Promise<[boolean, string | undefined]>{
        const { comparison, value } = condition
        if(comparison === "equal"){
            try {
                let admin = new Web3(this.getWeb3URL(worker.remote))
                let version = await admin.eth.getNodeInfo()
                if(version === value){
                    return [true, undefined]
                } else{
                    return [false, `Version is not equal, found ${version} expect ${value}`]
                }

            } catch (err){
                Logger.error(`${this.pluginName}: ${worker.remote} -> ${err}`)
                return [false, err.toString()]
            }

        } else{
            return [false, "Can only do equal checking on node version"]
        }
    }

    /**
     * Check chain id is equal
     * @param worker
     * @param condition
     * @private
     */
    private async checkChainID(worker: Worker, condition: WorkerCondition<Web3PluginAcceptType>): Promise<[boolean, string | undefined]>{
        const { comparison, value } = condition
        if(comparison === "equal"){
            try {
                let admin = new Web3(this.getWeb3URL(worker.remote))
                let chain = await admin.eth.getChainId()
                if(`${chain}` === value){
                    return [true, undefined]
                } else {
                    return [false, `Chain id is not equal, found ${chain} expect ${value}`]
                }

            } catch (err){
                Logger.error(`${this.pluginName}: ${worker.remote} -> ${err}`)
                return [false, err.toString()]
            }

        } else{
            return [false, "Can only do equal checking on chainID"]
        }
    }

    async doChecking(worker: Worker, condition: WorkerCondition<Web3PluginAcceptType>): Promise<WorkerStatus> {
        const { remote } = worker
        const { workingType, comparison } = condition

        switch (workingType){
            case "isMining":
                let [isMining, miningErr] = await this.checkIsMining(worker)
                return {
                    remote: remote,
                    title: "Is Mining",
                    message: miningErr ?? `${isMining}`,
                    success: isMining,
                }

            case "isSyncing":
                let [isSyncing, syncingErr] = await this.checkIsSyncing(worker)
                return {
                    remote: remote,
                    title: "Is Syncing",
                    message: syncingErr ?? `${isSyncing}`,
                    success: isSyncing,
                }
            case "nodeVersion":
                let [isNodeEqual, nodeErr] = await this.checkNodeVersion(worker, condition)
                return {
                    remote,
                    title: "Node Version",
                    message: nodeErr ?? `${isNodeEqual}`,
                    success: isNodeEqual,
                }

            case "chainID":
                let [isChainIDEqual, chainIDErr] = await this.checkChainID(worker, condition)
                return {
                    remote,
                    title: "ChainID",
                    message: chainIDErr ?? `${isChainIDEqual}`,
                    success: isChainIDEqual,
                }
        }
        return this.getDefaultWorkerStatus(worker)
    }
}