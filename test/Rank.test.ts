import { parse } from 'node-html-parser'
import Rank from '../src/Rank'


test('Rank test. ', () => {
  const html = parse(`
  <table class="cube_info">
    <colgroup>
        <col width="50%" />
        <col width="*" />
    </colgroup>
    <thead>
        <tr>
            <th>구분</th>
            <th>명장의 큐브</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>레어 &rarr; 에픽</td>
            <td>7.9994%</td>
        </tr>
        <tr>
            <td>에픽 &rarr; 유니크</td>
            <td>1.6959%</td>
        </tr>
        <tr>
            <td>유니크 &rarr; 레전드리</td>
            <td>0.1996%</td>
        </tr>
    </tbody>
  </table>
  `)

  const rank = new Rank(html)

  expect(rank.get()).toStrictEqual([
    { prev: '레어', next: '에픽', rate: 7.9994 },
    { prev: '에픽', next: '유니크', rate: 1.6959 },
    { prev: '유니크', next: '레전드리', rate: 0.1996 },
  ])

})
