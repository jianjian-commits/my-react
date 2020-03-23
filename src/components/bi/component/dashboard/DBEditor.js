import React, {Fragment} from "react";
import { connect } from "react-redux";
import ChartContainer from '../elements/chart/ChartContainer';
import "../../scss/dashboard.scss";

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

  getElements = (dataArr) => {
    dataArr = dataArr ? dataArr : ['a', 'b','c', 'd', 'e', 'f', 'g'];
    const len = dataArr.length;
    let elems = [];
    const rows = [];

    dataArr.forEach((item, idx) => {
      if(idx % 2 == 0) {
        elems.push(<ChartContainer key={item}/>);

        if(idx == len - 1) {
          rows.push(<Column children={elems} key={item}/>);
        }
      } else {
        elems.push(<ChartContainer key={item}/>);
        rows.push(<Column children={elems} key={item}/>);
        elems = [];
      }
    });
    
    return rows;
  }

  render() {
    const { dashboardId, dataArr, height } = this.props;

    // if(!dashboardId) {
    //   return (
    //     <Fragment>
    //       <div className="db-placeholder" style={{height}}>
    //         <div>点击新建图表创建仪表盘</div>
    //       </div>
    //     </Fragment>
    //   )
    // }

    return (
      <Fragment>
        <div className="db-editor">
          {this.getElements(dataArr)}
        </div>
      </Fragment>
    )

    return (<div/>);
  }
}

export default connect(
  store => ({
  }),
  {
  }
)(DBEditor);
