import React, { Component } from "react";
import { Tooltip, Button, Tree, Popconfirm, message } from "antd";
import { connect } from "react-redux";
import classes from "./position.module.scss";
import {
  PromptIcon,
  CompanyIcon,
  CreateIcon,
  RemoveIcon
} from "../../../assets/icons/company";
import { EditIcon } from "../../../assets/icons";
import { catchError } from "../../../utils";
import request from "../../../utils/request";
import ModalCreation from "../../profileManagement/modalCreate/ModalCreation";
import PositionDel from "./PositionDel";
const { TreeNode } = Tree;

const Header = () => {
  return (
    <p>
      <span>职位</span>
      <Tooltip
        placement="right"
        title="帮助您按照团队组织架构定义成员的层级关系！"
        trigger="click"
        overlayClassName="header-tooltip"
      >
        <PromptIcon />
      </Tooltip>
    </p>
  );
};

class PositionTree extends Component {
  constructor(props) {
    super(props);
    this.state = {
      treeData: [],
      selectedId: ""
    };
    this.handleCreate = this.handleCreate.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
  }

  // 新建职位
  async handleCreate(data) {
    try {
      const positionCreateBO = {
        company: this.props.id,
        dataShare: false,
        description: data.description,
        name: data.name,
        superior: this.state.selectedId
      };
      const res = await request("/position", {
        method: "POST",
        data: positionCreateBO
      });
      if (res && res.status === "SUCCESS") {
        message.success("新建职位成功!");
        this.handleCancel();
        this.setState({
          enterD: true
        });
        // this.getPositionTree();
      } else {
        message.error(res.msg || "新建职位失败");
      }
    } catch (err) {
      catchError(err);
    }
  }

  // 关闭模态窗
  handleCancel() {
    this.setState({
      open: false,
      selectedId: "",
      enterD: false
    });
  }

  // 删除职位
  async onDelect(targetId) {
    try {
      const res = await request(`/position/${targetId}`, {
        method: "DELETE"
      });
      if (res && res.status === "SUCCESS") {
        message.success("删除职位成功!");
        this.handleCancel();
        this.getPositionTree();
      } else {
        message.error(res.msg || "删除职位失败");
      }
    } catch (err) {
      catchError(err);
    }
  }

  componentDidMount() {
    this.getPositionTree();
  }

  async getPositionTree() {
    try {
      let companyData = {};
      if (!this.props.companyName) {
        const companyRes = await request("/company/current");
        if (companyRes && companyRes.status === "SUCCESS") {
          companyData = companyRes.data;
        }
      }
      const res = await request("/position/current");
      if (res && res.status === "SUCCESS") {
        const treeData = [
          {
            value: this.props.companyName || companyData.companyName,
            id: this.props.id || companyData.id,
            code: "COMPANY",
            children: [...res.data]
          }
        ];
        this.setState({
          treeData
        });
      } else {
        message.error(res.msg || "获取职位树失败");
      }
    } catch (err) {
      catchError(err);
    }
  }

  unfoldArr(opera) {
    const expandedArr = [];
    function filterArray(arr) {
      return arr.map(i => {
        expandedArr.push(i.id);
        if (i.children.length > 0) {
          filterArray(i.children);
        }
        return expandedArr;
      });
    }
    const treeData = [...this.state.treeData];
    if (opera === "unfold") {
      filterArray(treeData);
    } else {
      filterArray([]);
    }
    this.setState({
      expandedArr
    });
  }

  renderTreeNodes = data =>
    data.map(item => {
      let title;
      title = (
        <div className={classes["title-wrap"]} key={item.id}>
          {item.value}
          {item.code !== "COMPANY" && (
            <CreateIcon
              onClick={() => this.setState({ open: true, selectedId: item.id })}
            />
          )}
          {item.code !== "COMPANY" && (
            <EditIcon
              onClick={() => {
                this.setState({ enterD: true });
              }}
            />
          )}
          {!item.code && (
            <Popconfirm
              title="确认删除该职位？"
              onConfirm={() => this.onDelect(item.id)}
              okText="是"
              cancelText="否"
              placement="top"
            >
              <RemoveIcon />
            </Popconfirm>
          )}
        </div>
      );
      // if (item.children) {
      return (
        <TreeNode
          title={title}
          key={item.id}
          icon={item.code === "COMPANY" ? <CompanyIcon /> : undefined}
        >
          {this.renderTreeNodes(item.children)}
        </TreeNode>
      );
      // }
      // return <TreeNode title={item.value} key={item.id} />;
    });

  render() {
    return (
      <div className={classes.wrapper}>
        <Header />
        {this.state.enterD ? (
          <PositionDel />
        ) : (
          <div className={classes.tree}>
            <div className={classes.button}>
              <Button type="link" onClick={() => this.unfoldArr("unfold")}>
                全部展开
              </Button>
              |
              <Button type="link" onClick={() => this.unfoldArr("collapse")}>
                全部折叠
              </Button>
            </div>
            <Tree
              showIcon
              showLine
              onExpand={expandedKeys => {
                this.setState({
                  expandedArr: expandedKeys
                });
              }}
              className="hide-file-icon"
              expandedKeys={this.state.expandedArr}
            >
              {this.renderTreeNodes(this.state.treeData)}
            </Tree>
          </div>
        )}
        <ModalCreation
          title={"新建职位"}
          visible={this.state.open}
          onOk={data => this.handleCreate(data)}
          onCancel={this.handleCancel}
        />
      </div>
    );
  }
}

export default connect(
  ({ login }) => ({
    id: login.currentCompany && login.currentCompany.id,
    companyName: login.currentCompany && login.currentCompany.companyName
  })
)(PositionTree);
