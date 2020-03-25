import React from "react";
import { Row, Col, Input, Select, Button } from "antd";

import classes from "./team.module.scss";

const { Option } = Select;
const Filter = props => {
  const [inputStr, setInputStr] = React.useState(null); //输入框关键字
  // const [groupKey, setGroupKey] = React.useState(null); //分组关键字
  const onChangeInput = e => {
    const { value } = e.target;
    setInputStr(value);
  };
  const onChange = value => {
    // setGroupKey(value);
  };

  // 过滤
  return (
    <div className={classes.fliter}>
      <Row>
        <Col span={5}>用户信息</Col>
        <Col span={5}>分组</Col>
      </Row>
      <Row>
        <Col span={5} className={classes.filterRow}>
          <Input
            placeholder="姓名字或邮箱"
            value={inputStr}
            onChange={onChangeInput}
          />
        </Col>
        <Col span={5} className={classes.filterRow}>
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
            <Option value={null}>全部</Option>
            {props.groups.map((item, index) => {
              return (
                <Option key={item.id} value={item.id}>
                  {item.name}
                </Option>
              );
            })}
          </Select>
          <Button className={classes.submitBtn}>筛选</Button>
        </Col>
      </Row>
    </div>
  );
};

export default Filter;
