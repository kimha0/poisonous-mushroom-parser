import type { HTMLElement } from 'node-html-parser'
import type ParserInterface from '../types/ParserInterface'
import type { OptionRateData, Rate } from '../types/OptionRate'

export default class OptionRate implements ParserInterface<OptionRateData> {

  data: OptionRateData = []
  private static ROW_COUNTS = 3


  constructor(html: HTMLElement) {
    this.set(html)
  }

  get() {
    return this.data
  }

  set(html: HTMLElement) {
    const tableRows = this.getTableRows(html)
    const grades = this.getGrades(html)

    this.data = this.setOptionRates(tableRows, grades)
  }
  private getGrades(html: HTMLElement): string[] {
    const thead = html.querySelectorAll('thead tr th')

    if (thead.length === 0) {
      throw new TypeError('th tag could not be found.')
    }
    
    const grades = html.querySelectorAll('thead tr th').reduce<string[]>((accu, curr, currentIndex) => {
      if (currentIndex === 0) { return accu }
      
      accu.push(curr.text)
      return accu
    }, [])

    return grades
  }

  private getRates(rate: Rate[], current: number, rows: number, gradeCount: number): Rate[] {
    let newRate: Rate[] = []

    for(let idx = 0; idx < rows; idx++) {
      newRate.push(rate[(idx * gradeCount) + current])
    }

    return newRate
  }

  private getTableRows(html: HTMLElement) {
    return html.querySelectorAll('tbody > tr')
  }

  private setOptionRates(tableRows: HTMLElement[], grades: string[]) {
    let rowCounts = new Array<number>(OptionRate.ROW_COUNTS).fill(1)
    let optionIndex = 0

    const [firstOptions, secondOptions, thirdOptions] = tableRows.reduce<[Rate[], Rate[], Rate[]]>((accu, curr) => {
      if (curr.querySelector('th')?.hasAttribute('rowspan')) {
        optionIndex += 1

        const rowspan = parseInt(curr.querySelector('th').getAttribute('rowspan')!, 10)
        rowCounts[optionIndex] = rowspan
      }
      const td = curr.querySelectorAll('td')

      for (let tdIdx = 0; tdIdx < td.length; tdIdx += 2) {
        const name = td[tdIdx].text
        let rate = parseFloat(td[tdIdx + 1].text)

        rate = isNaN(rate) ? 0 : rate

        accu[optionIndex].push({ name, rate, })
      }

      return accu

    }, [[], [], []])

    const gradeLength = grades.length
    
    const optionRates = grades.reduce<OptionRateData>((accu, curr, currentIndex) => {
      const first: Rate[] = this.getRates(firstOptions, currentIndex, rowCounts[0], gradeLength)
      const second: Rate[] = this.getRates(secondOptions, currentIndex, rowCounts[1], gradeLength)
      const third: Rate[] = this.getRates(thirdOptions, currentIndex, rowCounts[2], gradeLength)

      accu.push({
        name: curr,
        first,
        second,
        third,
      })
      return accu
    }, [])

    return optionRates
  }
}
