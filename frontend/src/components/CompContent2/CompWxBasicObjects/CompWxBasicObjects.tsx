import CompWxBasicObject from "./CompWxBasicObject"
import { PayloadWxContact, PayloadWxRoom } from "../../../DS/interface"
import { Card, Skeleton, Spin } from "antd"
import React, { useRef, useState } from "react"
import InfiniteScroll from "react-infinite-scroller"
import { $http } from "../../../utils/$http"
import { API } from "../../../DS/API"
import { connect } from "react-redux"
import { State } from "../../../store"
import { EventHttp } from "../../../DS/actions"

export interface CompWxBasicObjectsStates {
  wxid: string
}

export interface CompWxBasicObjectsProps {
  items: (PayloadWxContact & PayloadWxRoom)[]
  itemsCount: number
  title: string
}

export interface CompWxBasicObjectsDispatch {
  pushMoreFriends: (payload: PayloadWxContact[]) => void
}

export const CompWxBasicObjects = (
  props: CompWxBasicObjectsProps &
    CompWxBasicObjectsStates &
    CompWxBasicObjectsDispatch
) => {
  const [isPulling] = useState(false)
  const skipRef = useRef(0)
  console.log("rendered " + props.title)

  const loadMore = () => {
    const api = props.title.includes("群")
      ? API.wechat.rooms
      : API.wechat.friends
    $http
      .get(api, { params: { wxid: props.wxid, skip: skipRef.current } })
      .then(({ data }: any) => {
        skipRef.current += 100
        props.pushMoreFriends(data)
      })
      .catch((err) => {
        console.log({ err })
      })
  }

  return (
    <Card
      title={props.title}
      bodyStyle={{ padding: 0, maxHeight: "300px", overflow: "scroll" }}
      extra={
        <p>
          ({props.items.length} / {props.itemsCount})
        </p>
      }
    >
      {isPulling ? (
        <div className="p-4">
          {Array.from(Array(3)).map((e, i) => {
            return (
              <Skeleton
                title
                loading
                avatar
                children
                paragraph
                active
                key={i}
              />
            )
          })}
        </div>
      ) : (
        <InfiniteScroll
          pageStart={skipRef.current}
          initialLoad={true}
          loadMore={loadMore}
          hasMore={skipRef.current + 100 < props.itemsCount}
          useWindow={false}
          threshold={600}
          loader={
            <div
              className="w-full h-24 flex items-center justify-center"
              key="loader"
            >
              <Spin size="default" />
            </div>
          }
        >
          {props.items.map((item) => (
            <CompWxBasicObject item={item} key={item.id} />
          ))}
        </InfiniteScroll>
      )}
    </Card>
  )
}

export default connect(
  (state: State): CompWxBasicObjectsStates => ({
    wxid: state.wxSelf.id,
  }),
  (dispatch, ownProps): CompWxBasicObjectsDispatch => ({
    pushMoreFriends: (payload) =>
      dispatch({
        type: EventHttp.FETCH_MORE_FRIENDS_SUCCESS,
        payload,
      }),
  })
)(CompWxBasicObjects)
