import getScrapping from "./modules/scrapping"
import { ask, hasHTMLFiles, mkdir, parseElement, parseElements, readText, saveFile } from "./modules/utils"
import Rank from "./Rank"
import OptionRate from "./OptionRate"
import Item from "./Item"
import type { Items } from '../types/Item'
import config from '../config/config'

async function main() {
  // 1. set html
  await settingHTML()
  // 2. set JSON
  settingJSON()
}

async function settingHTML() {
  const downloadAnswer = await ask('Do you want to download a new HTML file you need? (Y/n): ')
  const shouldDownloadHtml = downloadAnswer === 'Y' || downloadAnswer === 'y'

  if (shouldDownloadHtml) {
    await getScrapping(config)
  }

  if (!hasHTMLFiles(config)) {
    throw new TypeError('HTML file could not be found.')
  }
  
  return true
}

function settingJSON() {
  const path = '.bin/json'

  mkdir(path)

  config.scrapingUrls.forEach(scrapingUrl => {
    const htmlString = readText(`.bin/${scrapingUrl.name}.html`)

    const cubeInfoElement = parseElement(htmlString, '.cube_info')
    const cubeGradeElement = parseElement(htmlString, '.cube_grade')

    const cubeOptionElement = parseElements(htmlString, '.cube_option')
    const cubeDataElement = parseElements(htmlString, '.cube_data')

    if (cubeOptionElement.length !== cubeDataElement.length) {
      console.warn('Options and data have different lengths')
    }

    const rank = new Rank(cubeInfoElement)
    const optionRate = new OptionRate(cubeGradeElement)

    const items: Items[] = []
    
    cubeOptionElement.forEach((_, idx) => {
      const item = new Item(cubeOptionElement[idx], cubeDataElement[idx])
      items.push(item.get())
    })

    saveFile(`${path}/${scrapingUrl.name}.json`, JSON.stringify({
      name: scrapingUrl.name,
      rank: rank.get(),
      optionRate: optionRate.get(),
      items,
    }))
  })
}


main()
