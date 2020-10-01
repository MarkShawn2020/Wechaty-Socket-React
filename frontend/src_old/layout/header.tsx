import {
  Button,
  Form,
  Input,
  Menu,
  Modal,
  notification,
  Rate,
  Layout,
} from "antd"
import TextArea from "antd/es/input/TextArea"
import React, { useState } from "react"
import ReactDOMServer from "react-dom/server"
import ModalLogin from "../components/CompLogin/CompLoginModal"

const APP_NAME = process.env.REACT_APP_NAME || "小成时光屋"
const FEEDBACK_MAIL_PLACEHOLDER = "xxx@gmail.com"
const FEEDBACK_TEXT_PLACEHOLDER = "嘿，有什么需要改进的吗~"

const ModalFeedback = (props: { visible: boolean; onClose: Function }) => {
  const [feedback] = Form.useForm()
  // const [feedbackVisible, setFeedbackVisible] = useState(false)

  const formLayout = {
    labelCol: { span: 6 },
  }

  const onCloseForm = () => {
    props.onClose()
  }

  const onFinishForm = (value: object) => {
    console.log(value)
    props.onClose()
    notification.success({
      message: "反馈结果",
      description: `反馈收到，使命必达！`,
    })
    feedback.resetFields()
  }

  return (
    <Modal
      visible={props.visible}
      title={APP_NAME + "使用反馈 ^_^"}
      okButtonProps={{ htmlType: "submit" }}
      footer={null}
      onCancel={onCloseForm}
    >
      <Form
        {...formLayout}
        onFinish={onFinishForm}
        initialValues={{ rate: 5 }}
        form={feedback}
      >
        <Form.Item label="Rate" name="rate" valuePropName="defaultValue">
          <Rate />
        </Form.Item>

        <Form.Item
          label="Content"
          name="content"
          rules={[{ required: true, message: "反馈消息必填哦！" }]}
        >
          <TextArea rows={2} placeholder={FEEDBACK_TEXT_PLACEHOLDER} />
        </Form.Item>

        <Form.Item
          label="E-Mail"
          name="email"
          rules={[
            { required: true, message: "留个联系方式呗！" },
            { type: "email", message: "邮箱格式不合法哦！" },
          ]}
          validateTrigger="onBlur"
        >
          <Input placeholder={FEEDBACK_MAIL_PLACEHOLDER} />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" className="float-right">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  )
}

const MyHeader = (props: { appName: string }) => {
  const [menuKey, setMenuKey] = useState("home")
  const [feedbackVisible, setFeedbackVisible] = useState(false)
  const [loginVisible, setLoginVisible] = useState(false)

  const onShowIntro = () => {
    Modal.info({
      title: props.appName + "使用说明~",
      content: (
        <div id="description" className="text-gray-600">
          <p />
          <p>这是一个小小小程序，专门用于记录撤回的微信信息</p>
          <p>扫码登录后，好友撤回的消息将自动转发到文件助手</p>
          <p>该程序可由任意人使用，但任一时刻只能有一人在线</p>
        </div>
      ),
    })
  }

  return (
    <Layout.Header className="flex items-center bg-pink-200 p-4">
      {/*<img src={"/banner.png"} alt="vase" className="float-left h-12" />*/}
      <h1 className="text-xl text-purple-600">{props.appName}</h1>

      <Menu
        mode={"horizontal"}
        selectedKeys={[menuKey]}
        className="no-underline hover:no-underline"
        style={{ background: "transparent" }}
        onClick={(e) => setMenuKey(e.key.toString())}
      >
        <Menu.Item key={"home"}>Home</Menu.Item>
        <Menu.Item key={"intro"} onClick={onShowIntro}>
          Introduction
        </Menu.Item>

        <Menu.Item key={"feedback"} onClick={() => setFeedbackVisible(true)}>
          FeedBack
        </Menu.Item>
        <ModalFeedback
          visible={feedbackVisible}
          onClose={() => setFeedbackVisible(false)}
        />

        <Menu.Item
          key={"login"}
          onClick={() => {
            setLoginVisible(true)
          }}
        >
          Login/Register
        </Menu.Item>
        <ModalLogin
          visible={loginVisible}
          onFinishForm={() => setLoginVisible(false)}
          onClose={() => setLoginVisible(false)}
        />
      </Menu>
    </Layout.Header>
  )
}

export default MyHeader
