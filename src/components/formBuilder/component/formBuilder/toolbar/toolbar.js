import React from "react";
import ToolbarItem from "./component/tollbarItem";
import ID from "../../../utils/UUID";
// import store from '../../../stores/store';
import { connect } from "react-redux";
import ToolHeader from "./component/toolbarHeader";

// 基础组件
export const basicComponentsArray = [
  _buildDefaultProp({
    label: "单行文本",
    tooltip: "",
    type: "SingleText",
    defaultValue: "",
    unique: false,
    validate: {
      required: false,
      customMessage: "",
      maxLength: Number.MAX_SAFE_INTEGER,
      minLength: 0,
      isLimitLength: false
    },
    data: {
      type: "custom"
    },
    icon: ["text", 16]
  }),
  _buildDefaultProp({
    label: "多行文本",
    tooltip: "",
    type: "TextArea",
    defaultValue: "",
    unique: false,
    rows: 2,
    validate: {
      required: false,
      customMessage: "",
      isLimitLength: false,
      maxLength: Number.MAX_SAFE_INTEGER,
      minLength: 0
    },
    data: {
      type: "custom"
    },
    icon: ["textarea", 16]
  }),
  _buildDefaultProp({
    label: "单选",
    tooltip: "",
    type: "RadioButtons",
    validate: {
      required: false,
      customMessage: ""
    },
    icon: ["radio", 14],
    values: [{ value: "选项", label: "选项" }],
    inline: false
  }),
  _buildDefaultProp({
    label: "多选",
    tooltip: "",
    type: "CheckboxInput",
    validate: {
      required: false,
      customMessage: "",
      isLimitLength: false,
      maxOptionNumber: Number.MAX_SAFE_INTEGER,
      minOptionNumber: 0
    },
    values: [
      {
        value: "选项",
        label: "选项"
      }
    ],
    icon: ["checkbox", 16]
  }),
  _buildDefaultProp({
    label: "下拉单选",
    tooltip: "",
    type: "DropDown",
    validate: {
      required: false,
      customMessage: ""
    },
    icon: ["dropdown", 16],
    data: {
      type: "custom",
      values: [
        {
          value: "选项",
          label: "选项"
        }
      ]
    }
  }),
  _buildDefaultProp({
    label: "下拉多选",
    tooltip: "",
    type: "MultiDropDown",
    validate: {
      required: false,
      customMessage: "",
      isLimitLength: false,
      maxOptionNumber: Number.MAX_SAFE_INTEGER,
      minOptionNumber: 0
    },
    icon: ["check_dropdown", 16],
    data: {
      type: "custom",
      values: [
        {
          value: "选项",
          label: "选项"
        }
      ]
    }
  }),
  _buildDefaultProp({
    inputType: "NumberInput",
    label: "数字",
    tooltip: "",
    type: "NumberInput",
    defaultValue: "",
    unique: false,
    validate: {
      required: false,
      customMessage: "",
      isLimitLength: false,
      max: Number.MAX_VALUE,
      min: -Number.MAX_VALUE
    },
    data: {
      type: "custom"
    },
    icon: ["number", 19]
  })
];
//----------------------------------------------------------
// 高级组件
export const advancedComponentArray = [
  _buildDefaultProp({
    label: "子表单",
    tooltip: "",
    type: "FormChildTest",
    validate: {
      required: false
    },
    data: {
      type: "custom"
    },
    values: [],
    icon: ["form", 17]
  }),
  _buildDefaultProp({
    label: "时间/日期",
    tooltip: "",
    type: "DateInput",
    defaultValue: "",
    validate: {
      required: false,
      customMessage: ""
    },
    data: {
      type: "custom"
    },
    icon: ["date", 17]
  }),
  _buildDefaultProp({
    label: "Email",
    tooltip: "",
    unique: false,
    type: "EmailInput",
    defaultValue: "",
    validate: {
      required: false,
      customMessage: ""
    },
    data: {
      type: "custom"
    },
    icon: ["email", 18]
  }),
  _buildDefaultProp({
    label: "手机号",
    tooltip: "",
    type: "PhoneInput",
    defaultValue: "",
    unique: false,
    validate: {
      required: false,
      customMessage: ""
    },
    data: {
      type: "custom"
    },
    icon: ["phone", 16]
  }),
  _buildDefaultProp({
    label: "定位",
    tooltip: "",
    type: "GetLocalPosition",
    validate: {
      required: false,
      customMessage: "",
      isLimitOrientationRange: false, //是否限定范围
      isAdjustmentRange: false, //是否微调
      adjustmentRange: 5000, // 微调范围
      centerList: [
        // {
        //   'center': "北京", //中心的地址
        //   'latitude':0, //经度
        //   'longitude':0, //纬度
        //   'orientationRange': 0 //范围 单位m
        // }
      ]
    },
    icon: ["location", 17]
  }),
  _buildDefaultProp({
    label: "身份证号码",

    tooltip: "",
    type: "IdCardInput",
    defaultValue: "",
    unique: false,
    validate: {
      required: false,
      customMessage: ""
    },
    icon: ["idcard", 23]
  }),
  _buildDefaultProp({
    label: "图片上传",
    tooltip: "",
    type: "ImageUpload",
    storage: "base64",
    validate: {
      fileSize: 2,
      fileUnit: "MB",
      fileCount: 1,
      required: false,
      customMessage: ""
    },
    icon: ["image", 16]
  }),
  // _buildDefaultProp({
  //   inputFormat: "plain",
  //   label: '子表单',
  //   tooltip: "",
  //   type: "FormChild",
  //   defaultValue: "",
  //   unique: false,
  //   childForm:"",
  //   validate: {
  //     required: false,
  //     customMessage: "",
  //   },
  //   icon: ['form', 16],
  // }),
  _buildDefaultProp({
    label: "附件",
    tooltip: "",
    type: "FileUpload",
    storage: "base64",
    validate: {
      required: false,
      customMessage: "",
      fileSize: 2,
      fileUnit: "MB",
      fileCount: 1
    },
    icon: ["file", 18]
  }),
  _buildDefaultProp({
    label: "手写签名",
    tooltip: "",
    type: "HandWrittenSignature",
    validate: {
      required: false,
      customMessage: ""
    },
    icon: ["writtensign", 16]
  }),
  _buildDefaultProp({
    label: "地址",
    tooltip: "",
    type: "Address",
    addressType: "hasDetail",
    validate: {
      required: false,
      customMessage: ""
    },
    data: {
      type: "custom"
    },
    icon: ["address", 18]
  }),
  _buildDefaultProp({
    label: "嵌套表单",
    tooltip: "",
    type: "ComponentTemplate",
    validate: {
      required: false,
      customMessage: ""
    },
    icon: ["tmpForm", 20]
  }),
  _buildDefaultProp({
    label: "按钮",
    tooltip: "",
    type: "Button",
    buttonStyle: "primary",
    buttonSize: "default",
    icon: ["tmpForm", 20]
  })
];

function _buildDefaultProp(customProps) {
  return {
    ...customProps,
    autofocus: false,
    hidden: false,
    input: true
  };
}

class Toolbar extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      basicComponentsArray,
      advancedComponentArray,
      store: props.data
    };

    this.create = this.create.bind(this);
  }

  create(item) {
    let key = ID.uuid(item.type);

    let elementOptions = {
      ...item,
      id: key,
      key: key,
      isShow: true,
      layout: { i: key, x: 0, y: 0, w: 10, h: 3, minH: 2, minW: 2 },
      element: item.type
    };

    return elementOptions;
  }

  render() {
    return (
      <div className="react-form-builder-toolbar">
        <ToolHeader icon={["basic", 16]} text="基础组件" />
        <ul className="tool-wrap">
          {this.state.basicComponentsArray.map((item, i) => (
            <ToolbarItem
              data={item}
              key={`toolbarItem${i}`}
              onCreate={this.create}
            />
          ))}
        </ul>

        <ToolHeader icon={["advanced", 17]} text="高级组件" />
        <ul className="tool-wrap">
          {this.state.advancedComponentArray.map((item, i) => (
            <ToolbarItem
              data={item}
              key={`toolbarItem${i}`}
              onCreate={this.create}
            />
          ))}
        </ul>
      </div>
    );
  }
}

export default connect(
  store => ({
    data: store.formBuilder
  }),
  {}
)(Toolbar);
