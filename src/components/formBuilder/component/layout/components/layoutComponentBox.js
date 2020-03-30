import React from 'react';
import { Form,Popconfirm } from "antd";
class LayoutComponentBox extends React.Component{
    render(){
        return (
            <Popconfirm
                title="确认删除该组件？"
                onConfirm={this.props.Confirm}
                onCancel={()=>{}}
                okText="是"
                cancelText="否"
              >
                <div
                  className="btn is-isolated btn-school"
                >
                  <i className="is-isolated fa fa-trash-o"></i>
                </div>
              </Popconfirm>
        )
    }
}
export default LayoutComponentBox;