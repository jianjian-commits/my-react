import React ,{ useState, useEffect, useRef }from "react";
import { Icon, Input, Button } from "antd";
import {TimeSumType,SortType, DataType} from "./Constant";
import classes from "../../scss/bind/optionSelect.module.scss";
import {FieldSecondMenus,transforObjIntoArr} from "./FieldMeasureSelect";
import FieldNameModal from "../elements/modal/fieldNameModal";
export default function FieldDimensionSelect(props) {
  const {sort,currentGroup} = props.item;
  const SortTypeArr = transforObjIntoArr(SortType);
  const TimeSumTypeArr = transforObjIntoArr(TimeSumType);
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
    if (sort) {
      SortTypeArr.map((sortType,i) => {
        if(sort.value == sortType.value){
          setSortTypeIndex(i);
        }
      })
    }
    if(currentGroup.value){
      TimeSumTypeArr.map((sumType,j) => {
        if(currentGroup.value == sumType.value){
          setSumTypeIndex(j);
        }
      })
    }
  }, [props]);

  //二级菜单根据时间汇总回调
  const secondMenuSumFunc = index => {
    setSumTypeIndex(index);
    props.item.changeGroup(TimeSumTypeArr[index], props.item.index, props.item.bindType);
    setPopoverVisible(false);
  }
  //二级菜单字段排序回调
  const secondMenuSortFunc = index => {
    setSortTypeIndex(index);
    props.item.changeSortType({...SortTypeArr[index], fieldId: props.item.fieldId}, props.item.index, props.item.bindType);
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
      name: "删除字段",
      click: () => {
        handleDeleteTarget();
      }
    }
  ];

  const handleOK = name => {
    props.item.changeFieldName(name, props.item.index, props.item.bindType);
    setNameInputVisible(false);
  }
  const handleCancel = () => {
    setNameInputVisible(false);
  }

  const showSortIcon = () => {
    const sortImgArr = [SortType.ASC.value,SortType.DESC.value];
    return (sort && sortImgArr.includes(sort.value)) ? <img src={"/image/davinci/"+sort.value+".svg"}/> : null;
  }
  const fieldName = props.item.alias||props.item.label;
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
          {props.item.type==DataType.DATETIME ? fieldName + `(${TimeSumType[currentGroup.value].name})`:fieldName}
          {showSortIcon()}
        </span>
        {deleteBtnVisible && <Icon type="close-circle" onClick={handleDeleteTarget} theme="filled" />}
      </div>
      {nameInputVisible && <FieldNameModal label={props.item.alias} handleOK={handleOK} handleCancel={handleCancel}/>}
      {popoverVisible && (
        <div className={classes.dropDownItemContainer}>
          <FieldSecondMenus
            selectIndex={sortTypeIndex}
            click={secondMenuSortFunc}
            list={SortTypeArr}
            label={"排序方式"}
          />
          {
            props.item.type==DataType.DATETIME &&
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