import React from "react";
import { Row, Col, Input, Select, Button } from "antd";
import data from "./mockMember";
import classes from "./team.module.scss";

const { Option } = Select;
const Filter = props => {
  const groups = Array.from(
    new Set(
      data.map(item => {
        return item.group;
      })
    )
  );
  const [inputStr, setInputStr] = React.useState(null); //输入框关键字
  const [groupKey, setGroupKey] = React.useState(null); //分组关键字
  const onChangeInput = e => {
    const { value } = e.target;
    setInputStr(value);
  };
  const onChange = value => {
    setGroupKey(value);
  };

  // 过滤
  const onClickFilter = () => {
    const newData = groupKey
      ? data.filter(item => {
          return item.group === groupKey;
        })
      : data;
    const resultData = inputStr
      ? newData.filter(item => {
          return (
            item.name.includes(inputStr) ||
            item.mail.includes(inputStr) ||
            item.nickname.includes(inputStr)
          );
        })
      : newData;
    props.fn(resultData);
  };
  return (
    <div className={classes.fliter}>
      <Row>
        <Col span={5}>用户信息</Col>
        <Col span={5}>分组</Col>
      </Row>
      <Row>
        <Col span={5} style={{ padding: "10px 10px 5px 0" }}>
          <Input
            placeholder="姓名，用户名或邮箱"
            value={inputStr}
            onChange={onChangeInput}
          />
        </Col>
        <Col span={5} style={{ padding: "10px 10px 5px 0" }}>
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
            {groups.map((item, index) => {
              return (
                <Option key={index} value={item}>
                  {item}
                </Option>
              );
            })}
          </Select>
          ,<Button onClick={onClickFilter}>筛选</Button>
        </Col>
      </Row>
    </div>
  );
};

export default Filter;
