const { spawn } = require("child_process");
const path = require("path");

// This function uses the child_process module to 'spawn' a subprocess. We pass it a command (e.g. python3) and an options array.
// The options array can include various arguments, including the file path to target with our command, and arguments we wish to pass
// In this function, we are accepting 'args' which we are passing from the router that calls this function. In this case, it is an array of search name from the request.body
const execPyScript = (args) => {
  return new Promise((resolve, reject) => {
    try {
      const process = spawn("python3", [
        `${path.join(__dirname, "capture_search.py")}`,
        args ? args : [],
      ]);
      // We access the stdout stream which will output print statmenets from our python code and pass them in the reponse.
      process.stdout.on("data", (data) => {
        resolve(`stdout: ${data}`);
      });
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = execPyScript;
