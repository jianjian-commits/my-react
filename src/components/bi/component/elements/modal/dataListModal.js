import React from "react";
import { Modal, Button, Collapse, Icon } from "antd";
import { useState } from "react";
import { push } from "connected-react-router";
import { connect } from "react-redux";
import request from "../../../utils/request";
import { DBMode } from "../../dashboard/Constant";
import classes from "../../../scss/modal/dataModal.module.scss";
import {
  setDataSource,
  clearBind
} from "../../../redux/action";
import ChangeTipModal from "./changeTipModal";
const { Panel } = Collapse;

function ModalTitle() {
  return (
    <div className={classes.formchoiceModalTitle}>
      <span>添加数据源</span>
      <span>选择图表数据源</span>
    </div>
  );
}

function DataListModal(props) {
  const [choiceFormId, setChoiceFormId] = useState("");
  const [choiceFormName, setChoiceFormName] = useState("");
  const { setVisible, setDataSource, clearBind, createChart } = props;

  const _getFormChoice = (id, name) => {
    setChoiceFormId(id);
    setChoiceFormName(name);
  };

  const onConfirm = () => {
    if (props.type == "create") {
      createChart(choiceFormId);
      setVisible(false);
      clearBind();
    } else {
      setChangeVisible(true);
    }
  };

  const [changeVisible, setChangeVisible] = useState(false);
  const changeModalProps = {
    visible: changeVisible,
    showModal: () => {
      setChangeVisible(true);
    },
    handleCancel: e => {
      setVisible(false);
      setChangeVisible(false);
    },
    handleOK: e => {
      setVisible(false);
      clearBind();
      setChangeVisible(false);

      request(`/bi/forms/${choiceFormId}`).then((res) => {
        if(res && res.msg === "success") {
          const data = res.data;
          setDataSource({id: data.formId, name: data.formName, data: data.items});
        }
      })
    }
  };

  return changeVisible ? (
    <ChangeTipModal {...changeModalProps}/>
  ) : (
    <Modal
      title={<ModalTitle />}
      visible={props.visible}
      footer={null}
      closable={false}
      centered
      width={500}
      bodyStyle={{ padding: 0 }}
      wrapClassName={classes.BIDataModal}
      handleCancel={() => {setVisible(false);}}
      handleOK={() => {setVisible(false);}}
    >
      <div className={classes.formChoiceModalContainer}>
        <div className={classes.formGroups}>
          <Collapse
            bordered={false}
            activeKey={"formList"}
            expandIcon={({ isActive }) =>
              isActive ? <Icon type="folder-open" /> : <Icon type="folder" />
            }
          >
            <Panel header={"表单列表"} key={"formList"}>
              {props.formDataArr.map(form => (
                <span
                  onClick={() => {
                    _getFormChoice(form.formId, form.formName);
                  }}
                  key={form.formId}
                  className={form.id == choiceFormId ? {backgroundColor: 'rgba(43, 129, 255, 0.1)'} : {}
                  }
                >
                  <Icon type="profile" style={{ color: "orange" }} />
                  {form.formName}
                  {form.formId == choiceFormId ? (
                    <Icon type="check-circle" theme="filled" />
                  ) : (
                    ""
                  )}
                </span>
              ))}
            </Panel>
          </Collapse>
        </div>
        <div className={classes.footBtnGroups}>
          <Button onClick={() => {setVisible(false);}}>取消</Button>
          <Button onClick={onConfirm}>确定</Button>
        </div>
      </div>
    </Modal>
  );
}

export default connect(
  store => ({
    formDataArr: store.bi.formDataArr
  }),
  {
    push,
    setDataSource,
    clearBind
  }
)(DataListModal);
