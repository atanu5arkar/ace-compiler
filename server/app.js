import express from "express";
import { cpus } from "node:os";
import cluster from "node:cluster";

import codeRouter from "./routes/codeRouter.js";

const cores = cpus().length;

const app = express();
const port = 8080;

app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/compiler", codeRouter);

if (cluster.isPrimary) {
    for (let i = 0; i < cores; i++) cluster.fork();

    cluster.on("exit", (worker, core, signal) => {
        return console.log(`Worker ${worker.process.pid} died.`);
    });
} else {
    app.listen(port, () => {
        return console.log(`Compiler Service Running: http://localhost:${port} | PID: ${process.pid}`);
    });
}
