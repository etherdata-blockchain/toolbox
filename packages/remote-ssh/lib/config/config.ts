import fs from "fs";
import YAML from "yaml";
import { Config, Logger as ConfigLogger, Login } from "./config-interface";
import Logger from "../logger";
import { Remote } from "../remote/remote";
import { Result } from "../remote";

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
  onError?(
    err: any,
    index: number,
    progress: number,
    command: string,
    errorStopped: boolean
  ): void;

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

export class ConfigParser {
  private readonly filePath: string;
  config: Config | undefined;
  private readonly concurrency: number;

  constructor({ filePath, concurrency }: Param) {
    this.filePath = filePath;
    this.concurrency = concurrency;
  }

  /**
   * Read config from file
   */
  readFile() {
    let file = fs.readFileSync(this.filePath, "utf-8");
    let config: Config = YAML.parse(file);
    Logger.info("Finish reading configuration file");
    this.config = config;
    return this;
  }

  /**
   * Read config from content
   * @param content YML String
   */
  readString(content: string) {
    let config: Config = YAML.parse(content);
    Logger.info("Finish reading configuration string");
    this.config = config;
    return this;
  }

  private checkAndFixConfig() {
    if (this.config === undefined) {
      throw new Error("Config should not be null");
    }
    // Check if the yaml file meets the requirement
    if (this.config.logger === undefined) {
      this.config.logger = { output: "./" };
      Logger.info("Use default logger output");
    }
    if (this.config.remote.length === 0) {
      throw new Error("You need to set your remote ip address");
    }

    if (this.config.steps.length === 0) {
      throw new Error("You need to set your step");
    }

    if (this.config.start_from === undefined) {
      this.config.start_from = 0;
    }

    if (
      this.config.login === undefined ||
      this.config.login.password === undefined ||
      this.config.login.username === undefined
    ) {
      throw new Error(
        "You need to set your username and password in loggin section"
      );
    }
  }

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
  private async runCommandHelper(
    remoteIp: string,
    count: number,
    {
      onError,
      onCommandOutput,
      onCommandEnd,
      onCommandStart,
      onDone,
    }: RunCommandParam
  ): Promise<Result[]> {
    let results: Result[] = [];
    try {
      if (this.config === undefined) {
        return [];
      }

      // Setup remote
      let remote = new Remote({
        showOutput: this.config.output,
        remoteIP: remoteIp,
        password: this.config.login.password,
        username: this.config.login.username,
        concurrency: this.concurrency,
      });

      await remote.connect();
      Logger.warning(`${remoteIp}: Connected`);
      let stepLength = this.config.steps.length;
      let currentStepNumber = 0;
      // run step
      for (let step of this.config!.steps) {
        let progress = currentStepNumber / (stepLength - 1);
        const { files, directory, run, cwd, env, catch_err, name, with_root } =
          step;
        let result: Result | undefined = undefined;
        // start running command
        if (run !== undefined) {
          // Start command callback

          if (onCommandStart !== undefined) {
            onCommandStart(count, run, progress);
          }

          result = await remote.runCommand(
            count,
            currentStepNumber,
            {
              command: run,
              cwd,
              envs: env,
              catchErr: catch_err ?? false,
              withRoot: with_root ?? false,
            },
            { onError, onCommandOutput }
          );
        } else if (files !== undefined) {
          result = await remote.putFiles(count, currentStepNumber, files, {
            onError,
            onCommandOutput,
          });
        } else if (directory !== undefined) {
          result = await remote.putDirectory(
            count,
            currentStepNumber,
            directory,
            {
              onCommandOutput,
              onError,
            }
          );
        } else {
          Logger.error("Nothing to run");
        }

        currentStepNumber += 1;
        if (result) {
          results.push(result);
          if (onCommandEnd) {
            onCommandEnd(count, run ?? "", progress);
          }
        }
      }
      if (onDone) {
        onDone(count, results);
      }
      return results;
    } catch (err) {
      let reason = "Cannot run set up on remote " + remoteIp + " because" + err;
      Logger.error(reason);
      if (onError) {
        onError(reason, count, -1, "connection", true);
      }
      return results;
    }
  }

  /**
   * Run Command.
   * Will run command in parallel if config.concurrency is set
   */
  async runRemoteCommand(
    param: RunCommandParam
  ): Promise<Result[][] | undefined> {
    let returnResults: Result[][] = [];
    if (this.config === undefined) {
      throw new Error("You need to read config file first");
    }
    this.checkAndFixConfig();
    Logger.info("Starting job " + this.config.name);
    let concurrency = this.config.concurrency ?? 1;
    // Perform deep copy
    let remoteAddresses: string[] = JSON.parse(
      JSON.stringify(this.config.remote)
    );

    remoteAddresses.splice(0, this.config.start_from);
    let count = 0;
    while (remoteAddresses.length > 0) {
      // Split array into a small size of chunk
      let remotes = remoteAddresses.splice(0, concurrency);
      let promises = remotes.map((r, index) =>
        this.runCommandHelper(r, index + count, param)
      );
      let results = await Promise.all(promises);
      returnResults = returnResults.concat(results);
      count += remotes.length;
    }

    return returnResults;
  }
}
