export const getRandomColor: () => string = () => {
  return "#" + Math.floor(Math.random() * (2 << 23)).toString(16)
}

const getRandomInt: () => number = () => {
  return Math.floor(Math.random() * 7) + 3
}

export const getRandomColorGentle: () => string = () => {
  return "#" + Array.from(Array(6)).map(getRandomInt).join("")
}
