import React from "react";
import { Modal, Select, Row, Col } from "antd";
import classes from './team.module.scss'

const { Option } = Select;

const ChangeGroup = props => {
  const [groupKey, setGroupKey] = React.useState(props.groupKey); //分组关键字
  const onChange = value => {
    setGroupKey(value);
  };
  const handleCancel = () => {
    props.fn();
  };
  const handleOk = () => {
    props.fn(groupKey);
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
            defaultValue={props.groupKey}
            showSearch
            style={{ width: 200 }}
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
                <Option className={classes.selection} key={index} value={item.id}>
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
