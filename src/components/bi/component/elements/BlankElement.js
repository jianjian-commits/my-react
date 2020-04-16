import React from 'react';
import classes from '../../scss/elements/element.module.scss';


const BlankElement = (props) => {
  return (
    <div style ={props.style} className={classes.blankElement}><span>暂无数据</span></div>
  )
}

export default BlankElement;