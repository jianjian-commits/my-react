import React from "react";
import { Button, Row, Col, List, Table, Tabs , Icon } from "antd";
import { useHistory } from "react-router-dom";

const StartApprovalButton = (props) =>{
  const {isAssociateApprovalFlow , isOwnRecord, isStartApproval, startApprovelBtnClick} = props;
  let isShow = false;

  if(isAssociateApprovalFlow && isOwnRecord && !isStartApproval){
    isShow = true;
  } else{
    isShow = false;
  }
  return (
    isShow ?
      (<Button 
        type="primary" 
        onClick={()=>{
          startApprovelBtnClick()
        }}>提交审批</Button>)
      :(<></>)
  )
}



const FormDataDetailHeader = (props) =>{
  const history = useHistory();
  const onClickBack = () => {
    history.goBack();
  };
  const { title } = props; 
  return (
    <div className="FormDataDetailHeader">
      <Row type="flex" justify="space-between">
        <Col>
          <Row type="flex" align="middle" gutter={10}>
            <Col>
              <div className="title">
                <Icon type="arrow-left" onClick={onClickBack}></Icon>
              </div>
            </Col>
            <Col>
              <div className="title">{title}</div>
            </Col>
          </Row>
        </Col>
        <Col>
          <div className="title">
            <StartApprovalButton {...props}/>
          </div>
        </Col>
      </Row>
    </div>
  )
}

export default FormDataDetailHeader;