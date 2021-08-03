import { Directory } from "../config/config-interface";
import { Command, ReplaceParams, Result } from "./remoteInterface";
interface Param {
    remoteIP: string;
    username: string;
    password: string;
    concurrency: number;
    showOutput: boolean;
}
interface CommandParam {
    onError?(err: any, index: number, progress: number, command: string, errorStopped: boolean): void;
    onCommandOutput?(index: number, progress: number, output: string): void;
}
export declare class Remote {
    private readonly remoteIP;
    private readonly username;
    private readonly password;
    private readonly concurrency;
    private ssh;
    private readonly showOutput;
    constructor({ remoteIP, username, password, concurrency, showOutput, }: Param);
    connect(): Promise<void>;
    close(): Promise<void>;
    runCommand(index: number, progress: number, { command, envs, cwd, catchErr, withRoot, name }: Command, { onCommandOutput, onError }: CommandParam): Promise<Result | undefined>;
    putFiles(index: number, progress: number, files: Directory[], { onCommandOutput, onError }: CommandParam): Promise<Result | undefined>;
    putDirectory(index: number, progress: number, { local, remote }: Directory, { onCommandOutput, onError }: CommandParam): Promise<Result | undefined>;
    /**
     * Replace command according to environments.
     * For example, docker run {name} will be replaced to docker run username.
     * When environment for name is set to username
     *
     * @param name command name
     * @param index current remote index
     */
    replacePlaceHolder(name: string, { index }: ReplaceParams): string;
}
export {};
