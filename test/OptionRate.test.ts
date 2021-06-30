import { parse } from 'node-html-parser'
import OptionRate from '../src/OptionRate'


test('Option rate test. ', () => {
  const html = parse(`
<table class="cube_grade">
  <colgroup>
    <col width="*">
    <col width="10%">
    <col width="10%">
    <col width="10%">
    <col width="10%">
    <col width="10%">
    <col width="10%">
    <col width="10%">
    <col width="10%">
  </colgroup>
  <thead>
    <tr>
      <th>명장의 큐브</th> <!-- v0601 -->
      <th colspan="2">레어 등급</th>
      <th colspan="2">에픽 등급</th>
      <th colspan="2">유니크 등급</th>
      <th colspan="2">레전드리 등급</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>첫 번째 옵션</th>
      <td>레어</td>
      <td class="right">100.0000%</td>
      <td>에픽</td>
      <td class="right">100.0000%</td>
      <td>유니크</td>
      <td class="right">100.0000%</td>
      <td>레전드리</td>
      <td class="right">100.0000%</td>
    </tr>
    <tr>
      <th rowspan="2">두 번째 옵션</th>
      <td>레어</td>
      <td class="right">16.6667%</td>
      <td>에픽</td>
      <td class="right">7.9994%</td>
      <td>유니크</td>
      <td class="right">1.6959%</td>
      <td>레전드리</td>
      <td class="right">0.1996%</td>
    </tr>
    <tr>
      <td>노멀</td>
      <td class="right">83.3333%</td>
      <td>레어</td>
      <td class="right">92.0006%</td>
      <td>에픽</td>
      <td class="right">98.3041%</td>
      <td>유니크</td>
      <td class="right">99.8004%</td>
    </tr>
    <tr>
      <th rowspan="2">세 번째 옵션</th>
      <td>레어</td>
      <td class="right">16.6667%</td>
      <td>에픽</td>
      <td class="right">7.9994%</td>
      <td>유니크</td>
      <td class="right">1.6959%</td>
      <td>레전드리</td>
      <td class="right">0.1996%</td>
    </tr>
    <tr>
      <td>노멀</td>
      <td class="right">83.3333%</td>
      <td>레어</td>
      <td class="right">92.0006%</td>
      <td>에픽</td>
      <td class="right">98.3041%</td>
      <td>유니크</td>
      <td class="right">99.8004%</td>
    </tr>
  </tbody>
</table>
  `)

  const optionRate = new OptionRate(html)

  expect(optionRate.get()).toStrictEqual([
    {
      name: '레어 등급',
      first: [
        { name: '레어', rate: 100.0000 },
      ],
      second: [
        { name: '레어', rate: 16.6667 },
        { name: '노멀', rate: 83.3333 },
      ],
      third: [
        { name: '레어', rate: 16.6667 },
        { name: '노멀', rate: 83.3333 },
      ],
    },
    {
      name: '에픽 등급',
      first: [
        { name: '에픽', rate: 100.0000 },
      ],
      second: [
        { name: '에픽', rate: 7.9994 },
        { name: '레어', rate: 92.0006 },
      ],
      third: [
        { name: '에픽', rate: 7.9994 },
        { name: '레어', rate: 92.0006 },
      ],
    },
    {
      name: '유니크 등급',
      first: [
        { name: '유니크', rate: 100.0000 },
      ],
      second: [
        { name: '유니크', rate: 1.6959 },
        { name: '에픽', rate: 98.3041 },
      ],
      third: [
        { name: '유니크', rate: 1.6959 },
        { name: '에픽', rate: 98.3041 },
      ],
    },
    {
      name: '레전드리 등급',
      first: [
        { name: '레전드리', rate: 100.0000 },
      ],
      second: [
        { name: '레전드리', rate: 0.1996 },
        { name: '유니크', rate: 99.8004 },
      ],
      third: [
        { name: '레전드리', rate: 0.1996 },
        { name: '유니크', rate: 99.8004 },
      ],
    },
  ])

})
