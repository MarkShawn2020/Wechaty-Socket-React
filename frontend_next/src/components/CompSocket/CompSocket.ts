import io from "socket.io-client";
import { EventFromWechaty } from "../../interface/events";
import { Code } from "../../interface/codes";

export class CompSocket {
  private username: string | undefined;
  private socket: SocketIOClient.Socket | undefined;

  // Bot是来自wechaty的消息
  private readonly onBotScan;
  private readonly onBotLogin;
  private readonly onBotMessage;

  // Server是对socket服务器的操作
  private readonly emitServerRequest;
  private readonly emitServerRelease;
  private readonly emitServerDaemon;
  private readonly emitServerDaemonCancel;

  // Fetch是对http服务器的操作
  private readonly fetchServers;
  private readonly fetchContacts;

  constructor(
    onMethods: {
      onBotScan: any;
      onBotLogin: any;
      onBotMessage: any;
    },
    emitMethods: {
      emitServerRequest: any;
      emitServerRelease: any;
      emitServerDaemon: any;
      emitServerDaemonCancel: any;
    },
    fetchMethods: {
      fetchServers: any;
      fetchContacts: any;
    }
  ) {
    this.onBotScan = onMethods.onBotScan;
    this.onBotLogin = onMethods.onBotLogin;
    this.onBotMessage = onMethods.onBotMessage;
    this.emitServerRequest = emitMethods.emitServerRequest;
    this.emitServerRelease = emitMethods.emitServerRelease;
    this.emitServerDaemon = emitMethods.emitServerDaemon;
    this.emitServerDaemonCancel = emitMethods.emitServerDaemonCancel;
    this.fetchContacts = fetchMethods.fetchContacts;
    this.fetchServers = fetchMethods.fetchServers;
  }

  /**
   * socket connection reference: https://socket.io/docs/client-api/
   */
  public initWechaty(username: string) {
    this.username = username;
    const socket = io("ws://localhost:3002", {
      query: { username: this.username },
      transports: ["websocket"], // 或许可以加快连接
    });
    console.log(" socket established");
    this.socket = socket;

    socket.on("reconnect_attempt", () => {
      socket.io.opts.transports = ["polling", "websocket"];
    });

    socket.on("connection", () => {
      console.log("socket connected!");
    });

    socket.on(EventFromWechaty.BOT_SCAN, this.onBotScan);
    socket.on(EventFromWechaty.BOT_LOGIN, this.onBotLogin);
    socket.on(EventFromWechaty.BOT_MESSAGE, this.onBotMessage);
  }

  public emitEvent = (e: string, ...args: any) => {
    if (this.socket) {
      this.socket.emit(e, ...args);
    }
  };

  get name() {
    return this.username;
  }

  get isSocketInitialized() {
    return this.socket !== undefined;
  }
}
