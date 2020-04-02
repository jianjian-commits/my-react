import React, {Fragment} from "react";
import { connect } from "react-redux";
import ChartContainer from '../elements/chart/ChartContainer';

const Column = (props) => {
  return (
    <div className="layout-column">
      {props.children}
    </div>
  )
}

class DBEditor extends React.PureComponent {
  constructor(props) {
    super(props);
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
        chartName: element.name, chartId: element.id};

      if(idx % 2 == 0) {
        elems.push(<ChartContainer {...containerObj}/>);

        if(idx == len - 1) {
          rows.push(<Column children={elems} key={item}/>);
        }
      } else {
        elems.push(<ChartContainer {...containerObj} />);
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
          <div className="db-placeholder" style={{height}}>
            <div>点击新建图表创建仪表盘</div>
          </div>
        </Fragment>
      )
    }

    return (
      <Fragment>
        <div className="db-editor" style={{height}}>
          {this.getElements(dashboards)}
        </div>
      </Fragment>
    )
  }
}

export default connect(
  store => ({
    dashboards: store.bi.dashboards}),
    {}
  )(DBEditor);
