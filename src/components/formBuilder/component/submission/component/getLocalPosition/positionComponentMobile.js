import React from "react";
import { isValueValid, isStringValid } from "../../../../utils/valueUtils";
import { Input, Form, Tooltip, Icon, Button } from "antd";
import PositionComponent from "./component/positionComponent";
import LabelUtils from "../../../formBuilder/preview/component/formItemDoms/utils/LabelUtils";

let AMap;

export default class PositionComponentMoblie extends React.Component {
  isInCenter = value => {
    const { validate } = this.props.item;
    const centerList = validate.centerList;
    if (centerList.length === 0) {
      //当勾选了中心
      return true;
    }
    const currentPosition = [value.longitude, value.latitude]; //填表人的当前位置
    const isInCenterList = centerList.some(center => {
      // 这是一个数组的坐标
      const centerPostion = [center.longitude, center.latitude];
      const orientationRange = center.orientationRange;
      let dis = AMap.GeometryUtil.distance(centerPostion, currentPosition);
      const isInCenter = dis < orientationRange;
      return isInCenter;
    });
    return isInCenterList;
  };
  checkCenterPosition = (rule, value, callback) => {
    console.log(value);
    const { validate } = this.props.item;
    const isLimitOrientationRange = validate.isLimitOrientationRange;
    if (isLimitOrientationRange) {
      console.log("限制范围检查");
      if (this.isInCenter(value)) {
        console.log("在设定范围内");
        callback();
      } else {
        callback("当前位置不在规定的定位范围内");
      }
    } else {
      callback();
    }
  };
  render() {
    const { getFieldDecorator, item, initData } = this.props;
    return (
      <Form.Item label={<LabelUtils data={item} />}>
        {getFieldDecorator(item.key, {
          rules: [
            {
              validator: this.checkCenterPosition
            },
            {
              required: item.validate.required,
              message: `${item.label}不能为空`
            }
          ],
          initialValue: initData,
        })(<PositionComponent item={item} />)}
      </Form.Item>
    );
  }
}
