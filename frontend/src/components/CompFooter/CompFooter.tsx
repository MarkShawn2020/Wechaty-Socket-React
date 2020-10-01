import React from "react"
import CompStatus from "./CompStatus"
import VaseImg from "../../../src/styles/images/vase-red.png"

const CompFooter = () => {
  console.log("rendered CompFooter")

  return (
    <div className="w-full flex flex-col justify-center items-center">
      <img src={VaseImg} alt="vase" className="w-16 m-auto hidden md:block" />

      <CompStatus />

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
    </div>
  )
}

export default CompFooter
