import React from "react"
import { Modal, Spin } from "antd"
import { ScanMsg, ScanStatus } from "../interface"

const ScanModal = (props: { msg: ScanMsg; visible: boolean }) => {
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
        {props.msg.status === ScanStatus.Waiting && props.msg ? (
          <>
            <img
              src={props.msg.imgSrc}
              alt={props.msg.qrCode}
              title={"登录二维码"}
            />

            <p className="text-gray-500">请及时扫描哦~</p>
          </>
        ) : (
          <>
            <Spin className="h-32 flex items-center" size="default" />
            {props.msg.status === ScanStatus.Scanned && (
              <p>扫描成功！等候确认……</p>
            )}
            {props.msg.status === ScanStatus.Confirmed && (
              <p>确认成功！正在加载……</p>
            )}
            {props.msg.status === ScanStatus.Unknown && (
              <p>正在努力加载，嘿呀呀呀……</p>
            )}
          </>
        )}
      </div>
    </Modal>
  )
}

export default ScanModal
