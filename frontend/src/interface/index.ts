export enum ScanStatus {
  Unknown = 0,
  Cancel = 1,
  Waiting = 2,
  Scanned = 3,
  Confirmed = 4,
  Timeout = 5,
}

export interface ScanMsg {
  status: number
  socketID: string
  qrCode: string
  imgSrc: string
}

export interface UserData {
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

export enum LoginStatus {
  UnLogined,
  Logined,
  Logout,
  Logoff,
}

export const transLoginStatus = (e: LoginStatus) => {
  const s: { [key: number]: string } = {
    0: "未登录",
    1: "在线",
    2: "离线",
    3: "已注销",
  }
  return s[e]
}
