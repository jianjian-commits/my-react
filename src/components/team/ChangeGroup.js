import React from "react";
import { Modal, Select, Row, Col, message } from "antd";
import request from "../../utils/request";

const { Option } = Select;

const ChangeGroup = props => {
  // console.log(props)
  const [groupKey, setGroupKey] = React.useState(null); //分组关键字
  const onChange = value => {
    setGroupKey(value);
  };
  const handleCancel = () => {
    props.fn();
  };
  const handleOk = () => {
    if (groupKey) {
      request(`/sysUser/${props.userKey}/group`, {
        method: "PUT",
        data: { oldGroupId: props.groupKey, newGroupId: groupKey }
      })
        .then(res => {
          message.success("成功");
          props.fn();
        })
        .catch(err => {
          message.error("变更失败");
        });
    } else {
      props.fn();
    }
  };
  return (
    <Modal
      title="变更分组"
      visible={props.visible}
      okText="确认"
      onOk={handleOk}
      cancelText="取消"
      onCancel={handleCancel}
    >
      <Row type="flex" gutter={5} align="middle">
        <Col>选择分组</Col>
        <Col>
          <Select
            showSearch
            style={{ width: 100 }}
            placeholder="分组"
            optionFilterProp="children"
            onChange={onChange}
            filterOption={(input, option) =>
              option.props.children
                .toLowerCase()
                .indexOf(input.toLowerCase()) >= 0
            }
          >
            {props.groups.map((item, index) => {
              return (
                <Option key={index} value={item.id}>
                  {item.name}
                </Option>
              );
            })}
          </Select>
        </Col>
      </Row>
    </Modal>
  );
};
export default ChangeGroup;
