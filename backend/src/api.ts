import { SecretData, UserLogin } from "../../frontend/src/DS/interface"
import { decodeAES } from "./utlis/secret"
import {
  writeAccountRegister,
  writeAccountLogin,
  readUserBasic,
  readWechatContacts,
  readWechatContactsCount,
  readWechatSelf,
  readWechatRooms,
  writeServiceRequestAdd,
  readServiceRequestAdd,
  writeServiceFeedback,
} from "./db/operations"
import { ParamsFeedbackPost } from "../../frontend/src/DS/API"

const Koa = require("koa")
const Router = require("koa-router")
const bodyParser = require("koa-bodyparser")
const CORS = require("@koa/cors")

const apiServer = () => {
  /**
   * account
   */
  const router_account = new Router()
  router_account.post("/register", async (ctx) => {
    const data: SecretData = ctx.request.body
    const dataDecodedString = decodeAES(data.dataEncoded)
    if (!dataDecodedString) return // 直接返回空，一般都是黑客攻击
    const dataDecoded: UserLogin = JSON.parse(dataDecodedString)
    console.log(dataDecoded)
    ctx.body = await writeAccountRegister(dataDecoded)
  })

  router_account.post("/login", async (ctx) => {
    const data: SecretData = ctx.request.body
    const dataDecodedString = decodeAES(data.dataEncoded)
    if (!dataDecodedString) return // 直接返回空，一般都是黑客攻击
    const dataDecoded: UserLogin = JSON.parse(dataDecodedString)
    console.log(dataDecoded)
    ctx.body = await writeAccountLogin(dataDecoded)
  })

  router_account.get("/basic", async (ctx) => {
    const username = ctx.request.query.username
    ctx.body = await readUserBasic(username)
  })

  /**
   * wechat
   */
  const router_wechat = new Router()
  router_wechat.get("/basic", async (ctx) => {
    const wxid = ctx.request.query.wxid
    ctx.body = await readWechatSelf(wxid)
  })

  router_wechat.get("/friends", async (ctx) => {
    const wxid = ctx.request.query.wxid
    const skip = parseInt(ctx.request.query.skip) || 0
    const limit = parseInt(ctx.request.query.limit) || 100
    const onlyFriends =
      !ctx.request.query.onlyFriends ||
      ctx.request.query.onlyFriends !== "false"
    ctx.body = await readWechatContacts({ wxid, skip, limit, onlyFriends })
  })

  router_wechat.get("/rooms", async (ctx) => {
    const wxid = ctx.request.query.wxid
    const skip = parseInt(ctx.request.query.skip) || 0
    const limit = parseInt(ctx.request.query.limit) || 100
    ctx.body = await readWechatRooms({ wxid, skip, limit })
  })

  router_wechat.get("/friends-count", async (ctx) => {
    const wxid = ctx.request.query.wxid
    const onlyFriends =
      !ctx.request.query.onlyFriends ||
      ctx.request.query.onlyFriends !== "false"
    ctx.body = await readWechatContactsCount(wxid, onlyFriends)
  })

  /***
   * service
   */
  const router_service = new Router()
  router_service.get("/", async (ctx) => {
    console.log("/ hello")
    ctx.body = "hello!"
  })

  router_service.post("/request", async (ctx) => {
    console.log({ query: ctx.request.body })

    const serviceType = ctx.request.body.serviceType
    ctx.body = await writeServiceRequestAdd({
      serviceType,
      time: new Date(),
      ip: ctx.request.ip,
      // todo: ip
    })
  })

  router_service.get("/request", async (ctx) => {
    const serviceType = ctx.request.query.serviceType
    console.log({ query: ctx.request.query })
    ctx.body = await readServiceRequestAdd({
      serviceType,
    })
  })

  router_service.post("/feedback", async (ctx) => {
    const params: ParamsFeedbackPost = ctx.request.body
    console.log(params)
    ctx.body = await writeServiceFeedback(params)
  })

  /**
   * api汇总
   */
  const router_api = new Router()
  router_api.get("/", async (ctx) => {
    ctx.body = "hello"
  })
  router_api.use("/account", router_account.routes())
  router_api.use("/wechat", router_wechat.routes())
  router_api.use("/service", router_service.routes())

  /**
   * 参考，拿到ip不容易
   * 1. https://koa.bootcss.com/
   * 2. https://ifttl.com/get-client-ip-in-koa/
   * 3. https://github.com/koajs/koa/issues/599
   */
  const app = new Koa({ proxy: true })
  const PORT = 3001
  app.use(CORS()).use(bodyParser()).use(router_api.routes()).listen(PORT)
  console.log("started @" + PORT)

  return app
}

export default apiServer
