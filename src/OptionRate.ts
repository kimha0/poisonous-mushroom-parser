import type { HTMLElement } from 'node-html-parser'


type Rate = { name: string, rate: number }
export default class OptionRate {

  optionRates: {
    name: string
    first: Rate[]
    second: Rate[] 
    third: Rate[]
  }[] = []

  constructor(html: HTMLElement) {
    const body = html.querySelectorAll('tbody > tr')

    const grades = html.querySelectorAll('thead tr th').reduce<string[]>((accu, curr, currentIndex) => {
      if (currentIndex === 0) { return accu }
      
      accu.push(curr.text)
      return accu
    }, [])
    
    let rowCounts = new Array<number>(3).fill(1)


    let optionIndex = 0
    
    const [firstOptions, secondOptions, thirdOptions] = body.reduce<
      [Rate[], Rate[], Rate[]]
    >((accu, curr) => {
      if (curr.querySelector('th')?.hasAttribute('rowspan')) {
        optionIndex += 1

        const rowspan = parseInt(curr.querySelector('th').getAttribute('rowspan')!, 10)
        rowCounts[optionIndex] = rowspan
      } else {
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
    
    const optionRates = grades.reduce<
      {
        name: string
        first: Rate[]
        second: Rate[] 
        third: Rate[]
      }[]
    >((accu, curr, currentIndex) => {

      const first: Rate[] = this.getRates(firstOptions, currentIndex, rowCounts[0], grades.length)
      const second: Rate[] = this.getRates(secondOptions, currentIndex, rowCounts[1], grades.length)
      const third: Rate[] = this.getRates(thirdOptions, currentIndex, rowCounts[2], grades.length)

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

  getRates(rate: Rate[], current: number, rows: number, gradeCount: number): Rate[] {
    let newRate: Rate[] = []
    for(let idx = 0; idx < rows; idx++) {
      newRate.push(rate[(idx * gradeCount) + current])
    }

    return newRate
  }


  get() {
    return this.optionRates
  }

  
}
