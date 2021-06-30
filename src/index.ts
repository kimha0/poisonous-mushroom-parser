import type c from "../config/config"
import readline from 'readline'
import getScrapping from "./modules/scrapping"
import { hasHTMLFiles, mkdir, parseElement, parseElements, readText, saveScraping } from "./modules/utils"
import Rank from "./Rank"
import OptionRate from "./OptionRate"
import Item, { ItemReturnType } from "./Item"


type Config = typeof c

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,

})

async function main() {
  // 1. set html
  await settingHTML()

  // 2. set JSON
  settingJSON()
}

async function settingHTML() {
  const config = require('../config/config').default as Config

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

async function ask(question: string): Promise<string> {
  return await new Promise((resolve, reject) => {
    rl.question(question, (input) => resolve(input))
  })
  .then(value => {
    rl.close()
    return value as string
  })
}

async function settingJSON() {
  const config = require('../config/config').default as Config
  const path = '.bin/json'

  mkdir(path)

  const pad = config.scrapingUrls.reduce((accu, curr) => accu > curr.name.length ? accu : curr.name.length, 0) + (path.length + 9)

  config.scrapingUrls.forEach(scrapingUrl => {
    const txt = readText(`.bin/${scrapingUrl.name}.html`)
    const rankEl = parseElement(txt, '.cube_info')
    const optionRateEl = parseElement(txt, '.cube_grade')
    
    const cOption = parseElements(txt, '.cube_option')
    const cData = parseElements(txt, '.cube_data')

    if (cOption.length !== cData.length) {
      console.warn('Options and data have different lengths')
    }

    const rank = new Rank(rankEl).get()
    const optionRate = new OptionRate(optionRateEl).get()

    const items: ItemReturnType[] = []
    
    cOption.forEach((_, idx) => {
      const item = new Item(cOption[idx], cData[idx]).get()
      items.push(item)
    })

    saveScraping(`${path}/${scrapingUrl.name}.json`, JSON.stringify({
      name: scrapingUrl.name,
      rank,
      optionRate,
      items,
    }))

    console.log('\x1b[36m%s\x1b[0m', `${path}/${scrapingUrl.name}.json`.padEnd(pad, ' ') + '✅');
  })
}


main()