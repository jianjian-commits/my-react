import React from 'react';
import './element.scss'


const BlankElement = (props) => {
  return (
    <div style ={props.style} className={"element-blank"}><span>暂无数据</span></div>
  )
}

export default BlankElement;