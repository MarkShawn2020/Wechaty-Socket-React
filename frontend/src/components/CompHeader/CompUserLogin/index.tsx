import { Button, Modal } from "antd"
import { connect } from "react-redux"
import React, { Dispatch, useState } from "react"

import CompLoginForm from "./CompLoginForm"
import { Actions, PayloadUser } from "../../../DS/interface"
import { Visibility } from "../../../DS/enums"
import { State } from "../../../store"
import { EventBrowser } from "../../../DS/actions"

export interface CompLoginModalProps {
  appName: string
  user: PayloadUser
  visibility: boolean
}

export interface CompLoginModalDispatch {
  updateUserLogout: (user: PayloadUser) => void
}

export const CompUserLoginModal = (
  props: CompLoginModalProps & CompLoginModalDispatch
) => {
  console.log("rendered CompUserLoginModal")
  const [loginModalVisible, setLoginModalVisible] = useState(false)

  const onUserLogout = () =>
    props.updateUserLogout({ ...props.user, hasLogined: false })

  const onOpenLoginModal = () => setLoginModalVisible(true)

  const onCloseLoginModal = () => setLoginModalVisible(false)

  return (
    <div>
      <div onClick={onOpenLoginModal}>Login/Register</div>

      <Modal
        title={props.appName + `统一用户系统`}
        footer={null}
        visible={loginModalVisible}
        onCancel={onCloseLoginModal}
        width={400}
      >
        {props.user.hasLogined ? (
          <div className="flex justify-center items-center flex-col">
            <h1 className="text-3xl font-semibold">{props.user.username}</h1>
            <br />
            <Button
              type="primary"
              danger
              onClick={() => {
                onCloseLoginModal()
                onUserLogout()
              }}
            >
              退出
            </Button>
          </div>
        ) : (
          <CompLoginForm onCloseLoginModal={onCloseLoginModal} />
        )}
      </Modal>
    </div>
  )
}

export default connect(
  (state: State): CompLoginModalProps => ({
    appName: state.appName,
    user: state.user,
    visibility: state.status[Visibility.LoginModal],
  }),
  (dispatch: Dispatch<Actions>): CompLoginModalDispatch => ({
    updateUserLogout: (user) =>
      dispatch({
        type: EventBrowser.UPDATE_USER,
        payload: user,
      }),
  })
)(CompUserLoginModal)
