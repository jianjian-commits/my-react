export const handleFormulaSubmit = (selectComponent, str, value, element, elementParent, funcObj) => {
    str = str.replace(/\s+/g, "").replace(/\，/g, ",");

    let values = {
        verificationStr: str,
        verificationValue: value,
        connectArray: selectComponent.map((item) => {
            let key = item.key;
            let index = key.indexOf("_");

            if (index > -1) {
                let itemParent = key.slice(0, index);
                let itemChild = key.slice(index + 1);

                return {
                    key: itemChild,
                    parentKey: itemParent
                }
            } else {
                return {
                    key: key,
                    parentKey: null
                }
            }
        })
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