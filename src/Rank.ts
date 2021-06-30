import type { HTMLElement } from 'node-html-parser'

export default class Rank {

  private rank: {
    prev: string
    next: string
    rate: number
  }[] = []

  private html!: HTMLElement
  private trList!: HTMLElement[]


  constructor(html: HTMLElement) {
    this.html = html

    this.setTableRowList()
    this.setRank()
  }

  get() {
    return this.rank
  }


  private setTableRowList() {
    this.trList = this.html.querySelectorAll('tbody > tr')
  }

  private setRank() {
    for(const tr of this.trList) {

      const first = tr.querySelector('td:nth-child(1)')
      const second = tr.querySelector('td:nth-child(2)')

      const [prev, next] = first.text.split('→').map(text => text.trim())
      const trimSecondText = second.text.replace('%', '').trim()

      let rate = parseFloat(trimSecondText)

      if (isNaN(rate)) {
        rate = 0
      }

      this.rank.push({
        next,
        prev,
        rate,
      })
    }
  }

}
