import React from "react";
import {
  Form,
  Icon,
  Tooltip,
  Spin,
  Upload,
  Button,
  message,
  Modal
} from "antd";
import LabelUtils from "../../../formBuilder/preview/component/formItemDoms/utils/LabelUtils";
import { isValueValid, isStringValid } from "../../../../utils/valueUtils";
import ImageUploadItem from "./imageUploadMobileItem";
export default class ImageUpload extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.validFunction = this.validFunction.bind(this);
  }
  validFunction = (rule, value, callback) => {
    const { required, customMessage } = this.props.item.validate;
    if (value.length === 0 && required) {
      callback(customMessage);
    }
    callback();
  };
  render() {
    const { getFieldDecorator, item, isChild, isShowTitle } = this.props;
    return (
      <Form.Item label={isShowTitle === false ? null : <LabelUtils data={item} />}>
        {isChild ? (
          <ImageUploadItem onChange={this.props.onChange} canUpload={this.state.canUpload} item={item} />
        ) : (
          getFieldDecorator(item.key, {
            rules: [
              {  required: isValueValid(item.validate.required)
                ? item.validate.required
                : false, message: "图片上传不能为空" },
              // {
              //   validator: this.validFunction
              // }
            ],
            // validateTrigger: "onSubmit"
            initialValue:[]
          })(<ImageUploadItem canUpload={this.state.canUpload} item={item} />)
        )}
      </Form.Item>
    );
  }
}
