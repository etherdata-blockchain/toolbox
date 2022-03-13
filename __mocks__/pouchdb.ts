import { SavedConfiguration } from "../renderer/component/remote_ssh/interface";

const mockData: SavedConfiguration = {
  filePath: "test/a.yaml",
  name: "mock_template",
  env: {
    hello: "world",
    hello_2: "world",
  },
};

export default jest.fn().mockImplementation(() => ({
  get: jest.fn().mockReturnValue(mockData),
}));
