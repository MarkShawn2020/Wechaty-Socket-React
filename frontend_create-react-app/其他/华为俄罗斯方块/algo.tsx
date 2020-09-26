import React, { useState } from "react"
import { Button } from "antd"

const MAX_HEIGHT = 4
const MIN_HEIGHT = 1

interface Block {
  colIndex: number
  yStart: number
  blockHeight: number
}

const getRandomHeight = () => {
  return (
    Math.floor((Math.random() * (MAX_HEIGHT - MIN_HEIGHT) + MIN_HEIGHT) * 100) /
    100
  )
}

const getMinPos: (arr: number[]) => number = (arr) => {
  return arr.findIndex((x) => x === Math.min.apply(null, arr))
}

const addBlock: (
  arrCols: number[],
  arrBlocks: Block[]
) => { arrCols: number[]; arrBlocks: Block[] } = (arrCols, arrBlocks) => {
  const minPos = getMinPos(arrCols)
  const newRandomHeight = getRandomHeight()
  arrBlocks.push({
    colIndex: minPos,
    yStart: arrCols[minPos],
    blockHeight: newRandomHeight,
  })
  arrCols[minPos] += newRandomHeight
  console.log({ minPos, newRandomHeight, arrCols, arrBlocks })
  return { arrCols, arrBlocks }
}

const MainPage = () => {
  const UNIT = 100 // 像素单位

  const [cols, setArrCols] = useState<number[]>([0, 0, 0, 0])
  const [blocks, setArrBlocks] = useState<Block[]>([])

  const nextStep = () => {
    const { arrCols, arrBlocks } = addBlock([...cols], [...blocks])
    setArrCols((cols) => arrCols)
    setArrBlocks((blocks) => arrBlocks)
    console.log({ arrCols, arrBlocks })
  }

  return (
    <div
      id={"page"}
      className="w-full h-full bg-gray-100 flex justify-center items-center"
    >
      <div
        id={"main"}
        style={{ width: "800px", height: "800px" }}
        className="bg-gray-300 flex"
      >
        <div
          id={"opers"}
          style={{ width: "400px" }}
          className="flex flex-col items-center"
        >
          <Button type="primary" onClick={nextStep}>
            {" "}
            NEXT{" "}
          </Button>
          <h2>COLS</h2>
          {cols.map((col, index) => {
            return (
              <p key={index}>
                第{index + 1}列高： {col}
              </p>
            )
          })}
          <h1>BLOCKS</h1>
          {blocks.map((block, index) => {
            return (
              <p key={index}>
                第{index + 1}个块，列：{block.colIndex}，底高：{block.yStart}，
                自高：{block.blockHeight}
              </p>
            )
          })}
        </div>

        <div
          id={"game"}
          style={{ width: cols.length * 100 + "px" }}
          className="bg-gray-500 relative"
        >
          {blocks.map((block, index) => {
            return (
              <div
                key={index}
                className="bg-gray-700 absolute border-2 border-blue-200 text-3xl text-white"
                style={{
                  left: block.colIndex * UNIT + "px",
                  bottom: block.yStart * UNIT + "px",
                  height: block.blockHeight * UNIT + "px",
                  width: UNIT + "px",
                }}
              >
                {index + 1}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default MainPage
