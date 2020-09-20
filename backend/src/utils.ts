const QRCode = require("qrcode")

export const getImgSrcFromQRCode = async (qrCode: string) => {
  return await QRCode.toDataURL(qrCode)
}
