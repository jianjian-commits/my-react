import React from 'react';
import './element.scss'


const BlankElement = (props) => {
  return (
    <div style ={props.style} className={"element-blank"}><span>空组件</span></div>
  )
}

export default BlankElement;