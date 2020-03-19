import React from "react";
import { Select } from "antd";
const { Option } = Select;
const operationArr = [
  {
    value: "求和",
  },
  {
    value: "平均",
  },
  {
    value: "最大",
  },
  {
    value: "最小",
  }
];
export default function FieldTargetSelect(props) {
  
  const creatFieldOperationArr = (componentLabel) => {
      return operationArr.map(operation => {
        return {
          ...operation,
          label:`${componentLabel}(${operation.value})`
        }
      })
  }

  const fieldOperationArr = creatFieldOperationArr(props.label);

  const style = {
    fontSize: 12,
    lineHeight:32,
  }
  const getSelectOperation = value => {
    console.log("你选择了",value);
  }
  
  return (
    <div className={props.className}>
    <Select dropdownStyle={style} defaultValue={fieldOperationArr[0].value} onChange={getSelectOperation}>
      {fieldOperationArr.map(option => (
        <Option className="fieldOpertaion" key={option.value} value={option.value}>{option.label}</Option>
      ))}
    </Select>
    </div>
  );
}
