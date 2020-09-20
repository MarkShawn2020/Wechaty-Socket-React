import { ScanStatus } from "wechaty"

export interface ScanMsg {
  socketID: string
  qrCode: string
  imgSrc: string
}

export interface ScanModalProps {
  status: ScanStatus
  msg: ScanMsg
}

interface UserData {
  weixin: string
  id: string
  name: string
  phone: string[]
  alias: string
  avatar: string
  city: string
  friend: string
  gender: string
  province: string
  signature: string
  type: number
}
