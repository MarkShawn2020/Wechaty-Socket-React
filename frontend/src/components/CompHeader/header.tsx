import { Menu } from "antd"
import React, { useState } from "react"
import CompFeedbackModal from "./CompUserFeedback/CompFeedbackModal"
import { connect } from "react-redux"
import { Dispatch } from "redux"
import CompLoginModal from "./CompUserLogin"
import CompIntro from "./CompIntro/CompIntro"
import CompSettings from "./CompSettings/CompSettings"
import { Actions, CoreStatus, PayloadRunningStatus } from "../../DS/interface"
import { State } from "../../store"
import { EventBrowser } from "../../DS/actions"
import VaseLogo from "../../styles/images/vase-red.png"

export interface CompHeaderProps {
  appName: string
  status: CoreStatus
}

export interface CompHeaderDispatch {
  switchStatus: (payload: PayloadRunningStatus) => void
}

const CompHeader = (props: CompHeaderProps & CompHeaderDispatch) => {
  console.log("rendered CompHeader")

  const [menuKey, setMenuKey] = useState("home")

  return (
    <>
      <img src={VaseLogo} alt="vase" className="md:hidden w-8 h-8" />
      <h1 className="text-xl text-purple-600 hidden md:block">
        {props.appName}
      </h1>

      <Menu
        mode={"horizontal"}
        selectedKeys={[menuKey]}
        className="no-underline hover:no-underline"
        style={{ background: "transparent" }}
        onClick={(e) => setMenuKey(e.key.toString())}
      >
        {/*<Menu.Item key={"home"}>Home</Menu.Item>*/}

        <Menu.Item key={"intro"}>
          <CompIntro />
        </Menu.Item>

        <Menu.Item key={"login"}>
          <CompLoginModal />
        </Menu.Item>

        <Menu.Item key={"feedback"}>
          <CompFeedbackModal />
        </Menu.Item>

        <Menu.Item key={"settings"}>
          <CompSettings />
        </Menu.Item>
      </Menu>
    </>
  )
}

export default connect(
  (state: State): CompHeaderProps => ({
    appName: state.appName,
    status: state.status,
  }),
  (dispatch: Dispatch<Actions>): CompHeaderDispatch => ({
    switchStatus: (payload) =>
      dispatch({
        type: EventBrowser.SWITCH_STATUS,
        payload,
      }),
  })
)(CompHeader)
