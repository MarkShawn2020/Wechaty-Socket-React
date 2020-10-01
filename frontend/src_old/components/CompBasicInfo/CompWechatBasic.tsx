import { Card, Empty } from "antd"
import React, { useEffect, useState } from "react"
import { WechatAccountItem } from "../../data-sctructure/interface"
import { $http } from "../../utils/$http"
import { API } from "../../data-sctructure/API"
import { useCookies } from "react-cookie"

const CompWechatBasic = () => {
  const [cookie, setCookie] = useCookies()
  const [wechatBasic, setWechatBasic] = useState<WechatAccountItem>({} as any)

  const fetchWechatBasic = async () => {
    const { data: wechatBasic } = await $http.get(API.wechat.basic, {
      params: { wxid: cookie.wxid },
    })
    setWechatBasic(wechatBasic)
  }

  useEffect(() => {
    fetchWechatBasic().catch((err) => {
      console.log({ err })
    })
  }, [cookie.wxid])

  return (
    <Card title={"基本信息"}>
      {Object.keys(wechatBasic).length > 0 ? (
        <pre>{JSON.stringify(wechatBasic, null, 4)}</pre>
      ) : (
        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
      )}
    </Card>
  )
}

export default CompWechatBasic
