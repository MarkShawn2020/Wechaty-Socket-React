import {
  Button,
  Form,
  Input,
  message,
  Modal,
  notification,
  Rate,
  Space,
} from "antd"
import TextArea from "antd/es/input/TextArea"
import React, { useState } from "react"
import { connect } from "react-redux"
import MyIcon, { IconType } from "../../../utils/icons"
import { FormInstance } from "antd/es/form"
import PayAli from "../../../styles/images/支付宝收款.jpg"
import PayWechat from "../../../styles/images/微信收款.png"
import { Visibility } from "../../../DS/enums"
import { State } from "../../../store"
import { PayloadUser } from "../../../DS/interface"
import { $http } from "../../../utils/$http"
import { API, ParamsFeedbackPost } from "../../../DS/API"

const FEEDBACK_MAIL_PLACEHOLDER = "xxx@gmail.com"
const FEEDBACK_TEXT_PLACEHOLDER = "嘿，有什么需要改进的吗~"

export interface CompFeedbackModalStates {
  appName: string
  visibility: boolean
  user: PayloadUser
}

const CompCoffee = () => {
  return (
    <div>
      <div className="flex justify-around mb-4">
        <img src={PayAli} alt={"支付宝收款码"} className="w-48 h-64" />
        <img src={PayWechat} alt={"微信收款码"} className="w-48 h-64" />
      </div>

      <div className="text-center text-lg text-gray-700 mb-4">
        <p>给我一杯咖啡，我就能满足您的一个愿望。</p>

        <p className="italic">A Cup of Coffee, A Mr. Meeseeks.</p>
      </div>
    </div>
  )
}

export interface CompFeedbackFormProps {
  onFinishForm: (v: any) => void
  feedback: FormInstance
}

const CompFeedbackForm = (props: CompFeedbackFormProps) => {
  return (
    <Form
      id={"feedbackForm"}
      labelCol={{ span: 6 }}
      onFinish={props.onFinishForm}
      initialValues={{ rate: 5 }}
      form={props.feedback}
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
    </Form>
  )
}

const CompFeedbackModal = (props: CompFeedbackModalStates) => {
  console.log("rendered CompUserFeedback")

  const [feedbackModalVisible, setFeedbackModalVisible] = useState(false)
  const [feedback] = Form.useForm()
  const [isSubmitMode, setIsSubmitMode] = useState(true)

  const onOpenFeedbackModal = () => setFeedbackModalVisible(true)

  const onCloseFeedbackModal = () => setFeedbackModalVisible(false)

  const onFinishForm = (value: {
    content: string
    rate: number
    email: string
  }) => {
    if (!props.user.hasLogined) {
      message.error({ content: "该功能需要登录才可使用" })
      return
    }
    const data: ParamsFeedbackPost = {
      content: value.content,
      email: value.email,
      rate: value.rate,
      time: new Date(),
      username: props.user.username,
    }
    $http
      .post(API.service.feedback, data)
      .then(({ data }) => {
        if (data.insertedCount === 1) {
          notification.success({
            message: "反馈结果",
            description: `反馈收到，使命必达！`,
          })
        } else {
          notification.warn({
            message: "反馈结果",
            description: "未能成功反馈",
          })
        }
      })
      .catch((err) => {
        notification.error({
          message: "反馈结果",
          description: "反馈异常",
        })
      })
    onCloseFeedbackModal()
    feedback.resetFields()
  }

  return (
    <div>
      <div onClick={onOpenFeedbackModal}>Feedback</div>

      <Modal
        visible={feedbackModalVisible}
        title={props.appName + "使用反馈 ^_^"}
        okButtonProps={{ htmlType: "submit" }}
        footer={null}
        onCancel={onCloseFeedbackModal}
      >
        {isSubmitMode ? (
          <CompFeedbackForm onFinishForm={onFinishForm} feedback={feedback} />
        ) : (
          <CompCoffee />
        )}

        <div className="flex justify-end items-center">
          <Space>
            <Button
              type="primary"
              size="middle"
              className="inline-flex items-center"
              icon={<MyIcon type={IconType.COFFEE} className="text-base" />}
              onClick={() => setIsSubmitMode(!isSubmitMode)}
            >
              Coffee
            </Button>

            {/* reference: [Submit form from external button (Form in Modal) · Issue #9380 · ant-design/ant-design](https://github.com/ant-design/ant-design/issues/9380) */}
            <Button
              type="primary"
              size="middle"
              className="inline-flex items-center"
              icon={<MyIcon type={IconType.SUBMIT} className="text-base" />}
              form="feedbackForm"
              htmlType={"submit"}
              key="submit"
            >
              Submit
            </Button>
          </Space>
        </div>
      </Modal>
    </div>
  )
}

export default connect(
  (state: State): CompFeedbackModalStates => ({
    appName: state.appName,
    visibility: state.status[Visibility.FeedbackModal],
    user: state.user,
  })
)(CompFeedbackModal)
