import type { HTMLElement } from 'node-html-parser'


type Rate = { name: string, rate: number }
export default class OptionRate {

  private optionRates: {
    name: string
    first: Rate[]
    second: Rate[] 
    third: Rate[]
  }[] = []

  private html!: HTMLElement
  private trList!: HTMLElement[]
  private grades!: string[]

  private static ROW_COUNTS = 3


  constructor(html: HTMLElement) {
    this.html = html

    this.setGrades()
    this.setTRowList()
    this.setOptionRates()
  }

  get() {
    return this.optionRates
  }

  private getRates(rate: Rate[], current: number, rows: number, gradeCount: number): Rate[] {
    let newRate: Rate[] = []

    for(let idx = 0; idx < rows; idx++) {
      newRate.push(rate[(idx * gradeCount) + current])
    }

    return newRate
  }

  private setGrades() {
    const thead = this.html.querySelectorAll('thead tr th')

    if (thead.length === 0) {
      throw new TypeError('th tag could not be found.')
    }
    
    const grades = this.html.querySelectorAll('thead tr th').reduce<string[]>((accu, curr, currentIndex) => {
      if (currentIndex === 0) { return accu }
      
      accu.push(curr.text)
      return accu
    }, [])

    this.grades = grades
  }

  private setTRowList() {
    this.trList = this.html.querySelectorAll('tbody > tr')
  }

  private setOptionRates() {
    let rowCounts = new Array<number>(OptionRate.ROW_COUNTS).fill(1)
    let optionIndex = 0

    const [firstOptions, secondOptions, thirdOptions] = this.trList.reduce<
      [Rate[], Rate[], Rate[]]
    >((accu, curr) => {
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
    
    const optionRates = this.grades.reduce<
      {
        name: string
        first: Rate[]
        second: Rate[] 
        third: Rate[]
      }[]
    >((accu, curr, currentIndex) => {

      const first: Rate[] = this.getRates(firstOptions, currentIndex, rowCounts[0], this.grades.length)
      const second: Rate[] = this.getRates(secondOptions, currentIndex, rowCounts[1], this.grades.length)
      const third: Rate[] = this.getRates(thirdOptions, currentIndex, rowCounts[2], this.grades.length)

      accu.push({
        name: curr,
        first,
        second,
        third,
      })
      return accu
    }, [])

    this.optionRates = optionRates
  }

  
}
