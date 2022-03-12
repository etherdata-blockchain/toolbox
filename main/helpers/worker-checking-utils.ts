import { Web3Plugin } from "@etherdata-blockchain/worker-checker";

export function getPluginsByName(pluginNames: string[]): any[] {
  //TODO: Add real mapping function
  return [new Web3Plugin()];
}
