/*
 * @Author: your name
 * @Date: 2020-04-08 15:05:30
 * @LastEditors: komons
 * @LastEditTime: 2020-04-14 15:21:05
 * @Description:
 * @FilePath: \form-builderc:\Komons\work\all\davinci-paas-frontend\src\components\formBuilder\component\formData\components\filterFields\filterFieldsComponents.js
 */
import React, { useEffect, useState } from "react";
import { Checkbox, Button } from "antd";

const CheckboxGroup = Checkbox.Group;

const FilterFieldsComponents = ({
  components,
  handleSetShowFields = () => {}
}) => {
  const [fields, setFields] = useState([]);
  const [selectedFields, setSelectedFields] = useState([]);

  const handleClickOk = () => {
    handleSetShowFields(selectedFields);
    let dom = document.querySelector("#fieldsBtn");
    dom && dom.click();
  };

  useEffect(() => {
    let res = [];
    let fields = components.map(item => {
      res.push(item.key);
      return {label:item.label, value: item.key}
    });
    setFields(fields);
    setSelectedFields(res);
  }, [components]);

  return (
    <div className="fields-wraper">
      <CheckboxGroup
        className="fields-checkbox"
        onChange={setSelectedFields}
        options={fields}
        value={selectedFields}
      />
      <Button type="link" block className="fields-btn" onClick={handleClickOk}>
        确定
      </Button>
    </div>
  );
};

export default FilterFieldsComponents;
