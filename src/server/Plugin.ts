import { Server } from './Server';

export default abstract class Plugin {
  abstract register(server: Server): void;
  abstract unregister(server: Server): void;
  abstract load(): void;
  abstract unload(): void;
}
