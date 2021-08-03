import { Config } from "./config-interface";
import { Result } from "../remote";
import CancelablePromise from "cancelable-promise";
interface Param {
    filePath: string;
    concurrency: number;
}
export interface CommandOutput {
    /**
     * Command output
     */
    output: string;
    /**
     * Remote's index
     */
    index: number;
    /**
     * Action's index
     */
    progress: number;
}
export interface WorkerStatus {
    remoteIP: string;
    currentProgress?: number;
    isFinished: boolean;
    outputs: CommandOutput[];
    errors: CommandOutput[];
    errorStopped: boolean;
    results: Result[];
    /**
     * Will include both errors and outputs
     */
    totalOutputs: CommandOutput[];
}
interface RunCommandParam {
    /**
     * This callback will be called when command starts
     * @param index Current remote's index
     * @param command Running command
     * @param progress Action's index
     */
    onCommandStart?(index: number, command: string, progress: number): void;
    /**
     * This callback will be called when error occurs
     * @param err Error message
     * @param index Current remote's index
     * @param progress Current action's index
     * @param command Which command causes error
     * @param errorStopped Whether the worker has stopped
     */
    onError?(err: any, index: number, progress: number, command: string, errorStopped: boolean): void;
    /**
     *  This callback will be called when worker finished all actions
     * @param index Remote's index
     * @param results Actions' results
     */
    onDone?(index: number, results: Result[]): void;
    /**
     * This callback will be called when command finished running
     * @param index Remote's index
     * @param command Which command
     * @param progress Action's index
     */
    onCommandEnd?(index: number, command: string, progress: number): void;
    /**
     * This callback will be called when command is producing outputs
     * @param index Remote's index
     * @param progress Current action's index
     * @param output Command's outputs
     */
    onCommandOutput?(index: number, progress: number, output: string): void;
}
export declare class ConfigParser {
    private readonly filePath;
    config: Config | undefined;
    private readonly concurrency;
    constructor({ filePath, concurrency }: Param);
    /**
     * Read config from file
     */
    readFile(): this;
    /**
     * Read config from content
     * @param content YML String
     */
    readString(content: string): this;
    private checkAndFixConfig;
    /**
     * Private helper method to run command
     * @param remoteIp Remote IP address
     * @param count current remote's index
     * @param onError This callback will be called when encounter error
     * @param onCommandOutput This callback will be called when command has output
     * @param onCommandEnd This callback will be called when command ends
     * @param onCommandStart This callback will be called when command starts
     * @param onDone This callback will be called when action done
     * @private
     */
    private runCommandHelper;
    /**
     * Run Command.
     * Will run command in parallel if config.concurrency is set
     */
    runRemoteCommand(param: RunCommandParam): CancelablePromise<Result[][] | undefined>;
}
export {};
