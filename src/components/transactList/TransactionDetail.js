import React from "react";
import { Button, Row, Col, List, Table, Tabs , Typography } from "antd";
import { useHistory } from "react-router-dom";

import clasess from "./transactionDetail.module.scss";
const { TabPane } = Tabs;

const { Title } = Typography;
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

const startApprovalButton = (isAssociateApprovalFlow, isOwnRecord, isStartApproval) =>{
  let isShow = false;
  if(isAssociateApprovalFlow && isOwnRecord && isStartApproval){
    isShow = true;
  }
  return (
    isShow ?
      (<Button style={{display: isShow ? "block" : "none"}}>提交审批</Button>)
      :(<></>)
  )
}

const WithdrawApprovalButton = (isAllowedWithDraw) =>{
// 撤回审批按钮
  return (
    isAllowedWithDraw ?
    (<Button style={{display: isAllowedWithDraw ? "block" : "none"}}>撤回</Button>)
    :<></>
  )
}

const EditApprovalButton = (props) =>{
  // 删除和编辑按钮
  // 根据页面详情页的权限展示
  const { detailAuthority = false } = props;
  return (
    detailAuthority ? 
    (
      <div className={clasess.approvalbox}>
      <div>编辑</div> 
      <div>删除</div> 
      </div>
    ):(
      <></>
    )
  )
}

const ApprovalProcessButtons = (props) =>{
  // 当前节点处理人
  // 特殊情况 多人审批 是否有人审批过？
  // 审批流程中的按钮(通过或者拒绝)
  const { isApprovalProcessor = false, isMultiPersonApproval = false, isApproved = false } = props;
  const [currentApproved, setCurrentApproved] = React.useState(false);
  const [visible, setvisible] = React.useState(false);
  const [confirmLoading, setconfirmLoading] = React.useState(false);
  const handleApproval = () =>{
    // 显示弹窗填意见
  }
  // isApprovalProcessor = true, isMultiPersonApproval = false, isApproved = false


  const handlePass = () =>{
    setCurrentApproved(true);
    setvisible(true)
  }

  const handleRefused = () =>{
    setCurrentApproved(false)
    setvisible(true)
  }

  const handleOk = () => {
    // 这里调用提交审批意见的接口
    // this.setState({
    //   ModalText: 'The modal will be closed after two seconds',
    //   confirmLoading: true,
    // });
    // setconfirmLoading
    // setTimeout(() => {
    //   this.setState({
    //     visible: false,
    //     confirmLoading: false,
    //   });
    // }, 2000);
  };

  const handleCancel = () => {
    console.log('Clicked cancel button');
    setvisible(false)
  };

  console.log("isApprovalProcessor",isApprovalProcessor)
  return (
    isApprovalProcessor ?
    (
      <>
      <Button onClick ={handlePass}>通过</Button>
      <Button onClick ={handleRefused}>拒绝</Button>
    </>
    ):(<></>)
  )
}

const ApprovalStatus = (props) =>{
  const { approveStatus } = props;
  switch (approveStatus) {
    case "approved":
      return (<span style={{color :"green"}}>通过</span>)
      break;
    case "refused":
      return (<span style={{color: "red"}}>已拒绝</span>)
    case "going":
        return (<span>正在进行中</span>)
    default:
      return <></>
      break;
  }
}

const TransactionDetail = () => {
  const history = useHistory();
  const [tabKey, setTabKey] =  React.useState("formDetail");
  const onClickBack = () => {
    console.log(history);
    history.goBack();
  };

  function callback(key) {
    console.log(key);
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
        operations = <div className={clasess.approvalbox}>审批状态:<ApprovalStatus approveStatus={"approved"}/></div>
      }
        break;
    default:
      {
        operations = (<></>)
      }
      break;
  }

  return (
    <div className={clasess.box}>
      <Row type="flex" align="middle" gutter={10} className={clasess.title}>
        <Col>
         <Title level={3}>
             <Button icon="arrow-left" onClick={onClickBack}></Button>
           </Title>
        </Col>
        <Col>
          <Title level={3}>理财产品合同审批2333</Title>
        </Col>
      </Row>
      <Row type="flex" justify="space-between" className={clasess.title}>
        <Col>
            <Title level={4}>记录信息</Title>
        </Col>
        <Col>
         <Button type="danger" style={{ marginRight: "20px" }}>
           拒绝
         </Button>
          <Button type="primary">通过</Button>
        </Col>
      </Row>
      <Tabs className={clasess.tabsBackground} defaultActiveKey="detail" onChange={ callback } tabBarExtraContent={operations}>
        <TabPane classNamr={clasess.tabsBackground} tab="表单详情" key="formDetail">
         <List
            bordered={true}
            itemLayout="horizontal"
            dataSource={fields}
            renderItem={item => (
              <List.Item>
                <Row type="flex" gutter={16}>
                  <Col>{item.lable}:</Col>
                  <Col>{item.value}</Col>
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
