import { spawn } from "node:child_process";

function start(command, args, name) {
  const child = spawn(command, args, {
    stdio: "inherit",
    shell: true,
  });

  child.on("exit", (code) => {
    if (code && code !== 0) {
      process.exitCode = code;
    }
  });

  return child;
}

const api = start("npm", ["run", "dev:api"], "api");
const client = start("npm", ["run", "dev:client"], "client");

function shutdown() {
  api.kill();
  client.kill();
  process.exit();
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
