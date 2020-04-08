import React, { useState } from 'react';
import Chart from './Chart';
import { connect } from "react-redux";
import { getOption } from '../../../utils/ChartUtil';
import BlankElement from '../BlankElement';
import ChartToolbarBtn from "../ChartToolbarBtn";
import request from '../../../utils/request';
import {setDB} from '../../../utils/ReqUtil';
import { DBMode } from '../../dashboard/Constant';
import { Types } from '../../bind/Types';
import { ChartType } from '../Constant';
import { useHistory, useParams } from "react-router-dom";
import { changeBind, changeChartData, setDataSource, changeChartInfo, setDashboards } from '../../../redux/action';
import {message} from "antd";

const ChartContainer = props => {
  const { chartData, style, dashboards, chartName, isBtnBlock=false, dbMode, chartId,
    changeBind, changeChartData, setDataSource, chartInfo, changeChartInfo } = props;
  const { elementId, dashboardId, appId } = useParams();
  const history = useHistory();
  const chartOption = chartData ? getOption(chartData, chartInfo) : {};
  const chart = <Chart chartOption={chartOption} />;
  const [btnVisible, setBtnVisible] = useState(isBtnBlock);
  const elements =
    dashboards && dashboards.length > 0 ? dashboards[0].elements : [];
  let name = "新建图表";
  let iconBtnGroup = [];
  if (elementId) {
    elements.forEach(item => {
      if (item.id == elementId) {
        name = item.name;
      }
    });
  } else {
    name = chartName || name;
  }
  if(dbMode == DBMode.Edit) {
    iconBtnGroup = [
      {
        type: "edit",
        click: () => {
          request(`/bi/charts/${chartId}`).then((res) => {
            if(res && res.msg === "success") {
              const data = res.data.view;
              const formId = data.formId;
              const chartInfo = data.chartTypeProp;
              let bindDataArr = [];
              const dimensions = data.dimensions;
              const indexes = data.indexes;

              if(dimensions && dimensions.length > 0) {
                const dimArr = dimensions.map((each, idx) => {
                  const field = each.field;
                  field["option"] = {currentGroup: each.currentGroup}
                  field["bindType"] = Types.DIMENSION;
                  field["idx"] = idx;
                  return field;
                })

                bindDataArr = dimArr;
              }

              if(indexes && indexes.length > 0) {
                const meaArr = indexes.map((each, idx) => {
                  const field = each.field;
                  field["option"] = {currentGroup: each.currentGroup}
                  field["bindType"] = Types.MEASURE;
                  field["idx"] = bindDataArr.length + idx;
                  return field;
                })

                bindDataArr = bindDataArr.concat(meaArr);
              }

              changeBind(bindDataArr);
              changeChartInfo(chartInfo);
              request(`/bi/charts/data`, {
                method: "POST",
                data: {
                  chartId,
                  formId,
                  dimensions,
                  indexes,
                  conditions: data.conditions,
                  chartType: ChartType.HISTOGRAM
                }
              }).then((res) => {
                if(res && res.msg === "success") {
                  const dataObj = res.data;
                  const data = dataObj.data;
                  changeChartData(data);
                }
              })

              return formId;
            }
          }).then((formId)  => {
            request(`/bi/forms/${formId}`).then((res) => {
              if(res && res.msg === "success") {
                const data = res.data;
                // @temp lpf data.items  formId --> id
                setDataSource({id: data.formId, name: data.formName, data: data.items});
                history.push(`/app/${appId}/setting/bi/${dashboardId}/${chartId}`);
              }
            })
          })
        }
      },
      {
        type:"delete",
        click: () => {
          request(`/bi/charts/${chartId}`,{
            method:"DELETE"
          })
          .then(res => {
            message.info("删除成功");
            if(res && res.msg === "success"){
              if(props.handleFullChart){
                props.handleFullChart(null);
              }
              props.setDB(dashboardId, props.setDashboards);
            }
          }).catch(err => {
            console.log(err);
          });
        }
      },
      {
        type:"fullscreen",
        click: props.setFullChart
      }
    ]
  }

  if(props.modalNarrowBtn){
    //如果图表放大，将放大按钮变成缩小按钮
    iconBtnGroup = iconBtnGroup.filter(item => item.type!="fullscreen");
    iconBtnGroup.push(props.modalNarrowBtn);
  }

  const handlMouseEnter = () => {
    if (!isBtnBlock) {
      setBtnVisible(true);
    }
  };

  const handlMouseLeave = () => {
    if (!isBtnBlock) {
      setBtnVisible(false);
    }
  };

  if (!chartData) {
    return (
      <div className="chart-container" style={style} onMouseEnter={handlMouseEnter}
        onMouseLeave={handlMouseLeave}>
        {btnVisible && (
          <ChartToolbarBtn
            {...props}
            iconBtnGroup={iconBtnGroup}
            isBtnBlock={isBtnBlock}
          />
         )} 
        <BlankElement />
      </div>
    );
  }

  return (
    <div
      className="chart-container"
      onMouseEnter={handlMouseEnter}
      onMouseLeave={handlMouseLeave}
      style={style}
    >
      <div className="chart-title">{name}</div>
      {btnVisible && (
        <ChartToolbarBtn
          {...props}
          iconBtnGroup={iconBtnGroup}
          isBtnBlock={isBtnBlock}
        />
      )} 
      {chart}
    </div>
  );
};

export default connect(
  store => ({
    dashboards: store.bi.dashboards,
    dbMode: store.bi.dbMode}),
    { changeBind, changeChartData, setDataSource, changeChartInfo, setDB, setDashboards }
  )(ChartContainer);
