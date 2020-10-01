import React from "react"
import CompServices from "./CompServices/CompServices"
import CompWxBasicObjects from "./CompWxBasicObjects/CompWxBasicObjects"
import { PayloadWxContact, PayloadWxRoom } from "../../DS/interface"
import { connect } from "react-redux"
import { State } from "../../store"

export interface CompContent2States {
  friends: PayloadWxContact[]
  friendsCount: number
  rooms: PayloadWxRoom[]
}

export const CompContent2 = (props: CompContent2States) => {
  console.log("rendered CompContent2")

  return (
    <div className="w-full p-0 md:p-4 h-full flex flex-col">
      <div className="order-9 md:order-5 my-4">
        <CompServices />
      </div>

      <div className="order-6 my-4">
        <CompWxBasicObjects
          items={props.friends as any}
          title={"好友列表"}
          itemsCount={props.friendsCount}
        />
      </div>

      <div className="order-7 my-4">
        <CompWxBasicObjects
          items={props.rooms as any}
          title={"群组列表"}
          itemsCount={props.rooms.length}
        />
      </div>
    </div>
  )
}

export default connect(
  (state: State): CompContent2States => ({
    friends: state.wxFriends,
    rooms: state.wxRooms,
    friendsCount: state.wxFriendsCount,
  })
)(CompContent2)
