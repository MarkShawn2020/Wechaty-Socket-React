import MyIcon, { IconType } from "../../../utils/icons"
import { Space, Spin } from "antd"
import { LoadingOutlined } from "@ant-design/icons"
import React from "react"
import { ServerItem } from "../../../DS/interface"
import { connect } from "react-redux"
import { State } from "../../../store"

const CompServers = (props: { servers: ServerItem[] }) => {
  return (
    <span className="inline-flex">
      {props.servers.length > 0 ? (
        <span className="text-green-500 flex items-center">
          ONLINE <MyIcon type={IconType.DOT_CONNECTED} className="text-xl" />
        </span>
      ) : (
        <Space size="large">
          <span className="text-red-500">CONNECTING</span>
          <Spin indicator={<LoadingOutlined className="text-red-500" spin />} />
        </Space>
      )}
    </span>
  )
}

export default connect((state: State) => ({
  servers: state.servers,
}))(CompServers)
