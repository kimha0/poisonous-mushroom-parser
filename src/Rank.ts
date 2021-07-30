import type { HTMLElement } from 'node-html-parser'
import type ParserInterface from '../types/ParserInterface'
import type { Data } from '../types/Rank'

export default class Rank implements ParserInterface<Data> {

  public data: Data = []

  constructor(html: HTMLElement) {
    this.set(html)
  }

  get() {
    return this.data
  }

  set(html: HTMLElement) {
    const rows = this.getTableRows(html)
    this.data = this.getData(rows)
  }


  private getTableRows(html: HTMLElement) {
    return html.querySelectorAll('tbody > tr')
  }

  private getData(rows: HTMLElement[]) {
    const data = []

    for (const tr of rows) {

      const firstRow = tr.querySelector('td:nth-child(1)')
      const secondRow = tr.querySelector('td:nth-child(2)')

      const [prev, next] = firstRow.text.split('→').map(text => text.trim())
      const trimSecondText = secondRow.text.replace('%', '').trim()

      let rate = parseFloat(trimSecondText)

      if (isNaN(rate)) {
        rate = 0
      }


      data.push({
        next,
        prev,
        rate,
      })
    }

    return data
  }

}
