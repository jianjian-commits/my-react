import React, { Component } from 'react'
import {Button, Form} from 'antd'
import { isValueValid,isStringValid } from "../../../../../utils/valueUtils";
import LabelUtils from "../../../../formBuilder/preview/component/formItemDoms/utils/LabelUtils";


export default class PositionComponentPC extends Component {
  render() {
  const { getFieldDecorator, item } = this.props;
  return (
    <Form.Item
      label={<LabelUtils data={item} />}
    >
      {getFieldDecorator(item.key,{
        rules:[{
          required: isValueValid(item.validate.required) ? item.validate.required : false,
          message:`${item.label}不能为空`
        }],
      })(			
        <div className="localposition-container">
        <span className="loaction-tip">请在移动端打开表单获取位置信息</span>
        <Button type="dashed">
            <img src="/image/icons/location2.png" />
            获取当前位置
          </Button>
      </div>
  )}
    </Form.Item>
  );
  }
}
