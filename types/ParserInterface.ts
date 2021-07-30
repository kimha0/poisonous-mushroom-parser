import type { HTMLElement } from 'node-html-parser'

interface ParserInterface<T> {
  data: T

  get: () => T
  set: <T extends HTMLElement>(...arg: T[]) => void
}

export default ParserInterface
