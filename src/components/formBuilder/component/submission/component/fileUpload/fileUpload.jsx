import React from "react";
import { Form } from "antd";
import LabelUtils from "../../../formBuilder/preview/component/formItemDoms/utils/LabelUtils";
import { isValueValid, isStringValid } from "../../../../utils/valueUtils";
import FileUploadItem from './fileUploadItem';
export default class FileUpload extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
    this.validFunction = this.validFunction.bind(this);
  }
  validFunction = (rule, value, callback) => {
    const { required, customMessage } = this.props.item.validate;
    if (value.length==0 && required) {
      callback(customMessage);
    }
    callback();
  };
  render() {
    const { getFieldDecorator, item } = this.props;
    return (
      <Form.Item
        label={
          <LabelUtils data = {item} />
        }
      >
        {getFieldDecorator(item.key, {
          rules: [
            {  required: isValueValid(item.validate.required)
              ? item.validate.required
              : false, message: item.validate.customMessage||"文件上传不能为空" },
            // {
            //   validator: this.validFunction
            // }
          ],
          // validateTrigger: 'onSubmit',
          initialValue:[]
        })(
         <FileUploadItem item={item}/>
        )}
      </Form.Item>
    );
  }
}
