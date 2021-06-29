import fs from 'fs'
import { parse } from 'node-html-parser'
import fetch from 'node-fetch'

export const readText = (path: string) => {
  const readFile = fs.readFileSync(path, 'utf8')
  return readFile.toString()
}

export const parseElement = (html: string, selector: string) => {
  return parse(html).querySelector(selector)
}

export const scraping = async (url: string) => {
  const response = await fetch(url)
  const text = await response.text()
  return text
}

export const saveScraping = (path: string, text: string) => {
  fs.appendFile(path, text, { encoding: 'utf8' }, (error) => {
    if (error) {
      console.error('parse error, ', error)
    }
  })
}