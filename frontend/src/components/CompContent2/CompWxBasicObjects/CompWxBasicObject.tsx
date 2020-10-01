import { Avatar, Button, List, message, Popover } from "antd"
import Search from "antd/es/input/Search"
import { MessageOutlined } from "@ant-design/icons"
import React, { useState } from "react"
import {
  PayloadClientSendMessage,
  PayloadWxContact,
  PayloadWxRoom,
} from "../../../DS/interface"
import { connect } from "react-redux"
import { EventSocket } from "../../../DS/actions"
import { Code } from "../../../DS/codes"

export interface CompWxBasicObjectProps {
  item: PayloadWxContact & PayloadWxRoom
}

export interface CompWxBasicObjectDispatch {
  sendMessage: (
    msg: PayloadClientSendMessage,
    callback: (code: Code) => void
  ) => void
}

export const CompWxBasicObject = (
  props: CompWxBasicObjectProps & CompWxBasicObjectDispatch
) => {
  const [replyVisible, setReplyVisible] = useState(false)

  const sendMessage = (v: string) => {
    props.sendMessage(
      {
        time: new Date(),
        toID: props.item.id,
        isRoom: Boolean(props.item.topic),
        content: v,
      },
      (code: Code) => {
        if (code === Code.SUCCESS) {
          message.success({ content: "发送成功" })
        } else {
          message.error({ content: "发送失败" })
        }
      }
    )
    setReplyVisible(false)
  }

  return (
    <List.Item
      key={props.item.id}
      actions={[
        <Popover
          placement="topRight"
          visible={replyVisible}
          trigger="click"
          onVisibleChange={(v) => setReplyVisible(v)}
          content={<Search enterButton={"消息发送"} onSearch={sendMessage} />}
        >
          <Button type="text" onClick={() => setReplyVisible(true)}>
            <MessageOutlined />
          </Button>
        </Popover>,
      ]}
      className="list"
    >
      <List.Item.Meta
        avatar={
          <Popover
            content={
              <img
                src={props.item.avatar}
                alt={props.item.name || props.item.topic}
                style={{ width: "160px", height: "160px", opacity: "90%" }}
              />
            }
            placement="top"
            trigger="click"
          >
            <div className="relative">
              <Avatar src={props.item.avatar} className="avatar" />
              <Avatar
                src={props.item.avatar}
                className="avatar-blur absolute top-0 left-0"
              />
            </div>
          </Popover>
        }
        title={
          props.item.name || `${props.item.topic}（${props.item.members}）`
        }
        description={props.item.alias}
      />
    </List.Item>
  )
}

export default connect(
  null,
  (dispatch): CompWxBasicObjectDispatch => ({
    sendMessage: (payload: PayloadClientSendMessage) =>
      dispatch({
        type: EventSocket.CLIENT_SEND_WX_MESSAGE,
        payload: payload,
      }),
  })
)(CompWxBasicObject)
