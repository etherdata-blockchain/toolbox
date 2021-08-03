import { BasePlugin } from "../base";
import { WorkerCondition, WorkerStatus, Worker } from "../../interfaces";
export declare type Web3PluginAcceptType = "isMining" | "isSyncing" | "coinbase" | "nodeVersion" | "chainID" | "blockNumber" | "peerCount";
export declare class Web3Plugin extends BasePlugin {
    pluginName: string;
    private getWeb3URL;
    /**
     * Check whether worker is mining
     * @param worker
     * @private
     */
    private checkIsMining;
    /**
     * Check whether worker is syncing
     * @param worker
     * @private
     */
    private checkIsSyncing;
    /**
     * Check whether two worker's version is the same
     * @param worker
     * @param condition
     * @private
     */
    private checkNodeVersion;
    /**
     * Check chain id is equal
     * @param worker
     * @param condition
     * @private
     */
    private checkChainID;
    /**
     * Check block number
     * @param worker
     * @param condition
     * @private
     */
    private checkBlockNumber;
    /**
     * Check peer count
     * @param worker
     * @param condition
     * @private
     */
    private checkPeerCount;
    doChecking(worker: Worker, condition: WorkerCondition<Web3PluginAcceptType>): Promise<WorkerStatus>;
}
