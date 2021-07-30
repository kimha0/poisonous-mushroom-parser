import type { HTMLElement } from 'node-html-parser'
import type { Option, Rate, ItemReturnType } from '../types/Item'
import ParserInterface from '../types/ParserInterface'
import { replaceName } from './modules/utils'

export default class Item implements ParserInterface<ItemReturnType> {
  data!: ItemReturnType



  constructor(optionElement: HTMLElement, dataElement: HTMLElement) {
    this.set(optionElement, dataElement)
  }

  get(): ItemReturnType {
    return this.data
  }

  set(optionElement: HTMLElement, dataElement: HTMLElement) {
    const option = this.getOption(optionElement)
    const [first, second, third] = this.setCubeData(dataElement)
    this.data = {
      option,
      first,
      second,
      third,
    }
  }


  public getOption(optionElement: HTMLElement) {
    const [nameText, partText, LevelText] = optionElement.querySelectorAll('ul li')

    const name = nameText.querySelector('span').text
    const part = partText.querySelector('span').text
    const level = LevelText.querySelector('span').text

    return {
      name,
      part,
      level,
    }
  }

  private setCubeData(dataElement: HTMLElement) {

    const title = dataElement.querySelectorAll('thead tr th')
    const optionList = dataElement.querySelectorAll('tbody tr')

    if (title.length !== 6) {
      throw new TypeError('The number of headers in the cube data table does not match. can\'t parse')
    }

    const firstOptions: Rate[] = []
    const secondOptions: Rate[] = []
    const thirdOptions: Rate[] = []

    optionList.forEach((rows) => {
      const option = rows.querySelectorAll('td')
      
      {
        const [name, value] = option.slice(0, 2)
        const options = this.getOptions(name, value)
        if (options) firstOptions.push(options)
      }

      {
        const [name, value] = option.slice(2, 4)
        const options = this.getOptions(name, value)
        if (options) secondOptions.push(options)
      }

      {
        const [name, value] = option.slice(4, 6)
        const options = this.getOptions(name, value)
        if (options) thirdOptions.push(options)
      }
    })
    
    return [firstOptions, secondOptions, thirdOptions]
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

  private getOptions(nameElement: HTMLElement, valueElement: HTMLElement) {
    const name = replaceName(nameElement.text)
    const value = valueElement.text
    const options = this.getRate(name, value)
    return options
  }
}
