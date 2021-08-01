import { Directory } from "../config/config-interface";
import Logger from "../logger";
import { Command, ReplaceParams, Result } from "./remoteInterface";
import { NodeSSH } from "node-ssh";

interface Param {
  remoteIP: string;
  username: string;
  password: string;
  concurrency: number;
  showOutput: boolean;
}

interface CommandParam {
  onError?(
    err: any,
    index: number,
    progress: number,
    command: string,
    errorStopped: boolean
  ): void;

  onCommandOutput?(index: number, progress: number, output: string): void;
}

export class Remote {
  private readonly remoteIP: string;
  private readonly username: string;
  private readonly password: string;
  private readonly concurrency: number;
  private ssh: NodeSSH | undefined;
  private readonly showOutput: boolean;

  constructor({
    remoteIP,
    username,
    password,
    concurrency,
    showOutput,
  }: Param) {
    this.remoteIP = remoteIP;
    this.username = username;
    this.password = password;
    this.concurrency = concurrency;
    this.showOutput = showOutput;
  }

  async connect() {
    this.ssh = new NodeSSH();
    await this.ssh.connect({
      host: this.remoteIP,
      username: this.username,
      password: this.password,
    });
  }

  async close() {
    this.ssh?.dispose();
  }

  async runCommand(
    index: number,
    progress: number,
    { command, envs, cwd, catchErr, withRoot, name }: Command,
    { onCommandOutput, onError }: CommandParam
  ): Promise<Result | undefined> {
    if (this.ssh === undefined) {
      throw new Error("You need to connect to the remote server first");
    }
    // Logging
    let cmdName = name ?? command;
    Logger.info(`${this.remoteIP}: Running command ${cmdName}`);
    // Run command
    let newCommand = this.replacePlaceHolder(command, { index });

    // on Error output
    const onErrorOutput = (err: Buffer) => {
      if (catchErr) {
        if (onError) {
          onError(err.toString(), index, progress, cmdName, true);
        }
        throw new Error(err.toString());
      } else {
        if (onError) {
          onError(err.toString(), index, progress, cmdName, false);
        }
        Logger.error(err.toString());
      }
    };

    const onStdOut = (out: Buffer) => {
      if (onCommandOutput) {
        onCommandOutput(index, progress, out.toString());
      }
      if (this.showOutput) {
        console.log(out.toString());
      }
    };

    if (envs) {
      // set environments
    }

    if (withRoot) {
      let cmds = newCommand.split(" ");
      await this.ssh.exec("sudo", cmds, {
        cwd,
        stdin: this.password + "\n",
        execOptions: {
          pty: true,
        },
        onStdout: onStdOut,
        onStderr: onErrorOutput,
      });
    } else {
      await this.ssh.execCommand(newCommand, {
        cwd,
        onStdout: onStdOut,
        onStderr: onErrorOutput,
      });
    }

    return {
      name: cmdName,
      type: "command",
      success: true,
      remote: this.remoteIP,
    };
  }

  async putFiles(
    index: number,
    progress: number,
    files: Directory[],
    { onCommandOutput, onError }: CommandParam
  ): Promise<Result | undefined> {
    if (this.ssh === undefined) {
      throw new Error("You need to connect to the remote server first");
    }
    let newFiles = files.map((f) => {
      return {
        local: this.replacePlaceHolder(f.local, { index }),
        remote: this.replacePlaceHolder(f.remote, { index }),
      };
    });

    Logger.info(
      `${this.remoteIP}: Copy local files ` + newFiles.map((f) => f.local)
    );
    try {
      await this.ssh.putFiles(newFiles, {
        concurrency: this.concurrency,
      });

      return {
        remote: this.remoteIP,
        type: "file",
        success: true,
        files: newFiles,
      };
    } catch (err) {
      Logger.error(`${this.remoteIP}: ${err}`);

      if (onError !== undefined) {
        onError(
          err,
          index,
          progress,
          `${this.remoteIP}: Copy local files ` + newFiles.map((f) => f.local),
          false
        );
      }
    }
  }

  async putDirectory(
    index: number,
    progress: number,
    { local, remote }: Directory,
    { onCommandOutput, onError }: CommandParam
  ): Promise<Result | undefined> {
    if (this.ssh === undefined) {
      throw new Error("You need to connect to the remote server first");
    }

    try {
      Logger.info(`${this.remoteIP}: Putting directory ${local} to ${remote}`);
      let result = await this.ssh.putDirectory(local, remote, {
        concurrency: this.concurrency,
      });

      return {
        type: "directory",
        remote: this.remoteIP,
        success: result,
      };
    } catch (err) {
      if (onError !== undefined) {
        Logger.error(`${this.remoteIP}: ${err}`);
        onError(
          err,
          index,
          progress,
          `${this.remoteIP}: Putting directory ${local} to ${remote}`,
          false
        );
      }
    }
  }

  /**
   * Replace command according to environments.
   * For example, docker run {name} will be replaced to docker run username.
   * When environment for name is set to username
   *
   * @param name command name
   * @param index current remote index
   */
  replacePlaceHolder(name: string, { index }: ReplaceParams) {
    let newNameWithoutIndex = name.replace("{index}", `${index}`);
    let newName = newNameWithoutIndex;
    let expression = new RegExp(/\{[^\}]*\}/g);
    while (true) {
      let arr = expression.exec(newNameWithoutIndex);
      if (arr === null) {
        break;
      } else {
        // {docker_username}
        let variable = arr[0];
        // docker_username
        let pureVariable = arr[0].replace("{", "").replace("}", "");
        // some_username
        let value = process.env[pureVariable];
        if (value !== undefined) {
          // new: docker login -u {docker_username} -> docker login -u some_username
          newName = newName.replace(variable, value);
        }
      }
    }

    return newName;
  }
}
