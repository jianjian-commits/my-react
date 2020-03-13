import React from "react";
import { Icon, Button, Modal, InputNumber, Form, Input, message } from "antd";
import PositionCenterItem from "./positionCenterItem"

// var AMap;

export default class PositionCenterList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      center: "",
      latitude: 39.9,
      longitude: 116.39,
      orientationRange: 0,
      visible: false,
      isChangeCenterPosition: false,
      changeCenterPositionIndex: 0,
    };
    this.map = null;
    this.positionInput = React.createRef();
    this.rangeNumber = React.createRef();
  }
  

  componentDidMount() {  //组件加载后初始化地图
    //eslint-disable-next-line
    this.map = new AMap.Map("container", {
      resizeEnable: true,
      // position: [this.state.latitude, this.state.longitude]
    });

  }

  deleteItem = (index) => {
    this.props.deleteCenterPosition(index);
  }

  showModal = () => {
    this.setState({
      visible: true,
    }, () => {
      setTimeout(() => {
        this.showMap();
      }, 200)
    });
  };
  showEditModal = (index) => {
    const { center, latitude, longitude, orientationRange } = this.props.centerList[index];
    // console.log("center latitude longitutde, orientation", center, latitude, longitude, orientationRange);
    this.setState({
      center,
      latitude,
      longitude,
      orientationRange,
      visible: true,
      isChangeCenterPosition: true
    }, () => {
      setTimeout(() => {
        this.showMap({ latitude, longitude });
      }, 200)
    });


  }

  handleOk = e => {
    if (this.state.orientationRange !== 0 && this.state.center !=="") {
      const centerPosition = {
        center: this.state.center,
        latitude: this.state.latitude, //经度
        longitude: this.state.longitude, //纬度
        orientationRange: this.state.orientationRange
      }
      if (!this.state.isChangeCenterPosition) {
        //添加一个center position
        this.props.addCenterPosition(centerPosition);
      } else {
        //改变一个center position
        this.props.changeCenterPosition(centerPosition, this.state.changeCenterPositionIndex);
      }
      // 清空数据
      this.setState({
        visible: false,  //关闭模态框
        isChangeCenterPosition: false, //当前模态框的状态 是添加centerposion 还是编辑center position
        center: "",
        latitude: 39.9,
        longitude: 116.39,
        orientationRange: 0,
      });
    }else {
      message.error("定位中心和定位范围必填")
    }

  };

  handleCancel = e => {
    this.setState({
      isChangeCenterPosition: false, //当前模态框的状态 是添加centerposion 还是编辑center position
      center: "",
      latitude: 39.9,
      longitude: 116.39,
      orientationRange: 0,
    },()=>{
      this.setState({
        visible: false,  //关闭模态框
      })
    });
  };


  showMap = (position) => {
    var _this = this;
    //eslint-disable-next-line
    this.map = new AMap.Map("container", {
      resizeEnable: true,
      // position: [this.state.latitude, this.state.longitude],
      zoom: 13
    });

    if (this.state.isChangeCenterPosition) {
      //eslint-disable-next-line
      var marker = new AMap.Marker({
        //eslint-disable-next-line
        position: new AMap.LngLat(position.longitude, position.latitude),   // 经纬度对象，也可以是经纬度构成的一维数组[116.39, 39.9]
      });
      this.map.setCenter([position.longitude, position.latitude]);
      this.map.add(marker);
      marker.setMap(this.map);
    }
    //输入提示
    var autoOptions = {
      input: "tipinput"
    };
    //eslint-disable-next-line
    var auto = new AMap.Autocomplete(autoOptions);
    //eslint-disable-next-line
    var placeSearch = new AMap.PlaceSearch({
      map: this.map
    });  //构造地点查询类
    //eslint-disable-next-line
    AMap.event.addListener(auto, "select", select);//注册监听，当选中某条记录时会触发


    function select(e) {
      placeSearch.setCity(e.poi.adcode);
      placeSearch.search(e.poi.name);  //关键字查询查询
      // console.log("select", e, "name", e.poi.name);
      _this.setState({
        // center:`${e.poi.district}${e.poi.address}`,
        center: `${e.poi.name}`,
        latitude: e.poi.location.P,
        longitude: e.poi.location.Q,
      })
    }
  }

  handleChangeRange = (value) => {
    this.setState({
      orientationRange: value
    })
  }
  handleChangeCenter = (e) => {
    this.setState({
      center: e.target.value
    })
  }

  render() {
    const itemList = this.props.centerList;
    const centerList = itemList.map((item, index) => {
      return <PositionCenterItem
        item={item}
        index={index}
        key={index}
        showEditModal={this.showEditModal}
        deleteItem={this.deleteItem}
      />
    })
    return (
      <div className="position-center-list">
        {centerList}
        <Button type="primary" onClick={this.showModal} style={{ width: '100%' }} disabled={!this.props.isActive}>
          <Icon type="plus" /> 新增定位中心
        </Button>
        <Modal
          title="校验条件"
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          okText = "保存"
          cancelText = "取消"
          className="form-change-modal"
          
        >
          <div className="map-modal-container-content">
            <div id="container" style={{ width: "92%", height: 300, margin: "16px 4%" }}>
            </div>
            <div>
              <input id="tipinput"
                ref = {this.positionInput}
                className = "tip-input" 
                placeholder="请选择定位中心"
                onChange={this.handleChangeCenter}
                value={this.state.center}
                autoComplete="off" />
              <div className="range-number-warper">
              <span>定位范围</span>
              <InputNumber id="orientationRange"
                className = "" 
                ref = {this.rangeNumber}
                min={0}
                onChange={this.handleChangeRange}
                value={this.state.orientationRange} 
                autoComplete = "off" />
              <span>米</span><br/>
              <span className="orientation-range-tip">以中心为圆设置定位半径，建议范围500-1000米</span>
              </div>
            </div>
          </div>
        </Modal>
      </div>

    );
  }
}


