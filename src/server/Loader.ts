import { servers, ServerManager } from './ServerManager';
import * as fs from 'fs';
import * as path from 'path';
import * as util from 'util';
import Commands from './Commands';
import PluginLoader from './PluginLoader';
import * as config from 'config';

const readdir = util.promisify(fs.readdir);

export default class Loader {
  static setup() {
    const normalizedPath = path.join(__dirname, config.get('handlers'));
    readdir(normalizedPath)
      .then((files) => {
        const handles = [];
        files.forEach((file) => {
          if(file.split('.')[file.split('.').length - 1] !== 'js') return;

          import(config.get('handlers') + file).then((handle) => {
            handles.push(handle.default);
          });
        });

        this.startServersFromConfig(handles);
      })
      .then(() => {
        Commands.instance();
        return PluginLoader.load(config, servers);
      });
  }

  static startServersFromConfig(handles) {
    config.get('servers').forEach(function (server) {
      ServerManager.startServer(
        server.ip,
        server.port,
        server.password,
        server.zone
      );
    });
  }
}
