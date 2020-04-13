import React from 'react';
import ComponentBox from '../componentBox';
import { ComponentHeader} from '../utils/commonDom';


export default class NumberInput extends React.Component {
    constructor(props) {
        super(props);
        this.inputField = React.createRef();
    }

    render() {
        const props = {};
        props.type = 'number';
        props.className = 'form-control numberInput';
        props.name = this.props.data.field_name;

        if (this.props.mutable) {
            props.defaultValue = this.props.defaultValue;
            props.ref = this.inputField;
        }

        if (this.props.read_only) {
            props.disabled = 'disabled';
        }

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
                            <input {...props} style={{ minHeight: "34px",width:"405px" }} />
                        </div>
                    </>
                }
            />
        );
    }
}
