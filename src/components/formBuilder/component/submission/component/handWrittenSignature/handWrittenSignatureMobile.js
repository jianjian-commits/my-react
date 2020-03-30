import React from "react";
import { Form, Icon, Tooltip, Spin, Modal, Button, message } from "antd";

import LabelUtils from "../../../formBuilder/preview/component/formItemDoms/utils/LabelUtils";
export default class HandWrittenSignatureMobile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      imgStr: props.value != void 0 ? props.value.url : null,
      mousePressed: false,
      lastX: 0,
      lastY: 0,
      offsetLeft: 0,
      offsetTop: 0,
      isMobile: true,
      isShowModal: false
    };
    this.canvas = React.createRef();
  }

  _resetCanvasParentAndCanvasStyle(canvasParent, canvas, width, height) {
    if (width > height) {
      let canvasHeight = height - 108;

      canvasParent.style.width = width;
      canvasParent.style.height = height;
      canvasParent.style.top = 0;
      canvasParent.style.left = 0;
      canvasParent.style.transform = "none";
      canvasParent.style.transformOrigin = "50% 50%";

      canvas.height = canvasHeight;
      canvas.width = width;
      canvas.style.height = canvasHeight;
      canvas.style.width = width;

      this.ctx.rotate((0 * Math.PI) / 180);
    } else {
      let canvasHeight = width - 108;

      canvasParent.style.width = height;
      canvasParent.style.height = width;
      canvasParent.style.top = (height - width) / 2;
      canvasParent.style.left = 0 - (height - width) / 2;
      canvasParent.style.transform = "rotate(90deg)";
      canvasParent.style.transformOrigin = "50% 50%";

      canvas.height = canvasHeight;
      canvas.width = height;
      canvas.style.height = canvasHeight;
      canvas.style.width = height;

      this.ctx.rotate((-90 * Math.PI) / 180);
      this.ctx.translate(-(canvasHeight + 60), 50);
    }
  }

  componentDidMount() {
    this.InitCanvas();

    var evt = "onorientationchange" in window ? "orientationchange" : "resize";

    window.addEventListener(
      evt,
      () => {
        let windowWidth = document.documentElement.clientWidth;
        let windowHeight = document.documentElement.clientHeight;
        let canvas = this.refs.canvas;
        let canvasParent = document.getElementById("canvasParent");

        let width = windowHeight;
        let height = windowWidth;

        this._resetCanvasParentAndCanvasStyle(
          canvasParent,
          canvas,
          width,
          height
        );
      },
      false
    );
  }
  resize(canvas) {
    var width = document.documentElement.clientWidth;
    var height = document.documentElement.clientHeight;
    let canvasParent = document.getElementById("canvasParent");

    this._resetCanvasParentAndCanvasStyle(canvasParent, canvas, width, height);
  }
  // 初始画板
  InitCanvas = () => {
    let canvas = this.refs.canvas;
    this.ctx = canvas.getContext("2d");
  };
  // pc端手写
  Draw(x, y, isDown) {
    if (isDown) {
      this.ctx.beginPath();
      this.ctx.strokeStyle = "black";
      this.ctx.lineWidth = 1;
      this.ctx.lineJoin = "round";
      this.ctx.moveTo(this.state.lastX, this.state.lastY);
      this.ctx.lineTo(x, y);
      this.ctx.closePath();
      this.ctx.stroke();
    }
    this.setState({
      lastX: x,
      lastY: y
    });
  }
  DrawBegin = e => {
    this.setState({
      mousePressed: true
    });
    this.Draw(
      e.pageX - this.refs.canvas.offsetLeft,
      e.pageY - this.refs.canvas.offsetTop,
      false
    );
  };
  Drawing = e => {
    if (this.state.mousePressed) {
      this.Draw(
        e.pageX - this.refs.canvas.offsetLeft,
        e.pageY - this.refs.canvas.offsetTop,
        true
      );
    }
  };
  DrawEnd = () => {
    this.setState({
      mousePressed: false
    });
  };
  // 移动端手写
  DrawBeginPh = e => {
    if (e.targetTouches.length === 1) {
      let touch = e.targetTouches[0];
      this.setState({
        mousePressed: true
      });
      this.Draw(
        touch.pageX - this.refs.canvas.offsetLeft,
        touch.pageY - this.refs.canvas.offsetTop,
        false
      );
    }
  };
  DrawingPh = e => {
    if (e.targetTouches.length === 1) {
      let touch = e.targetTouches[0];
      if (this.state.mousePressed) {
        this.Draw(
          touch.pageX - this.refs.canvas.offsetLeft,
          touch.pageY - this.refs.canvas.offsetTop,
          true
        );
      }
    }
  };
  DrawEndPh = e => {
    if (e.targetTouches.length === 1) {
      e.preventDefault();
      this.setState({
        mousePressed: false
      });
    }
  };
  // 清空画板
  ClearPath = e => {
    e.preventDefault();

    var width = document.documentElement.clientWidth;
    var height = document.documentElement.clientHeight;

    if (width > height) {
      this.ctx.clearRect(-50, -50, height * 2, width * 2);
    } else {
      this.ctx.clearRect(-50, -50, width * 2, height * 2);
    }
  };
  // 保存图片
  SaveToImage = e => {
    e.preventDefault();
    const { onChange } = this.props;
    let image = this.refs.canvas.toDataURL("image/png");

    this.setState(
      {
        imgStr: image
      },
      () => {
        document.getElementById("canvasParent").style.display = "none";
      }
    );
    onChange({
      name: "签名",
      url: image
    });
  };

  handleCancel(e) {
    e.preventDefault();

    // this.ctx.setTransform(1, 0, 0, 1, 0, 0);

    var width = document.documentElement.clientWidth;
    var height = document.documentElement.clientHeight;

    if (width > height) {
      this.ctx.clearRect(-50, -50, height * 2, width * 2);
    } else {
      this.ctx.clearRect(-50, -50, width * 2, height * 2);
    }
    document.getElementById("canvasParent").style.display = "none";
  }

  render() {
    let { item } = this.props;
    return (
      <>
        <Button
          className="signature-btn"
          onClick={() => {
            document.getElementById("canvasParent").style.display = "flex";
            let canvas = this.refs.canvas;

            this.resize(canvas);
          }}
          type="dashed"
        >
          <img src="/image/icons/writtensign2.png" /> 手写签名
        </Button>
        <div id="canvasParent" style={{ display: "none" }}>
          <div className="canvas-header">
            <span className="canvas-back" onClick={e => this.handleCancel(e)}>
              <Icon type="left" />
            </span>
            手写签名
          </div>
          <canvas
            key={"myCanvasKey"}
            id="myCanvas"
            ref="canvas"
            onTouchStart={this.DrawBeginPh}
            onTouchMove={this.DrawingPh}
            onTouchEnd={this.DrawEndPh}
          ></canvas>
          <div className="canvas-operate">
            <Button type="primary" onClick={this.ClearPath}>
              清空画板
            </Button>
            <Button type="primary" onClick={this.SaveToImage}>
              保存
            </Button>
          </div>
        </div>
        {this.state.imgStr == void 0 ? (
          <></>
        ) : (
          <div className="canvas-result-content">
            <img className="canvas-result" src={this.state.imgStr} alt="图片" />
          </div>
        )}
      </>
    );
  }
}
