import { Collection, Db, MongoClient } from "mongodb"
import { UserLogin } from "../../../frontend_create-react-app/src/interface"
import { Code } from "../../../frontend_create-react-app/src/interface/codes"
import { Contact } from "wechaty"
require("dotenv").config()
console.assert(process.env.MONGODB_DB_NAME)

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
  console.log("mongodb connected")
  const db: Db = client.db(process.env.MONGODB_DB_NAME)

  try {
    return await cb(db)
  } catch (err) {
    console.log({ err })
    return Code.ERROR_FOR_UNKNOWN
  } finally {
    await client.close()
  }
}

export const userRegister = async (userData: UserLogin) => {
  return await connectDB(async (db) => {
    return db
      .collection("user")
      .insertOne({ _id: userData.username, ...userData })
      .then(() => {
        return Code.SUCCESS
      })
      .catch((err) => {
        if (err.name === "MongoError" && err.code === 11000) {
          return Code.USER_REGISTER_FAILED_FOR_NAME_EXISTED
        } else {
          return Code.ERROR_FOR_UNKNOWN
        }
      })
  })
}

export const userLogin = async (userData: UserLogin) => {
  return await connectDB(async (db: Db) => {
    const item = await db
      .collection("user")
      .findOne({ _id: userData.username, password: userData.password })
    if (!item) return Code.USER_LOGIN_FAILED_FOR_INCORRECT_USERNAME_OR_PASSWORD
    return Code.SUCCESS
  })
}

export const fetchUserContacts = async (
  username: string,
  skip = 0,
  limit = 100,
  onlyFriends = true
) => {
  return await connectDB(async (db) => {
    const query = { username }
    if (onlyFriends) {
      query["friend"] = true
    }
    return await db
      .collection("contacts")
      .find(query)
      .skip(skip)
      .limit(limit)
      .toArray()
  })
}

export const fetchUserContactsCount = async (
  username: string,
  onlyFriends = true
) => {
  return await connectDB(async (db) => {
    const query = { username }
    if (onlyFriends) {
      query["friend"] = true
    }
    return await db.collection("contacts").countDocuments(query)
  })
}

export const updateUserContacts = async (
  username: string,
  contacts: Contact[]
) => {
  await connectDB(async (db) => {
    for (const contact of contacts) {
      // @ts-ignore
      const { payload: contactItem } = contact
      contactItem["username"] = username
      contactItem["key"] = contactItem.id
      contactItem["_id"] = contactItem.id
      try {
        await db.collection("contacts").insertOne(contactItem)
      } catch (err) {}
    }
    console.log("微信成员数据更新完成！")
    return Code.SUCCESS
  })
}

export const fetchUserBasic = async (username: string) => {
  return await connectDB(async (db) => {
    return await db.collection("user").findOne({ _id: username })
  })
}
