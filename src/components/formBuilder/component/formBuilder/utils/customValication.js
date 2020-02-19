import { textCheckType, numberCheckType, specificCheckType, logicCheckType } from "./checkTypeList";

var _checkValueIsFunc = (value) => {
    let textResult = textCheckType.filter((item) => {
        return item.type === value;
    });

    let numberResult = numberCheckType.filter((item) => {
        return item.type === value;
    });

    let logicResult = logicCheckType.filter((item) => {
        return item.type === value;
    });

    if (textResult.length > 0) {
        return {
            type: "func",
            item: textResult[0]
        }
    } else if (numberResult.length > 0) {
        return {
            type: "func",
            item: numberResult[0]
        }
    } else if (logicResult.length > 0) {
        return {
            type: "func",
            item: logicResult[0]
        }
    } else {
        return {
            type: "none"
        }
    }
};

var _checkValueIsData = (data, value) => {
    let result = data.filter((item) => {
        return item.type === value
    });

    if (result.length === 0) {
        return {
            type: "none"
        }
    } else {
        return {
            type: "data",
            item: result[0]
        }
    }
};


var getFuncTree = (str) => {
    let result = "";
    let leftArray = [];
    let resultArray = [];

    for (let i = 0, len = str.length; i < len; i++) {
        let item = str[i];

        if ((/\(/).test(item)) {
            for (let j = 0, length = leftArray.length; j < length; j++) {
                result = [result];
            };

            leftArray.push("(");
            resultArray.push(result)
            result = "";
        } else if ((/\)/).test(item)) {
            for (let j = 0, length = leftArray.length; j < length; j++) {
                result = [result];
            };

            leftArray.pop();
            resultArray.push(result)
            result = "";
        } else if ((/\>|\<|\=/).test(item)) {
            result += item;

            if ((/(\w+)?(\>|\<|\=\=|\>\=|\<\=)/).test(result)) {
                let matchArray = result.match(/([\u4e00-\u9fa5_a-zA-Z0-9]+)?(\>|\<|\=\=|\>\=|\<\=)/);
                let value = matchArray[1];
                let operate = matchArray[2];

                if (value  != void 0) {
                    for (let j = 0, length = leftArray.length; j < length; j++) {
                        value = [value];
                    };

                    resultArray.push(value)
                }
                if (operate  != void 0) {
                    for (let j = 0, length = leftArray.length; j < length; j++) {
                        operate = [operate];
                    };

                    resultArray.push(operate)
                    result = "";
                }
            }
        } else if ((/\,/).test(item)) {
            if (result !== "") {
                for (let j = 0, length = leftArray.length; j < length; j++) {
                    result = [result];
                };

                resultArray.push(result)
                result = "";
            }
        } else {
            result += item;
        }
    }

    if (result !== "") {
        resultArray.push(result)
    }

    return resultArray;
};

var isArray = (value) => {
    return {}.toString.call(value) === "[object Array]"
}

var getArrayLevel = (array) => {
    let result = null;
    let count = 1;
    array = isArray(array) ? [...array] : array;


    if (isArray(array)) {
        result = array.pop();
        let res = getArrayLevel(result);
        count += res.level
        return {
            level: count,
            value: res.value
        }

    } else {
        return {
            level: 0,
            value: array
        }
    }
}

let insertParentChildren = (resultArray, currentLevel, childLevel, childItem) => {
    let length = resultArray.length;
    let target = resultArray[length - 1]
    currentLevel += 1;

    if (currentLevel === childLevel) {
        target.children.push(childItem);
        return 0;
    } else {
        insertParentChildren(target.children, currentLevel, childLevel, childItem)
    }
}


var buildFuncTreeArray = (data, treeArray) => {
    let resultArray = [];

    for (let i = 0, len = treeArray.length; i < len; i++) {
        let item = treeArray[i];
        let currentLevel = item.level;
        let funcResult = _checkValueIsFunc(item.value);
        let dataResult = _checkValueIsData(data, item.value);
        let valueObj = null;

        if (funcResult.type === "func") {
            valueObj = funcResult.item
        } else if (dataResult.type === "data") {
            valueObj = {
                value: dataResult.item.value
            }
        } else {
            valueObj = {
                value: item.value
            }
        }

        if (currentLevel === 0) {
            resultArray.push({
                ...valueObj,
                children: []
            })
        } else {
            let currentItem = {
                ...valueObj,
                children: []
            }
            insertParentChildren(resultArray, 0, currentLevel, currentItem)
        }
    }

    return resultArray
}

var _executeFuncTree = (funcTreeArray) => {
    return funcTreeArray.reduce((childrenArray, item) => {
        console.log("type :", item)
        if (item.type  != void 0) {
            let funcArgArray = _executeFuncTree(item.children);

            console.log("arugmengts", funcArgArray)
            let specificArray = [];
            for (let i = 0, len = funcArgArray.length; i < len; i++) {
                let item = funcArgArray[i];

                //TODO 把数组中字符附近的3个进行替换
                if ((/\>|\<|\=/).test(item)) {
                    let leftValue = funcArgArray[i - 1];
                    let symbol = funcArgArray[i]
                    let rightValue = funcArgArray[i + 1]

                    let specificSymbol = specificCheckType.filter((item) => {
                        return item.type === symbol
                    })[0];

                    if (specificSymbol === void 0) {
                        console.error("this symbol not find")
                    } else {
                        let res = specificSymbol.checkFunc.call(this, leftValue, rightValue)
                        console.log("asjdhkljhwjklwher", res)
                        specificArray.push(res);
                    }
                }
            }

            console.log(specificArray)

            if (specificArray.length > 0) {
                childrenArray.push(item.checkFunc.apply(this, specificArray))
            } else {
                childrenArray.push(item.checkFunc.apply(this, funcArgArray))
            }
            console.log(childrenArray)

            return childrenArray
        } else {
            childrenArray.push(item.value)

            return childrenArray
        }

    }, [])
}

export const checkCustomValidate = (data, str) => {
    str = str.replace(/\s+/g, "").replace(/\"|\'/g, "").replace(/\，/g, ",");

    console.log(str)

    let resultArray = getFuncTree(str).filter((item) => {
        return item !== "" && item !== " "
    }).map((item) => {
        return getArrayLevel(item);
    });

    console.log(resultArray)

    let funcTreeArray = buildFuncTreeArray(data, resultArray)

    console.log(funcTreeArray)

    let a = _executeFuncTree(funcTreeArray);

    let specificArray = [];
    for (let i = 0, len = a.length; i < len; i++) {
        let item = a[i];

        //TODO 把数组中字符附近的3个进行替换
        if ((/\>|\<|\=/).test(item)) {
            let leftValue = a[i - 1];
            let symbol = a[i]
            let rightValue = a[i + 1]

            let specificSymbol = specificCheckType.filter((item) => {
                return item.type === symbol
            })[0];

            if (specificSymbol === void 0) {
                console.error("this symbol not find")
            } else {
                let res = specificSymbol.checkFunc.call(this, leftValue, rightValue)
                console.log("asjdhkljhwjklwher", res)
                specificArray.push(res);
            }
        }
    }
    console.log(specificArray)
    console.log("result", a)

    if (specificArray.length > 0) {
        return specificArray[0]
    } else {
        return a[0]
    }
};