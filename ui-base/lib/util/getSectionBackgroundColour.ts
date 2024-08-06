import { replaceChar } from "./utils"

export function getSectionBackgroundColour(
  backgroundColour: any,
  defaultColourClass: string
) {
  if (!backgroundColour) {
    return defaultColourClass
  }

  const colors = {
    "0092ff": "bg-[#0092ff]",
    "1d7841": "bg-[#1d7841]",
    "1f2a37": "bg-[#1f2a37]",
    "111928": "bg-my-blue",
    "333333": "bg-my-black-33",
    "374151": "bg-gray-700",
    d1d3d4: "white bg-[#d1d3d4]",
    "f6f6f6": "white bg-[#f6f6f6]",
    f3f6f4: "white bg-[#f3f6f4]",
    fed095: "white bg-lighterYellow",
    faa634: "bg-my-yellow",
    "9479fa": "bg-my-lighterIndigo",
    "8f73f9": "bg-my-darkerIndigo",
    "5850ec": "bg-my-indigo",
    "000000": "bg-my-black",
    "9328e2": "bg-[#9328e2]",
    "395ad1": "bg-[#395ad1]",
    ffffff: "bg-my-white",
    f2f2f2: "bg-my-white2",
    f4f3f3: "bg-my-white3",
    dedede: "bg-my-brwhite",
  }

  const colourClass =
    colors[replaceChar(backgroundColour, "#", "").toLowerCase()]

  if (!colourClass) {
    return defaultColourClass
  }

  return colourClass
}
