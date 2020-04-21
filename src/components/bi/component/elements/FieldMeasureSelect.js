import React, { useState, useEffect, useRef } from "react";
import { Icon, Popover, Input, Button } from "antd";
import { GroupType, SortType, DataType} from "./Constant";
import classes from "../../scss/bind/optionSelect.module.scss";
import FieldNameModal from "../elements/modal/fieldNameModal";
export const transforObjIntoArr = obj => {
  let arr = [];
  for (let i in obj) {
    arr.push({...obj[i]}); 
  }
  return arr;
}

export const FieldSecondMenus = (props) => {
  //二级菜单组件{菜单列表，选中索引，方法回调,是否禁用}
  const { list, selectIndex, click ,disabled=false} = props;
  return (
    <Popover
      placement="rightTop"
      title=""
      overlayStyle={{ paddingLeft: 0 }}
      overlayClassName={classes.FieldSelectPopover}
      content={
        <div className={classes.popoverSelectionGroup} style={disabled ? {backgroundColor:"#e9ecef"} : {}}>
          {list.map((item, index) => (
            <div
              key={index}
              onClick={() => {
                if(disabled){
                  return false;
                }else{
                  click(index);
                }
              }}
              className={classes.selectionBox}
            >
              {item.name}
              {selectIndex === index && <Icon type="check" />}
            </div>
          ))}
        </div>
      }
      trigger="hover"
    >
      <div className={classes.dropDownItem}>
        <span className={classes.dropDownItemSpan}>{props.label}</span>
        <Icon type="right" />
      </div>
    </Popover>
  );
};

export default function FieldMeasureSelect(props) {
  const operationArr = transforObjIntoArr(GroupType);
  const SortTypeArr = transforObjIntoArr(SortType);
  const [selectIndex, setSelectIndex] = useState(0);
  const [sortTypeIndex, setSortTypeIndex] = useState(0);
  const [popoverVisible, setPopoverVisible] = useState(false);
  const [nameInputVisible, setNameInputVisible] = useState(false);
  const [deleteBtnVisible, setDeleteBtnVisible] = useState(false);
  const dropDownBtn = useRef(null);
  useEffect(() => {
    const dropDownEvent = (event) => {
      if (popoverVisible) {
        setPopoverVisible(false);
      }
    };
    document.addEventListener("click", dropDownEvent);
    return () => {
      document.removeEventListener("click", dropDownEvent);
    };
  }, [popoverVisible]);

  useEffect(() => {
    if (props.item.sort) {
      SortTypeArr.map((sortType,i) => {
        if(props.item.sort.value == sortType.value){
          setSortTypeIndex(i);
        }
      })
    }
    if(props.item.currentGroup){
      operationArr.map((operationType,i) => {
        if(props.item.currentGroup.value == operationType.value){
          setSelectIndex(i);
        }
      })
    }
  }, [props]);

  const handleDeleteTarget = () => {
    props.item.removeField(props.item);
  };

  const handlMouseEnter = () => {
    setDeleteBtnVisible(true);
  };

  const handlMouseLeave = () => {
    setDeleteBtnVisible(false);
  };

  const operationList = [
    {
      name: "修改显示名",
      click: () => {
        setNameInputVisible(true);
      },
    },
    {
      name: "数据格式",
      click: () => {},
    },
    {
      name: "删除字段",
      click: () => {
        handleDeleteTarget();
      },
    },
  ];

  const secondMenuSumFunc = (index) => {
    setSelectIndex(index);
    props.item.changeGroup(operationArr[index], props.item.fieldId);
    setPopoverVisible(false);
  };

  //二级菜单字段排序回调
  const secondMenuSortFunc = (index) => {
    setSortTypeIndex(index);
    props.item.changeSortType(SortTypeArr[index], props.item.fieldId);
    setPopoverVisible(false);
  };

  const handleOK = name => {
    props.item.changeFieldName(name, props.item.fieldId);
    setNameInputVisible(false);
  }
  const handleCancel = () => {
    setNameInputVisible(false);
  }
  return (
    <div
      className={classes.meaContainer}
      onMouseEnter={handlMouseEnter}
      onMouseLeave={handlMouseLeave}
    >
      <div
        className={classes.dropDownBtn}
        ref={dropDownBtn}
        onClick={(e) => {
          e.stopPropagation();
          setPopoverVisible(!popoverVisible);
        }}
      >
        {popoverVisible === false ? <Icon type="down" /> : <Icon type="up" />}
        <span className={classes.dropDownBtnSpan}>
          {`${props.item.label}(${operationArr[selectIndex].name})`}
        </span>
        {deleteBtnVisible && (
          <Icon
            type="close-circle"
            onClick={handleDeleteTarget}
            theme="filled"
          />
        )}
      </div>
      {nameInputVisible && <FieldNameModal label={props.item.label} handleOK={handleOK} handleCancel={handleCancel}/>}
      {popoverVisible && (
        <div className={classes.dropDownItemContainer}>
          <FieldSecondMenus
            selectIndex={sortTypeIndex}
            click={secondMenuSortFunc}
            list={SortTypeArr}
            disabled={props.item.dimFiledCount>1}
            label={"排序方式"}
          />
          {props.item.type == DataType.NUMBER && (
            <FieldSecondMenus
              selectIndex={selectIndex}
              click={secondMenuSumFunc}
              list={operationArr}
              label={"汇总方式"}
            />
          )}
          {operationList.map((operation) => (
            <div
              className={classes.dropDownItem}
              onClick={() => {
                operation.click();
                setPopoverVisible(false);
              }}
              key={operation.name}
            >
              <span className={classes.dropDownItemSpan}>{operation.name}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
