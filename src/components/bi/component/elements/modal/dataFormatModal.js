import React, { useState } from "react";
import { Button, Radio, Checkbox, Input } from "antd";
import { Modal } from "../../../../shared/customWidget"
import classes from "../../../scss/modal/dataFormatModal.module.scss";
import { DataFormatType } from "../Constant";
import { getFormatter } from "../../../utils/ChartUtil"
export default function DataFormatModal(props) {
  const { custom, predefine, selectType } = props.dataFormat;
  const [modalCustom, setModalCustom] = useState(custom);
  const [modalPredefine, setModalPredefine] = useState(predefine);
  const [modalSelectType, setModalSelectType] = useState(selectType);
  const [decimalsInput, showDecimalsInput] = useState(
    !(predefine.decimals == 0)
  );
  const checkboxGroup = [
    {
      label: "千分符",
      checked: modalPredefine.thousandSymbols,
      onChange: (e) => {
        setModalPredefine({
          ...modalPredefine,
          thousandSymbols: e.target.checked,
        });
      },
    },
    {
      label: "百分比",
      checked: modalPredefine.percent,
      onChange: (e) => {
        setModalPredefine({
          ...modalPredefine,
          percent: e.target.checked,
        });
      },
    },
    {
      label: "小数位数",
      checked: decimalsInput,
      onChange: (e) => {
        showDecimalsInput(e.target.checked);
        if(!e.target.checked){
            setModalPredefine({
                ...modalPredefine,
                decimals:0
            })
        }
      },
    },
  ];
  const handleDecimalsOnchange = (e) => {
    setModalPredefine({
      ...modalPredefine,
      decimals: e.target.value,
    });
  };

  const getFormatPreview = () => {
    let showStr = 99999;
    
    return getFormatter(showStr, modalPredefine);

  };

  const checkoutType = (value) => {
    setModalSelectType(DataFormatType[value]);
  };
  const handleCustomOnchange = e => {
    setModalCustom({
        format:e.target.value
    })
  }
  const handleOk = () => {
    const newDataFormat = {
        custom:modalCustom,
        predefine:modalPredefine,
        selectType:modalSelectType,
    }
    props.handleOK(newDataFormat);
  }
  return (
    <Modal
      title={<span className={classes.modalTitle}>数据格式</span>}
      visible={true}
      closable={false}
      footer={null}
      width={500}
      bodyStyle={{ padding: 0 }}
      wrapClassName={classes.dataFormatModal}
      centered
    >
      <div className={classes.modalContent}>
        <div className={classes.itemBox}>
          <Radio
            value={DataFormatType.PREDEFINE}
            checked={modalSelectType == DataFormatType.PREDEFINE}
            onChange={(e) => {
              checkoutType(e.target.value);
            }}
          >
            预定义格式
          </Radio>
          <div className={classes.formatSetting}>
            <div className={classes.checkboxGroup}>
              {checkboxGroup.map((item) => (
                <Checkbox
                  checked={item.checked}
                  key={item.label}
                  onChange={item.onChange}
                >
                  {item.label}
                </Checkbox>
              ))}
              {decimalsInput && (
                <Input
                  value={modalPredefine.decimals}
                  onChange={handleDecimalsOnchange}
                />
              )}
            </div>
            <div className={classes.preview}>
              <span>效果预览</span>
              <span>{getFormatPreview()}</span>
            </div>
            {modalSelectType != DataFormatType.PREDEFINE && (
              <div className={classes.mask} />
            )}
          </div>
        </div>
        <div className={classes.itemBox} style={{height:60}}>
          {/* <Radio
            value={DataFormatType.CUSTOM}
            checked={modalSelectType == DataFormatType.CUSTOM}
            onChange={(e) => {
              checkoutType(e.target.value);
            }}
          >
            自定义格式
          </Radio>
          <div className={classes.formatSetting}>
            <div className={classes.custom}>
              <Input onChange={handleCustomOnchange} value={modalCustom.format}/>
            </div>
            {modalSelectType != DataFormatType.CUSTOM && (
              <div className={classes.mask} />
            )}
          </div> */}
        </div>
      </div>
      <div className={classes.footBtns}>
        <Button onClick={props.handleCancel}>取消</Button>
        <Button onClick={handleOk}>确定</Button>
      </div>
    </Modal>
  );
}
