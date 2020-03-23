import React from "react";
import { Button, Row, Col, List, Table, Tabs , Modal, Icon, Input } from "antd";
import { useHistory } from "react-router-dom";

import clasess from "./transactionDetail.module.scss";
const { TabPane } = Tabs;

const fields = [
  {
    key: "name",
    lable: "姓名",
    value: "王唯一"
  },
  {
    key: "phone",
    lable: "联系方式",
    value: "13667874323"
  },
  {
    key: "income",
    lable: "收入来源",
    value: "E.无固定收入"
  },
  {
    key: "investKnowledge",
    lable: "投资知识",
    value: "B.一般.对金融产品及相关风险有基本认识与理解"
  },
  {
    key: "能承受的最大损失",
    lable: "姓名",
    value: "B.10%(含)~30%"
  },
  {
    key: "experience",
    lable: "投资经验",
    value: "B.1年（含）~3年"
  }
];

const columns = [
  {
    title: "审批ID",
    dataIndex: "id"
  },
  {
    title: "环节名称",
    dataIndex: "name"
  },
  {
    title: "操作人",
    dataIndex: "operator"
  },
  {
    title: "状态",
    dataIndex: "status"
  },
  {
    title: "审批意见",
    dataIndex: "opinion"
  },
  {
    title: "日期",
    dataIndex: "dateTime"
  }
];
const data = [
  {
    key: "1",
    id: "101",
    name: "高风险客户",
    operator: "李XX",
    status: "通过",
    opinion: "风险可控",
    dateTime: new Date().toLocaleString("chinese", { hour12: false })
  }
];


const WithdrawApprovalButton = (props) =>{
// 撤回审批按钮
  const { isAllowedWithDraw, withdraw } = props;
  return (
    isAllowedWithDraw ?
    (<Button type="primary" className={clasess.btn} onClick={withdraw}>撤回</Button>)
    :<></>
  )
}

const EditApprovalButton = (props) =>{
  // 删除和编辑按钮
  // 根据页面详情页的权限展示
  const { detailAuthority, ...rest } = props;
  return (
    detailAuthority ? 
    (
      <div className={clasess.toolbarBox}>
        <span style={{cursor:'pointer'}}><Icon component={editIconSvg} {...props} style={{marginRight:5}}/>编辑</span> 
        <span style={{cursor:'pointer'}}><Icon component={deleteIconSvg} {...props} style={{marginRight:5}}/>删除</span> 
      </div>
    ):(
      <></>
    )
  )
}

const editIconSvg = (props) =>{
  return (
    <svg width="13" height="14" viewBox="0 0 13 14" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M6.62171 8.09947C6.35794 8.36546 6.01953 8.48436 5.70856 8.20083C5.44077 7.95667 5.47077 7.65206 5.73061 7.3617L11.2145 1.69796C11.488 1.43753 11.8911 1.3106 12.1657 1.56992C12.495 1.88088 12.3545 2.26219 12.0941 2.53562L6.62069 8.09838L6.62171 8.09947Z" fill="#2A7FFF"/>
      <path d="M12.0826 6.47912C12.4095 6.48877 12.5695 6.79515 12.5563 7.13582V11.7475C12.5563 12.6144 11.8536 13.317 10.9868 13.317H1.56951C0.702694 13.317 0 12.6143 0 11.7475V2.33025C0 1.46343 0.702694 0.760742 1.56951 0.760742H7.5733C8.00672 0.760742 8.35805 0.846825 8.35805 1.28024C8.35805 1.71365 8.00672 1.7723 7.5733 1.7723H1.6582C1.28592 1.7723 0.984128 2.07409 0.984128 2.44637V11.6771C0.984128 12.0494 1.28592 12.3512 1.6582 12.3512H10.8432C11.2155 12.3512 11.5173 12.0494 11.5173 11.6771V7.13582C11.472 6.80886 11.6915 6.48877 12.0185 6.47912H12.0826Z" fill="#2A7FFF"/>
    </svg>
  )
}

const deleteIconSvg = (props) =>{
  return(
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M5.4375 10.625C5.12813 10.625 4.875 10.3719 4.875 10.0625V6.8125C4.875 6.50313 5.12813 6.25 5.4375 6.25C5.74687 6.25 6 6.50313 6 6.8125V10.0625C6 10.3719 5.74687 10.625 5.4375 10.625ZM8.5625 10.625C8.25312 10.625 8 10.3719 8 10.0625V6.8125C8 6.50313 8.25312 6.25 8.5625 6.25C8.87188 6.25 9.125 6.50313 9.125 6.8125V10.0625C9.125 10.3719 8.87188 10.625 8.5625 10.625Z" fill="#2A7FFF"/>
      <path d="M13.4344 2.875H10.5V1.59375C10.5 0.715625 9.78438 0 8.90625 0H5.09375C4.21562 0 3.5 0.715625 3.5 1.59375V2.875H0.565625C0.254687 2.875 0 3.12812 0 3.4375C0 3.74688 0.254687 4 0.565625 4H2V12.0938C2 12.35 2.05 12.6 2.15 12.8359C2.24531 13.0625 2.38281 13.2672 2.55781 13.4422C2.73281 13.6172 2.93594 13.7547 3.16406 13.85C3.4 13.95 3.65 14 3.90625 14H10.0938C10.35 14 10.6 13.95 10.8359 13.85C11.0625 13.7547 11.2672 13.6172 11.4422 13.4422C11.6172 13.2672 11.7547 13.0641 11.85 12.8359C11.95 12.6 12 12.35 12 12.0938V4H13.4344C13.7453 4 14 3.74688 14 3.4375C14 3.12812 13.7453 2.875 13.4344 2.875ZM4.625 1.59375C4.625 1.33438 4.83437 1.125 5.09375 1.125H8.90625C9.16562 1.125 9.375 1.33438 9.375 1.59375V2.875H4.625V1.59375ZM10.875 12.0938C10.875 12.525 10.525 12.875 10.0938 12.875H3.90625C3.475 12.875 3.125 12.525 3.125 12.0938V4H10.875V12.0938Z" fill="#2A7FFF"/>
  </svg>)
}

const ApprovalProcessButtons = (props) =>{
  // 当前节点处理人
  // 特殊情况 多人审批 是否有人审批过？
  // 审批流程中的按钮(通过或者拒绝)
  const { isApprovalProcessor, isMultiPersonApproval, isApproved } = props;
  const [currentApproved, setCurrentApproved] = React.useState(false);
  const [approveMsg, setApproveMsg] = React.useState(false);
  const [visible, setVisible] = React.useState(false);
  const [confirmLoading, setConfirmLoading] = React.useState(false);
  const handleApproval = () =>{
    // 显示弹窗填意见
  }
  // isApprovalProcessor = true, isMultiPersonApproval = false, isApproved = false


  const handlePass = () =>{
    setCurrentApproved(true);
    setVisible(true);
  }

  const handleRefused = (e) =>{
    setCurrentApproved(false);
    setVisible(true);
  }

  const handleOk = () => {
    // 这里调用审批意见的接口
    setConfirmLoading(true);
    setTimeout(() => {
      setVisible(false);
      setConfirmLoading(false);
    }, 2000);
  };

  const handleCancel = () => {
    setVisible(false)
  };

  return (
    isApprovalProcessor ?
    (
      <>
      <Button type="danger" onClick={handleRefused} className={clasess.btn} style={{backgroundColor : "#fff",borderColor:"#fff",color:"#E71010"}}>拒绝</Button>
      <Button type="primary" onClick={handlePass} className={clasess.btn}>通过</Button>
      <Modal
          title="审批意见"
          visible={visible}
          onOk={handleOk}
          onCancel={handleCancel}
        >
          <Input.TextArea
            allowClear
            style={{resize:"none"}}
            onChange={(e)=>{setApproveMsg(e.target.value)}}
          />
      </Modal>
    </>
    ):(<></>)
  )
}

const ApprovalStatus = (props) =>{
  const { approveStatus = "going" } = props;
  switch (approveStatus) {
    case "approved":
      return (<span style={{color : "#00c39c"}}>通过</span>)
      break;
    case "refused":
      return (<span style={{color: "red"}}>已拒绝</span>)
    case "going":
        return (<span style={{color: "#ffa439"}}>进行中</span>)
    default:
      return <></>
      break;
  }
}

const TransactionDetail = (props) => {
  const [tabKey, setTabKey] =  React.useState("formDetail");
  const onClickBack = (e) => {
    props.fn(props.approvalKey)
  };

  function callback(key) {
    setTabKey(key)
  }

  let operations ={}

  switch (tabKey) {
    case "formDetail":
      {
        operations = <EditApprovalButton detailAuthority={true}/>
      }
      break;
    case "approvelFlow":
      {
        operations = <div className={clasess.approvalbox}>审批状态：<ApprovalStatus approveStatus={"going"}/></div>
      }
        break;
    default:
      {
        operations = (<></>)
      }
      break;
  }

  const ApprovalProcessButtonsOptions = {isApprovalProcessor: true, isMultiPersonApproval: false, isApproved: false}

  return (
    <div className={clasess.box}>
      <Row type="flex" justify="space-between" className={clasess.title}>
        <Col>
          <Row type="flex" align="middle" gutter={10} className={clasess.title}>
            <Col>
              <div className={clasess.title}>
                <Icon type="arrow-left" onClick={onClickBack}></Icon>
              </div>
            </Col>
            <Col>
              <div className={clasess.title}>理财产品合同审批2333</div>
            </Col>
          </Row>
        </Col>
        <Col>
          <div className={clasess.title}>
           <ApprovalProcessButtons {...ApprovalProcessButtonsOptions}/>
           <WithdrawApprovalButton  isAllowedWithDraw = {true} />
          </div>
        </Col>
      </Row>
      <Tabs className={clasess.tabsBackground} defaultActiveKey="detail" onChange={ callback } tabBarExtraContent={operations}>
        <TabPane tab="表单详情" key="formDetail">
         <List
            style={{ border: "none"}}
            bordered={true}
            itemLayout="vertical"
            dataSource={fields}
            renderItem={item => (
              <List.Item className={clasess.ListItem}>
                <Row type="flex" gutter={16}>
                  <Col className={clasess.detailTitle}>{item.lable}</Col>
                </Row>
                <Row>
                  <Col className={clasess.detailValue}>{item.value}</Col>
                </Row>
              </List.Item>
            )}
          />
        </TabPane>
        <TabPane tab="审批流水" key="approvelFlow">
          <Table
            pagination={false}
            columns={columns}
            dataSource={data}
            size="middle"
          />
        </TabPane>
      </Tabs>
    </div>
  );
};

export default TransactionDetail;
