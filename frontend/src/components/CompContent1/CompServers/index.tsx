import { ServerItem } from "../../../DS/interface"
import { TokenType, ServerStatus } from "../../../DS/enums"
import { Avatar, Card, Space, Table, Tag } from "antd"
import React from "react"
import { UserOutlined } from "@ant-design/icons"
import MyIcon, { IconType } from "../../../utils/icons"
import CompRequestServer from "./CompRequestServer"
import CompServerDaemon from "./CompDaemonServer"
import moment from "../../../utils/moment"
import { connect } from "react-redux"
import { State } from "../../../store"

export interface CompServersStates {
  servers: ServerItem[]
  clients: number
}

const CompServers = (props: CompServersStates) => {
  console.log(`rendered CompServers`)

  const serversTableColumns = [
    {
      title: "昵称",
      dataIndex: "username",
      render: (text: string, record: ServerItem) => {
        return (
          <Space>
            <Avatar
              src={record.avatar}
              icon={<UserOutlined className="text-2xl" />}
            />
            {text ? <p>{text}</p> : <p className="text-gray-500">No One</p>}
          </Space>
        )
      },
    },

    {
      title: "类型",
      dataIndex: "tokenType",
      render: (text: TokenType) => {
        switch (text) {
          case TokenType.MOBILE:
            return <MyIcon type={IconType.PUPPET_MOBILE} className="text-2xl" />
          case TokenType.PAD:
            return <MyIcon type={IconType.PUPPET_PAD} className="text-2xl" />
          case TokenType.WEB:
            return <MyIcon type={IconType.PUPPET_WEB} className="text-2xl" />
        }
      },
    },
    {
      title: "免费",
      dataIndex: "isFree",
      render: (isFree: boolean) => {
        return <MyIcon type={isFree ? IconType.RIGHT : IconType.WRONG} />
      },
    },
    {
      title: "状态",
      dataIndex: "status",
      render: (status: ServerStatus) => {
        switch (status) {
          case ServerStatus.IDLE: {
            return <Tag color="blue">空闲</Tag>
          }
          case ServerStatus.CONNECTING: {
            return <Tag color="orange">启动中</Tag>
          }
          case ServerStatus.RUNNING: {
            return <Tag color="green">运行中</Tag>
          }
          case ServerStatus.DAEMON: {
            return <Tag color="magenta">托管中</Tag>
          }
          case ServerStatus.ERROR: {
            return <Tag color={"red"}>异常</Tag>
          }
          default: {
            throw new Error()
          }
        }
      },
    },
    {
      title: "最近使用",
      dataIndex: "lastTime",
      render: (text: Date) => {
        // console.log({ lastTime: text })
        if (text) {
          return <p>{moment(text).fromNow()}</p>
        } else {
          return "-"
        }
      },
    },
    {
      title: "操作",
      key: "apply",
      render: (text: string, server: ServerItem) => {
        return (
          <Space>
            <CompRequestServer server={server} />

            <CompServerDaemon server={server} />
          </Space>
        )
      },
    },
  ]

  return (
    <Card title={"服务器"} bodyStyle={{ padding: 0 }}>
      <Table
        columns={serversTableColumns}
        dataSource={props.servers.map((server) => {
          // @ts-ignore
          server.key = server.token
          return server
        })}
        pagination={false}
      />
    </Card>
  )
}

export default connect(
  (state: State): CompServersStates => {
    return {
      servers: state.servers,
      clients: state.clients,
    }
  }
)(CompServers)
