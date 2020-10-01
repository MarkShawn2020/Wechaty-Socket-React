import { Button, Card, Divider, Empty, message, Modal } from "antd"
import TextArea from "antd/es/input/TextArea"
import React, { useEffect, useRef, useState } from "react"
import { connect } from "react-redux"
import { PayloadUser, PayloadUserChat } from "../../../DS/interface"
import { State } from "../../../store"
import { EventSocket } from "../../../DS/actions"
import MyMoment from "../../../utils/moment"

export interface CompUserChatsStates {
  user: PayloadUser
  userMessages: PayloadUserChat[]
  clientCount: number
}

export interface CompUserChatsDispatch {
  sendUserChat: (userMessage: PayloadUserChat) => void
}

const CompUserChats = (props: CompUserChatsStates & CompUserChatsDispatch) => {
  console.log("rendered CompUserChats")

  const [inputMessage, setInputMessage] = useState("")
  const messageEndRef = useRef<HTMLDivElement>(null as any)
  const messagesRef = useRef(null as any)
  const enterTime = useRef(new Date())
  const MaxHeight = 400

  useEffect(() => {
    if (!props.user.username) {
      Modal.confirm({
        title: "初体验提示",
        content: (
          <div>
            <p>1. 浏览器每次刷新或打开，实时聊天室的内容都会重置哦</p>
            <p>2. 注册登录之后就会记住你的信息啦~</p>
            <p>
              3.
              登录后即可点击"申请"按钮扫码选择自己的机器人，请在PC页面上登录哦！（因为手机不好扫自己屏幕的码~）
            </p>
          </div>
        ),
      })
    }
  }, [])

  useEffect(() => {
    if (messageEndRef.current && messagesRef.current) {
      if (messagesRef.current.offsetHeight >= MaxHeight) {
        messageEndRef.current.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
        })
      }
    }
  })

  const sendUserMessage = () => {
    if (!props.user.hasLogined) {
      return message.warning({ content: "需要先登陆才可以聊天哦！" })
    }
    if (inputMessage === "") {
      return message.warning({ content: "您倒是输出呀！" })
    }
    if (new Date().getTime() - enterTime.current.getTime() < 1000) {
      return message.warning({ content: "您的操作太快啦！" })
    }
    const userMessage: PayloadUserChat = {
      username: props.user.username,
      content: inputMessage,
      time: new Date(),
    }
    console.log(userMessage)
    props.sendUserChat(userMessage)
    setInputMessage("")
    enterTime.current = new Date()
  }

  return (
    <Card title={`实时聊天室（${props.clientCount}）`}>
      <div
        className="chats-display"
        style={{ maxHeight: MaxHeight, overflow: "scroll" }}
      >
        {props.userMessages.length > 0 ? (
          <div ref={messagesRef}>
            {props.userMessages.map((msg: PayloadUserChat, index) => {
              return (
                <div key={index}>
                  <div className="row-1 inline-flex justify-between items-center w-full">
                    <div className="inline-flex">
                      <p className="username text-black font-semibold">
                        @ {msg.username}
                      </p>
                    </div>

                    <div className="content text-gray-600">
                      {MyMoment(msg.time).fromNow()}
                    </div>
                  </div>

                  <div className="row-2">
                    <p className="text-gray-800 text-sm break-words pl-4">
                      {msg.content}
                    </p>
                  </div>

                  {index !== props.userMessages.length - 1 && (
                    <Divider className="my-2" />
                  )}
                </div>
              )
            })}
          </div>
        ) : (
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={false} />
        )}
        <div ref={messageEndRef} />
      </div>

      <div>
        <TextArea
          autoSize={{ minRows: 3, maxRows: 6 }}
          className="my-2 "
          value={inputMessage}
          placeholder={
            props.clientCount > 1
              ? `当前有${props.clientCount}人在线哦，要不打声招呼pa？`
              : "你想说点什么吗~"
          }
          onChange={(e) => {
            setInputMessage(e.target.value)
          }}
        />
      </div>

      <div className="flex justify-end">
        <Button type="primary" onClick={sendUserMessage}>
          发送
        </Button>
      </div>
    </Card>
  )
}

export default connect(
  (state: State): CompUserChatsStates => ({
    userMessages: state.userMessages,
    clientCount: state.clients,
    user: state.user,
  }),
  (dispatch): CompUserChatsDispatch => ({
    sendUserChat: (userMessage: PayloadUserChat) => {
      console.log("sending message")
      dispatch({
        type: EventSocket.CLIENT_SEND_USER_CHAT,
        payload: userMessage,
      })
    },
  })
)(CompUserChats)
