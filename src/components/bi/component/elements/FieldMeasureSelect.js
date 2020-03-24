import React from "react";
import { Select,Icon } from "antd";
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
export default function FieldMeasureSelect(props) {
  
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

  const handleDeleteTarget = () => {
    console.log("你删除了这个指标");
  }
  
  return (
    <div className={props.className}>
      <div className="cancelIcon">
        <Icon type="close-circle" onClick={handleDeleteTarget} theme="filled" />
      </div>
      <Select dropdownStyle={style} defaultValue={fieldOperationArr[0].value} onChange={getSelectOperation}>
        {fieldOperationArr.map(option => (
          <Option className="fieldOpertaion" key={option.value} value={option.value}>{option.label}</Option>
        ))}
      </Select>
    </div>
  );
}
