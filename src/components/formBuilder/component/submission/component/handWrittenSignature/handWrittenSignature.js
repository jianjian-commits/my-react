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
import { isValueValid } from "../../../../utils/valueUtils";
import HandWrittenSignatureMobile from './handWrittenSignatureMobile';
export default class HandWrittenSignature extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
    };
  }

  checkImg = (rule, value, callback)=>{
    let valueObj = value;
    if(this.props.item.validate.required && Object.is((typeof valueObj).toString(),"undefined")){
      callback(` `)
    }else{
      callback()
    }
  }

  render() {
    
    const { getFieldDecorator, item } = this.props;
    return (
      <Form.Item label={<LabelUtils data={item} />}>
        {getFieldDecorator(item.key,{
          rules:[
            {
              required: isValueValid(item.validate.required)
                  ? item.validate.required
                  : false,
              message:"此字段为必填"
            },{
              validator:this.checkImg
            }
          ]
        })(
          <HandWrittenSignatureMobile {...item}/>
        )}
      </Form.Item>
    );
  }
}
