import CompServers from "./CompServers"
import CompWechatyMessages from "./CompWechatyMessages/CompWechatyMessages"
import React from "react"
import CompUserChats from "./CompUserChats"

export const CompContent1 = () => {
  console.log("rendered CompContent1")

  return (
    <div className="w-full p-0 md:p-4 flex flex-col">
      <div className="order-2 my-4">
        <CompServers />
      </div>

      <div className="order-3 my-4">
        <CompWechatyMessages />
      </div>

      <div className="order-4 my-4">
        <CompUserChats />
      </div>
    </div>
  )
}

export default CompContent1
