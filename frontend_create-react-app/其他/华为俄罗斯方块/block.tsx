import React from "react"

const UNIT = 100
const WIDTH = UNIT
const HEIGHT = UNIT

const COLS = 4
const MAX_ROWS = 4
const MAX_COLORS = 5

const getRandomHeight = () => {
  return Math.ceil(Math.random() * 4) * HEIGHT + "px"
}

const Block = (props: { height: number }) => {
  return (
    <div
      className="bg-gray-500 border-2 border-blue-200"
      style={{
        width: `${WIDTH}px`,
        height: props.height * UNIT + "px",
      }}
    />
  )
}

export default Block
