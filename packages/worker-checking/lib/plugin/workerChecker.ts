import {BasePlugin} from "./base";
import {Callbacks, Worker, WorkerCondition, WorkerStatus} from "../interfaces";
import CancelablePromise from "cancelable-promise";


export class WorkerChecker {
    plugins: BasePlugin[]
    concurrency: number

    /**
     *
     * Start a worker checking job.
     * It will use a list of plugins to accomplish the checking.
     * @param plugins List of plugins
     * @param concurrency Number of jobs start running together
     */
    constructor(plugins: BasePlugin[], concurrency: number) {
        this.plugins = plugins
        this.concurrency = concurrency
    }

    /**
     * Checking helper function
     * @param worker
     * @param condition
     * @param callbacks
     * @private
     */
    private doCheckingHelper(worker: Worker, condition: WorkerCondition<any>, callbacks: Callbacks): CancelablePromise<WorkerStatus[]> {
        const {onDone} = callbacks
        return new CancelablePromise(async (resolve, reject, onCancel) => {
            let results: WorkerStatus[] = []
            for (let plugin of this.plugins) {
                let result = await plugin.doChecking(worker, condition)
                if (onDone) {
                    onDone(result)
                }
                results.push(result)
            }
            resolve(results)
        })
    }

    /***
     * Check workers using plugins based on condition
     * @param workers
     * @param condition
     * @param callbacks List of callbacks
     */
    doChecking(workers: Worker[], condition: WorkerCondition<any>, callbacks: Callbacks): CancelablePromise {
        return new CancelablePromise(async (resolve, reject, onCancel) => {
            /// Deep copy workers
            let copiedWorkers: Worker[] = JSON.parse(JSON.stringify(workers))
            let returnResults: WorkerStatus[][] = []

            /// Split workers into multiple parts
            while (copiedWorkers.length > 0) {
                let splitWorkers = copiedWorkers.splice(0, this.concurrency)
                let promises = splitWorkers.map((r, index) => {
                    return this.doCheckingHelper(splitWorkers[index], condition, callbacks)
                })

                onCancel(() => {
                    for (let p of promises) {
                        p.cancel()
                    }
                })

                let results = await CancelablePromise.all(promises)
                returnResults.concat(results)
            }

            resolve(returnResults)
        })
    }
}