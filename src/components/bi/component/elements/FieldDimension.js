import React ,{ useState, useEffect, useRef }from "react";
import { Icon, Input, Button } from "antd";
import {TimeSumTypeArr,SortTypeArr} from "./Constant";
import classes from "../../scss/bind/optionSelect.module.scss";
import {FieldSecondMenus} from "./FieldMeasureSelect";
export default function FieldDimensionSelect(props) {
  const [popoverVisible, setPopoverVisible] = useState(false);
  const [nameInputVisible,setNameInputVisible] = useState(false);
  const [deleteBtnVisible,setDeleteBtnVisible] = useState(false);
  //字段排序和字段汇总方式
  const [sortTypeIndex,setSortTypeIndex] = useState(0);
  const [sumTypeIndex,setSumTypeIndex] = useState(4);
  const dropDownBtn = useRef(null);
  useEffect(() => {
    const dropDownEvent = event => {
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
    if (props.item.option.sort) {
      SortTypeArr.map((sortType,i) => {
        if(props.item.option.sort.value == sortType.value){
          setSortTypeIndex(i);
        }
      })
    }
    if(props.item.option.currentGroup.value){
      TimeSumTypeArr.map((sumType,j) => {
        if(props.item.option.currentGroup.value == sumType.value){
          setSumTypeIndex(j);
        }
      })
    }
  }, [props]);

  //二级菜单根据时间汇总回调
  const secondMenuSumFunc = index => {
    setSumTypeIndex(index);
    props.item.changeGroup(TimeSumTypeArr[index], props.item.fieldId);
    setPopoverVisible(false);
  }
  //二级菜单字段排序回调
  const secondMenuSortFunc = index => {
    setSortTypeIndex(index);
    props.item.changeSortType(SortTypeArr[index], props.item.fieldId);
    setPopoverVisible(false);
  }

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
      }
    },
    {
      name: "数据格式",
      click: () => {}
    },
    {
      name: "删除字段",
      click: () => {
        handleDeleteTarget();
      }
    }
  ];
  return (
    <div 
      className={classes.dimContainer}
      onMouseEnter={handlMouseEnter} 
      onMouseLeave={handlMouseLeave}
    >
      <div
        className={classes.dropDownBtn}
        ref={dropDownBtn}
        onClick={e => {
          e.stopPropagation();
          setPopoverVisible(!popoverVisible);
        }}
      >
        {popoverVisible === false ? <Icon type="down" /> : <Icon type="up" />}
        <span className={classes.dropDownBtnSpan}>
          {props.item.label}
        </span>
        {deleteBtnVisible && <Icon type="close-circle" onClick={handleDeleteTarget} theme="filled" />}
      </div>
      {nameInputVisible && (
        <div className={classes.nameInputContainer}>
          <div className={classes.inputBox}>
            <Input/>
          </div>
          <div className={classes.btnBox}>
            <Button onClick={()=>{setNameInputVisible(false)}}>取消</Button>
            <Button onClick={()=>{setNameInputVisible(false)}}>确定</Button>
          </div>
        </div>
      )}
      {popoverVisible && (
        <div className={classes.dropDownItemContainer}>
          <FieldSecondMenus
            selectIndex={sortTypeIndex}
            click={secondMenuSortFunc}
            list={SortTypeArr}
            label={"排序方式"}
          />
          {
            props.item.type=="DATETIME" &&
            <FieldSecondMenus
            selectIndex={sumTypeIndex}
            click={secondMenuSumFunc}
            list={TimeSumTypeArr}
            label={"汇总方式"}
          />
          }
          {operationList.map(operation => (
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