import type { HTMLElement } from 'node-html-parser'

export default class Rank {

  rank: {
    prev: string
    next: string
    rate: number
  }[] = []

  constructor(html: HTMLElement) {
    const body = html.querySelectorAll('tbody > tr')

    for(const tr of body) {

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



  get() {
    return this.rank
  }

}
