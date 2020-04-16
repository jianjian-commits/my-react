export const ChartType = {
  HISTOGRAM: "HISTOGRAM",
  
}

export const GroupType = {
  SUM: {name: "总计", value: "SUM"},
  COUNT: {name: "计数", value: "COUNT"},
  AVERAGE: {name: "平均", value: "AVERAGE"},
  MAX: {name: "最大", value: "MAX"},
  MIN: {name: "最小", value: "MIN"},
}

export const SortTypeArr = [
  {
    name:"默认",
    value:"DEFAULT"
  },{
    name:"降序",
    value:"DESC"
  },{
    name:"升序",
    value:"ASC"
  },
]
export const TimeSumTypeArr = [
  {
    name:"年",
    value:"YEAR"
  },{
    name:"年-季",
    value:"QUARTER"
  },{
    name:"年-月",
    value:"MONTH"
  },{
    name:"年-周",
    value:"WEEK"
  },{
    name:"年-月-日",
    value:"DAY"
  }
]