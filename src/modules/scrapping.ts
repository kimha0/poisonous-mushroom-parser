import { scraping, saveScraping } from "./utils"
import config from "../config/config"
import fs from 'fs'

export default async function getScrapping(): Promise<void> {
  const texts = await Promise.all(config.scrapingUrls.map(({ url }) => scraping(url)))
  const paths = config.scrapingUrls.map(url => url.name)

  try {
    const lstat = fs.lstatSync('.bin')
    
    if (!lstat.isDirectory()) {
      throw new Error('The .bin file must not exist.')
    }
  } catch (error) {
    if (error.errno === -2 && error.code === 'ENOENT') {
      fs.mkdirSync('.bin')
    }
  }

  for (const text in texts) {
    saveScraping(`.bin/${paths[text]}`, texts[text])
  }
}
