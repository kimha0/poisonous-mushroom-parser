import type { HTMLElement } from 'node-html-parser'

type Option = {
  name: string
  part: string
  level: string
}

type Rate = {
  name: string
  rate: number
}

export default class Item {
  private option!: Option
  private firstOptions!: Rate[]
  private secondOptions!: Rate[]
  private thirdOptions!: Rate[]

  private cubeOptionEl!: HTMLElement
  private cubeDataEl!: HTMLElement



  constructor(cubeOptionEl: HTMLElement, cubeDataEl: HTMLElement) {

    this.cubeOptionEl = cubeOptionEl
    this.cubeDataEl = cubeDataEl

    this.setCubeOption()
    this.setCubeData()
  }


  public setCubeOption() {
    const liList = this.cubeOptionEl.querySelectorAll('ul li')

    const name = liList[0].querySelector('span').text
    const part = liList[1].querySelector('span').text
    const level = liList[2].querySelector('span').text

    this.option = {
      name,
      part,
      level,
    }
  }

  public setCubeData() {

    const thead = this.cubeDataEl.querySelectorAll('thead tr th')
    const tbodyTableRows = this.cubeDataEl.querySelectorAll('tbody tr')

    if (thead.length !== 6) {
      throw new TypeError('The number of headers in the cube data table does not match. can\'t parse')
    }

    const firstOptions: Rate[] = []
    const secondOptions: Rate[] = []
    const thirdOptions: Rate[] = []

    tbodyTableRows.forEach((rows) => {
      const tbodyList = rows.querySelectorAll('td')
      const firstName = tbodyList[0].text
      const firstValue = tbodyList[1].text

      const first = this.getRate(firstName, firstValue)

      const secondName = tbodyList[2].text
      const secondValue = tbodyList[3].text

      const second = this.getRate(secondName, secondValue)

      const thirdName = tbodyList[4].text
      const thirdValue = tbodyList[5].text

      const third = this.getRate(thirdName, thirdValue)
      
      if (first) {
        firstOptions.push(first)
      }

      if (second) {
        secondOptions.push(second)
      }

      if (third) {
        thirdOptions.push(third)
      }
    })
    
    this.firstOptions = firstOptions
    this.secondOptions = secondOptions
    this.thirdOptions = thirdOptions
  }

  private getRate(name: string, value: string): Rate | null {
    if (!name || !value) {
      return null
    }
    
    let v = parseFloat(value.replace('%', ''))

    if (isNaN(v)) {
      throw new TypeError('Invalid value during parsing. isNaN')
    }

    return ({ name: name, rate: v })

  }



  get(): {
    option: Option
    firstOptions: Rate[]
    secondOptions: Rate[]
    thirdOptions: Rate[]
  } {
    return {
      option: this.option,
      firstOptions: this.firstOptions,
      secondOptions: this.secondOptions,
      thirdOptions: this.thirdOptions,
    }
  }

}
