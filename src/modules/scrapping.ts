import { scraping, saveFile } from "./utils"
import type c from "../../config/config"
import fs from 'fs'

type Config = typeof c

export default async function getScrapping(config: Config): Promise<void> {
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
    saveFile(`.bin/${paths[text]}.html`, texts[text])
  }
}

