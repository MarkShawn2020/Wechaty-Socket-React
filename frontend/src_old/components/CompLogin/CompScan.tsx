import React, { useState } from "react"
import { Modal, Spin } from "antd"
import { ScanDataType } from "../../data-sctructure/interface"
import { ScanStatus } from "../../data-sctructure/enums"

const CompScan = (props: { msg: ScanDataType; visible: boolean }) => {
  const [imgSrc, setImgSrc] = useState<string>("")
  console.log(`rendered CompScan `)

  if (props.msg.qrcode) {
    require("qrcode")
      .toDataURL(props.msg.qrcode)
      .then((src: string) => setImgSrc(src))
  }

  return (
    <Modal
      title={process.env.REACT_APP_NAME + "扫码登录系统"}
      visible={props.visible}
      destroyOnClose={true}
      footer={null}
      keyboard={false}
      maskClosable={false}
      closable={false}
    >
      <div className="flex flex-col items-center">
        {props.msg.status === ScanStatus.Waiting && imgSrc ? (
          <img src={imgSrc} alt={"登录二维码"} />
        ) : (
          <Spin className="h-32 flex items-center" size="default" />
        )}
        <p>
          {(() => {
            switch (props.msg.status) {
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

export default CompScan
