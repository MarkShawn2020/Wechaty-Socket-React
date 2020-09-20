import { Wechaty } from "wechaty"
import { PuppetPadplus } from "wechaty-puppet-padplus"

/**
 *  导入dotenv包，以配置token
 */
require("dotenv").config()
if (!process.env.PUPPET_PADPLUS_TOKEN) {
  throw new Error("请在根目录的`.env`文件中配置`PUPPET_PADPLUS_TOKEN`！")
}

/**
 * 根据force参数控制的单例设计
 */
let instance: Wechaty | null

function initBot(name) {
  return new Wechaty({
    name,
    puppet: new PuppetPadplus({ token: process.env.PUPPET_PADPLUS_TOKEN }),
  })
}

function Bot(name, option = { force: false }) {
  if (option.force && instance && instance.name() !== name) {
    instance = null
  }
  return instance || initBot(name)
}

export default Bot
