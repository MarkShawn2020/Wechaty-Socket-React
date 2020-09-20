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

interface MyHeaderProps {
  appName: string | undefined
}

const MyHeader = (props: MyHeaderProps) => {
  const defaultSampleEmail = "xxx@gmail.com"
  const defaultFeedbackText = "嘿，有什么需要改进的吗~"

  const [feedback] = Form.useForm()
  const [menuKey, setMenuKey] = useState("home")
  const [feedbackVisible, setFeedbackVisible] = useState(false)

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

  const formLayout = {
    labelCol: { span: 6 },
  }

  const onCloseForm = () => {
    setFeedbackVisible(false)
  }

  const onFinishForm = (value: object) => {
    console.log(value)
    setFeedbackVisible(false)
    notification.success({
      message: "反馈结果",
      description: `反馈收到，使命必达！`,
    })
    feedback.resetFields()
  }

  return (
    <Layout.Header className="flex items-center bg-pink-200">
      {/*<img src={"/banner.png"} alt="vase" className="float-left h-12" />*/}
      <h1 className="text-xl text-purple-600 text-center">{props.appName}</h1>

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
      </Menu>

      <Modal
        visible={feedbackVisible}
        title={props.appName + "使用反馈 ^_^"}
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
            <TextArea rows={2} placeholder={defaultFeedbackText} />
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
            <Input placeholder={defaultSampleEmail} />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" className="float-right">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </Layout.Header>
  )
}

export default MyHeader
