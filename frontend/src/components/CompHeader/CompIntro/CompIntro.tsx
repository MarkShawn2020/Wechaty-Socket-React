import { Collapse, Modal } from "antd"
import React from "react"
import { connect } from "react-redux"
import { State } from "../../../store"
import CollapsePanel from "antd/es/collapse/CollapsePanel"
import ShareGroup from "../../../styles/images/小成时光屋.png"

export interface CompIntroStates {
  appName: string
}

export const CompIntro = (props: CompIntroStates) => {
  console.log("rendered CompIntro")

  const showIntro: any = () =>
    Modal.info({
      title: props.appName + "使用说明~",
      className: "p-0",
      content: (
        <Collapse accordion>
          <style jsx>{`
            .ant-modal-confirm-content {
              margin-left: 0 !important;
              margin-top: 8px;
            }
          `}</style>

          <CollapsePanel key={1} header={"开发契机"}>
            <p>
              本人微信作风严谨，常撤回误字错字，以致好友频频发问，为解此忧，特开发此项目，原只为撤回监控之用。
            </p>
          </CollapsePanel>

          <CollapsePanel key={2} header={"技术背景"}>
            <p>
              1.
              金融专业，爱好编程（华为前端研发在职），公众号南川笔记，擅长Python、TypeScript，前端主用React、Vue。
            </p>
            <p>
              2.
              曾经使用基于Python的itchat、wxpy等库实现了基于网页协议的微信机器人，本项目使用基于TypeScript的Wechaty库实现了基于Pad协议的微信机器人。
            </p>
            <p>
              3. 当然是Pad协议更优了，基本不会封号，接近全部Pad端的实体机功能。
            </p>
          </CollapsePanel>

          <CollapsePanel key={3} header={"开发现状"}>
            <p>
              目前已经完成了前端与后端的框架搭建，UI基本成型，已实现以下功能
            </p>
            <ul>
              <li>1. 自动获取好友、群组列表，点击消息按钮即可快捷发送信息</li>
              <li>2. 实时监控所有的消息（好友+群组），点击即可快捷回复</li>
              <li>3. 支持实时聊天室功能，消息能够被打开该网友的所有人看到</li>
              <li>
                4. 支持服务器扩展，可以添加多个Wechaty的Token，实现多账号服务
              </li>
              <li>
                5.
                由于目前只有一个Token，因此用户需要轮流使用，基于此实现了下线、托管、踢线等功能
              </li>
            </ul>
          </CollapsePanel>

          <CollapsePanel key={4} header={"项目TODO"}>
            <p>
              1. 本项目原则上不做商用，毕竟没有大量token，且存在一定的监管风险
            </p>
            <p>
              2. 但本项目能很好地锻炼自己的开发能力，包括对react、socket等的熟悉
            </p>
            <p>
              3.
              近期可能会陆续扩展的功能，主要就是一些交互优化与"服务订阅"，也欢迎后台留言反馈
            </p>
          </CollapsePanel>

          <CollapsePanel key={5} header={"隐私说明"}>
            <ol>
              <li>
                1.
                本网站信息传输过程采用高级别的加密手段，您的信息可安全录入与存储
              </li>

              <li>
                2.
                本网站作为微信的第三方服务，建议不要传输过于敏感以及其他违反国家法律规定的信息
              </li>

              <li>
                3.
                本网站坚决不会使用或滥用用户的个人信息，包括存储、转发、非法交易，如有违反，可举报
              </li>

              <li>
                4.
                感谢您的支持，如需打赏或反馈可点击菜单按钮【Feedback】，谢谢！
              </li>
            </ol>
          </CollapsePanel>

          <CollapsePanel key={6} header={"加入交流群"}>
            <img
              src={ShareGroup}
              alt={"小成时光屋交流群"}
              className="mx-auto"
              style={{ width: "200px", height: "300px" }}
            />
          </CollapsePanel>
        </Collapse>
      ),
    })

  return (
    <div onClick={showIntro}>
      <p>Introduction</p>
    </div>
  )
}

export default connect(
  (state: State): CompIntroStates => {
    return {
      appName: state.appName,
    }
  }
)(CompIntro)
