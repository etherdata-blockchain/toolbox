import CancelablePromise from "cancelable-promise";
import { Json_rpc_methods } from "etherdata-typescript";
export declare class BlockExporter {
    rpc: Json_rpc_methods;
    blocks: any[];
    output: string;
    concurrency: number;
    constructor(base: string, port: number | undefined, output: string, concurrency: number);
    private decimalToHexString;
    private checkHelper;
    check(onChecking: (current: number, total: number, blockData: any) => void, onError: (error: any) => void): CancelablePromise<void>;
}
