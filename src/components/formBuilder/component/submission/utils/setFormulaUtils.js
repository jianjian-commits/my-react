var _executeBindEventByResultData = (resultData, formulaItem, form, formChildDataObj, saveFormChildSubmitData, dataResource) => {
    if (formulaItem.parentKey == void 0) {
        form.setFieldsValue({
            [formulaItem.key]: resultData
        });
        const { callEventArr, formulaEvent } = formulaItem;

        if (callEventArr) {
            callEventArr.forEach(fnc => {
                fnc(resultData, this);
            });
        }
        if (formulaEvent) {
            formulaEvent.forEach(fnc => {
                fnc(resultData, dataResource);
            });
        }
    } else {
        let formChildFormulaCallBack = null;
        let formulaDataArray = [];

        formChildDataObj[formulaItem.parentKey].forEach((item) => {
            let target = item[formulaItem.key];
            target.data = resultData;
            formulaDataArray.push(resultData);

            console.log(formulaDataArray)

            if (target.callEventArr) {
                target.callEventArr.forEach(fnc => {
                    fnc(resultData, this);
                });
            }
            if (target.formulaEvent && formChildFormulaCallBack == void 0) {
                formChildFormulaCallBack = target.formulaEvent
            };
        });
        if (formChildFormulaCallBack != void 0) {
            formChildFormulaCallBack.forEach((func) => {
                func(formulaDataArray, dataResource)
            })
        }

        saveFormChildSubmitData(formChildDataObj)
    }
};

var _getFormulaRelationData = (form, resultArray, itemFormulaObj, formChildDataObj, formComponentArray, connectItem) => {
    itemFormulaObj.connectArray.filter((otherItem) => {
        return otherItem.key != connectItem.key
    }).forEach((otherItem) => {
        if (otherItem.parentKey == void 0) {
            let value = form.getFieldValue(otherItem.key);
            let targetComponent = formComponentArray.filter((item) => {
                return item.key == otherItem.key
            })[0];

            resultArray.push({
                type: targetComponent.key,
                value: value == void 0 ? null : value
            });
        } else {
            let formChildResultArray = [];
            let formChildType = null;

            formChildDataObj[otherItem.parentKey].map((formChildItem) => {
                let data = formChildItem[otherItem.key].data;

                if (formChildType == void 0) {
                    formChildType = formChildItem[otherItem.key].type;
                }
                if (data != void 0) {
                    formChildResultArray.push(data)
                }
            });
            let formChild = formComponentArray.filter((item) => {
                return item.key == otherItem.parentKey
            })[0];

            resultArray.push({
                type: formChild.key + "_" + formChildType,
                value: formChildResultArray
            });
        }
    });
};

export const setFormulaEvent = (props, formChildItem, insertFromChildIndex) => {
    const { form, item, formulaArray, formComponent, formChildDataObj, handleSetFormula, saveFormChildSubmitData } = props;

    console.log(props);

    let formComponentArray = formComponent.components;

    formulaArray.forEach((formulaItem) => {
        let itemFormulaObj = formulaItem.data.values;

        itemFormulaObj.connectArray.forEach((connectItem) => {
            if (connectItem.key == item.key) {
                handleSetFormula(item.key, (value, dataResource) => {
                    let resultArray = [];

                    console.log("fck", item, dataResource)
                    if (dataResource != void 0) {
                        if (item.data.type == "EditFormula") {
                            let resultArray = item.data.values.connectArray.filter((item) => {
                                return item.key == dataResource.key
                            });
                            if (resultArray.length > 0) {
                                return;
                            }
                        }
                        return;
                    }

                    resultArray.push({
                        type: item.key,
                        value: value
                    });


                    _getFormulaRelationData(form, resultArray, itemFormulaObj, formChildDataObj, formComponentArray, connectItem);

                    console.log("hahah", resultArray);

                    let resultData = "123123";

                    _executeBindEventByResultData(resultData, formulaItem, form, formChildDataObj, saveFormChildSubmitData, formChildItem == void 0 ? item : formChildItem);
                });
            } else if (formChildItem && connectItem.key == formChildItem.key) {
                handleSetFormula(formChildItem.key, (value, dataResource) => {
                    let resultArray = [];

                    console.log("fck222", formChildItem, dataResource)
                    if (dataResource != void 0) {
                        if (formChildItem.data.type == "EditFormula") {
                            let resultArray = formChildItem.data.values.connectArray.filter((item) => {
                                return item.key == dataResource.key
                            });
                            if (resultArray.length > 0) {
                                return;
                            }
                        }
                    }

                    resultArray.push({
                        type: item.label + "." + formChildItem.label,
                        value: value
                    });

                    _getFormulaRelationData(resultArray, itemFormulaObj, formChildDataObj, formComponentArray, connectItem);

                    // let resultData = checkCustomValidate(resultArray, itemFormulaObj.verificationStr);

                    // _executeBindEventByResultData(resultData, formulaItem, form, formChildDataObj, saveFormChildSubmitData, formChildItem);

                }, item.key, insertFromChildIndex);
            }
        });
    });
};