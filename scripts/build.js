var exec = require('child_process').exec;

const sh  = async (cmd) => {
  return new Promise((resolve, reject) => {
    exec(cmd, (error, stdout, stderr) => {
          console.log(stdout);
          console.log(stderr);
          resolve();
          if (error !== null) {
               console.log(error);
               reject(error);
          }
      });
  });
}

async function build() {
  var kibanaVersion = require('../../../package.json').version;
  var command = 'node ../../scripts/plugin_helpers.js build --kibana-version';
  await sh(`${command} ${kibanaVersion}`);
}

build();
