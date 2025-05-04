import { exec, execFile } from "child_process";
import { chmodSync } from "fs";

function execFn(cmd) {
    const output = {};

    const child = exec(cmd,
        {
            timeout: 4000,
            maxBuffer: 1024 * 90,
            uid: 1000,
            killSignal: "SIGKILL"
        },
        (error, stdout, stderr) => {
            if (error && error.message == "stdout maxBuffer length exceeded")
                output.errorMsg = error.message;
        });

    return new Promise((resolve, reject) => {
        output.pid = child.pid + 2; // Maybe a convention

        let stdout = '', stderr = '';

        child.stdout.on("data", (data) => {
            stdout += data;
        });

        child.stderr.on("data", (data) => {
            stderr += data;
        });

        child.on("exit", (code, signal) => {
            output.code = code;
            output.signal = signal;
        });

        child.on("close", () => {
            output.stdout = stdout;
            output.stderr = stderr;
            resolve(output);
        });
    });
}

function compileAndRun(compileCmd, execArgs, req) {
    const compilerOutput = {};

    const child = exec(compileCmd);
    compilerOutput.pid = child.pid + 1;

    return new Promise((resolve, reject) => { 
        let stderr = '';

        child.stderr.on("data", (data) => {
            stderr += data;
        });
    
        child.on("close", () => {
            const didCompilationFail = compilerOutput.code ? true : false;
    
            if (didCompilationFail) {
                compilerOutput.stderr = stderr;
                compilerOutput.stdout = '';
                compilerOutput.msg = "Compilation Error";
                resolve(compilerOutput);
            }
        });
    
        child.on("exit", (code, signal) => {
            if (code != 0) {
                compilerOutput.code = code;
                return compilerOutput.signal = signal;
            }

            const output = {};
            let stdout = '', stderr = '';
    
            const child2 = execFile("time", [...execArgs.split(' ')],
                {
                    timeout: 4000,
                    maxBuffer: 1024 * 90,
                    uid: 1000,
                    killSignal: "SIGKILL"
                },
                (error, stdout, stderr) => {
                    if (error && error.message == "stdout maxBuffer length exceeded")
                        output.errorMsg = error.message;
                });
    
            output.pid = child2.pid + 1;
    
            child2.stdout.on("data", (data) => {
                stdout += data;
            });
    
            child2.stderr.on("data", (data) => {
                stderr += data;
            });
    
            child2.on("exit", (code, signal) => {
                output.code = code;
                output.signal = signal;
            });
    
            child2.on("close", () => {
                output.stdout = stdout;
                output.stderr = stderr;
                resolve(output);
            });
        });
    });
}


export { execFn, compileAndRun };
