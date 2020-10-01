import CompWechatScan from "./CompWechatyScan/CompWechatScan"
import React from "react"

export const CompInvisible = () => {
  console.log("rendered CompInvisible")

  return (
    <div>
      <CompWechatScan />
    </div>
  )
}

export default CompInvisible
