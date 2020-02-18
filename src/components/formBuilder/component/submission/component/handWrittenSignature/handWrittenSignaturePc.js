import React from "react";
import { Form, Icon, Tooltip, Spin, Upload, Button, message } from "antd";

import LabelUtils from "../../../formBuilder/preview/component/formItemDoms/utils/LabelUtils"
export default class HandWrittenSignaturePc extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }
  render() {
    const { getFieldDecorator, item } = this.props;
    let errMsg = this.props.item.validate.customMessage;
    return (
      <Form.Item
        label={
          <LabelUtils data={item} />
        }
      >
        {getFieldDecorator(item.key, {
          rules: [
            {
              validator: this.validFunction
            }
          ]
        })(
          <div className="localposition-container">
            <span className="loaction-tip">请在移动端打开表单添加签名</span>
            <Button type="dashed">
              <img src="/image/icons/writtensign2.png" />
              添加签名
            </Button>
          </div>
        )}
      </Form.Item>
    );
  }
}
