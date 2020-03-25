import React from "react";
import { Select,Icon } from "antd";
import { GroupType } from "./Constant";
const { Option } = Select;
const operationArr = [
  {...GroupType.SUM},
  {...GroupType.AVERAGE},
  {...GroupType.MAX},
  {...GroupType.MIN},
  {...GroupType.COUNT}
];
export default function FieldMeasureSelect(props) {
  const creatFieldOperationArr = (componentLabel) => {
      return operationArr.map(operation => {
        return {
          ...operation,
          label:`${componentLabel}(${operation.name})`
        }
      })
  }

  const fieldOperationArr = creatFieldOperationArr(props.item.label);

  const style = {
    fontSize: 12,
    lineHeight:32,
  }

  const getSelectOperation = value => {
    props.changeGroup(GroupType[value], props.item.id);
  }

  const handleDeleteTarget = () => {
    props.removeField(props.item);
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
