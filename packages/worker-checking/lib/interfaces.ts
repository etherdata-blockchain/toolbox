export interface WorkerStatus {
  /**
   * Remote IP Address
   */
  remote: string;
  /**
   * Checking job's title
   */
  title: string;
  /**
   * Checking job's message
   */
  message: string;
  /**
   * Whether checking success
   */
  success: boolean;
}

export interface Worker {
  remote: string;
}

export type Comparison = "greater" | "less" | "equal";

export interface WorkerCondition<T> {
  /**
   * Checking type.
   */
  workingType: T;

  /**
   * Comparison condition
   */
  comparison: Comparison;
  /**
   * Comparison value
   */
  value?: any;
}

export interface Callbacks {
  /**
   * This function will be called when plugin finish one remote's checking
   * @param status Worker's status
   * @param index Current worker's index
   * @param pluginIndex Index of plugin
   */
  onDone?(status: WorkerStatus, index: number, pluginIndex: number): void;
}
