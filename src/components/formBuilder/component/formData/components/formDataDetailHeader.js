import React from "react";
import { Button, Row, Col, List, Table, Tabs , Icon, Typography } from "antd";
import { useHistory } from "react-router-dom";
const { Title } = Typography;
const StartApprovalButton = (props) =>{
  const {isAssociateApprovalFlow = true , isOwnRecord = true, isStartApproval = false} = props;
  let isShow = false;
  if(isAssociateApprovalFlow && isOwnRecord && !isStartApproval){
    isShow = true;
  }
  return (
    isShow ?
      (<Button type="primary" style={{display: isShow ? "block" : "none"}}>提交审批</Button>)
      :(<></>)
  )
}



const FormDataDetailHeader = (props) =>{
  const history = useHistory();
  const onClickBack = () => {
    console.log(history);
    history.goBack();
  };
  const { title, startApprovelBtnOptions } = props; 
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
          <StartApprovalButton {...startApprovelBtnOptions}/>
        </Col>
      </Row>
    </div>
  )
}

export default FormDataDetailHeader;