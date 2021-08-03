import {Worker, WorkerCondition, WorkerStatus} from "../interfaces";


export abstract class BasePlugin{
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

    protected getDefaultWorkerStatus(worker: Worker): WorkerStatus{
        return {
            remote: worker.remote,
            title: this.pluginName,
            message: "No Such Checkin type",
            success: false,
        }
    }

    protected equal(foundValue: any, expectValue: any, errorMessage: string): [boolean, string | undefined]{
        if(foundValue === expectValue){
            return [true, undefined]
        } else{
            return  [false, `${errorMessage}, found ${foundValue}, expect equals to ${expectValue}`]
        }
    }

    protected greaterThan(foundValue: any, expectValue: any, errorMessage: string): [boolean, string | undefined]{
        if(foundValue > expectValue){
            return [true, undefined]
        } else{
            return  [false, `${errorMessage}, found ${foundValue}, expect greater than ${expectValue}`]
        }
    }

    protected lessThan(foundValue: any, expectValue: any, errorMessage: string): [boolean, string | undefined]{
        if(foundValue < expectValue){
            return [true, undefined]
        } else{
            return  [false, `${errorMessage}, found ${foundValue}, expect less than ${expectValue}`]
        }
    }

}