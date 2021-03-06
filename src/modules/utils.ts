import fs from 'fs'
import readline from 'readline'
import type c from "../../config/config"
import { parse } from 'node-html-parser'
import fetch from 'node-fetch'
type Config = typeof c

export const readText = (path: string) => {
  const readFile = fs.readFileSync(path, 'utf8')
  return readFile.toString()
}

export const parseElement = (html: string, selector: string) => {
  return parse(html).querySelector(selector)
}

export const parseElements = (html: string, selector: string) => {
  return parse(html).querySelectorAll(selector)
}

export const scraping = async (url: string) => {
  const response = await fetch(url)
  const text = await response.text()
  return text
}

export const saveFile = (path: string, text: string) => {
  try {
    const isFile = fs
      .lstatSync(path)
      .isFile()

    if (isFile) {
      fs.unlinkSync(path)
    }
  } catch {

  }

  fs.writeFileSync(path, text, { encoding: 'utf8' })
  console.log('\x1b[36m%s\x1b[0m', `${path}`.padEnd(30, ' ') + ' ✅');
}

export const hasHTMLFiles = (config: Config): boolean => {
  const names = config.scrapingUrls.map(url => url.name + '.html')

  return names.every(name => {
    try {
      fs.lstatSync(`.bin/${name}`)
    } catch {
      return false
    }
    return true
  })
}

export const mkdir = (dirRoot: string) => {
  try {
    const lstat = fs.lstatSync(dirRoot)
    
    if (!lstat.isDirectory()) {
      throw new Error('The .bin file must not exist.')
    }
  } catch (error) {
    if (error.errno === -2 && error.code === 'ENOENT') {
      fs.mkdirSync(dirRoot)
    }
  }
}

export const replaceName = (name: string) => {
  return name.replace(/[\r\n]+/g,'').replace(/[  ]+/g, ' ').trim()
}

export async function ask(question: string): Promise<string> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  })
  
  return await new Promise((resolve, reject) => {
    rl.question(question, (input) => resolve(input))
  })
  .then(value => {
    rl.close()
    return value as string
  })
}
