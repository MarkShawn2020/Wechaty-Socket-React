import React, { useState } from "react"
import Block from "./block"
import { Button } from "antd"

const BASE_SIZE = 100

const getRandomHeight = () => {
  return Math.random() * 4
}

const getMinPosOfArr = (arr: number[]) => {
  let minPos: number = 0
  let minVal = 999

  for (let ind in arr) {
    if (arr[ind] < minVal) {
      minVal = arr[ind]
      minPos = parseInt(ind)
    }
  }
  return minPos
}

const Page = () => {
  const [heights, setHeights] = useState<number[]>([0, 0, 0, 0])

  const onAddBlock = () => {
    const minPos = getMinPosOfArr(heights)
    const heightNew: number[] = [...heights]
    heightNew[minPos] += getRandomHeight()
    setHeights((heights) => heightNew)
  }

  return (
    <div
      id={"page"}
      className="w-screen h-screen bg-gray-100 flex justify-center items-center"
    >
      <div className="flex flex-col">
        {/* button */}
        <Button type="primary" className="mr-8" onClick={onAddBlock}>
          NEXT
        </Button>

        {heights.map((h) => {
          return <Button type="text">{h}</Button>
        })}
      </div>

      {/* show page */}
      <div
        id={"main"}
        className="bg-gray-300 flex"
        style={{ height: "800px", width: "400px" }}
      >
        <Block height={heights[0]} />
        <Block height={heights[1]} />
        <Block height={heights[2]} />
        <Block height={heights[3]} />
      </div>
    </div>
  )
}

export default Page
