import {WorkerChecker} from "./plugin/workerChecker";
import {Web3Plugin} from "./plugin";
import {Worker, WorkerCondition, WorkerStatus} from "./interfaces";
import {Web3PluginAcceptType} from "./plugin/plugins/web3Plugin";

let worker: Worker = {
    remote: "165.22.104.44:8547",
}

let condition: WorkerCondition<Web3PluginAcceptType> = {
    comparison: "less", value: "2", workingType: "peerCount"
}

let checker = new WorkerChecker([new Web3Plugin()], 1)
checker.doChecking([worker], condition, {onDone(status: WorkerStatus) {
        console.log(status)
    }}).then(()=> console.log("Finished"))