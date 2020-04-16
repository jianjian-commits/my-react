import React from "react";
import { connect } from "react-redux";
import classes from '../../scss/elements/element.module.scss';

class IndexChart extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { chartOption } = this.props;
    const chartdata = chartOption;
    if(!chartdata.length){
      return(
        <div></div>
      )
    }else if(chartdata.length == 1){
      return(
        <div className={classes.indexSum}>
          {chartdata.map(data=>
            <span className={classes.indexCount}>{data.count}</span>
          )}
        </div>
      )
    }else if(chartdata.length > 1) {
      return(
        <div className={classes.indexChart}>
          {chartdata.map(data=>
            <div className={classes.indexTable}>
              <span>{data.name}</span>
              <span>{data.count}</span>
            </div>
          )}
        </div>
      )
    }
  }
}

export default connect(store => ({}),{})(IndexChart);