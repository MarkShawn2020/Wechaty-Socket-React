import { ServerItem, TokenType } from "../../interface";
import { Avatar, Card, Space, Table, Tag } from "antd";
import React from "react";
import { UserOutlined } from "@ant-design/icons";
import { useCookies } from "react-cookie";
import MyIcon, { IconType } from "../CompIcon";
import CompRowStatus from "../CompStatus";
import CompServerRequest from "./CompServerRequest";
import CompServerDaemon from "./CompServerDaemon";

const CompServerList = (props: {
  servers: ServerItem[];
  onRequestServer: (server: ServerItem) => void;
}) => {
  console.log(
    `rendered CompServers with counts of ${props.servers.length}, idles: ${
      props.servers.filter((s) => s.isIdle).length
    }`
  );

  if (props.servers.length) {
    console.log(props.servers);
  }

  const serversTableColumns = [
    {
      title: "昵称",
      dataIndex: "name",
      render: (text: string, record: ServerItem) => {
        return (
          <Space>
            <Avatar
              src={record.avatar}
              icon={<UserOutlined className="text-2xl" />}
            />
            <p>{text || "No One"}</p>
          </Space>
        );
      },
    },

    {
      title: "类型",
      dataIndex: "tokenType",
      render: (text: TokenType) => {
        switch (text) {
          case TokenType.MOBILE:
            return (
              <MyIcon type={IconType.PUPPET_MOBILE} className="text-2xl" />
            );
          case TokenType.PAD:
            return <MyIcon type={IconType.PUPPET_PAD} className="text-2xl" />;
          case TokenType.WEB:
            return <MyIcon type={IconType.PUPPET_WEB} className="text-2xl" />;
        }
      },
    },
    {
      title: "免费",
      dataIndex: "isFree",
      render: (isFree: boolean) => {
        return <MyIcon type={isFree ? IconType.RIGHT : IconType.WRONG} />;
      },
    },
    {
      title: "状态",
      key: "status",
      render: (text: string, server: ServerItem) => {
        return (
          <span>
            {server.isIdle ? (
              <Tag color="green">空闲</Tag>
            ) : (
              <Tag color="red">忙碌</Tag>
            )}
            {server.isDaemon ? (
              <Tag color="red">托管中</Tag>
            ) : (
              <Tag color="green">未托管</Tag>
            )}
          </span>
        );
      },
    },
    {
      title: "操作",
      key: "apply",
      render: (text: string, server: ServerItem) => {
        return (
          <Space>
            <CompServerRequest
              server={server}
              onRequestServer={props.onRequestServer}
            />

            <CompServerDaemon server={server} />
          </Space>
        );
      },
    },
  ];

  return (
    <Card
      title={"用户列表"}
      bodyStyle={{ padding: 0 }}
      extra={<CompRowStatus servers={props.servers} />}
    >
      <Table
        columns={serversTableColumns}
        dataSource={props.servers}
        pagination={false}
      />
    </Card>
  );
};

const MemoServers = React.memo(CompServerList);

export default MemoServers;
