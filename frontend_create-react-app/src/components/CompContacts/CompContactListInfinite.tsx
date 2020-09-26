import React, { useRef, useState } from "react"
import { useCookies } from "react-cookie"
import { Avatar, Card, Empty, List, Spin } from "antd"
import { SyncOutlined } from "@ant-design/icons"
import InfiniteScroll from "react-infinite-scroller"

import { ContactItem } from "../../interface"
import { $http } from "../../utils/$http"
import { API } from "../../interface/API"

const CompContactListInfinite = () => {
  const [cookie] = useCookies()
  const [contacts, setContacts] = useState<ContactItem[]>([])
  const [skip, setSkip] = useState(0)
  const isLoading = useRef(false)
  const hasMore = useRef(true)

  const username = cookie.user.username

  console.log(`rendered CompContactList with length: `, contacts.length)

  const fetchContacts = async (username: string, skip = 0, limit = 100) => {
    console.log({ skip, dataLen: contacts.length })
    const { data: newContacts } = await $http.get(API.user.contacts, {
      params: { username, skip, limit },
    })
    return newContacts
  }

  const handleLoadMore = async () => {
    const limit = 100
    isLoading.current = true
    const newContacts = await fetchContacts(username, skip, limit)
    isLoading.current = false
    setSkip(skip + limit)
    setContacts((contacts) => [...contacts, ...newContacts])
    if (newContacts.length < limit) {
      hasMore.current = false
    }
  }

  const renderItem = (item: ContactItem) => {
    return (
      <List.Item key={item.id}>
        <List.Item.Meta
          avatar={<Avatar src={item.avatar} />}
          title={item.name}
          description={item.alias}
        />
      </List.Item>
    )
  }

  return (
    <Card
      title={"好友列表"}
      bodyStyle={{ padding: 0 }}
      extra={<SyncOutlined onClick={handleLoadMore} />}
    >
      {contacts.length > 0 ? (
        <div className="demo-infinite-container">
          <InfiniteScroll
            pageStart={0}
            loadMore={handleLoadMore}
            hasMore={!isLoading.current && hasMore.current}
            useWindow={false}
          >
            <List dataSource={contacts} renderItem={renderItem}>
              {isLoading && hasMore && (
                <div className={"demo-loading-container"}>
                  <Spin />
                </div>
              )}
            </List>
          </InfiniteScroll>
        </div>
      ) : (
        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
      )}
    </Card>
  )
}

const MemoContactListInfinite = React.memo(CompContactListInfinite)
export default MemoContactListInfinite
