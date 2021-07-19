import Remote from "../remote";

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

describe("Remote replacing test", () => {
    let ENV = process.env

    beforeEach(() => {
        process.env = {
            ...ENV,
            docker_user: "username",
            docker_password: "password"
        }
    })

    afterEach(() => {
        process.env = ENV
    })

    test("Simple test 1", () => {
        let remote = new Remote({concurrency: 0, password: "", remoteIP: "", showOutput: false, username: ""})
        let oldCommand = "docker login -u {docker_user} -p {docker_password}"
        let newCommand = remote.replacePlaceHolder(oldCommand, {index: 0})
        expect(newCommand).toBe("docker login -u username -p password")
    })

    test("Simple test 2", () => {
        let remote = new Remote({concurrency: 0, password: "", remoteIP: "", showOutput: false, username: ""})
        let oldCommand = "docker login -u"
        let newCommand = remote.replacePlaceHolder(oldCommand, {index: 0})
        expect(newCommand).toBe("docker login -u")
    })


    test("Simple test 3", () => {
        let remote = new Remote({concurrency: 0, password: "", remoteIP: "", showOutput: false, username: ""})
        let oldCommand = ""
        let newCommand = remote.replacePlaceHolder(oldCommand, {index: 0})
        expect(newCommand).toBe("")
    })
})