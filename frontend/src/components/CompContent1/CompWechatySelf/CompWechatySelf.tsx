import { Card, Empty } from "antd"
import React from "react"
import { PayloadWxSelf } from "../../../DS/interface"
import { connect } from "react-redux"
import { State } from "../../../store"

export interface CompWechatySelfStates {
  wechat: PayloadWxSelf
}

const CompWechatySelf = (props: CompWechatySelfStates) => {
  console.log("rendered CompWechatySelf")

  return (
    <Card title={"基本信息"}>
      {Object.keys(props.wechat).length > 0 ? (
        <pre>{JSON.stringify(props.wechat, null, 4)}</pre>
      ) : (
        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
      )}
    </Card>
  )
}

export default connect(
  (state: State): CompWechatySelfStates => ({
    wechat: state.wxSelf,
  })
)(CompWechatySelf)
