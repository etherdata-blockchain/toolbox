import { BasePlugin } from "../plugin/base";
import { Callbacks, Worker, WorkerCondition } from "../interfaces";
import CancelablePromise from "cancelable-promise";
export declare class WorkerChecker {
    plugins: BasePlugin[];
    concurrency: number;
    /**
     *
     * Start a worker checking job.
     * It will use a list of plugins to accomplish the checking.
     * @param plugins List of plugins
     * @param concurrency Number of jobs start running together
     */
    constructor(plugins: BasePlugin[], concurrency: number);
    /**
     * Checking helper function
     * @param worker
     * @param condition
     * @param callbacks
     * @private
     */
    private doCheckingHelper;
    /***
     * Check workers using plugins based on condition
     * @param workers
     * @param condition
     * @param callbacks List of callbacks
     */
    doChecking(workers: Worker[], condition: WorkerCondition<any>, callbacks: Callbacks): CancelablePromise;
}
