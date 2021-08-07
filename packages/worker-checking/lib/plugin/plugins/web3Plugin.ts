import { BasePlugin } from "../base";
import { WorkerCondition, WorkerStatus, Worker } from "../../interfaces";
import Web3 from "web3";
import Logger from "../../logger";

export type Web3PluginAcceptType =
  | "isMining"
  | "isSyncing"
  | "coinbase"
  | "nodeVersion"
  | "chainID"
  | "blockNumber"
  | "peerCount";

export class Web3Plugin extends BasePlugin {
  pluginName: string = "Web3 Plugin";

  private getWeb3URL(ip: string): string {
    return `http://${ip}`;
  }

  /**
   * Check whether worker is mining
   * @param worker
   * @private
   */
  private async checkIsMining(
    worker: Worker
  ): Promise<[boolean, string | undefined]> {
    try {
      let web3 = new Web3(this.getWeb3URL(worker.remote));
      return [await web3.eth.isMining(), undefined];
    } catch (err) {
      Logger.error(`${this.pluginName}: ${worker.remote} => ${err}`);
      return [false, err.toString()];
    }
  }

  /**
   * Check whether worker is syncing
   * @param worker
   * @private
   */
  private async checkIsSyncing(
    worker: Worker
  ): Promise<[boolean, string | undefined]> {
    try {
      let web3 = new Web3(this.getWeb3URL(worker.remote));
      return [(await web3.eth.isSyncing()) === true, undefined];
    } catch (err) {
      Logger.error(`${this.pluginName}: ${worker.remote} => ${err}`);
      return [false, err.toString()];
    }
  }

  /**
   * Check whether two worker's version is the same
   * @param worker
   * @param condition
   * @private
   */
  private async checkNodeVersion(
    worker: Worker,
    condition: WorkerCondition<Web3PluginAcceptType>
  ): Promise<[boolean, string | undefined]> {
    const { comparison, value } = condition;
    if (comparison === "equal") {
      try {
        let admin = new Web3(this.getWeb3URL(worker.remote));
        let version = await admin.eth.getNodeInfo();
        return this.equal(version, value, "Node Version is not equal");
      } catch (err) {
        Logger.error(`${this.pluginName}: ${worker.remote} -> ${err}`);
        return [false, err.toString()];
      }
    } else {
      return [false, "Can only do equal checking on node version"];
    }
  }

  /**
   * Check chain id is equal
   * @param worker
   * @param condition
   * @private
   */
  private async checkChainID(
    worker: Worker,
    condition: WorkerCondition<Web3PluginAcceptType>
  ): Promise<[boolean, string | undefined]> {
    const { comparison, value } = condition;
    if (comparison === "equal") {
      try {
        let admin = new Web3(this.getWeb3URL(worker.remote));
        let chain = await admin.eth.getChainId();
        return this.equal(`${chain}`, value, "Chain ID is not equal");
      } catch (err) {
        Logger.error(`${this.pluginName}: ${worker.remote} -> ${err}`);
        return [false, err.toString()];
      }
    } else {
      return [false, "Can only do equal checking on chainID"];
    }
  }

  /**
   * Check chain id is equal
   * @param worker
   * @param condition
   * @private
   */
  private async checkCoinbase(
    worker: Worker,
    condition: WorkerCondition<Web3PluginAcceptType>
  ): Promise<[boolean, string | undefined]> {
    const { comparison, value } = condition;
    if (comparison === "equal") {
      try {
        let admin = new Web3(this.getWeb3URL(worker.remote));
        let coinbase = await admin.eth.getCoinbase();
        return this.equal(`${coinbase}`, value, "Coinbase is not equal");
      } catch (err) {
        Logger.error(`${this.pluginName}: ${worker.remote} -> ${err}`);
        return [false, err.toString()];
      }
    } else {
      return [false, "Can only do equal checking on coinbase"];
    }
  }

  /**
   * Check block number
   * @param worker
   * @param condition
   * @private
   */
  private async checkBlockNumber(
    worker: Worker,
    condition: WorkerCondition<Web3PluginAcceptType>
  ): Promise<[boolean, string | undefined]> {
    const { comparison, value } = condition;
    try {
      let web3 = new Web3(this.getWeb3URL(worker.remote));
      let blockNumber = await web3.eth.getBlockNumber();
      if (comparison === "greater") {
        return this.greaterThan(
          blockNumber,
          parseInt(value),
          "Block Number checking failed"
        );
      } else if (comparison === "less") {
        return this.lessThan(
          blockNumber,
          parseInt(value),
          "Block Number checking failed"
        );
      } else if (comparison === "equal") {
        return this.equal(
          blockNumber,
          parseInt(value),
          "Block Number checking failed"
        );
      } else {
        return [false, "No such method"];
      }
    } catch (err) {
      Logger.error(`${this.pluginName}: ${worker.remote} -> ${err}`);
      return [false, err.toString()];
    }
  }

  /**
   * Check peer count
   * @param worker
   * @param condition
   * @private
   */
  private async checkPeerCount(
    worker: Worker,
    condition: WorkerCondition<Web3PluginAcceptType>
  ): Promise<[boolean, string | undefined]> {
    const { comparison, value } = condition;
    try {
      let web3 = new Web3(this.getWeb3URL(worker.remote));
      let peerCount = await web3.eth.net.getPeerCount();
      if (comparison === "greater") {
        return this.greaterThan(
          peerCount,
          parseInt(value),
          "Peer Count checking failed"
        );
      } else if (comparison === "less") {
        return this.lessThan(
          peerCount,
          parseInt(value),
          "Peer Count checking failed"
        );
      } else if (comparison === "equal") {
        return this.equal(
          peerCount,
          parseInt(value),
          "Peer Count checking failed"
        );
      } else {
        return [false, "No such method"];
      }
    } catch (err) {
      Logger.error(`${this.pluginName}: ${worker.remote} -> ${err}`);
      return [false, err.toString()];
    }
  }

  async doChecking(
    worker: Worker,
    condition: WorkerCondition<Web3PluginAcceptType>
  ): Promise<WorkerStatus> {
    const { remote } = worker;
    const { workingType, comparison } = condition;

    switch (workingType) {
      case "isMining":
        let [isMining, miningErr] = await this.checkIsMining(worker);
        return {
          remote: remote,
          title: "Is Mining",
          message: miningErr ?? `${isMining}`,
          success: isMining,
        };

      case "isSyncing":
        let [isSyncing, syncingErr] = await this.checkIsSyncing(worker);
        return {
          remote: remote,
          title: "Is Syncing",
          message: syncingErr ?? `${isSyncing}`,
          success: isSyncing,
        };
      case "nodeVersion":
        let [isNodeEqual, nodeErr] = await this.checkNodeVersion(
          worker,
          condition
        );
        return {
          remote,
          title: "Node Version",
          message: nodeErr ?? `${isNodeEqual}`,
          success: isNodeEqual,
        };

      case "chainID":
        let [isChainIDEqual, chainIDErr] = await this.checkChainID(
          worker,
          condition
        );
        return {
          remote,
          title: "ChainID",
          message: chainIDErr ?? `${isChainIDEqual}`,
          success: isChainIDEqual,
        };

      case "coinbase":
        let [isCoinbaseEqual, coinbaseErr] = await this.checkCoinbase(
          worker,
          condition
        );
        return {
          remote,
          title: "Coinbase",
          message: coinbaseErr ?? `${isCoinbaseEqual}`,
          success: isCoinbaseEqual,
        };

      case "blockNumber":
        let [blockNumberResult, blockNumberErr] = await this.checkBlockNumber(
          worker,
          condition
        );
        return {
          remote,
          title: "Block Number",
          message: blockNumberErr ?? `${blockNumberResult}`,
          success: blockNumberResult,
        };
      case "peerCount":
        let [peerCountResult, peerCountErr] = await this.checkPeerCount(
          worker,
          condition
        );
        return {
          remote,
          title: "Peer Count",
          message: peerCountErr ?? `${peerCountResult}`,
          success: peerCountResult,
        };
    }
    return this.getDefaultWorkerStatus(worker);
  }
}
