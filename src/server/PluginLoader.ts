import * as fs from 'fs';
import * as md5file from 'md5-file';
import * as unzip from 'extract-zip';
import * as pathlib from 'path';
import Plugin from './Plugin';
import * as util from 'util';

const readdir = util.promisify(fs.readdir);

class PluginWrapper {
  name: string;
  plugin: Plugin;
  registered: boolean;

  constructor(name, plugin, registered) {
    this.name = name;
    this.plugin = plugin;
    this.registered = registered;
  }
}

export default class PluginLoader {
  plugins: Array<PluginWrapper>;

  constructor() {
    this.plugins = [];
  }

  static getPlugins() {
    return loader.plugins;
  }

  static load(config, servers) {
    return readdir(config.pluginPath, { withFileTypes: true })
      .then((files) => {
        const foundFiles = [];
        files.forEach((file) => {
          if (file.isFile() && file.name.match(/.*\.zip$/g)) {
            foundFiles.push(file);
          }
        });
        return foundFiles;
      })
      .then((files) => {
        const promises = [];
        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          promises.push(
            this.isAlreadyUnzipped(config.pluginPath, file.name).then(
              (isUnzipped) => {
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
        loader.plugins.forEach((plugin) => {
          servers.forEach((server) => {
            plugin.plugin.register(server);
          });
          console.log(`Registered ${this.getUniformName(plugin.name)}`);
        });
      });
  }

  static getUniformName(name) {
    return name.toLowerCase().replace(/ /g, '-');
  }

  static reloadPlugin(pluginName) {
    this.unloadPlugin(pluginName);
    this.loadPlugin(pluginName);
  }

  static unloadPlugin(pluginName) {
    loader.plugins.forEach((plugin) => {
      if (pluginName === this.getUniformName(plugin.name)) {
        plugin.plugin.unload();
      }
    });
  }

  static loadPlugin(pluginName) {
    loader.plugins.forEach((plugin) => {
      if (pluginName === this.getUniformName(plugin.name)) {
        plugin.plugin.load();
      }
    });
  }

  static reregisterPlugin(pluginName, servers) {
    this.unregisterPlugin(pluginName, servers);
    this.registerPlugin(pluginName, servers);
  }

  static registerPlugin(pluginName, servers) {
    servers.forEach((server) => {
      loader.plugins.forEach((plugin) => {
        if (pluginName === this.getUniformName(plugin.name)) {
          plugin.plugin.register(server);
        }
      });
    });
  }

  static unregisterPlugin(pluginName, servers) {
    servers.forEach((server) => {
      loader.plugins.forEach((plugin) => {
        if (pluginName === this.getUniformName(plugin.name)) {
          plugin.plugin.unregister(server);
        }
      });
    });
  }

  static loadPluginFromFile(path, zipName) {
    return this.getHash(path, zipName).then((hash) => {
      return this.loadInfoFromFile(`${path}unpacked/${hash}/info.json`).then(
        (info) => {
          import(`${path}unpacked/${hash}/index.js`).then((PluginClass) => {
            const plugin = new PluginClass();
            plugin.load();
            loader.plugins.push(new PluginWrapper(info, plugin, false));
          });
        }
      );
    });
  }

  static loadInfoFromFile(file) {
    return new Promise((resolve, reject) => {
      fs.readFile(file, { encoding: 'utf8', flag: 'r' }, (err, data) => {
        if (err) reject(err);
        else {
          resolve(JSON.parse(data));
        }
      });
    });
  }

  static unzip(path, zipName) {
    return this.getHash(path, zipName).then((hash) => {
      return unzip(path + zipName, {
        dir: pathlib.resolve(__dirname, `${path}unpacked/${hash}`)
      });
    });
  }

  static getHash(path, fileName) {
    return new Promise((resolve, reject) => {
      md5file(path + fileName, (err, hash) => {
        if (err) reject(err);

        resolve(hash);
      });
    });
  }

  static isAlreadyUnzipped(path, fileName) {
    return this.getHash(path, fileName).then((hash) => {
      return new Promise((resolve, reject) => {
        fs.readdir(
          `${path}unpacked/${hash}`,
          { withFileTypes: true },
          (err, files) => {
            if (err) resolve(false);

            let found = false;

            if (files === undefined) resolve(found);
            else {
              files.forEach((file) => {
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
