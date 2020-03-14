import React, { Component } from "react";
import { Select, Input } from "antd";
import { Form } from "antd";

const { Option } = Select;
const { TextArea } = Input;
// let AMap;

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
    //eslint-disable-next-line
    AMap.plugin("AMap.DistrictSearch", function() {
      //eslint-disable-next-line
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
            CityData: result.districtList[0]
          },()=>{
            let { item } = that.props;
            let data = item.data;
            if(data != void 0){
              that.setState({
                county: data.county || "",
                city: data.city || "",
                province: data.province || "",
                detail: data.detail ||""
              });
              that.handleGetRightSelectedIndex(data)
            }
          });
        } else {
          console.error("城市信息获取失败！");
        }
      });
    });
  }

    // 根据地址数据改变选中的索引
    handleGetRightSelectedIndex = address => {
      let { city, province } = address;
      const { CityData } = this.state;
      let currentProvinceIndex = -1,
        currentCityIndex = -1;
      if (province && CityData && CityData.districtList) {
        currentProvinceIndex = CityData.districtList.findIndex(
          item => item.name === province
        );
      }
      if (
        currentProvinceIndex > -1 &&
        CityData &&
        CityData.districtList[currentProvinceIndex].districtList
      ) {
        currentCityIndex = CityData.districtList[
          currentProvinceIndex
        ].districtList.findIndex(item => item.name === city);
      }
      this.setState({
        currentProvinceIndex,
        currentCityIndex
      });
    };

  handleSelectedProvince = (value, ev) => {
    const index = ev.props.index;
    if (index > -1) {
      this.setState(
        {
          currentProvinceIndex: index,
          province: value,
          city: "",
          county: ""
        },
        this.handleUpdateData
      );
    }
  };

  handleSelectedCity = (value, ev) => {
    const index = ev.props.index;
    if (index > -1) {
      this.setState(
        {
          currentCityIndex: index,
          city: value,
          county: ""
        },
        this.handleUpdateData
      );
    }
  };

  handleSelectedCounty = (value, ev) => {
    this.setState(
      {
        county: value
      },
      this.handleUpdateData
    );
  };

  handleSetDetail = ev => {
    const value = ev.target.value;
    this.setState(
      {
        detail: value
      },
      this.handleUpdateData
    );
  };

  handleUpdateData = () => {
    const { province, city, county, detail } = this.state;
    const { item } = this.props;
    const newAddress = {
      province,
      city,
      county,
      detail
    };
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
    this.props.setAddress(newAddress);
  };

  render() {
    const {
      CityData,
      currentCityIndex,
      currentProvinceIndex,
      city,
      county,
      province,
      detail
    } = this.state;
    return (
      <div className="form-address">
        <div className="row">
          <Select value={province || "none"} onChange={this.handleSelectedProvince}>
            <Option value="none" disabled>
              -请选择-
            </Option>
            {CityData
              ? CityData.districtList.map((city, cityIndex) => (
                  <Option key={city.adcode} index={cityIndex} value={city.name}>
                    {city.name}
                  </Option>
                ))
              : null}
          </Select>
          <Select value={city || "none"} onChange={this.handleSelectedCity}>
            <Option value="none" disabled>
              -请选择-
            </Option>
            {currentProvinceIndex > -1
              ? CityData.districtList[currentProvinceIndex].districtList.map(
                  (city, cityIndex) => (
                    <Option
                      key={city.adcode}
                      index={cityIndex}
                      value={city.name}
                    >
                      {city.name}
                    </Option>
                  )
                )
              : null}
          </Select>
          <Select value={county || "none"} onChange={this.handleSelectedCounty}>
            <Option value="none" disabled>
              -请选择-
            </Option>
            {currentCityIndex > -1
              ? CityData.districtList[currentProvinceIndex].districtList[
                  currentCityIndex
                ].districtList.map((city, cityIndex) => (
                  <Option key={city.adcode} index={cityIndex} value={city.name}>
                    {city.name}
                  </Option>
                ))
              : null}
          </Select>
        </div>
        <div className="row">
          <TextArea
            onChange={this.handleSetDetail}
            value={detail}
            placeholder="详细地址"
            autoSize={{ minRows: 2, maxRows: 2 }}
          />
        </div>
        <div className="ant-form-explain err-message">
          <p>此字段为必填</p>
        </div>
      </div>
    );
  }
}
