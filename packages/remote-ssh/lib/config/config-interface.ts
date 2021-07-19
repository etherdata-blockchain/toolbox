export interface Config {
  name: string;
  concurrency?: number;
  remote: string[];
  login: Login;
  logger?: Logger;
  steps: Step[];
  output: boolean;
  start_from?: number;
}

export interface Logger {
  output: string;
}

export interface Login {
  username: string;
  password: string;
}

export interface Step {
  run?: string;
  catch_err?: boolean;
  files?: Directory[];
  directory?: Directory;
  env?: string[];
  cwd?: string;
  name?: string;
  with_root?: boolean;
}

export interface Directory {
  local: string;
  remote: string;
}
