export const ChartType = {
  HISTOGRAM: "HISTOGRAM",
  PIE: "PIE",
  INDEX_DIAGRAM: "INDEX_DIAGRAM"
}

export const DataType = {
  NUMBER: "NUMBER",
  DATETIME: "DATETIME",
  STRING: "STRING"
}

export const AllType = ["HISTOGRAM", "PIE", "INDEX_DIAGRAM"];
export const PieType = ["PIE"];
export const BarType = ["HISTOGRAM"];
export const BarIndexType = ["HISTOGRAM","INDEX_DIAGRAM"];

export const OPERATORS = {
  EQUALS: "EQ",
  NOT_EQUALS: "NE",
  EQUALS_TO_ANY_ONE: "IN",
  NOT_EQUALS_TO_ANY_ONE: "NOT_IN",
  INCLUDE: "LIKE",
  NOT_INCLUDE: "NOT_LIKE",
  IS_NULL: "NULL",
  IS_NOT_NULL: "NOT_NULL",
  GRATER_THAN: "GT",
  LESS_THAN: "LT",
  GRATER_OR_EQUAL_TO: "GTE",
  LESS_OR_EQUAL_TO: "LTE",
  RANGE: "RANGE",
}

export const OPERATOR_LABELS = {
  EQUALS: "等于",
  NOT_EQUALS: "不等于",
  EQUALS_TO_ANY_ONE: "等于任意一个",
  NOT_EQUALS_TO_ANY_ONE: "不等于任意一个",
  INCLUDE: "包含",
  NOT_INCLUDE: "不包含",
  IS_NULL: "为空",
  IS_NOT_NULL: "不为空",
  GRATER_THAN: "大于",
  LESS_THAN: "小于",
  GRATER_OR_EQUAL_TO: "大于等于",
  LESS_OR_EQUAL_TO: "小于等于",
  RANGE: "选择范围",
}

export const TextOptions = [
  { value: OPERATORS.EQUALS, label: OPERATOR_LABELS.EQUALS },
  { value: OPERATORS.NOT_EQUALS, label: OPERATOR_LABELS.NOT_EQUALS },
  { value: OPERATORS.EQUALS_TO_ANY_ONE, label: OPERATOR_LABELS.EQUALS_TO_ANY_ONE },
  { value: OPERATORS.NOT_EQUALS_TO_ANY_ONE, label: OPERATOR_LABELS.NOT_EQUALS_TO_ANY_ONE },
  { value: OPERATORS.INCLUDE, label: OPERATOR_LABELS.INCLUDE },
  { value: OPERATORS.NOT_INCLUDE, label: OPERATOR_LABELS.NOT_INCLUDE },
  { value: OPERATORS.IS_NULL, label: OPERATOR_LABELS.IS_NULL },
  { value: OPERATORS.IS_NOT_NULL, label: OPERATOR_LABELS.IS_NOT_NULL },
]

export const NumberOptions = [
  { value: OPERATORS.EQUALS, label: OPERATOR_LABELS.EQUALS },
  { value: OPERATORS.NOT_EQUALS, label: OPERATOR_LABELS.NOT_EQUALS },
  { value: OPERATORS.GRATER_THAN, label: OPERATOR_LABELS.GRATER_THAN },
  { value: OPERATORS.GRATER_OR_EQUAL_TO, label: OPERATOR_LABELS.GRATER_OR_EQUAL_TO },
  { value: OPERATORS.LESS_THAN, label: OPERATOR_LABELS.LESS_THAN },
  { value: OPERATORS.LESS_OR_EQUAL_TO, label: OPERATOR_LABELS.LESS_OR_EQUAL_TO },
  { value: OPERATORS.RANGE, label: OPERATOR_LABELS.RANGE },
  { value: OPERATORS.IS_NULL, label: OPERATOR_LABELS.IS_NULL },
  { value: OPERATORS.IS_NOT_NULL, label: OPERATOR_LABELS.IS_NOT_NULL }
]

export const DateOptions = [
  { value: OPERATORS.EQUALS, label: OPERATOR_LABELS.EQUALS },
  { value: OPERATORS.NOT_EQUALS, label: OPERATOR_LABELS.NOT_EQUALS },
  { value: OPERATORS.GRATER_OR_EQUAL_TO, label: OPERATOR_LABELS.GRATER_OR_EQUAL_TO },
  { value: OPERATORS.LESS_OR_EQUAL_TO, label: OPERATOR_LABELS.LESS_OR_EQUAL_TO },
  { value: OPERATORS.RANGE, label: OPERATOR_LABELS.RANGE },
  { value: OPERATORS.IS_NULL, label: OPERATOR_LABELS.IS_NULL },
  { value: OPERATORS.IS_NOT_NULL, label: OPERATOR_LABELS.IS_NOT_NULL }
]


export const GroupType = {
  SUM: {name: "总计", value: "SUM"},
  COUNT: {name: "计数", value: "COUNT"},
  AVERAGE: {name: "平均", value: "AVERAGE"},
  MAX: {name: "最大", value: "MAX"},
  MIN: {name: "最小", value: "MIN"},
  // DEFAULT: {name: "", value: null},
}

export const SortType = {
  DEFAULT:{
    name:"默认",
    value:"DEFAULT"
  },
  DESC:{
    name:"降序",
    value:"DESC"
  },
  ASC:{
    name:"升序",
    value:"ASC"
  },
}
export const TimeSumType = {
  YEAR:{
    name:"年",
    value:"YEAR"
  },
  QUARTER:{
    name:"年-季",
    value:"QUARTER"
  },
  MONTH:{
    name:"年-月",
    value:"MONTH"
  },
  WEEK:{
    name:"年-周",
    value:"WEEK"
  },
  DAY:{
    name:"年-月-日",
    value:"DAY"
  }
}

export const DataFormatType = {
  PREDEFINE:"PREDEFINE",
  CUSTOM:"CUSTOM"
}

export const ChartColor = ['#4398E2','#6FB3EE','#F57243','#FFA585','#8D84E0','#BBB5F0','#FA5F84','#FE91BA','#1FB4BD','#94E2C7','#C2864F','#E6B181','#65B440','#9DDA81','#FCA036','#FFB966','#888E9D','#B9BCC7','#DA6ED5','#F3A9EE'];