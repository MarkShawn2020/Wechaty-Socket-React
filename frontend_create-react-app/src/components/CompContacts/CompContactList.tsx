import React, { useEffect, useRef, useState } from "react"
import { useCookies } from "react-cookie"
import { Avatar, Button, Card, Empty, List, Popover, Space, Spin } from "antd"
import { MessageOutlined, SyncOutlined } from "@ant-design/icons"

import { ContactItem } from "../../interface"
import { $http } from "../../utils/$http"
import { API } from "../../interface/API"
import Search from "antd/es/input/Search"

import "./list-item-style.scss"

const CompContactListInfinite = () => {
  const [cookie] = useCookies()
  const [contactsCount, setContactsCount] = useState(0)
  const skip = useRef(0)
  const isLoading = useRef(false)
  const [contactsShow, setContactsShow] = useState<ContactItem[]>([])
  const contacts = useRef<ContactItem[]>([])
  const username = cookie.user.username
  const contactSearch = useRef("")
  const stopFetchingContacts = useRef(false)

  console.log(`rendered CompContactList with length: `, contacts.current.length)

  useEffect(() => {
    fetchContactsCount().then()
    clickLoadContents().then()
  }, [])

  const fetchContactsCount = async () => {
    const { data } = await $http.get(API.user.contactsCount, {
      params: { username },
    })
    setContactsCount(data)
  }

  const _fetchMoreContacts = async () => {
    const limit = 100
    isLoading.current = true
    console.log({ username, skip: skip.current, limit })
    const { data: newContacts } = await $http.get(API.user.contacts, {
      params: { username, skip: skip.current, limit },
    })
    contacts.current.push(...newContacts)
    if (newContacts.length < limit || stopFetchingContacts.current) {
      isLoading.current = false
      skip.current = 0
    } else {
      skip.current += limit
    }
    setContactsShow((contactsShow) => [...contacts.current])
    if (newContacts.length === limit) {
      if (!stopFetchingContacts.current) {
        // todo
        // await _fetchMoreContacts()
      } else {
        stopFetchingContacts.current = false
      }
    }
  }

  const clickLoadContents = async () => {
    skip.current = 0
    contacts.current = []
    await _fetchMoreContacts()
  }

  const renderItem = (item: ContactItem) => {
    return (
      <List.Item
        key={item.id}
        actions={[
          <Button type="text">
            <MessageOutlined />
          </Button>,
        ]}
        className="list-item"
      >
        <List.Item.Meta
          avatar={
            <Popover
              content={
                <img
                  src={item.avatar}
                  alt={item.name}
                  style={{ width: "160px", height: "160px", opacity: "90%" }}
                />
              }
              placement="top"
              trigger="click"
            >
              <div className="relative">
                <Avatar src={item.avatar} className="avatar relative" />
                <Avatar
                  src={item.avatar}
                  className="avatar-blur absolute top-0 left-0"
                />
              </div>
            </Popover>
          }
          title={item.name}
          description={item.alias}
        />
      </List.Item>
    )
  }

  const onSearchContacts = (v: string) => {
    const contactsFiltered = contacts.current.filter((contact) => {
      return contact.name.includes(v) || contact.alias.includes(v)
    })
    setContactsShow(contactsFiltered)
  }

  const onChangeContacts = (e: any) => {
    const v: string = e.target.value
    contactSearch.current = v
    onSearchContacts(v)
  }

  const Controls = () => {
    return (
      <div>
        {/* {pointerEvents: "none"} */}

        <Space className="inline-flex items-center">
          {isLoading.current && (
            <SyncOutlined
              onClick={() => {
                stopFetchingContacts.current = true
              }}
              className={"inline-flex items-center"}
              spin={isLoading.current}
            />
          )}

          <p>
            ({contactsShow.length}/{contactsCount})
          </p>

          <Search
            className="w-36"
            onSearch={onSearchContacts}
            // onChange={onChangeContacts}
            // value={contactSearch.current}
            autoFocus={
              !isLoading.current && contactsShow.length !== contactsCount
            }
          />
        </Space>
      </div>
    )
  }

  return (
    <Card title={"好友列表"} bodyStyle={{ padding: 0 }} extra={<Controls />}>
      {contactsCount > 0 ? (
        <div className="infinite-container">
          <List dataSource={contactsShow} renderItem={renderItem}>
            {isLoading.current && (
              <div className="loading">
                <Spin />
              </div>
            )}
          </List>
        </div>
      ) : (
        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
      )}
    </Card>
  )
}

const MemoContactList = React.memo(CompContactListInfinite)
export default MemoContactList
