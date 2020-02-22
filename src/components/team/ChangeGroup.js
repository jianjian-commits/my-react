import React from "react";
import { Modal, Select, Row, Col } from "antd";
import data from "./mockMember";

const { Option } = Select;
const groups = Array.from(
  new Set(
    data.map(item => {
      return item.group;
    })
  )
);

const ChangeGroup = props => {
  const [groupKey, setGroupKey] = React.useState(null); //分组关键字
  const onChange = value => {
    setGroupKey(value);
  };
  const handleCancel = () => {
    props.fn();
  };
  const handleOk = () => {
    if (groupKey) {
      data.forEach(item => {
        if (item.name === props.userKey) {
          item.group = groupKey;
        }
      });
    }
    props.fn();
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
            {groups.map((item, index) => {
              return (
                <Option key={index} value={item}>
                  {item}
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
