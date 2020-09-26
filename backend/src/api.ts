import {
  SecretData,
  ServerItem,
  UserLogin,
} from "../../frontend_create-react-app/src/interface"
import { decodeAES } from "./utlis/secret"
import {
  userRegister,
  userLogin,
  fetchUserBasic,
  fetchUserContacts,
  fetchUserContactsCount,
} from "./db/operations"
import { Contact } from "wechaty"

const Koa = require("koa")
const Router = require("koa-router")
const bodyParser = require("koa-bodyparser")
const CORS = require("@koa/cors")

const apiServer = (fetchServers: () => ServerItem[]) => {
  /**
   * user
   */
  const router_user = new Router()
  router_user.post("/register", async (ctx) => {
    console.log("api /register")
    const data: SecretData = ctx.request.body
    const dataDecodedString = decodeAES(data.dataEncoded)
    if (!dataDecodedString) return // 直接返回空，一般都是黑客攻击
    const dataDecoded: UserLogin = JSON.parse(dataDecodedString)
    console.log(dataDecoded)
    ctx.body = await userRegister(dataDecoded)
  })

  router_user.post("/login", async (ctx) => {
    console.log("api /login")
    const data: SecretData = ctx.request.body
    const dataDecodedString = decodeAES(data.dataEncoded)
    if (!dataDecodedString) return // 直接返回空，一般都是黑客攻击
    const dataDecoded: UserLogin = JSON.parse(dataDecodedString)
    console.log(dataDecoded)
    ctx.body = await userLogin(dataDecoded)
  })

  router_user.get("/basic", async (ctx) => {
    const username = ctx.request.query.username
    console.log("api /basic, name: ", username)
    ctx.body = await fetchUserBasic(username)
  })

  router_user.get("/contacts", async (ctx) => {
    const username = ctx.request.query.username
    const skip = parseInt(ctx.request.query.skip) || 0
    const limit = parseInt(ctx.request.query.limit) || 100
    const onlyFriends =
      !ctx.request.query.onlyFriend || ctx.request.query.onlyFriend !== "false"
    console.log("api /contacts, name: ", username)
    ctx.body = await fetchUserContacts(username, skip, limit, onlyFriends)
  })

  router_user.get("/contacts-count", async (ctx) => {
    const username = ctx.request.query.username
    const onlyFriends =
      !ctx.request.query.onlyFriend || ctx.request.query.onlyFriend !== "false"
    console.log("api /contacts-count, name: ", username)
    ctx.body = await fetchUserContactsCount(username, onlyFriends)
  })
  /**
   * server
   */
  const router_server = new Router()
  router_server.get("/list", (ctx) => {
    console.log("api /servers")
    ctx.response.body = fetchServers()
  })

  /**
   * api汇总
   */
  const router_api = new Router()
  router_api.use("/user", router_user.routes())
  router_api.use("/server", router_server.routes())

  const app = new Koa()
  app.use(CORS()).use(bodyParser()).use(router_api.routes()).listen(3001)
  return app
}

export default apiServer
