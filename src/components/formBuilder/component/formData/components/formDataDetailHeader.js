import React from "react";
import { Button, Row, Col, List, Table, Tabs , Icon, Typography } from "antd";
import { useHistory } from "react-router-dom";
const { Title } = Typography;
const StartApprovalButton = (props) =>{
  const {isAssociateApprovalFlow , isOwnRecord, isStartApproval, startApprovelBtnClick} = props;
  let isShow = false;

  if(isAssociateApprovalFlow && isOwnRecord && !isStartApproval){
    isShow = true;
  } else{
    isShow = false;
  }
  console.log("sssss",isShow)
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
              <Title level={3}>
                <Icon type="arrow-left" onClick={onClickBack}></Icon>
              </Title>
            </Col>
            <Col>
              <Title level={3}>{title}</Title>
            </Col>
          </Row>
        </Col>
        <Col>
          <StartApprovalButton {...props}/>
        </Col>
      </Row>
    </div>
  )
}

export default FormDataDetailHeader;