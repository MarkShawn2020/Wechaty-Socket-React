import { Card, Empty, Layout, message, notification, Spin } from "antd";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Message } from "wechaty";
import { useCookies } from "react-cookie";

import {
  ContactItem,
  ScanDataType,
  ScanStatus,
  ServerItem,
  UserDataType,
  UserStatus,
} from "../interface";
import { API } from "../interface/API";
import { Code } from "../interface/codes";
import CompScan from "../components/CompLogin/CompScan";
import MemoServers from "../components/CompServers/CompServerList";
import MemoMessages from "../components/CompMessages/CompMessages";
import CompWechatBasic from "../components/CompBasicInfo/CompWechatBasic";
import { $http } from "../utils/$http";
import store from "../store/storeUserStatus";
import { ActionTypes } from "../store/ActionTypes";
import { CompSocket } from "../components/CompSocket/CompSocket";
import { EventFromClient } from "../interface/events";
import MemoContactList from "../components/CompContacts/CompContactList";

const Content = () => {
  /**
   * 首先应该从浏览器的cookies中查找是否有用户信息
   */
  const [userData, setUserData] = useState<UserDataType>({} as any);
  const [scanData, setScanData] = useState<ScanDataType>();

  const [cookie, setCookie] = useCookies(null as any);
  const [scanVisible, setScanVisible] = useState(false);
  const [msgHistory, setMsgHistory] = useState<Message[]>([]);
  const [servers, setServers] = useState<ServerItem[]>([]);
  const [contacts, setContacts] = useState<ContactItem[]>([]);
  console.log("--- rendered content ---");

  /**
   * 检查服务器连接状态
   */
  useEffect(() => {
    fetchServers().then();
  }, [servers.length, servers.filter((server) => server.isIdle).length]);

  /**
   * on
   */
  const onBotScan = async (scan: ScanDataType) => {
    /**
     * 只要返回就应该弹窗，因为已经与关窗的逻辑解耦了
     * 主要是若退出账号后重新登录，服务器的二维码并没有刷新，依旧保留在已确认状态
     * 更新：由于后端做了刷新处理，此处依旧可以做些强条件处理
     */
    console.log(scan);
    setScanData(scan);
    if (scan.qrcode && scan.status === ScanStatus.Waiting) {
      setScanVisible(true);
    }
  };

  const onBotLogin = async (user: UserDataType) => {
    console.log("登录成功，关闭扫码弹窗");
    await setScanVisible(false);

    console.log("更新用户状态");
    await store.dispatch({
      type: ActionTypes.updateUserStatus,
      payload: UserStatus.LOGIN,
    });

    console.log("更新用户数据", user);
    await setUserData(user);

    // console.log("更新好友数据")
    // await fetchContacts()
  };

  const onBotMessage = (msg: Message) => {
    console.log(msg);
    setMsgHistory((msgHistory) => [msg, ...msgHistory]);
  };

  /**
   * fetch
   */
  const fetchServers = async () => {
    const { data: servers } = await $http.get(API.server.list);
    setServers(servers);
  };

  const fetchContacts = async (skip = 0, limit = 100) => {
    console.log("fetching contacts ...");
    const { data } = await $http.get(API.user.contacts, {
      params: { username: cookie.user.username, skip, limit },
    });
    await setContacts((contacts) => [...contacts, ...data]);
    await console.log({
      skip,
      limit,
      contactLength: (() => contacts.length)(),
    });
    if (data.length === limit) {
      await fetchContacts(skip + limit);
    }
  };

  /**
   * emit
   */

  const emitServerRequest = async (server: ServerItem) => {
    if (
      !socketRef.current.isSocketInitialized &&
      cookie.user &&
      cookie.user.username
    ) {
      console.log(
        `检测到目前没有socket对象，正在以${cookie.user.username}身份对接`
      );
      // 登录状态，启动socket
      socketRef.current.initWechaty(cookie.user.username);
      return socketRef.current.emitEvent(
        EventFromClient.ClientRequestServer,
        server,
        (status: Code) => {
          if (status === Code.SUCCESS) {
            message.success({ content: "微信机器人后台登录成功" });
          } else {
            message.error({ content: Code[status] });
          }
        }
      );
    }
  };

  const emitServerRelease = async () => {
    await socketRef.current.emitEvent(EventFromClient.ClientReleaseServer);
    await fetchServers();
  };

  const emitServerDaemon = async () => {
    await socketRef.current.emitEvent(
      EventFromClient.ClientControlServerDaemon
    );
    await fetchServers();
  };

  const emitServerDaemonCancel = async () => {
    await socketRef.current.emitEvent(
      EventFromClient.ClientControlServerDaemonCancel
    );
    await fetchServers();
  };

  const socketRef = useRef<CompSocket>(
    new CompSocket(
      {
        onBotLogin,
        onBotScan,
        onBotMessage,
      },
      {
        emitServerDaemon,
        emitServerDaemonCancel,
        emitServerRelease,
        emitServerRequest,
      },
      {
        fetchContacts,
        fetchServers,
      }
    )
  );

  return (
    <Layout.Content className="w-full">
      {/* 服务器列表，依赖：服务器数量、服务器状态量 */}
      <MemoServers
        servers={useMemo(() => servers, [
          servers.length,
          servers.filter((server) => server.isIdle).length,
        ])}
        onRequestServer={useCallback(emitServerRequest, [])}
      />

      {/* 扫码弹窗 */}
      {scanData && <CompScan msg={scanData} visible={scanVisible} />}

      {/* 实时消息，依赖：消息总数 */}
      <MemoMessages
        msgHistory={useMemo(() => msgHistory, [msgHistory.length])}
      />

      {/* 好友列表，依赖：好友数目 */}
      <MemoContactList />

      <Card title="历史撤回" className="w-full">
        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
      </Card>

      <CompWechatBasic userData={userData} />
    </Layout.Content>
  );
};

export default Content;
