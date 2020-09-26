import { ServerItem, UserStatus } from "../../interface";
import { useCookies } from "react-cookie";
import { Button, Input, message, Modal } from "antd";
import { UserOutlined } from "@ant-design/icons";
import React from "react";
import store from "../../store/storeUserStatus";

const CompServerRequest = (props: {
  server: ServerItem;
  onRequestServer: (server: ServerItem) => void;
}) => {
  const [cookie] = useCookies();
  const onApplyServer = () => {
    if (store.getState().userStatus !== UserStatus.LOGIN) {
      return message.error({ content: "该功能需要登录才可以使用！" });
    }
    return props.onRequestServer(props.server);
  };

  if (props.server.isIdle) {
    return (
      <Button type="primary" onClick={onApplyServer}>
        申请
      </Button>
    );
  }
  if (cookie.user && props.server.name === cookie.user.username) {
    return (
      <Button type="primary" danger>
        下线
      </Button>
    );
  }
  return (
    <Button type="primary" danger>
      踢线
    </Button>
  );
};

export default CompServerRequest;
