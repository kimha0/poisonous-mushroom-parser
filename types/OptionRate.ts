export type Rate = {
  name: string
  rate: number
}

interface Data {
  name: string
  first: Rate[]
  second: Rate[]
  third: Rate[]
}

export type OptionRateData = Array<Data>