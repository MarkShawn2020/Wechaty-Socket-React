export const API = {
  account: {
    login: "/account/login",
    register: "/account/register",
    basic: "/account/basic",
  },
  wechat: {
    basic: "/wechat/basic",
    friends: "/wechat/friends",
    contactsCount: "/wechat/friends-count",
    rooms: "/wechat/rooms",
  },
  service: {
    add: "/service/request",
    feedback: "/service/feedback",
  },
}

export interface ParamsQueryWechatRooms {
  wxid: string
  skip?: number
  limit?: number
}

export interface ParamsQueryWechatFriends extends ParamsQueryWechatRooms {
  onlyFriends?: boolean
}

export enum ServiceType {
  Recall = "recall",
  Timing = "timing",
  Backup = "backup",
  Avatar = "avatar",
  Network = "network",
}

export interface ParamsBase {
  ip?: string
  time?: Date
}

export interface ParamsServiceAddGet {
  serviceType: ServiceType
}

export interface ParamsServiceAddPost extends ParamsServiceAddGet, ParamsBase {}

export interface ParamsFeedbackPost extends ParamsBase {
  rate: number
  content: string
  email: string
  username: string
}
