import React, {Fragment} from "react";
import { connect } from "react-redux";
import ChartContainer from '../elements/chart/ChartContainer';
import classes from '../../scss/dashboard/editor.module.scss';
import ChartFullModal from "../elements/modal/chartFullModal";

const Column = (props) => {
  return (
    <div className={classes.layoutColumn}>
      {props.children}
    </div>
  )
}

class DBEditor extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      fullChart:null,
    }
  }

  handleFullChart = fullChart => {
    if(this.state.fullChart){
      this.setState({fullChart:null});
    }else{
      this.setState({fullChart});
    }
  }

  getElements = (dashboards) => {
    const elements = dashboards[0].elements;
    const keys = Object.keys(elements);
    const len = keys.length;

    if(len == 0) {
      return null;
    }

    let elems = [];
    const rows = [];
    
    
    keys.forEach((item, idx) => {
      const data = elements[item].data;
      const element = elements[item];
      const containerObj = {isBtnBlock: false, key: item, chartData: data,
        chartName: element.name, chartId: element.id, chartInfo: element.chartTypeProp};
      const modalNarrowBtn = 
          {
            type:"fullscreen-exit",
            click:this.handleFullChart
          };
      const setFullChart = () => {this.handleFullChart(<ChartContainer modalNarrowBtn={modalNarrowBtn} handleFullChart={this.handleFullChart} {...containerObj}/>)};

      if(idx % 2 == 0) {
        elems.push(<ChartContainer {...containerObj} setFullChart={setFullChart}/>);

        if(idx == len - 1) {
          rows.push(<Column children={elems} key={item}/>);
        }
      } else {
        elems.push(<ChartContainer {...containerObj} setFullChart={setFullChart}/>);
        rows.push(<Column children={elems} key={item}/>);
        elems = [];
      }
    });
    
    return rows;
  }

  render() {
    const { height, dashboards } = this.props;

    if(!dashboards || (dashboards.length == 0) || dashboards[0].elements.length == 0) {
      return (
        <Fragment>
          <div className={classes.dbPlaceholder} style={{height}}>
            <div>点击新建图表创建仪表盘</div>
          </div>
        </Fragment>
      )
    }

    return (
      <Fragment>
        <div className={classes.dbEditor} style={{height}}>
          {this.state.fullChart && <ChartFullModal chart={this.state.fullChart}/>}
          {this.getElements(dashboards)}
        </div>
      </Fragment>
    )
  }
}

export default connect(
  store => ({
    dashboards: store.bi.dashboards}), {}
  )(DBEditor);
