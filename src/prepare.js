import { execSync } from 'child_process';

const AggregateError = require("aggregate-error");
const replace = require('replace-in-file');

module.exports = async (pluginConfig) => {
  const {updateLockfile, metadataPath, nextRelease} = pluginConfig;

  const options = {
    files: metadataPath,
    from: /version '${lastRelease.version}'/g,
    to: "version '${nextRelease.version}'",
  };
  
  try {
    let changedFiles = replace.sync(options);
    console.log('Modified files:', changedFiles.join(', '));
  }
  catch (error) {
    throw new AggregateError(error);
  }

  if(updateLockfile) {
    try {
      const output = execSync('bundle exec berks install', { encoding: 'utf-8' });  // the default is 'buffer'
      console.log('Output was:\n', output);
    }
    catch (error) {
      throw new AggregateError(error);
    }
  }
}
