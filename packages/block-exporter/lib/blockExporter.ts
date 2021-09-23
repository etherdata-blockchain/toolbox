import CancelablePromise from "cancelable-promise";
import { Json_rpc_methods } from "etherdata-typescript";
import fs from "fs";

export class BlockExporter {
  rpc: Json_rpc_methods;
  blocks: any[];
  output: string;
  concurrency: number;

  constructor(
    base: string,
    port: number | undefined,
    output: string,
    concurrency: number
  ) {
    this.rpc = new Json_rpc_methods(base, port);
    this.blocks = [];
    this.output = output;
    this.concurrency = concurrency;
    console.log("Starting block exporter with concurrency " + this.concurrency);
  }

  private decimalToHexString(num: number) {
    if (num < 0) {
      num = 0xffffffff + num + 1;
    }

    return "0x" + num.toString(16).toUpperCase();
  }

  private async checkHelper(blockNumber: number): Promise<[any[], string]> {
    let blockPromises = Array.from(Array(this.concurrency)).map(
      async (_, index) => {
        let block = await this.rpc.getBlockByNumber(
          this.decimalToHexString(index + blockNumber),
          false
        );

        const unclePromises = block.uncles.map((u, i) =>
          this.rpc.getUncleByBlockHashAndIndex(
            block.hash,
            this.decimalToHexString(i)
          )
        );

        let result = await Promise.all(unclePromises);
        //@ts-ignore
        block.uncles = result;
        return block;
      }
    );

    let blocks = await Promise.all(blockPromises);
    blocks = blocks.sort((a, b) => parseInt(a.number) - parseInt(b.number));
    let blockString = "";
    let index = 0;
    for (let b of blocks) {
      if (index > 0) {
        blockString += ",";
      }
      blockString += JSON.stringify(b, null, 2);
      index += 1;
    }

    return [blocks, blockString];
  }

  check(
    onChecking: (current: number, total: number, blockData: any) => void,
    onError: (error: any) => void
  ): CancelablePromise<void> {
    return new CancelablePromise(async (resolve, reject, oncancel) => {
      let writeStream = fs.createWriteStream(this.output);
      writeStream.write("[\n");

      let blockNumber = parseInt(await this.rpc.blockNumber());
      let number = 0;
      let stop = false;
      oncancel(() => {
        stop = true;
      });

      while (number < blockNumber && !stop) {
        try {
          if (number > 1) {
            writeStream.write(",");
          }
          let [blocks, blockString] = await this.checkHelper(number);

          writeStream.write(blockString);
          onChecking(number + this.concurrency, blockNumber, blocks);
          number += this.concurrency;
        } catch (e) {
          onError(e);
        }
      }
      writeStream.write("\n]");
      resolve();
    });
  }
}
