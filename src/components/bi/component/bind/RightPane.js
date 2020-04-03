import React, { useState } from "react";
import { connect } from "react-redux";
import { Tooltip, Checkbox, Input } from 'antd';
import { updateChartReq } from '../../utils/ReqUtil';
import ChartInfo from "../elements/data/ChartInfo";
import { changeChartInfo } from '../../redux/action';
import { useParams } from "react-router-dom";
import classNames from "classnames";

const RightPane = (props) => {
  const { chartInfo, bindDataArr, elemName, changeChartInfo } = props;
  const { elementId } = useParams();
  let [activeIcon, setActiveIcon] = useState("bar-chart");
  let [titleXAxis, setTitleXAxis] = useState(chartInfo.titleXAxis);
  let [titleYAxis, setTitleYAxis] = useState(chartInfo.titleYAxis);
  let [showLegend, setShowLegend] = useState(chartInfo.showLegend);
  let [showDataTag, setShowDataTag] = useState(chartInfo.showDataTag);

  const onChangeShowLegend = () => {
    let show = !showLegend;
    setShowLegend(show);
    let info = getChartInfo();
    info.showLegend = show
    updateChartInfo(info);
  }

  const onChangeShowDataTag = () => {
    let show = !showDataTag;
    setShowDataTag(show);
    let info = getChartInfo();
    info.showDataTag = show;
    updateChartInfo(info);
  }

  const handleSelectIcon = chartIcon => {
    setActiveIcon(chartIcon);
  }

  const onChangeTitleXAxis = (e) => {
    e.persist();
    setTitleXAxis(e.target.value);
  }

  const onChangeTitleYAxis = (e) => {
    e.persist();
    setTitleYAxis(e.target.value);
  }

  const getChartInfo = () => {
    let chartInfo = new ChartInfo();
    chartInfo.titleXAxis = titleXAxis;
    chartInfo.titleYAxis = titleYAxis;
    chartInfo.showLegend = showLegend;
    chartInfo.showDataTag = showDataTag;
    return chartInfo;
  }

  const updateChartInfo = (chartInfo) => {
    chartInfo = chartInfo || getChartInfo();
    updateChartReq(elementId, bindDataArr, elemName || "新建图表", {...chartInfo});
    changeChartInfo(chartInfo);
  }

  const chartGroup = [
    {type:"barChart",intro:"条形图"},
  ]

  return (
    <div className="right-pane">
      <div className="right-pane-chart">
        <span>可视化</span>
        <div className="chart-group">
        {chartGroup.map(chart =>
        <Tooltip key={chart.type}  title={chart.intro}>
          <div
            className={classNames("IconBox", {activeIcon: activeIcon==chart.type})}
            onClick={()=>{handleSelectIcon(chart.type)}}
          >
            <img src={"/image/davinci/"+chart.type+".svg"}/>
          </div>
        </Tooltip>
        )}
        </div>
      </div>
      <div className="right-pane-tools">
        <span className="title">工具栏</span>
        <p>X轴标题</p>
        <Input value={titleXAxis} onBlur={(e) => {updateChartInfo()}} onChange={onChangeTitleXAxis}/>
        <p>Y轴标题</p>
        <Input value={titleYAxis} onBlur={(e) => {updateChartInfo()}} onChange={onChangeTitleYAxis}/>
        <div className="checkboxGroup">
          <Checkbox checked={showDataTag} onClick={onChangeShowDataTag}>显示数据标签</Checkbox>
          <Checkbox checked={showLegend} onClick={onChangeShowLegend}>显示图例</Checkbox>
        </div>
      </div>
    </div>
  )
}

export default connect((store) => {
  return {
    chartInfo: store.bi.chartInfo,
    bindDataArr: store.bi.bindDataArr,
    elemName: store.bi.elemName
  }
}, { changeChartInfo })(RightPane)