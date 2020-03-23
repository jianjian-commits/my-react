import React, { useEffect } from "react";
import { Button, Row, Col, List, Table, Tabs , Modal, Icon, Input, message } from "antd";
import { useParams } from "react-router-dom";
import request from "../../utils/request";
import { EditIcon, DeleteIcon }from './svgIcon/index'

import clasess from "./transactionDetail.module.scss";
const { TabPane } = Tabs;

const fakeFields = [
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
const fakeData = [
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
  return (
      <div className={clasess.toolbarBox}>
        <span><Icon component={EditIcon} style={{marginRight:5}}/>编辑</span> 
        <span><Icon component={DeleteIcon} style={{marginRight:5}}/>删除</span> 
      </div>
  )
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
      postApproveMsg()
    }, 2000);
  };

  const handleCancel = () => {
    setVisible(false)
  };

  async function postApproveMsg(){
    setVisible(false);
    setConfirmLoading(false);
    try{
      console.log("approveMsg", approveMsg)
      const res = await request("/sysRole/list",{
        // headers:{
        //   appid: appId
        // }
        // method: "post",
        // data: { approveMsg}
      });
      if (res && res.status === "SUCCESS") {
        // setTransactList(res.data)
        // setTransactList(data)
      } else {
        message.error("提交审批意见失败");
      }
    } catch (err) {
      message.error("提交审批意见失败");
    }
  }



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
          confirmLoading={confirmLoading}
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
  const { appId } = useParams();
  const [currentDetailId ,setCurrentDetailId] = React.useState(props.currentDetailId);
  const [tabKey, setTabKey] =  React.useState("formDetail");
  const [fields, setFields] = React.useState([]);
  const [approveStatus, setApproveStatus] = React.useState("going")
  const [approvalData, setApprovalData] = React.useState([]);
  useEffect(() => {
    getTransactionDetail();
  }, [fields, approvalData]);

  async function getTransactionDetail() {
    try {
      // const res = await request("/sysRole/list");
      const res = {status: "SUCCESS"};
      if (res && res.status === "SUCCESS") {
        // setFields(res.data.fields)
        // setApprovalData(res.data.approvalData)
        setFields(fakeFields)
        setApprovalData(fakeData)
      } else {
        message.error("获取审批详情失败");
      }
    } catch (err) {
      message.error("获取审批详情失败");
    }
  }

  const onClickBack = (e) => {
    props.fn(props.approvalKey)
  };

  function callback(key) {
    setTabKey(key)
  }

  let operations ={}
  const detailAuthority = true
  switch (tabKey) {
    case "formDetail":
      {
        operations = detailAuthority ? <EditApprovalButton /> : <></>;
      }
      break;
    case "approvelFlow":
      {
        operations = <div className={clasess.approvalbox}>审批状态：<ApprovalStatus approveStatus={approveStatus}/></div>
      }
        break;
    default:
      {
        operations = (<></>)
      }
      break;
  }

  const ApprovalProcessButtonsOptions = {
    isApprovalProcessor: true, 
    isMultiPersonApproval: false,
    isApproved: false
  }

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
              <div className={clasess.title}>理财产品合同审批{`${currentDetailId}`}</div>
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
            dataSource={approvalData}
            size="middle"
          />
        </TabPane>
      </Tabs>
    </div>
  );
};

export default TransactionDetail;
