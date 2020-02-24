import React, { Component } from "react";
import { Input, Form, Tooltip, Icon, Button, Modal } from "antd";

let AMap;

export default class PositionComponent extends Component {
  static getDerivedStateFromProps(nextProps) {
    // Should be a controlled component.
    if ("value" in nextProps) {
      return {
        ...(nextProps.value || {})
      };
    }
    return null;
  }

  constructor(props) {
    super(props);
    const value = this.props.value || "";
    this.state = {
      address: value,
      isShowAddressWrapper: false,
      errorMsg: "",
      latitude: 0,
      longitude: 0,
      changedAdress: "",
      changedLatitude: 0,
      changedLongtitude: 0,
      isPositionModalVisible: false,
      showErrorBorder: false,

      showMapContainer: false
    };
    this.map = null;
    this.geolocation = null;
    this.geocoder = null;
    this.marker = null;
    this.mapList = React.createRef();

    AMap.plugin("AMap.Geolocation", () => {
      this.geolocation = new AMap.Geolocation({
        enableHighAccuracy: true, //是否使用高精度定位，默认:true
        zoomToAccuracy: true, //定位成功后是否自动调整地图视野到定位点
        timeout: 5000
      });
    });
  }

  componentDidMount() {
    this.map = new AMap.Map("map-container", {
      resizeEnable: true,
      zoom: 14
    });
    this.lnglat = this.map.getCenter();

    this.map.on("complete", () => {
      // this.map.on("click", (e)=>{this.showInfoClick(this.map,this.lnglat,e)});
      this.map.setZoomAndCenter(14, this.lnglat);
      this.marker = new AMap.Marker({
        position: this.lnglat
      });
      // console.log("marker", this.marker,this.lnglat);
      this.marker.setMap(this.map);
      this.map.setFitView();
    });
    this.geocoder = new AMap.Geocoder();
  }

  componentWillUnmount() {
    // this.map.destory();
  }
  onComplete = data => {
    // var lnglat = data.position;
    this.lnglat = data.position; //定位成功后 重新设置 lnglat;
    if (this.props.item.validate.isAdjustmentRange) {
      this.showMap();
    }
    this.getAddress();
  };

  getAddress = () => {
    this.geocoder.getAddress(this.lnglat, (status, result) => {
      if (status === "complete" && result.regeocode) {
        var address = result.regeocode.formattedAddress;
        this.setState({
          address,
          latitude: this.lnglat.lat, //这块有问题？？
          longitude: this.lnglat.lng
        });

        this.props.onChange({
          address,
          latitude: this.lnglat.lat,
          longitude: this.lnglat.lng
        });
      } else {
        this.setState({
          address,
          errorMsg: "查询地址失败"
        });
        this.props.onChange({
          address: "",
          latitude: this.lnglat.lat,
          longitude: this.lnglat.lng
        });
        console.error("根据经纬度查询地址失败");
      }
    });
  };

  onError = data => {
    this.setState({
      errorMsg: `定位失败，${data.message}`
    });
    this.props.onChange({ address: "", latitude: 39, longitude: 106 });
  };

  handleGetLocalPosition = () => {
    this.setState({
      isShowAddressWrapper: true,
      errorMsg: ""
    });
    this.props.onChange({ address: "", latitude: 39, longitude: 106 });
    this.geolocation.getCurrentPosition((status, result) => {
      if (status === "complete") {
        this.onComplete(result);
      } else {
        this.onError(result);
      }
    });
  };

  showMapList = () => {
    this.setState(
      {
        showMapContainer: true
      },
      () => {
        var displayWidth = window.screen.width;
        var displayHeight = window.screen.height;
        this.refs.mapList.style.width = displayWidth;
        this.refs.mapList.style.height = displayHeight;
        this.refs.mapList.style.zIndex = 100;
        // this.showPositionList();
        this.handleGetLocalPosition();
      }
    );
  };
  toggleAddressWrapper = () => {
    this.setState({
      changedAdress: "",
      changedLatitude: 0,
      changedLongtitude: 0,
      isShowAddressWrapper: !this.state.isShowAddressWrapper
    });
    this.props.onChange({ address: "", latitude: 39, longitude: 106 });
  };

  showInfoClick = e => {
    // console.log("show 可选列表")
    // console.log("e", e);
    this.setState(
      {
        isPositionModalVisible: true
      },
      () => {
        this.showPositionList();
      }
    );
  };

  showPositionList = () => {
    let adjustmentRange = this.props.item.adjustmentRange;
    let rangeNumber = adjustmentRange;
    AMap.service(["AMap.PlaceSearch"], () => {
      //构造地点查询类
      var placeSearch = new AMap.PlaceSearch({
        pageSize: 5, // 单页显示结果条数
        pageIndex: 1, // 页码
        map: this.map, // 展现结果的地图实例
        panel: "panel", // 结果列表将在此容器中进行展示。
        // autoFitView: true // 是否自动调整地图视野使绘制的 Marker点都处于视口的可见范围
        extensions: "base"
      });
      AMap.event.addListener(
        placeSearch,
        "listElementClick",
        this.clickPositionItem
      );
      AMap.event.addListener(
        placeSearch,
        "markerClick",
        this.clickPositionMarker
      );
      placeSearch.searchNearBy(
        "",
        this.lnglat,
        rangeNumber,
        (status, result) => {
          // console.log("searchNearBy result",result)
          // console.log("searchNearBy status",status)
        }
      );
    });
  };

  clickPositionItem = data => {
    const { address, location } = data.data;
    this.setState(
      {
        //修改后的位置
        changedAdress: address,
        changedLatitude: location.lat,
        changedLongtitude: location.lng
      },
      () => {
        this.props.onChange({
          address,
          latitude: location.lat,
          longitude: location.lng
        });
      }
    );
  };

  clickPositionMarker = e => {
    console.log("clicckPosition", e);
    this.setState(
      {
        //修改后的位置
        changedAdress: e.data.address,
        changedLatitude: e.data.location.lat,
        changedLongtitude: e.data.location.lng
      },
      () => {
        this.props.onChange({
          address: e.data.address,
          latitude: e.data.location.lat,
          longitude: e.data.location.lng
        });
      }
    );
  };
  showMap = () => {
    this.marker.setPosition(this.lnglat);
    // var circle = new AMap.Circle({
    //   center: this.lnglat, // 圆心位置
    //   radius: this.props.item.adjustmentRange,  //半径 单位m
    //   strokeColor: "#F33",  //线颜色
    //   strokeOpacity: 1,  //线透明度
    //   strokeWeight: 3,  //线粗细度
    //   fillColor: "#ee2200",  //填充颜色
    //   fillOpacity: 0.35 //填充透明度
    // });
    // circle.on("click", this.showInfoClick);
    // this.map.setZoomAndCenter(14, this.lnglat);
    // this.map.add(circle);
    // this.showInfoClick();
    this.showPositionList();
    this.map.setFitView();
  };

  handleCloseMapList = () => {
    this.setState({
      showMapContainer: false,
      isShowAddressWrapper: true
    });
  };

  renderAjustmentRangePositionNode = () => {
    let address =
      this.state.changedLatitude === 0
        ? this.state.address
        : this.state.changedAdress;

    return (
      <div className="localposition-container">
        <div
          className="ajustment-position-warpper"
          style={{ display: this.state.isShowAddressWrapper ? "flex" : "none" }}
        >
          <div className="address-wrapper">
            <div className="address">
              {address === "" && this.state.errorMsg == ""
                ? "正在定位..."
                : address}
            </div>
            <div className="err-msg">{this.state.errorMsg}</div>
            <span className="clear-btn" onClick={this.toggleAddressWrapper}>
              清空地址
            </span>
          </div>
        </div>
        <Button type="dash" onClick={this.showMapList}>
          <img src="/image/icons/location2.png" />
          获取当前位置
        </Button>
        <div
          id="positionParent"
          style={{
            display: this.state.showMapContainer ? "block" : "none",
            ZIndex: "100"
          }}
        >
          <div className="position-list-map-container" ref="mapList">
            <div>
              <Icon
                className="map-back-icon"
                type="left"
                onClick={this.handleCloseMapList}
              />
              <span className="map-title">定位</span>
            </div>
            <div className="map-container-wapper">
              <div id="map-container" className="map-container"></div>
            </div>
            <div id="panel" className="posi-list-container"></div>
          </div>
        </div>
      </div>
    );
  };
  renderDisableAjustmentRangePositionNode = () => {
    return (
      <div className="localposition-container">
        <div className="disable-ajustmentrange-position-container">
          <div
            className="address-wrapper"
            style={{
              display: this.state.isShowAddressWrapper ? "block" : "none"
            }}
          >
            <div className="address">
              {this.state.address === "" && this.state.errorMsg == ""
                ? "正在定位..."
                : this.state.address}
            </div>
            <div className="err-msg">{this.state.errorMsg}</div>
            <span className="clear-btn" onClick={this.toggleAddressWrapper}>
              清空地址
            </span>
          </div>
          <Button type="dash" onClick={this.handleGetLocalPosition}>
            <img src="/image/icons/location2.png" />
            获取当前位置
          </Button>
        </div>
      </div>
    );
  };
  render() {
    const { isAdjustmentRange } = this.props.item.validate;
    let positionNode = "";
    if (isAdjustmentRange) {
      positionNode = this.renderAjustmentRangePositionNode();
    } else {
      positionNode = this.renderDisableAjustmentRangePositionNode();
    }

    return <React.Fragment>{positionNode}</React.Fragment>;
  }
}
