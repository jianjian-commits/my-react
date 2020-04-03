import React from 'react';
import { Button } from 'antd'
import ComponentBox from '../componentBox';
import { ComponentHeader } from '../utils/commonDom';


export default class GetLocalPositon extends React.Component {
    constructor(props) {
        super(props);
        this.inputField = React.createRef();
    }

    render() {
        const props = {};
        props.type = 'text';
        props.className = 'form-control getLoaclPosition';
        props.name = this.props.data.field_name;
        if (this.props.mutable) {
            props.defaultValue = this.props.defaultValue;
            props.ref = this.inputField;
        }

        let baseClasses = 'SortableItem rfb-item';
        if (this.props.data.pageBreakBefore) { baseClasses += ' alwaysbreak'; }

        if (this.props.read_only) {
            props.disabled = 'disabled';
        }

        if (this.props.active) {
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
                            <div className="localposition-container">
                                <span className="loaction-tip">请在移动端打开表单获取位置信息</span>
                                <Button type="dashed">
                                    <img src="/image/icons/location2.png" alt="" />
                                    获取当前位置
                                </Button>
                            </div>
                        </div>
                    </>
                }
            />
        );
    }
}
