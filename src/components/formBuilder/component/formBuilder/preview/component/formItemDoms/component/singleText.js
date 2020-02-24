import React from 'react';
import ComponentBox from '../componentBox';
import { ComponentHeader } from '../utils/commonDom';


export default class SingleText extends React.Component {
    constructor(props) {
        super(props);
        this.inputField = React.createRef();
    }

    render() {
        const props = {};
        props.type = 'text';
        props.className = 'form-control';
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
                            {/* <ComponentLabel {...this.props} /> */}
                            <input {...props}/>
                        </div>
                    </>
                }
            />
        );
    }
}
