
import React from 'react';
import { Radio } from 'antd';
import ComponentBox from '../componentBox';
import { ComponentHeader, ComponentLabel } from '../utils/commonDom';


export default class RadioButtons extends React.Component {
    constructor(props) {
        super(props);
        this.values = {};
    }

    render() {
        const self = this;
        let radioGroupLayout = this.props.data.inline ? "row-layout":"column-layout";
        let baseClasses = 'SortableItem rfb-item';
        if (this.props.data.pageBreakBefore) { baseClasses += ' alwaysbreak'; }

        if(this.props.active) {
            baseClasses += " active";
          }

        return (

            <ComponentBox
                {...this.props}
                className={baseClasses}
                content={
                    <>
                        <ComponentHeader {...this.props} active={this.props.active} />
                        <div className="form-group">
                            <Radio.Group className={radioGroupLayout} >
                                {
                                    this.props.data.values.map( 
                                        (option,index) => 
                                        <Radio 
                                          key={index} 
                                          className ="radio-label" 
                                          value={option.value}
                                        >
                                            {option.label}
                                        </Radio>)}
                            </Radio.Group>
                        </div>
                    </>
                }
            />
        );
    }

}
