import React, { useState } from "react"
import { Modal, Spin } from "antd"
import { ScanStatus, Visibility } from "../../../DS/enums"
import { PayloadWxScan } from "../../../DS/interface"
import { connect } from "react-redux"
import { State } from "../../../store"

export interface CompWechatyScanStates {
  visibility: boolean
  wechatyScan: PayloadWxScan
}

const CompWechatScan = (props: CompWechatyScanStates) => {
  console.log(`rendered CompScan `)

  const [imgSrc, setImgSrc] = useState<string>("")

  const msg = props.wechatyScan
  if (msg.qrcode) {
    require("qrcode")
      .toDataURL(msg.qrcode)
      .then((src: string) => setImgSrc(src))
  }

  return (
    <Modal
      title={process.env.REACT_APP_NAME + "扫码登录系统"}
      visible={props.visibility}
      destroyOnClose={true}
      footer={null}
      keyboard={false}
      maskClosable={false}
      closable={false}
    >
      <div className="flex flex-col items-center">
        {msg.status === ScanStatus.Waiting && imgSrc ? (
          <img src={imgSrc} alt={"登录二维码"} />
        ) : (
          <Spin className="h-32 flex items-center" size="default" />
        )}
        <p>
          {(() => {
            switch (msg.status) {
              case ScanStatus.Unknown:
                return "正在努力加载，嘿呀呀呀……"
              case ScanStatus.Waiting:
                return "请及时扫描哦~"
              case ScanStatus.Scanned:
                return "扫描成功！等候确认……"
              case ScanStatus.Confirmed:
                return "确认成功！正在加载……"
              case ScanStatus.Cancel:
                // todo 取消处理
                return "取消啦"
              case ScanStatus.Timeout:
                // todo 超时处理
                return "超时！"
            }
          })()}
        </p>
      </div>
    </Modal>
  )
}

export default connect((state: State) => ({
  visibility: state.status[Visibility.ScanModal],
  wechatyScan: state.wxScan,
}))(CompWechatScan)
