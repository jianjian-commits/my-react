import React, { Component } from "react";
import { Select, Input } from "antd";
import { Form } from "antd";
import { Picker, List } from "antd-mobile";
import {
  getFormAllSubmission,
  filterSubmissionData,
  compareEqualArray
} from "../../utils/dataLinkUtils";
import LabelUtils from "../../../formBuilder/preview/component/formItemDoms/utils/LabelUtils";

const { Option } = Select;
const { TextArea } = Input;
let AMap;

export default class address extends Component {
  constructor(props) {
    super(props);
    this.state = {
      CityData: null,
      province: "", // 省
      city: "", // 市
      county: "", // 县
      detail: "", //详细地址
      currentProvinceIndex: -1, // 省索引
      currentCityIndex: -1 // 市索引
    };
  }

  componentDidMount() {
    const that = this;
    AMap.plugin("AMap.DistrictSearch", function() {
      var districtSearch = new AMap.DistrictSearch({
        // 关键字对应的行政区级别，country表示国家
        level: "中国",
        //  显示下级行政区级数，1表示返回下一级行政区
        subdistrict: 3
      });
      // 搜索所有省/直辖市信息
      districtSearch.search("中国", function(status, result) {
        // 查询成功时，result即为对应的行政区信息
        if (result.info === "OK") {
          that.setState({
            CityData: that.filterCityData(result.districtList[0].districtList)
          });
          let { initData } = that.props
            if(initData != void 0){
              that.props.handleSetAddress({
                id: item.id,
                county: initData.county || "",
                city: initData.city || "",
                province: initData.province || "",
                detail: initData.detail ||"",
                hasErr: item.validate.required
              });
              that.handleGetRightSelectedIndex(initData)
            }
        } else {
          console.error("城市信息获取失败！");
        }
      });
    });
    const { handleSetErrState, handleSetAddress, item } = this.props;
    const { form, handleSetComponentEvent } = this.props;
    if (!this.props.isChild) {
      handleSetAddress({
        id: item.id,
        county: "",
        city: "",
        province: "",
        detail: "",
        hasErr: item.validate.required
      });
    }
    if (handleSetErrState) {
      handleSetErrState(item.id, item.validate.required);
    }

    const { data } = item;
    // 是否为数据联动
    if (data && data.type === "DataLinkage") {
      const {
        conditionId, //联动条件 id(当前表单)
        linkComponentId, //联动条件 id(联动表单)
        linkDataId, //联动数据 id(联动表单)
        linkFormId //联动表单 id
      } = data.values;
      // 得到id表单的所有提交数据
      getFormAllSubmission(linkFormId).then(submissions => {
        // 根据联动表单的组件id 得到对应所有数据
        let dataArr = filterSubmissionData(submissions, linkComponentId);
        // 为需要联动的表单添加 change事件
        handleSetComponentEvent(conditionId, value => {
          let index = -1;
          // 比较dataArr中是否有与value相同的值，有的话返回对应的idnex
          // 如果change数据为数组 则进行深度比较
          if (value instanceof Array) {
            index = compareEqualArray(dataArr, value);
          } else {
            index = dataArr.indexOf(value);
          }
          // 如果存在 获得提交数据中关联字段的数据
          if (index > -1) {
            let data = filterSubmissionData(submissions, linkDataId);
            // 根据查找的idnex取得对应的关联数据
            let res = data[index];
            // 设置当前组件的数据为关联的数据
            this.handleSetDataLinkData(res);
            // 多级联动 事件派发
            this.handleEmitChange(res);
          } else {
            this.handleSetDataLinkData(undefined);
            this.handleEmitChange(undefined);
          }
        });
      });
    }
  }

  // 数据联动 设置数据
  handleSetDataLinkData = value => {
    const { handleSetAddress } = this.props;
    let { county, city, province, detail } = value ? value : {};
    const newAddress = { ...this.props.address };
    newAddress.province = province;
    newAddress.city = city;
    newAddress.county = county;
    newAddress.detail = detail;
    this.handleEmitChange(newAddress);
    handleSetAddress(newAddress);
  };

  // 如果存在回调数组，则遍历里面的函数执行
  handleEmitChange = value => {
    const { callEventArr } = this.props.item;
    if (callEventArr) {
      callEventArr.forEach(fnc => {
        fnc && fnc(value, this);
      });
    }
  };

  // 过滤请求的城市数据
  filterCityData = data => {
    return data.map(city => {
      return {
        label: city.name,
        value: city.name,
        children: Array.isArray(city.districtList)
          ? this.filterCityData(city.districtList)
          : []
      };
    });
  };

  handleSelectedCounty = value => {
    this.SetAddress("array", value);
  };

  handleSetDetail = ev => {
    const value = ev.target.value;
    this.SetAddress("detail", value);
  };

  SetAddress = (type, value) => {
    const { handleSetAddress, item, address } = this.props;
    let newAddress = { ...address };
    if (type === "array") {
      const [province, city, county] = value;
      newAddress = {
        ...newAddress,
        province,
        city,
        county
      };
    } else {
      newAddress[type] = value;
    }
    const { province, city, county, detail } = newAddress;
    if (item.validate.required) {
      if (province && city && county) {
        if (item.addressType === "hasDetail") {
          detail === ""
            ? (newAddress.hasErr = true)
            : (newAddress.hasErr = false);
        } else {
          newAddress.hasErr = false;
        }
      } else {
        newAddress.hasErr = true;
      }
    } else {
      newAddress.hasErr = false;
    }

    this.handleEmitChange(newAddress);
    handleSetAddress(newAddress);
  };

  // 如果存在回调数组，则遍历里面的函数执行
  handleEmitChange = value => {
    const { callEventArr } = this.props.item;
    if (callEventArr) {
      callEventArr.forEach(fnc => {
        fnc && fnc(value, this);
      });
    }
  };

  render() {
    const { item, showAddressErr, address, isShowTitle } = this.props;
    const { city = "", county = "", province = "", detail = "", hasErr } =
      address || {};
    const { CityData } = this.state;

    let classess =
      item.validate.required && showAddressErr && hasErr
        ? "form-address has-error"
        : "form-address";
    return (
      <Form.Item
        label={isShowTitle === false ? null : <LabelUtils data={item} />}
      >
        <div className={classess}>
          <div className="row mobile">
            <Picker
              extra={province ? province + city + county : "请选择省份/城市/区"}
              data={CityData}
              onOk={this.handleSelectedCounty}
              className="address-picker-mobile"
            >
              <List.Item
                className="mobile-list-default"
                arrow="down"
              ></List.Item>
            </Picker>
          </div>
          {this.props.item.addressType === "noDetail" ? (
            <></>
          ) : (
            <div className="row mobile detail">
              <p className="address-detail">详细地址</p>
              <TextArea
                onChange={this.handleSetDetail}
                autoSize={{ minRows: 3, maxRows: 3 }}
                style={{ paddingLeft: 0 }}
                value={detail}
              />
            </div>
          )}
          <div className="ant-form-explain err-message">
            <p>此字段为必填</p>
          </div>
        </div>
      </Form.Item>
    );
  }
}
