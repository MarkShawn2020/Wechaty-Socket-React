import CryptoJS from "crypto-js"
// react自带解析.env文件

if (!process.env.REACT_APP_AES_KEY || !process.env.REACT_APP_AES_IV) {
  console.log(process.env)
  throw new Error(
    "必须配置AES_KEY 和 AES_IV，可以通过 `openssl rand -r 16` 生成"
  )
}
const key: string = CryptoJS.enc.Utf8.parse(process.env.REACT_APP_AES_KEY)
const iv: string = CryptoJS.enc.Utf8.parse(process.env.REACT_APP_AES_IV)

export const encodeAES = (data: string) => {
  return CryptoJS.AES.encrypt(data, key, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  }).toString()
}
