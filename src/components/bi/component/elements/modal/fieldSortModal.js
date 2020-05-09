import React, { useEffect, useState } from "react";
import { Modal, Icon, Button, Input } from "antd";
import classes from "../../../scss/modal/fieldSortModal.module.scss";
import request from "../../../utils/request";
import { SortType} from "../Constant";
import {connect} from "react-redux";
import { setDashboards, setVisitorSorts} from '../../../redux/action';
function FieldSortModal(props) {
  const [bindData, setBindData] = useState({});
  const [dimensions, setDimensions] = useState([]);
  const [indexes, setIndexes] = useState([]);
  const [sortArr, setSortArr] = useState([]);
  const { chartId, chartName, setDashboards, handleCancel, visitorSorts } = props;

  useEffect(() => {
    request(`/bi/charts/${chartId}`).then((res) => {
      if (res && res.msg === "success") {
        const data = res.data.view;
        const formId = data.formId;
        const dimensions = data.dimensions;
        const indexes = data.indexes;
        const bindDataObj = {
          chartId,
          formId,
          dimensions,
          indexes,
          conditions: data.conditions,
          chartType: data.type
        };
        setBindData(bindDataObj);
        setDimensions(dimensions);
        setIndexes(indexes);
        setSortArr(visitorSorts.get(chartId) ? visitorSorts.get(chartId) : getSort(dimensions, indexes));
      }
    });
  }, []);

  const setFieldSortType = (fieldId, sortType) => {
    let newDismensions = [], newIndexes = [];

    if(dimensions.length == 1) {
      newDismensions = dimensions.map(dim => {
        if(dim.field.fieldId == fieldId){
          dim.sort.value = sortType;
        }else{
          dim.sort.value = SortType.DEFAULT.value;
        }
        return dim;
      })
      setDimensions(newDismensions);
      newIndexes = indexes.map(idx => {
        if(idx.field.fieldId == fieldId){
          idx.sort.value = sortType;
        }else{
          idx.sort.value = SortType.DEFAULT.value;
        }
        return idx;
      })
      setIndexes(newIndexes);
    }
    else {
      newDismensions = dimensions.map(dim => {
        if(dim.field.fieldId == fieldId){
          dim.sort.value = sortType;
        }
        return dim;
      })
      setDimensions(newDismensions);
    }

    const sort = getSort(newDismensions, newIndexes);
    setSortArr(sort);
  }

  const btnGroup = [
    {
      label: SortType.DEFAULT.name,
      value: SortType.DEFAULT.value,
      onClick: setFieldSortType,
    },
    {
      label: SortType.ASC.name,
      value: SortType.ASC.value,
      onClick: setFieldSortType,
    },
    {
      label: SortType.DESC.name,
      value: SortType.DESC.value,
      onClick:  setFieldSortType,
    },
  ];

  const setSort = () => {
    bindData["dimensions"] = dimensions;
    bindData["indexes"] = indexes;
    request(`/bi/charts/data`, {
      method: "POST",
      data: bindData
    }).then((res) => {
      if(res && res.msg === "success") {
        const dataObj = res.data;
        const data = dataObj.data;
        const dbItem = {
          name:props.dashboards[0].name,
          elements:props.dashboards[0].elements.map(element => {
            if(element.id == chartId){
              element.data = data;
            }

            return element;
          })
        }

        setDashboards([dbItem]);
        setVisitorSorts(visitorSorts.set(chartId, getSort(dimensions, indexes)));
        handleCancel();
      }
    })
  }

  return (
    <Modal
      title={
        <span className={classes.modalTitle}>排序规则设置({chartName})</span>
      }
      visible={true}
      closable={false}
      footer={null}
      width={500}
      bodyStyle={{ padding: 0 }}
      handleCancel={handleCancel}
      wrapClassName={classes.BIFieldSortModal}
      centered
    >
      <div className={classes.modalContent}>
        {sortArr.map((each, index) => (
          <div key={each.id} className={classes.sortBtnBox}>
            <span className={classes.fieldName}>{each.label}</span>
            <div className={classes.btnGroup}>
              {btnGroup.map((btn) => (
                <Button
                  key={btn.label}
                  style={each.sort == btn.value ?
                    {backgroundColor: "#dfecff"} : {}}
                  onClick={()=>{btn.onClick(each.id, btn.value)}}
                >
                  {btn.label}
                </Button>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className={classes.footBtns}>
        <Button onClick={handleCancel}>取消</Button>
        <Button onClick={setSort}>排序</Button>
      </div>
    </Modal>
  );
}

function processField(item) {
  return {id: item.field.fieldId, label: item.field.alias, sort: item.sort.value}
}

function getSort(dimensions, indexes) {
  let sorts = dimensions.map(processField);

  if(dimensions.length == 1) {
    sorts = sorts.concat(indexes.map(processField))
  }

  return sorts;
}

export default connect(store => 
  ({
    dashboards: store.bi.dashboards,
    visitorSorts: store.bi.visitorSorts
  }),{
    setDashboards, setVisitorSorts
  })(FieldSortModal);