import React from "react"
import { Layout } from "antd"

const MyFooter = () => {
  return (
    <Layout.Footer>
      <img
        src={require(`../images/${"vase-red"}.png`)}
        alt="vase"
        className="w-16 m-auto"
      />
      <ul className="text-gray-500 text-center">
        <li>Powered By React, SocketIO, Wechaty</li>
        <li>
          Author:{" "}
          <a
            href={"https://github.com/MarkShawn2020"}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-500 underline"
          >
            MarkShawn
          </a>
          , Date: 2020-09-18
        </li>
        <li>
          Inspired and Specialized for{" "}
          <span className="underline">Cheng XingYu</span>
        </li>
      </ul>
    </Layout.Footer>
  )
}

export default MyFooter
