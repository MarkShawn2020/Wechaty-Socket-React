import { Avatar, Card, Empty, List } from "antd"
import React from "react"
import { Message } from "wechaty"
// import InfiniteScroll from "react-infinite-scroller"

const CompMessages = (props: { msgHistory: Message[] }) => {
  return (
    <Card title={"实时消息"}>
      {props.msgHistory.length === 0 ? (
        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
      ) : (
        // <pre>{props.msgHistory}</pre>
        <List
          dataSource={props.msgHistory}
          renderItem={(item: Message) => (
            <List.Item key={item.id}>
              <List.Item.Meta
                avatar={
                  <Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
                }
                title="test"
              />
              <div>{item.toString()}</div>
            </List.Item>
          )}
        />
      )}
    </Card>
  )
}

const MemoMessages = React.memo(CompMessages)

export default MemoMessages
