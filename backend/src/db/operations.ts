import { BulkWriteInsertOneOperation, Db, MongoClient } from "mongodb"
import {
  PayloadWxSelf,
  UserLogin,
  PayloadWxContact,
} from "../../../frontend/src/DS/interface"
import { Code } from "../../../frontend/src/DS/codes"
import { Collections } from "../../../frontend/src/DS/enums"
import {
  ParamsFeedbackPost,
  ParamsQueryWechatFriends,
  ParamsQueryWechatRooms,
  ParamsServiceAddGet,
  ParamsServiceAddPost,
} from "../../../frontend/src/DS/API"
import { Contact, Room } from "wechaty"
require("dotenv").config()
console.assert(process.env.MONGODB_DB_NAME)

/**
 * 工厂函数
 * @param cb
 */
export const connectDB = async (cb: (db: Db) => any) => {
  const user = encodeURIComponent(process.env.MONGODB_USER)
  const pswd = encodeURIComponent(process.env.MONGODB_PSWD)
  const client = new MongoClient(
    `mongodb://${user}:${pswd}@${process.env.MONGODB_HOST}:${process.env.MONGODB_PORT}`,
    {
      authSource: process.env.MONGODB_AUTH_DB, // 必填，因为后台开启了正好验证
      poolSize: 10, // 最大并发数，默认为5
      useUnifiedTopology: true, // 必填，不然有warning，太烦了
      useNewUrlParser: true,
      w: "majority",
    }
  )
  await client.connect()
  // console.log("mongodb connected")
  const db: Db = client.db(process.env.MONGODB_DB_NAME)

  try {
    return await cb(db)
  } catch (err) {
    console.log({ err })
    return Code.FAILED_FOR_UNKNOWN
  } finally {
    await client.close()
  }
}

/**
 * 用户系统
 */

export const readUserBasic = async (username: string) => {
  return await connectDB(async (db) => {
    return await db
      .collection(Collections.Users)
      .findOne({ _id: username }, { projection: { password: 0 } })
  })
}

export const writeAccountRegister = async (userData: UserLogin) => {
  return await connectDB(async (db) => {
    return db
      .collection(Collections.Users)
      .insertOne({ _id: userData.username, ...userData })
      .then(() => {
        return Code.SUCCESS
      })
      .catch((err) => {
        if (err.name === "MongoError" && err.code === 11000) {
          return Code.USER_REGISTER_FAILED_FOR_NAME_EXISTED
        } else {
          return Code.FAILED_FOR_UNKNOWN
        }
      })
  })
}

export const writeAccountLogin = async (userData: UserLogin) => {
  return await connectDB(async (db: Db) => {
    const item = await db
      .collection(Collections.Users)
      .findOne({ _id: userData.username, password: userData.password })
    if (!item) return Code.USER_LOGIN_FAILED_FOR_INCORRECT_USERNAME_OR_PASSWORD
    return Code.SUCCESS
  })
}

/**
 * 微信系统
 * @param payload
 */
export const writeWechatSelf = async (payload: PayloadWxSelf) => {
  return await connectDB(async (db: Db) => {
    await db
      .collection(Collections.Wechats)
      .updateOne({ id: payload.id }, { $set: payload }, { upsert: true })
    console.log(`微信账号基本信息更新完成`)
    return Code.SUCCESS
  })
}

export const readWechatSelf = async (wxid: string) => {
  return await connectDB(async (db: Db) => {
    return await db.collection(Collections.Wechats).findOne({ id: wxid })
  })
}

export const readWechatContacts = async (params: ParamsQueryWechatFriends) => {
  return await connectDB(async (db) => {
    const query = { wxid: params.wxid }
    if (params.onlyFriends) {
      query["friend"] = true
    }
    return await db
      .collection(Collections.Friends)
      .find(query)
      .skip(params.skip)
      .limit(params.limit)
      .toArray()
  })
}

export const readWechatRooms = async (params: ParamsQueryWechatRooms) => {
  return await connectDB(async (db: Db) => {
    return await db
      .collection(Collections.Rooms)
      .aggregate([
        {
          $match: { wxid: params.wxid },
        },
        {
          $addFields: {
            members: { $size: "$memberIdList" },
          },
        },
        {
          $project: {
            memberIdList: 0,
          },
        },
      ])
      .skip(params.skip)
      .limit(params.limit)
      .toArray()

    //
    // .find(query, {
    //   projection: { memberIdList: 1, members: { $count: "$memberIdList" } },
    // })

    // .toArray()
  })
}

export const readWechatContactsCount = async (
  wxid: string,
  onlyFriends = true
) => {
  return await connectDB(async (db) => {
    const query = { wxid }
    if (onlyFriends) {
      query["friend"] = true
    }
    return await db.collection(Collections.Friends).countDocuments(query)
  })
}

const writeWechatData = async (
  username: string,
  wxid: string,
  data: Contact[] | Room[],
  collectionName,
  batch: number = 1000
) => {
  const convert = (item) => {
    const { payload } = item
    return {
      insertOne: {
        document: {
          ...payload,
          _id: payload.id,
          username,
          wxid,
        },
      },
    }
  }

  await connectDB(async (db) => {
    const BATCH = batch || 1000
    for (let i = 0; i < data.length; i += BATCH) {
      // @ts-ignore
      const oper = data.slice(i, i + BATCH).map(convert)
      await db
        .collection(collectionName)
        .bulkWrite(oper, { ordered: false })
        .then((res) => {
          console.log("inserted OK")
        })
        .catch((err) => {
          console.warn("inserted error")
        })
    }
  })
}

export const writeWechatFriends = async (
  username: string,
  wxid: string,
  friends: Contact[]
) => {
  await writeWechatData(username, wxid, friends, Collections.Friends)
}

export const writeWechatRooms = async (
  username: string,
  wxid: string,
  rooms: Room[]
) => {
  await writeWechatData(username, wxid, rooms, Collections.Rooms)
}

/**
 * 网站服务
 */
export const writeServiceRequestAdd = async (params: ParamsServiceAddPost) => {
  return await connectDB(async (db) => {
    return await db.collection(Collections.Services).insertOne(params)
  })
}

export const readServiceRequestAdd = async (params: ParamsServiceAddGet) => {
  return await connectDB(async (db) => {
    return await db
      .collection(Collections.Services)
      .countDocuments({ serviceType: params.serviceType })
  })
}

export const writeServiceFeedback = async (params: ParamsFeedbackPost) => {
  return await connectDB(async (db) => {
    return await db.collection(Collections.Feedback).insertOne(params)
  })
}
