import { Card, Empty } from "antd"
import React from "react"
import { UserDataType } from "../../interface"

const CompWechatBasic = (props: { userData: UserDataType }) => {
  return (
    <Card title={"基本信息"}>
      {props.userData.name ? (
        <pre>{JSON.stringify(props.userData, null, 4)}</pre>
      ) : (
        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
      )}
    </Card>
  )
}

export default CompWechatBasic
