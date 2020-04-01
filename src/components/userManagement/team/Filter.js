import React from "react";
import { Row, Col, Input, Select, Button } from "antd";

import classes from "./team.module.scss";

const customerCss = { width: 210, borderRadius: '3px', margin: '0 15px 0 10px' }

const { Option } = Select;
const Filter = props => {
  const [inputStr, setInputStr] = React.useState(null); //输入框关键字
  const [inputKey, setInputKey] = React.useState(null)
  const [groupKey, setGroupKey] = React.useState(null); //分组关键字
  const onChangeInput = e => {
    const { value } = e.target;
    const _str = value ? value.replace(/\s*/g, "") : null;
    setInputStr(value)
    setInputKey(_str);
  };
  const onChangeGroup = value => {
    setGroupKey(value);
  };
  const filterSubmit = () => {
    props.fn(inputKey, groupKey)
  }

  // 过滤
  return (
    <div>
      <Row type='flex'>
        <Col className={classes.filterRow}>
          <span>用户信息</span>
          <Input
            placeholder="姓名或邮箱"
            value={inputStr}
            style={customerCss}
            onChange={onChangeInput}
          />
        </Col>
        <Col className={classes.filterRow}>
          <span>分组</span>
          <Select
            showSearch
            style={customerCss}
            placeholder="分组"
            optionFilterProp="children"
            onChange={onChangeGroup}
            filterOption={(input, option) =>
              option.props.children
                .toLowerCase()
                .indexOf(input.toLowerCase()) >= 0
            }
          >
            <Option className={classes.selection} value={null}>全部</Option>
            {props.groups.map((item, index) => {
              return (
                <Option className={classes.selection} key={item.id} value={item.id}>
                  {item.name}
                </Option>
              );
            })}
          </Select>
          <Button className={classes.submitBtn} onClick={filterSubmit}>筛选</Button>
        </Col>
      </Row>
    </div>
  );
};

export default Filter;
