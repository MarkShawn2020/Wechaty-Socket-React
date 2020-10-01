import { Badge, Card, Divider, Empty } from "antd"
import React, { useEffect, useRef } from "react"
import { connect } from "react-redux"
import { PayloadWxMessage } from "../../../DS/interface"
import { CompWechatyMessageContainer } from "./CompWechatyMessage"
import { State } from "../../../store"

const CompWechatyMessages = (props: {
  wechatyMessages: PayloadWxMessage[]
}) => {
  console.log("rendered CompWechatyMessages")

  const messagesRef = useRef(null as any)
  const messageEndRef = useRef(null as any)

  const MaxHeight = 400

  useEffect(() => {
    if (messagesRef.current && messageEndRef.current) {
      if (messagesRef.current.offsetHeight >= MaxHeight) {
        // reference: https://stackoverflow.com/questions/60289640/react-useref-scrollintoview-how-to-only-autoscroll-a-specific-div-inside-of
        messageEndRef.current.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
          inline: "start",
        })
      }
    }
  })

  return (
    <Card title={"实时消息"}>
      {props.wechatyMessages.length === 0 ? (
        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={false} />
      ) : (
        <div
          className="overflow-y-scroll break-words pr-4"
          style={{ maxHeight: MaxHeight + "px", minHeight: "300px" }}
          ref={messagesRef}
        >
          {props.wechatyMessages.map((msg) => {
            return (
              <div key={msg.id} className="relative">
                <CompWechatyMessageContainer msg={msg} key={msg.id} />

                <Badge
                  status={msg.roomID ? "default" : "success"}
                  style={{
                    position: "absolute",
                    left: "4px",
                    top: "4px",
                  }}
                />

                <Divider className="my-2" />
              </div>
            )
          })}

          <div ref={messageEndRef} />
        </div>
      )}
    </Card>
  )
}

export default connect((state: State) => ({
  wechatyMessages: state.wxMessages,
}))(CompWechatyMessages)
