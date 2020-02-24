import React from "react";
import { Form } from "antd";
import LabelUtils from "../../../formBuilder/preview/component/formItemDoms/utils/LabelUtils";
import { isValueValid, isStringValid } from "../../../../utils/valueUtils";
import FileUploadItem from './fileUploadMobileItemX';
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
    const { getFieldDecorator, item, isChild, isShowTitle } = this.props;
    return (
      <Form.Item label={isShowTitle === false ? null : <LabelUtils data={item} />}>
        {isChild ? <FileUploadItem onChange={this.props.onChange} item={item}/> : getFieldDecorator(item.key, {
          rules: [
            {  required: isValueValid(item.validate.required)
              ? item.validate.required
              : false, message: "文件上传不能为空" },
            // {
            //   validator: this.validFunction
            // }
          ],
          // validateTrigger: 'onSubmit',
          initialValue:[]
        })(
         <FileUploadItem type={this.props.type} item={item}/>
        )}
      </Form.Item>
    );
  }
}
