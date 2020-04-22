export const handleFormulaSubmit = (str, element, elementParent, data, funcObj) => {
    str = str.replace(/\s+/g, "").replace(/\，/g, ",");
    let reg = /(([\u4e00-\u9fa5_a-zA-Z0-9]+)\.?([\u4e00-\u9fa5_a-zA-Z0-9]+))(\)|\,)/g;
    let verificationArray = (str.match(reg) || []).map((item) => {
        return item.slice(0, -1);
    });

    let values = {
        verificationStr: str,
        connectArray: verificationArray.map((item) => {
            let index = item.indexOf(".");

            if (index > -1) {
                let itemParent = item.slice(0, index);
                let itemChild = item.slice(index + 1);

                let resultArray = data.filter((component) => {
                    return component.label == itemParent
                }).map((component) => {
                    let lastChild = component.values.filter((item) => {
                        return item.label == itemChild;
                    }).pop();

                    if (lastChild == void 0) {
                        return null;
                    } else {
                        return {
                            key: lastChild.key,
                            parentKey: component.key
                        }
                    }
                });

                return resultArray.pop();
            } else {
                let resultArray = data.filter((component) => {
                    return component.label == item
                }).map((item) => {
                    return {
                        key: item.key,
                        parentKey: null
                    }
                })

                return resultArray.pop();
            }
        }).filter((item) => {
            return item.key != void 0
        }),
    };

    if (elementParent) {
        funcObj.setFormChildItemAttr(
            elementParent,
            "data",
            { values },
            element,
            "EditFormula"
        );
    } else {
        funcObj.setItemValues(element, "data", values, "EditFormula");
    }
};