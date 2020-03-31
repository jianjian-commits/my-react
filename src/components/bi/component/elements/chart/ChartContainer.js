import React from 'react';
import Chart from './Chart';
import { connect } from "react-redux";
import { getOption } from '../../../utils/ChartUtil';
import BlankElement from '../BlankElement';
import ChartToolbarBtn from "../ChartToolbarBtn";
import request from '../../../utils/request';
import { DBMode } from '../../dashboard/Constant';
import { Types } from '../../bind/Types';
import { useHistory, useParams } from "react-router-dom";
import { changeBind, changeChartData, setDataSource } from '../../../redux/action';

const ChartContainer = props => {
  const { chartData, style, dashboards, chartName, isBtnBlock, dbMode, chartId,
    changeBind, changeChartData, setDataSource } = props;
  const { elementId, dashboardId, appId } = useParams();
  const history = useHistory();
  const chartOption = chartData ? getOption(chartData) : {};
  const chart = <Chart chartOption={chartOption} />;

  const elements = dashboards && dashboards.length > 0 ? dashboards[0].elements : [];
  let name = "新建图表";
  let iconBtnGroup = [];

  if(elementId) {
    elements.forEach((item) => {
      if(item.id == elementId) {
        name = item.name;
      }
    })
  }
  else {
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
              let bindDataArr = [];
              const dimensions = data.dimensions;
              const indexes = data.indexes;

              if(dimensions && dimensions.length > 0) {
                const dimArr = dimensions.map((each) => {
                  const field = each.field;
                  field["option"] = {currentGroup: each.currentGroup}
                  field["bindType"] = Types.DIMENSION;
                  return field;
                })

                bindDataArr = dimArr;
              }

              if(indexes && indexes.length > 0) {
                const meaArr = indexes.map((each) => {
                  const field = each.field;
                  field["option"] = {currentGroup: each.currentGroup}
                  field["bindType"] = Types.MEASURE;
                  return field;
                })

                bindDataArr = bindDataArr.concat(meaArr);
              }

              changeBind(bindDataArr);
              request(`/bi/charts/data`, {
                method: "POST",
                data: {
                  chartId,
                  formId,
                  dimensions,
                  indexes,
                  conditions: data.conditions
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
      }
    ]
  }

  const handlMouseEnter = () => {
    document.getElementById(chartId + "btns").style.display = "block";
  };

  const handlMouseLeave = () => {
    document.getElementById(chartId + "btns").style.display = "none";
  };

  if (!chartData) {
    return (
      <div className="chart-container" style={style}>
        <BlankElement />
      </div>
    );
  }

  return (
    <div
      className="chart-container"
      onMouseEnter={isBtnBlock ? null : handlMouseEnter}
      onMouseLeave={isBtnBlock ? null : handlMouseLeave}
      style={style}
    >
      <div className="chart-title">{name}</div>
      <ChartToolbarBtn {...props} iconBtnGroup={iconBtnGroup} isBtnBlock={isBtnBlock}/>
      {chart}
    </div>
  );
};

export default connect(
  store => ({
    dashboards: store.bi.dashboards,
    dbMode: store.bi.dbMode}),
    { changeBind, changeChartData, setDataSource }
  )(ChartContainer);
