const _ = require('lodash');
const join = require('path').join;
const writeJsonFile = require('write-json-file');

const resolver = {
  postAction(source, rootDir, repoHash, deployConfigPath, tools) {
    const config = require(deployConfigPath);
    const resolvedApps = _.map(config.apps, (app) => {
      app.path = join(rootDir, app.path);
      app.source.path = join(rootDir, app.source.path);
      app.scripts = _.mapValues(app.scripts, (value, key) => {
        return _.map(value, (script) => script.replace('${rootDir}', rootDir));
      });
      return app;
    });
    config.apps = resolvedApps;
    return (cb) => (
      writeJsonFile(deployConfigPath, config)
        .then(() => cb(), cb));
  }
};

module.exports = resolver;
