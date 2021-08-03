export interface SavedConfiguration {
  filePath: string;
  name: string;
  env: { [key: string]: string };
}
