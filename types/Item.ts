export type Option = {
  name: string
  part: string
  level: string
}

export type Rate = {
  name: string
  rate: number
}

export type ItemReturnType = {
  option: Option
  first: Rate[]
  second: Rate[]
  third: Rate[]
}