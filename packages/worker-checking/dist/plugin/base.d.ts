import { Worker, WorkerCondition, WorkerStatus } from "../interfaces";
export declare abstract class BasePlugin {
    abstract pluginName: string;
    /**
     * Check whether this worker meets condition.
     * Will return a worker status indicates whether this worker
     * meets all conditions.
     *
     * @param worker Worker's information
     * @param condition Worker's condition
     */
    abstract doChecking(worker: Worker, condition: WorkerCondition<any>): Promise<WorkerStatus>;
    protected getDefaultWorkerStatus(worker: Worker): WorkerStatus;
    protected equal(foundValue: any, expectValue: any, errorMessage: string): [boolean, string | undefined];
    protected greaterThan(foundValue: any, expectValue: any, errorMessage: string): [boolean, string | undefined];
    protected lessThan(foundValue: any, expectValue: any, errorMessage: string): [boolean, string | undefined];
}
