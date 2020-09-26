// import CryptoJS from "crypto-js"
const CryptoJS = require("crypto-js")
require("dotenv").config()

if (!process.env.AES_KEY || !process.env.AES_IV) {
  console.log(process.env)
  throw new Error(
    "必须配置AES_KEY 和 AES_IV，可以通过 `openssl rand -r 16` 生成"
  )
}
const key: string = CryptoJS.enc.Utf8.parse(process.env.AES_KEY)
const iv: string = CryptoJS.enc.Utf8.parse(process.env.AES_IV)

export const decodeAES = (data: string) => {
  try {
    return CryptoJS.AES.decrypt(data, key, {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    }).toString(CryptoJS.enc.Utf8)
  } catch {
    return null
  }
}
