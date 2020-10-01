import React, { Dispatch, useState } from "react"
import { Button, Checkbox, Form, Input, message, Spin } from "antd"
import {
  Actions,
  PayloadUserChat,
  UserLogin,
  UserRegister,
} from "../../../DS/interface"
import { API } from "../../../DS/API"
import { Code } from "../../../DS/codes"
import { encodeAES } from "../../../utils/secret"
import $http from "../../../utils/$http"
import { LockOutlined, UserOutlined } from "@ant-design/icons"
import socketStore from "../../../store"
import { EventBrowser, EventSocket } from "../../../DS/actions"
import { connect } from "react-redux"

export interface CompLoginFormProps {
  onCloseLoginModal: () => void
}

export interface CompLoginFormDispatch {
  sendWelcomeChat: (payload: PayloadUserChat) => void
}

const CompLoginForm = (props: CompLoginFormProps & CompLoginFormDispatch) => {
  const [isLoginMode, setIsLoginModel] = useState(true)
  const [waiting, setWaiting] = useState<boolean>(false)
  const [form] = Form.useForm()

  /**
   * 账户密码信息应该由浏览器自己加载，而cookie存储我们的user数据，这两个概念不同
   */

  const onRegister = async (userData: UserRegister) => {
    setWaiting(true)
    const dataEncoded = encodeAES(JSON.stringify(userData))
    const { data } = await $http.post(API.account.register, { dataEncoded })
    if (data === Code.SUCCESS) {
      await $http.get(API.account.basic, {
        params: { username: form.getFieldValue("username") },
      })
      message.success({ content: "注册成功，请用新账号登录！" })
      props.sendWelcomeChat({
        username: "SYSTEM",
        content: `一位新朋友：${userData.username}注册成功`,
        time: new Date(),
      })
      setIsLoginModel(true)
    } else {
      message.error({ content: Code[data] })
    }
    setWaiting(false)
  }

  const onLogin = async (userData: UserLogin) => {
    setWaiting(true)
    const dataEncoded = encodeAES(JSON.stringify(userData))
    const { data } = await $http.post(API.account.login, { dataEncoded })
    if (data === Code.SUCCESS) {
      const { data } = await $http.get(API.account.basic, {
        params: { username: form.getFieldValue("username") },
      })
      data.hasLogined = true

      socketStore.dispatch({
        type: EventBrowser.UPDATE_USER,
        payload: data,
      })
      message.success({ content: "登录成功" })
      props.sendWelcomeChat({
        username: "SYSTEM",
        content: `${userData.username}登录成功`,
        time: new Date(),
      })

      props.onCloseLoginModal()
    } else {
      message.error({ content: Code[data] })
    }
    setWaiting(false)
  }

  const onSubmit = async (userData: UserLogin) => {
    console.log({ userData })
    if (isLoginMode) {
      await onLogin(userData)
    } else {
      await onRegister(userData)
    }
  }

  /**
   * 通过在给from设置id，然后为button设置form、htmlType属性，以任意实现按钮点击提交表单数据的功能
   * 可以参见：https://github.com/ant-design/ant-design/issues/9380
   **/
  return (
    <Form
      id={"loginForm"}
      form={form}
      name="normal_login"
      className="login-form"
      initialValues={{ remember: true }}
      onFinish={onSubmit}
    >
      <Form.Item
        name="username"
        rules={[
          {
            required: true,
            message: "Please input your Username!",
          },
        ]}
      >
        <Input
          prefix={<UserOutlined className="site-form-item-icon" />}
          placeholder="Username"
        />
      </Form.Item>

      {/* 密码 */}
      <Form.Item
        name="password"
        rules={[{ required: true, message: "Please input your Password!" }]}
      >
        <Input
          prefix={<LockOutlined className="site-form-item-icon" />}
          type="password"
          placeholder="Password"
        />
      </Form.Item>

      {/* 密码确认，仅注册可见*/}
      {!isLoginMode && (
        <Form.Item
          name="password_confirm"
          dependencies={["password"]}
          rules={[
            { required: true, message: "Please confirm your Password!" },
            ({ getFieldValue }) => ({
              validator(rule, value) {
                if (!value || getFieldValue("password") === value) {
                  return Promise.resolve()
                }
                return Promise.reject("password do not match!")
              },
            }),
          ]}
        >
          <Input
            prefix={<LockOutlined className="site-form-item-icon" />}
            type="password"
            placeholder="Password_confirm"
          />
        </Form.Item>
      )}

      {/* 记住密码 */}
      <Form.Item
        name="remember"
        valuePropName="checked"
        noStyle
        style={{ float: "left" }}
      >
        <Checkbox>Remember me</Checkbox>
      </Form.Item>

      {/* 忘记密码 */}
      {/*{isLoginMode && (*/}
      {/*  <Form.Item className="">*/}
      {/*    <a className="login-form-forgot float-right" href="">*/}
      {/*      Forgot password*/}
      {/*    </a>*/}
      {/*  </Form.Item>*/}
      {/*)}*/}

      {/* 点击登录/注册 */}
      <Form.Item>
        <Button
          size="middle"
          type="primary"
          className="login-form-button w-full my-2"
          form={"loginForm"}
          htmlType="submit"
          key={"submit"}
        >
          {waiting ? <Spin /> : isLoginMode ? "登录" : "注册"}
        </Button>
      </Form.Item>

      {/* 切换登录 / 注册模式 */}
      {isLoginMode ? (
        <div>
          没有账号？{" "}
          <Button
            type="text"
            className="text-pink-500"
            onClick={() => {
              setIsLoginModel(false)
              form.resetFields()
            }}
          >
            立即注册
          </Button>
        </div>
      ) : (
        <div>
          已有账号？{" "}
          <Button
            type="text"
            className="text-pink-500"
            onClick={() => setIsLoginModel(true)}
          >
            立即登录
          </Button>
        </div>
      )}
    </Form>
  )
}

export default connect(
  null,
  (dispatch: Dispatch<Actions>): CompLoginFormDispatch => ({
    sendWelcomeChat: (payload: PayloadUserChat) =>
      dispatch({
        type: EventSocket.CLIENT_SEND_USER_CHAT,
        payload: payload,
      }),
  })
)(CompLoginForm)
