# poisonous-mushroom-parser
그 게임에서 공개한 확률 테이블을 JSON 형태의 파일로 변환함

----

config/config.ts
```typescript
const config = {
  scrapingUrls: [
    {
      // 
      name: "확률성 아이템 이름",
      url: "확률성 아이템의 확률이 개시된 홈페이지 url", // default = "" 
    },
    ...
  ],
}
```

## how to use
1. config/config.ts에 url 값 입력, 혹은 .bin 파일 안에 config.scrapingUrls.name 이랑 매핑되는 ${name}.html 파일을 생성
2. yarn start 시 .bin/json 폴더에 ${name}.json 파일 생성됨


## 데이터 구조

```typescript
type Data = {
  name: string

  rank: {
    next: string // 다음 등급으로 상승 될 등급 이름
    prev: string // 현재 등급 이름
    rate: number // 다음 등급으로 상승할 확률
  }[]

  optionRate: {
    name: string // 아이템 등급 이름
    first: {
      name: string // 해당 옵션의 등급 이름
      rate: number // 해당 옵션의 등급이 등장할 확률
    }[]
    second: {
      name: string // 해당 옵션의 등급 이름
      rate: number // 해당 옵션의 등급이 등장할 확률
    }[]
    third: {
      name: string // 해당 옵션의 등급 이름
      rate: number // 해당 옵션의 등급이 등장할 확률
    }[]
  }[]

  items: {
    option: {
      name: string // 해당 옵션의 등급 이름
      part: string // 해당 부위의 장비 이름
      level: string // 해당 레벨 이름
    }
    first: {
      name: string // 옵션 이름
      rate: string // 옵션 등장 확률
    }[]
    second: {
      name: string // 옵션 이름
      rate: string // 옵션 등장 확률
    }[]
    third: {
      name: string // 옵션 이름
      rate: string // 옵션 등장 확률
    }[]
  }[]
}
```
