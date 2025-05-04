import { randomUUID } from "node:crypto";
import fs from "node:fs/promises";

import { compileAndRun, execFn } from "../helpers/index.js";

async function jsMiddlewareOne(req, res, next) {
    const dirPath = `workspaces/javascript/${randomUUID()}`;
    const { language, source_code, cmd_args } = req.body;

    req.dirPath = dirPath;

    try {
        await fs.mkdir(dirPath, { recursive: true });
        await fs.writeFile(`${dirPath}/code.js`, source_code);

        const command = `time -p node ${dirPath}/code.js`;

        req.command = cmd_args ? command + " " + cmd_args : command;
        req.processInfo = { language };
        return next();

    } catch (error) {
        console.log("Middleware1-js:\n", error);
        return next();
    }
}

async function pyMiddlewareOne(req, res, next) {
    const dirPath = `workspaces/python/${randomUUID()}`;
    const { language, source_code, cmd_args } = req.body;

    req.dirPath = dirPath;

    try {
        await fs.mkdir(dirPath, { recursive: true });
        await fs.writeFile(`${dirPath}/code.py`, source_code);

        const command = `time -p python3 ${dirPath}/code.py`;

        req.command = cmd_args ? command + " " + cmd_args : command;
        req.processInfo = { language };
        return next();

    } catch (error) {
        console.log("Middleware1-py:\n", error);
        return next();
    }
}

async function shMiddlewareOne(req, res, next) {
    const dirPath = `workspaces/bash/${randomUUID()}`;
    const { language, source_code, cmd_args } = req.body;

    req.dirPath = dirPath;

    try {
        await fs.mkdir(dirPath, { recursive: true });
        await fs.writeFile(`${dirPath}/code.sh`, source_code);

        const command = `time -p bash ${dirPath}/code.sh`;

        req.command = cmd_args ? command + " " + cmd_args : command;
        req.processInfo = { language };
        return next();

    } catch (error) {
        console.log("Middleware1-sh:\n", error);
        return next();
    }
}

async function rbMiddlewareOne(req, res, next) {
    const dirPath = `workspaces/ruby/${randomUUID()}`;
    const { language, source_code, cmd_args } = req.body;

    req.dirPath = dirPath;

    try {
        await fs.mkdir(dirPath, { recursive: true });
        await fs.writeFile(`${dirPath}/code.rb`, source_code);

        const command = `time -p ruby ${dirPath}/code.rb`;

        req.command = cmd_args ? command + " " + cmd_args : command;
        req.processInfo = { language };
        return next();

    } catch (error) {
        console.log("Middleware1-rb:\n", error);
        return next();
    }
}

async function interpretedLanguageMiddlewareTwo(req, res, next) {
    try {
        const { command } = req;
        const output = await execFn(command);
        const exitCode = output.code;

        if (exitCode != null) {
            output.msg = exitCode ? "Runtime Error" : "Executed Successfully";
            const timeMetrics = output.stderr.match(/(real|user|sys)\s+\d+\.\d+/g).slice(-3);

            output.time = timeMetrics.reduce((acc, str) => {
                const arr = str.split(" ");
                acc[arr[0]] = `${arr[1]}s`;
                return acc;
            }, {});
        }
        else output.msg = "Process Terminated! The Program must adhere to a runtime of 4s and memory usage of 90KB."

        const { heapUsed, heapTotal, rss } = process.memoryUsage();

        output.memory = {
            heapUsed: `${Math.floor(heapUsed / (1024 * 1024))}MB`,
            heapTotal: `${Math.floor(heapTotal / (1024 * 1024))}MB`,
            rss: `${Math.floor(rss / (1024 * 1024))}MB`
        };

        req.processInfo = { ...output, ...req.processInfo };
        await fs.rm(req.dirPath, { recursive: true, force: true });
        return next();

    } catch (error) {
        console.log("Middleware2-interpreted :", error);
        await fs.rm(req.dirPath, { recursive: true, force: true });
        return next();
    }
}

async function cMiddlewareOne(req, res, next) {
    const dirPath = `workspaces/c/${randomUUID()}`;
    const { language, source_code, cmd_args } = req.body;

    req.dirPath = dirPath;

    try {
        await fs.mkdir(dirPath, { recursive: true });
        await fs.writeFile(`${dirPath}/code.c`, source_code);

        req.compileCmd = `gcc ${dirPath}/code.c -o ${dirPath}/code.out`;
        req.execArgs = `-p ${dirPath}/code.out ${cmd_args}`;

        req.processInfo = { language };
        return next();

    } catch (error) {
        console.log("Middleware1-c:\n", error);
        return next();
    }
}

async function cppMiddlewareOne(req, res, next) {
    const dirPath = `workspaces/cpp/${randomUUID()}`;
    const { language, source_code, cmd_args } = req.body;

    req.dirPath = dirPath;

    try {
        await fs.mkdir(dirPath, { recursive: true });
        await fs.writeFile(`${dirPath}/code.cpp`, source_code);

        req.compileCmd = `g++ ${dirPath}/code.cpp -o ${dirPath}/code.out`;
        req.execArgs = `-p ${dirPath}/code.out ${cmd_args}`;

        req.processInfo = { language };
        return next();

    } catch (error) {
        console.log("Middleware1-cpp:\n", error);
        return next();
    }
}

async function javaMiddlewareOne(req, res, next) {    
    const dirPath = `workspaces/java/${randomUUID()}`;
    const { language, source_code, cmd_args } = req.body;

    req.dirPath = dirPath;

    try {
        await fs.mkdir(dirPath, { recursive: true });
        await fs.writeFile(`${dirPath}/MyJava.java`, source_code);

        req.compileCmd = `javac ${dirPath}/MyJava.java`;
        req.execArgs = `-p java -cp ${dirPath} MyJava ${cmd_args}`;

        req.processInfo = { language };
        return next();

    } catch (error) {
        console.log("Middleware1-java:\n", error);
        return next();
    }
}

async function compiledLanguageMiddlewareTwo(req, res, next) {
    try {
        const { compileCmd, execArgs } = req;
        const output = await compileAndRun(compileCmd, execArgs, req);

        const exitCode = output.code;
        const { heapUsed, heapTotal, rss } = process.memoryUsage();

        output.memory = {
            heapUsed: `${Math.floor(heapUsed / (1024 * 1024))}MB`,
            heapTotal: `${Math.floor(heapTotal / (1024 * 1024))}MB`,
            rss: `${Math.floor(rss / (1024 * 1024))}MB`
        };

        if (output.msg != "Compilation Error") {
            if (exitCode != null) {
                output.msg = exitCode ? "Runtime Error" : "Executed Successfully";
                const timeMetrics = output.stderr.match(/(real|user|sys)\s+\d+\.\d+/g).slice(-3);

                output.time = timeMetrics.reduce((acc, str) => {
                    const arr = str.split(" ");
                    acc[arr[0]] = `${arr[1]}s`;
                    return acc;
                }, {});
            }
            else output.msg = "Process Terminated! The Program must adhere to a runtime of 4s and memory usage of 90KB."
        }

        req.processInfo = { ...output, ...req.processInfo };
        await fs.rm(req.dirPath, { recursive: true, force: true });
        return next();

    } catch (error) {
        console.log("Middleware2-interpreted :", error);
        await fs.rm(req.dirPath, { recursive: true, force: true });
        return next();
    }
}

export {
    jsMiddlewareOne,
    pyMiddlewareOne,
    shMiddlewareOne,
    rbMiddlewareOne,
    interpretedLanguageMiddlewareTwo,
    cMiddlewareOne,
    cppMiddlewareOne,
    javaMiddlewareOne,
    compiledLanguageMiddlewareTwo
};

/* 
 The time command provides three key metrics to analyze a program’s execution: real, user, and sys:
 
 Real represents the total elapsed wall-clock time from start to finish, including time spent waiting for I/O or other system processes. 
 User indicates the CPU time spent executing the program’s instructions in user mode, focusing solely on computations and logic within the process. 
 Sys reflects the CPU time spent handling system calls and kernel-level operations, such as managing files or memory. 
 
 Together, these metrics give a comprehensive view of a program’s performance, helping to identify whether it is CPU-bound, I/O-bound, or impacted by system overhead.
*/