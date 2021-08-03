import ConfigParser, {Config} from "../config";

jest.mock("../logger/logger", () => {
    return {
        Logger: {
            info: jest.fn(),
            warning: jest.fn(),
            error: jest.fn()
        }
    }
})

jest.mock("node-ssh", () => {
    return {
        NodeSSH: jest.fn().mockImplementation(() => {
            return {
                connect: jest.fn().mockResolvedValue({}),
                exec: jest.fn().mockResolvedValue({}),
                execCommand: jest.fn().mockResolvedValue({}),
                putFiles: jest.fn().mockResolvedValue({})
            }
        })
    }
})

test("Simple test with concurrency 1", async () => {
    let config = new ConfigParser({filePath: "/", concurrency: 3})

    config.config = {
        logger: undefined, login: {username: "user", password: "pass"},
        name: "Test",
        output: false,
        concurrency: 1,
        steps: [{
            name: "My Command",
            run: "ls"
        }],
        remote: ["1", "2"]
    }

    let results = await config.runRemoteCommand({});
    expect(results?.length).toBe(2)
    expect(results![0][0].type).toBe("command")
})

test("Simple test with concurrency 2", async () => {
    let config = new ConfigParser({filePath: "/", concurrency: 3})

    config.config = {
        logger: undefined, login: {username: "user", password: "pass"},
        name: "Test",
        output: false,
        concurrency: 2,
        steps: [{
            name: "My Command",
            run: "ls"
        }],
        remote: ["1", "2"]
    }

    let results = await config.runRemoteCommand({});
    expect(results?.length).toBe(2)
})

test("test put files", async () => {
    let config = new ConfigParser({filePath: "/", concurrency: 3})

    config.config = {
        logger: undefined, login: {username: "user", password: "pass"},
        name: "Test",
        output: false,
        concurrency: 2,
        steps: [{
            files: [{
                local: "/a",
                remote: "/a"
            }]
        }],
        remote: ["1", "2"]
    }

    let results = await config.runRemoteCommand({});
    expect(results?.length).toBe(2)
})


test("test start from config", async () => {
    let config = new ConfigParser({filePath: "/", concurrency: 3})

    config.config = {
        logger: undefined, login: {username: "user", password: "pass"},
        name: "Test",
        output: false,
        concurrency: 2,
        start_from: 2,
        steps: [{
            files: [{
                local: "/a",
                remote: "/a"
            }]
        }],
        remote: ["1", "2", "3", "4"]
    }
    let results = await config.runRemoteCommand({});
    expect(results?.length).toBe(2)
})


test("test put files with {index}", async () => {
    let config = new ConfigParser({filePath: "/", concurrency: 3})

    config.config = {
        logger: undefined, login: {username: "user", password: "pass"},
        name: "Test",
        output: false,
        concurrency: 2,
        steps: [{
            files: [{
                local: "/a-{index}.md",
                remote: "/a"
            }]
        }],
        remote: ["1", "2"]
    }

    let results = await config.runRemoteCommand({});
    expect(results?.length).toBe(2)
    expect(results![0][0].files![0].local).toBe("/a-0.md")
    expect(results![1][0].files![0].local).toBe("/a-1.md")
})


describe("Test callbacks", () => {

    const configurations = {
        logger: undefined, login: {username: "user", password: "pass"},
        name: "Test",
        output: false,
        concurrency: 2,
        steps: [{
            files: [{
                local: "/a-{index}.md",
                remote: "/a"
            }]
        }, {
            run: "ls"
        }],
        remote: ["1", "2"]
    }

    test("On start callback", async () => {
        const onCommandStartCallback = jest.fn()
        let config = new ConfigParser({concurrency: 1, filePath: ""})
        config.config = configurations

        await config.runRemoteCommand({onCommandStart: onCommandStartCallback})
        // two remotes
        expect(onCommandStartCallback.mock.calls.length).toBe(2)
        expect(onCommandStartCallback.mock.calls[0][0]).toBe(0)
        expect(onCommandStartCallback.mock.calls[0][1]).toBe("ls")
        expect(onCommandStartCallback.mock.calls[0][2]).toBe(1)

        expect(onCommandStartCallback.mock.calls[1][0]).toBe(1)
        expect(onCommandStartCallback.mock.calls[1][1]).toBe("ls")
        expect(onCommandStartCallback.mock.calls[1][2]).toBe(1)
    })

    test("On done callback", async () => {
        const onDoneCallback = jest.fn()
        let config = new ConfigParser({concurrency: 1, filePath: ""})
        config.config = configurations

        await config.runRemoteCommand({onDone: onDoneCallback})
        // two remotes
        expect(onDoneCallback.mock.calls.length).toBe(2)
        expect(onDoneCallback.mock.calls[0][0]).toBe(0)
        expect(onDoneCallback.mock.calls[1][0]).toBe(1)
    })

})