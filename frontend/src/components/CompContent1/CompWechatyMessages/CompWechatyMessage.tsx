import {
  PayloadClientSendMessage,
  PayloadWxMessage,
} from "../../../DS/interface"
import React, { useRef, useState } from "react"
import { Avatar, Input, message, Popover } from "antd"
import MyMoment from "../../../utils/moment"
import { connect } from "react-redux"
import { EventSocket } from "../../../DS/actions"
import { Code } from "../../../DS/codes"

export interface CompWechatyMessageItemProps {
  msg: PayloadWxMessage
}

export interface CompWechatyMessageItemDispatch {
  sendMessage: (
    payload: PayloadClientSendMessage,
    callback?: (code: Code) => void
  ) => void
}

const CompWechatyMessageItem = (
  props: CompWechatyMessageItemProps & CompWechatyMessageItemDispatch
) => {
  const name = props.msg.from.alias || props.msg.from.name
  const [popupVisible, setPopupVisible] = useState(false)
  const replyRef = useRef(null as any)

  const reply = (s: string) => {
    const isRoom = props.msg.roomID !== null
    const msgPayload: PayloadClientSendMessage = {
      content: s,
      time: new Date(),
      toID: isRoom ? props.msg.roomID : props.msg.from.id,
      isRoom: isRoom,
    }
    console.log("reply: ", s)
    props.sendMessage(msgPayload, (code: Code) => {
      if (code === Code.SUCCESS) {
        message.success({ content: "回复成功！" })
      } else {
        message.error({ content: "回复失败" })
      }
    })
    setPopupVisible(false)
  }

  return (
    <Popover
      visible={popupVisible}
      onVisibleChange={(v) => setPopupVisible(v)}
      trigger="click"
      placement="top"
      content={
        <Input.Search
          ref={replyRef}
          autoFocus
          placeholder={`To ${name}: `}
          enterButton={"回复"}
          onSearch={reply}
        />
      }
      title={"快捷回复"}
      className="list"
    >
      <div className="relative flex justify-between items-start w-full">
        <div className="avatar mr-4">
          <Avatar src={props.msg.from.avatar} />
        </div>
        <div className="rows flex-1">
          <div className="row-1 inline-flex justify-between items-center w-full">
            <div className="inline-flex">
              <p className="username text-gray-800">{props.msg.from.name}</p>

              {props.msg.from.alias && (
                <p className="text-gray-700">（{props.msg.from.alias}）</p>
              )}
            </div>

            <div className="content text-gray-600">
              {MyMoment(props.msg.time).fromNow()}
            </div>
          </div>

          <div className="row-2">
            <p className="text-black text-sm break-words">
              {props.msg.content}
            </p>
          </div>
        </div>
      </div>
    </Popover>
  )
}

export const CompWechatyMessageContainer = connect(
  null,
  (dispatch, ownProps): CompWechatyMessageItemDispatch => ({
    sendMessage: (payload, callback) => {
      dispatch({
        type: EventSocket.CLIENT_SEND_WX_MESSAGE,
        payload,
        callback,
      })
    },
  })
)(CompWechatyMessageItem)
