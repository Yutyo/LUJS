const fs = require('fs');
const md5file = require('md5-file');
const unzip = require('extract-zip');
const pathlib = require('path');

class PluginLoader {
  constructor () {
    this.plugins = [];
  }

  static getPlugins () {
    return loader.plugins;
  }

  static load (config, servers) {
    return new Promise((resolve, reject) => {
      fs.readdir(config.pluginPath, { withFileTypes: true }, (err, files) => {
        if (err)
          throw new Error(
            'Something went wrong while trying to read directories: ' +
              err.message
          );
        resolve(files);
      });
    })
      .then(files => {
        const foundFiles = [];
        files.forEach(file => {
          if (file.isFile() && file.name.match(/.*\.zip$/g)) {
            foundFiles.push(file);
          }
        });
        return foundFiles;
      })
      .then(files => {
        const promises = [];
        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          promises.push(
            this.isAlreadyUnzipped(config.pluginPath, file.name).then(
              isUnzipped => {
                if (!isUnzipped) {
                  return this.unzip(config.pluginPath, file.name).then(() => {
                    return this.loadPluginFromFile(
                      config.pluginPath,
                      file.name
                    );
                  });
                } else {
                  return this.loadPluginFromFile(config.pluginPath, file.name);
                }
              }
            )
          );
        }
        return Promise.all(promises);
      })
      .then(() => {
        loader.plugins.forEach(plugin => {
          servers.forEach(server => {
            plugin.plugin.register(server);
          });
          console.log(`Registered ${this.getUniformName(plugin.info.name)}`);
        });
      });
  }

  static getUniformName (name) {
    return name.toLowerCase().replace(/ /g, '-');
  }

  static reloadPlugin (pluginName) {
    this.unloadPlugin(pluginName);
    this.loadPlugin(pluginName);
  }

  static unloadPlugin (pluginName) {
    loader.plugins.forEach(plugin => {
      if (pluginName === this.getUniformName(plugin.info.name)) {
        plugin.plugin.unload();
      }
    });
  }

  static loadPlugin (pluginName) {
    loader.plugins.forEach(plugin => {
      if (pluginName === this.getUniformName(plugin.info.name)) {
        plugin.plugin.load();
      }
    });
  }

  static reregisterPlugin (pluginName, servers) {
    this.unregisterPlugin(pluginName, servers);
    this.registerPlugin(pluginName, servers);
  }

  static registerPlugin (pluginName, servers) {
    servers.forEach(server => {
      loader.plugins.forEach(plugin => {
        if (pluginName === this.getUniformName(plugin.info.name)) {
          plugin.plugin.register(server);
        }
      });
    });
  }

  static unregisterPlugin (pluginName, servers) {
    servers.forEach(server => {
      loader.plugins.forEach(plugin => {
        if (pluginName === this.getUniformName(plugin.info.name)) {
          plugin.plugin.unregister(server);
        }
      });
    });
  }

  static loadPluginFromFile (path, zipName) {
    return this.getHash(path, zipName).then(hash => {
      return this.loadInfoFromFile(`${path}unpacked/${hash}/info.json`).then(
        info => {
          const PluginClass = require(`${path}unpacked/${hash}/index.js`);
          const plugin = new PluginClass();
          plugin.load();
          loader.plugins.push({
            info: info,
            plugin: plugin,
            registered: false
          });
        }
      );
    });
  }

  static loadInfoFromFile (file) {
    return new Promise((resolve, reject) => {
      fs.readFile(file, { encoding: 'utf8', flag: 'r' }, (err, data) => {
        if (err) reject(err);
        else {
          resolve(JSON.parse(data));
        }
      });
    });
  }

  static unzip (path, zipName) {
    return this.getHash(path, zipName).then(hash => {
      return new Promise((resolve, reject) => {
        unzip(
          path + zipName,
          { dir: pathlib.resolve(__dirname, `${path}unpacked/${hash}`) },
          err => {
            if (err) reject(err);
            resolve();
          }
        );
      });
    });
  }

  static getHash (path, fileName) {
    return new Promise((resolve, reject) => {
      md5file(path + fileName, (err, hash) => {
        if (err) reject(err);

        resolve(hash);
      });
    });
  }

  static isAlreadyUnzipped (path, fileName) {
    return this.getHash(path, fileName).then(hash => {
      return new Promise((resolve, reject) => {
        fs.readdir(
          `${path}unpacked/${hash}`,
          { withFileTypes: true },
          (err, files) => {
            if (err) resolve(false);

            let found = false;

            if (files === undefined) resolve(found);
            else {
              files.forEach(file => {
                if (file.isFile() && file.name.match(/index\.js$/g)) {
                  found = true;
                }
              });
              resolve(found);
            }
          }
        );
      });
    });
  }
}

const loader = new PluginLoader();

module.exports = PluginLoader;
