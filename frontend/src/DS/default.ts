import { PayloadUser, PayloadWxScan } from "./interface"
import moment from "moment"
import { Network, ScanStatus, Visibility } from "./enums"

export const USER: PayloadUser = {
  username: "",
  hasLogined: false,
  remember: true,
  deadTime: moment().add(7, "d").toDate(),
}

export const APP_NAME = "小成时光屋"

export const WX_SCAN: PayloadWxScan = {
  status: ScanStatus.Unknown,
  qrcode: "",
}

export const WX_SELF = {
  _id: "",
  id: "",
  friend: true,
  gender: 0,
  type: 0,
  phone: [],
  alias: "",
  avatar: "",
  city: "",
  name: "",
  province: "",
  signature: "",
  weixin: "",
}

export const STATUS = {
  [Network.FriendsPulling]: false,
  [Network.RoomsPulling]: false,
  [Network.BackendConnected]: false,
  [Network.ServerRequesting]: false,
  [Network.ServerStarting]: false,
  [Network.RobotRunning]: false,
  [Visibility.FeedbackModal]: false,
  [Visibility.LoginModal]: false,
  [Visibility.ScanModal]: false,
  [Network.LoggingOut]: false,
}
