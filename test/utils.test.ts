import { readText, parseElement } from "../src/modules/utils"

test('fs module test. ', () => {
  const result = readText('test/source/test.txt')
  expect(result).toBeTruthy()
  expect(result).toBe('Hello World!')
})

test('parser module test.', () => {
  const html = readText('test/source/index.html')
  const table = parseElement(html, '.cube_info')

  expect(table.classList.contains('cube_info')).toBe(true)
})
