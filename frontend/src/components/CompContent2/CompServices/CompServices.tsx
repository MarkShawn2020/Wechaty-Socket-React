import React from "react"
import { Card, message } from "antd"
import { getRandomColorGentle } from "../../../utils/random"
import { API, ServiceType } from "../../../DS/API"
import { $http } from "../../../utils/$http"

export interface ServiceItem {
  title: string
  key: ServiceType
}

export const apiAddServicePost = async (serviceItem: ServiceItem) => {
  await $http.post(API.service.add, { serviceType: serviceItem.key })
  message.success({
    content: `已收到您对【${serviceItem.title}】这项功能的的需求反馈，我们会尽快考虑的！`,
  })
}

export const CompServices = () => {
  const services: ServiceItem[] = [
    {
      title: "撤回监控",
      key: ServiceType.Recall,
    },
    {
      title: "定时提醒",
      key: ServiceType.Timing,
    },
    {
      title: "消息备份",
      key: ServiceType.Backup,
    },
    {
      title: "头像墙",
      key: ServiceType.Avatar,
    },
    {
      title: "社交圈",
      key: ServiceType.Network,
    },
  ]

  return (
    <Card title="服务订阅">
      <div className="flex justify-around flex-wrap">
        {services.map((item: ServiceItem) => {
          return (
            <div
              key={item.key}
              className="w-16 h-16 m-1 rounded text-white flex justify-center items-center flex-wrap text-base px-4 box-border text-center hover:cursor-pointer"
              style={{
                backgroundColor: getRandomColorGentle(),
                cursor: "pointer",
              }}
              onClick={() => apiAddServicePost(item)}
            >
              <p>{item.title}</p>
            </div>
          )
        })}
      </div>
    </Card>
  )
}

export default CompServices
