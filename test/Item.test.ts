import { parse } from 'node-html-parser'
import Item from '../src/Item'


test('Option rate test. ', () => {
  const cubeOption = parse(`
<div class="cube_option">
  <ul>
    <li>잠재능력 등급<span>레어</span></li>
    <li>장비 분류<span>무기</span></li>
    <li>장비 레벨<span>120레벨 이상</span></li>
  </ul>
</div>
  `)

  const cubeData = parse(`
  <table class="cube_data">
  <colgroup>
    <col width="246px">
    <col width="64px">
    <col width="246px">
    <col width="64px">
    <col width="244px">
    <col width="*">
  </colgroup>
  <thead>
    <tr>
      <th>첫 번째 옵션</th>
      <th>확률</th>
      <th>두 번째 옵션</th>
      <th>확률</th>
      <th>세 번째 옵션</th>
      <th>확률</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>최대 HP : +100</td>
      <td>5.8824%</td>
      <td>STR : +6</td>
      <td>7.2622%</td>
      <td>STR : +6</td>
      <td>7.2622%</td>
    </tr>
    <tr>
      <td></td>
      <td></td>
      <td>최대 HP : +2%</td>
      <td>0.0769%</td>
      <td>최대 HP : +2%</td>
      <td>0.0769%</td>
    </tr>
    <tr>
      <td></td>
      <td></td>
      <td>올스탯 : +5</td>
      <td>0.1153%</td>
      <td>올스탯 : +5</td>
      <td>0.1153%</td>
    </tr>
  </tbody>
</table>
  `)

  const optionRate = new Item(cubeOption, cubeData)

  const result = optionRate.get()

  expect(result.option).toStrictEqual({
    name: '레어',
    part: '무기',
    level: '120레벨 이상',
  })

  expect(result.first).toStrictEqual([
    {
      name: '최대 HP : +100',
      rate: 5.8824,
    },    
  ])

  expect(result.second).toStrictEqual([
    {
      name: 'STR : +6',
      rate: 7.2622,
    },
    {
      name: '최대 HP : +2%',
      rate: 0.0769,
    },
    {
      name: '올스탯 : +5',
      rate: 0.1153,
    },
  ])

  expect(result.third).toStrictEqual([
    {
      name: 'STR : +6',
      rate: 7.2622,
    },
    {
      name: '최대 HP : +2%',
      rate: 0.0769,
    },
    {
      name: '올스탯 : +5',
      rate: 0.1153,
    },
  ])

})
