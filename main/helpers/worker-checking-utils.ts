import { BasePlugin, Web3Plugin } from "worker-checking/dist/plugin";

export function getPluginsByName(pluginNames: string[]): BasePlugin[] {
  //TODO: Add real mapping function
  return [new Web3Plugin()];
}
