export function getSectionTextColour(
  textColour = "",
  defaultColourClass = "text-my-black dark:text-my-white"
) {
  if (!textColour) {
    return defaultColourClass
  }

  const colors = {
    d1d3d4: "text-[#d1d3d4]",
    f6f6f6: "text-[#f6f6f6]",
    fed095: "text-lighterYellow",
    faa634: "text-my-yellow",

    "9479FA": "text-my-lighterIndigo",
    "8F73F9": "text-my-darkerindigo",
    "5850ec": "text-my-indigo",

    "111928": "text-[#111928]",
    "000000": "text-my-black",
    "333333": "text-my-black-33",
    "9328e2": "text-[#9328e2]",
    "395ad1": "text-[#395ad1]",
    "1F2A37": "text-my-btntext",

    "6C2BD9": "text-my-purple",

    "0E9F6E": "text-my-green-500",

    ffffff: "text-my-white",
    F2F2F2: "text-my-white2",
    F4F3F3: "text-my-white3",

    "9CA3AF": "text-my-grey",
    "627280": "text-my-grey3",
    CBD2DC: "text-my-grey4",
    "374151": "text-gray-700",
    DEDEDE: "text-my-brwhite",
    "1d7841": "text-[#1D7841]",
    "0092ff": "text-[#0092FF]",
  }
  const colourClass =
    colors[textColour?.toLowerCase()] || colors[textColour.toUpperCase()]

  if (!colourClass) {
    return defaultColourClass
  }

  return colourClass
}
