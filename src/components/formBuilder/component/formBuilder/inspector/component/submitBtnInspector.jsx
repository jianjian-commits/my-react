import React from "react";
import { connect } from "react-redux";
import { Input, Select, message } from "antd";
import { setSubmitBtn } from "../../redux/utils/operateFormComponent";
import {
    setItemAttr
  } from "../../redux/utils/operateFormComponent";
const { Option } = Select;

class SubmitBtnInspector extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            btnName: "",
            hasError: false
        };
    }

    componentDidMount() {
        let { label } = this.props.element;

        this.setState({ btnName: label });
    }

    handleChangeAttr = value => {
          this.props.setItemAttr(
            this.props.element,
            "label",
            value
          );
      };

      handleChangeStyle = (value) =>{
        this.props.setItemAttr(
            this.props.element,
            "buttonStyle",
            value
          );
      }

    render() {
        let { buttonStyle, buttonSize,label} = this.props.element;
        let { btnName, hasError } = this.state;


        let className = hasError ? "submit-btn-input submit-input-error" : "submit-btn-input";
        return (
            <div className="textarea-text-input">
                <div className="base-form-tool">
                    <div className="costom-info-card">
                        <p htmlFor="email-title">标题</p>
                        <Input
                            id="single-text-title"
                            name="label"
                            className={className}
                            placeholder="提交按钮"
                            value={label}
                            onChange={(e) => {
                                const value = e.target.value;
                                this.handleChangeAttr(value)
                            }}
                            onBlur={(e) => {
                                const value = e.target.value;

                                if (value == "") {
                                    this.handleChangeAttr("提交")
                                } else {
                                    if (value.length > 6) {
                                        let name = value.substr(0, 6);
                                        message.error("按钮标题长度不大于6");
                                        this.handleChangeAttr(name)
                                        this.setState({ hasError: true });
                                    } else {
                                        this.setState({ btnName: value, hasError: false });
                                        this.handleChangeAttr(value)
                                    }
                                }
                            }}
                        />
                        <div className="submit-error">
                            {
                                hasError ?
                                    <span className="submit-btn-error">按钮标题长度不大于6</span> : <></>
                            }
                        </div>

                        <p htmlFor="email-title">样式类型</p>
                        <Select
                            value={buttonStyle}
                            style={{ width: "100%" }}
                            onChange={this.handleChangeStyle}
                            className="data-source-select"
                        >
                            <Option value="primary">提交类型</Option>
                            <Option value="default">默认类型</Option>
                            <Option value="danger">错误类型</Option>
                            <Option value="dashed">虚线类型</Option>
                        </Select>
                        {/* 
                        <p htmlFor="email-title">大小</p>
                        <Select
                            value={size}
                            style={{ width: "100%" }}
                            onChange={(value) => {
                                this.props.setSubmitBtn({
                                    ...this.props.submitBtnObj,
                                    size: value
                                });
                            }}
                            className="data-source-select"
                        >
                            <Option value="large">大号</Option>
                            <Option value="default">中号</Option>
                            <Option value="small">小号</Option>
                        </Select> */}

                    </div>
                </div>
            </div >
        );
    }
}

export default connect(
    store => ({
        data: store.formBuilder.data
    }),
    {
        setItemAttr,
    }
)(SubmitBtnInspector);
