import React from "react";
import { Modal, Button, Collapse, Icon } from "antd";
import { useState } from "react";
import classNames from "classnames";
import "./modal.scss";
import { push } from "connected-react-router";
import {connect} from "react-redux";

const { Panel } = Collapse;

const formFileGroups = [
  {
    fileName: "基础设置",
    key: "basicSetting",
    formList: [
      {
        name:
          "车队信息",
        id: "SSw"
      },
      {
        name: "油卡信息",
        id: "Jub"
      }
    ]
  },
  {
    fileName: "用车管理",
    key: "carManagerment",
    formList: [
      {
        name: "车队信息",
        id: "WES"
      },
      {
        name: "油卡信息",
        id: "dv1"
      }
    ]
  },
  {
    fileName: "配件管理",
    key: "partsManagerment",
    formList: [
      {
        name: "车队信息",
        id: "WES"
      },
      {
        name: "油卡信息",
        id: "dv1"
      }
    ]
  },
  {
    fileName: "燃料管理",
    key: "fuelManagerment",
    formList: [
      {
        name: "车队信息",
        id: "WES"
      },
      {
        name: "油卡信息",
        id: "dv1"
      }
    ]
  }
];

function ModalTitle() {
  return (
    <div className="formchoiceModalTitle">
      <span>添加数据源</span>
      <span>选择图表数据源</span>
    </div>
  );
}

function CreatChartModal(props) {

  const [choiceFormId,setChoiceFormId] = useState("");

  const _getFormChoice = id => {
    setChoiceFormId(id);
  };

  return (
    <Modal
      title={<ModalTitle />}
      visible={props.visible}
      footer={null}
      closable={false}
      centered
      width={500}
      bodyStyle={{padding:0}}
      wrapClassName="BImodal"
    >
      <div className="formChoiceModalContainer">
        <div className="formGroups">
          <Collapse
            bordered={false}
            // defaultActiveKey={["1"]}
            expandIcon={({ isActive }) =>
              isActive ? <Icon type="folder-open" /> : <Icon type="folder" />
            }
          >
            {formFileGroups.map(formFile => {
              return (
                <Panel header={formFile.fileName} key={formFile.key}>
                  {formFile.formList.map(form => (
                    <span
                      onClick={() => {
                        _getFormChoice(form.id);
                      }}
                      key={form.id}
                      className={classNames({activeSpan:form.id==choiceFormId})}
                    >
                      <Icon type="file-text" />
                      {form.name}
                      {form.id==choiceFormId?<Icon type="check-circle" theme="filled" />:""}
                    </span>
                  ))}
                </Panel>
              );
            })}
          </Collapse>
        </div>
        <div className="footBtnGroups">
          <Button onClick={props.handleCancel}>取消</Button>
          <Button onClick={()=>{
            props.push(props.url);
          }}>确定</Button>
        </div>
      </div>
    </Modal>
  );
}

export default connect(store => ({
}),{push})(CreatChartModal);