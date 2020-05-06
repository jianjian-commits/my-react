import { textCheckType, numberCheckType, logicCheckType, dateCheckType } from "../../utils/checkTypeList";

export const ruleList = [
  {
    ruleType: "文本类",
    ruleTypeList: [...textCheckType]
  },
  {
    ruleType: "逻辑类",
    ruleTypeList: [...logicCheckType]
  },
  {
    ruleType: "数字类",
    ruleTypeList: [...numberCheckType]
  },{
    ruleType: "时间日期类",
    ruleTypeList: [...dateCheckType]
  }
];
