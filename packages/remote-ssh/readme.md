# Remote Config

[![Node.js CI](https://github.com/crypyto-panel/remote-config/actions/workflows/test-nodejs.yml/badge.svg)](https://github.com/crypyto-panel/remote-config/actions/workflows/test-nodejs.yml)

Run your ssh command with simple a configuration file

## Available variable
- {index}: Current remote index

## Available configs

```typescript
export interface Config {
  name: string;
  remote: string[];
  login: Login;
  logger: Logger;
  steps: Step[];
  output: boolean;
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
```
