import ConfigParser from "./config";
import {Result} from "./remote";
import Logger from "./logger";

(async () => {
    const config = new ConfigParser({
        filePath: "YOUR_FILE_PATH",
        concurrency: 2,
    });

    config.readFile()

    await config.runRemoteCommand({
        onCommandEnd(index: number, command: string, progress: number) {
            Logger.warning(`Current progress: ${progress}`)
        },
        onError(err: any, index: number, progress: number, command: string, errorStopped: boolean) {
        },
        onDone(index: number, results: Result[]) {
            Logger.warning("Command done!")
        },
        onCommandOutput(index: number, progress: number, output: string) {
            Logger.info(`${index}: ${output}`)
        },
        onCommandStart(index: number, command: string, progress: number) {
        }
    });
})()