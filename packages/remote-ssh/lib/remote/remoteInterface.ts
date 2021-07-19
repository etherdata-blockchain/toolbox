import {Directory} from "../config/config-interface";

export interface ReplaceParams {
    index: number;
}

export interface Command {
    command: string;
    name?: string
    cwd?: string;
    envs?: string[];
    catchErr: boolean;
    withRoot: boolean;
}

type CommandType = "command" | "file" | "directory"

export interface Result{
    name ?: string;
    type: CommandType;
    success: boolean;
    remote: string;
    files?: Directory[]
}