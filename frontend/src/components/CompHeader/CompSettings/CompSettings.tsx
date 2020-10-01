import { Form, Input, message, Modal } from "antd"
import React, { useState } from "react"
import { connect } from "react-redux"
import { State } from "../../../store"
import { EventSocket } from "../../../DS/actions"
import { CoreStatus, PayloadSubmitSettings } from "../../../DS/interface"
import { Network } from "../../../DS/enums"

export interface CompSettingsStates {
  appName: string
  status: CoreStatus
}

export interface CompSettingsDispatch {
  submitSettings: (payload: PayloadSubmitSettings) => void
}

const CompSettings = (props: CompSettingsStates & CompSettingsDispatch) => {
  const [visible, setVisible] = useState(false)
  const [form] = Form.useForm(null as any)

  const openModal = () => {
    setVisible(true)
  }

  const closeModal = () => {
    setVisible(false)
  }

  const submit = () => {
    if (!props.status[Network.RobotRunning]) {
      message.error("该功能需要已申请并运行对应服务器方可使用！")
      return
    }
    console.log(form.getFieldsValue())
    props.submitSettings(form.getFieldsValue())
    closeModal()
    message.success("新设置已生效！")
  }

  return (
    <div>
      <div onClick={openModal}>Settings</div>

      <Modal
        visible={visible}
        onCancel={closeModal}
        onOk={submit}
        title={`${props.appName}设置系统`}
      >
        <Form labelCol={{ span: 8 }} form={form}>
          <Form.Item label={"机器人前缀（无换行）"} name={"prefix"}>
            <Input placeholder={"from robot: "} />
          </Form.Item>
          <Form.Item label={"机器人后缀（有换行）"} name={"suffix"}>
            <Input placeholder={"from robot"} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default connect(
  (state: State): CompSettingsStates => ({
    appName: state.appName,
    status: state.status,
  }),
  (dispatch, ownProps): CompSettingsDispatch => ({
    submitSettings: (payload) =>
      dispatch({
        type: EventSocket.CLIENT_SUBMIT_SETTINGS,
        payload,
      }),
  })
)(CompSettings)
