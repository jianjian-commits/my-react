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
import { getCurrentCompany } from "../../../store/loginReducer";
import { EditIcon } from "../../../assets/icons";
import { catchError } from "../../../utils";
import request from "../../../utils/request";
import ModalCreation from "../../profileManagement/modalCreate/ModalCreation";
import PositionDel from "./PositionDetail";
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
      selectedPosition: null
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
        superior: this.state.selectedPosition.id
      };
      const res = await request("/position", {
        method: "POST",
        data: positionCreateBO
      });
      if (res && res.status === "SUCCESS") {
        message.success("新建职位成功!");
        this.handleCancel();
        this.setState({
          detailOpened: true,
          selectedPosition: res.data
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
      selectedPosition: null,
      detailOpened: false
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

  operateTree(command) {
    const expandedKeys = [];
    function filterArray(arr) {
      return arr.map(i => {
        expandedKeys.push(i.id);
        if (i.children.length > 0) {
          filterArray(i.children);
        }
        return expandedKeys;
      });
    }
    const treeData = [...this.state.treeData];
    if (command === "unfold") {
      filterArray(treeData);
    } else {
      filterArray([]);
    }
    this.setState({
      expandedKeys
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
              onClick={() => this.setState({ open: true, selectedPosition: item })}
            />
          )}
          {item.code !== "COMPANY" && (
            <EditIcon
              onClick={() => {
                this.setState({ detailOpened: true, selectedPosition: item });
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
      return (
        <TreeNode
          title={title}
          key={item.id}
          icon={item.code === "COMPANY" ? <CompanyIcon /> : undefined}
        >
          {this.renderTreeNodes(item.children)}
        </TreeNode>
      );
    });

  returnTree = () => {
    this.setState({ detailOpened: false, selectedPosition: null });
    this.getPositionTree();
  };

  render() {
    const { detailOpened, selectedPosition } = this.state;
    return (
      <div className={classes.wrapper}>
        {detailOpened ? (
          <PositionDel
            position={selectedPosition}
            returnTree={this.returnTree}
          />
        ) : (
          <>
            <Header />
            <div className={classes.tree}>
              <div className={classes.button}>
                <Button type="link" onClick={() => this.operateTree("unfold")}>
                  全部展开
                </Button>
                |
                <Button type="link" onClick={() => this.operateTree("collapse")}>
                  全部折叠
                </Button>
              </div>
              <Tree
                showIcon
                showLine
                onExpand={expandedKeys => {
                  this.setState({
                    expandedKeys: expandedKeys
                  });
                }}
                className="hide-file-icon"
                expandedKeys={this.state.expandedKeys}
              >
                {this.renderTreeNodes(this.state.treeData)}
              </Tree>
            </div>
          </>
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
  }),
  { getCurrentCompany }
)(PositionTree);
