let _flattenArray = (array) => {
    return array.reduce((result, item) => {
        if ({}.toString.call(item) == "[object Array]") {
            result = result.concat(_flattenArray(item))
        } else {
            result.push(item);
        }

        return result
    }, [])
};

let getValidValue = (value, type) => {
    let newValue = null;

    if ({}.toString.call(value) == "[object Array]") {
        let array = _flattenArray(value);
        array.length == 0 ?
            type == "string" ?
                newValue = "" : newValue = 0
            :
            type == "string" ?
                newValue = String(array[0]) : newValue = Number(array[0])
    } else {
        type == "string" ?
            newValue = String(value) : newValue = Number(value)
    }

    return newValue
};
export const textCheckType = [
    {
        type: "EXACT",
        describe: "EXACT(text1,text2) 比较两个字符串是否完全相同，返回布尔值",
        checkFunc: (target, resource) => {
            target = getValidValue(target, "string");
            resource = getValidValue(resource, "string");

            return target == resource;
        }
    },
    {
        type: "LOWER",
        describe: "LOWER(text) 将文本中所有字母转换为小写",
        checkFunc: (value) => {
            value = getValidValue(value, "string");

            return value.toLowerCase();
        }
    },
    {
        type: "UPPER",
        describe: "UPPER(text) 将文本中所有字母转换为大写",
        checkFunc: (value) => {
            value = getValidValue(value, "string");

            return value.toUpperCase();
        }
    },
    {
        type: "MID",
        describe: "MID(text,start_num,num_chars) 从文本字符串中指定起始位置开始返回指定长度的字符",
        checkFunc: (target, start, count) => {
            target = getValidValue(target, "string");

            start = getValidValue(start, "number");
            count = getValidValue(count, "number");

            return target.substr(start - 1, count)
        }
    },
    {
        type: "REPLACE",
        describe: "REPLACE(old_text,start_num,num_chars,new_text) 将一个字符串内指定始末位置的部分字符用另一个字符串替代",
        checkFunc: (target, start, count, newStr) => {
            start = getValidValue(start, "number");
            count = getValidValue(count, "number");

            target = getValidValue(target, "string");
            newStr = getValidValue(newStr, "string");

            let oldStr = target.substr(start - 1, count);

            return target.replace(oldStr, newStr);
        }
    },
    {
        type: "LEFT",
        describe: "LEFT(text,num_chars) 从一个文本字符串的最初一个字符开始返回指定个数的字符",
        checkFunc: (target, count) => {
            target = getValidValue(target, "string");
            count = getValidValue(count, "number");

            return target.substr(0, (count));
        }
    },
    {
        type: "RIGHT",
        describe: "RIGHT(text,num_chars) 从一个文本字符串的最后一个字符开始返回指定个数的字符",
        checkFunc: (target, count) => {
            count = getValidValue(count, "number");
            target = getValidValue(target, "string");

            return target.substr(-count);
        }
    },
    {
        type: "SUBSTITUTE",
        describe: "SUBSTITUTE(text,old_text,new_text,instance_num)   将字符串中符合要求的第instance_num个字符串以新的字符串替换",
        checkFunc: (text, old_text, new_text, instance_num) => {
            text = getValidValue(text, "string");
            old_text = getValidValue(old_text, "string");
            new_text = getValidValue(new_text, "string");
            instance_num = getValidValue(instance_num, "number");

            let fromIndex = 0;
            for (let i = 0; i < instance_num; i++) {
                fromIndex += text.indexOf(old_text, fromIndex + old_text.length - 1);
            }
            return text.substring(0, fromIndex - old_text.length) + new_text + text.substring(fromIndex);
        }
    },
    {
        type: "TRIM",
        describe: "TRIM(text)   删除字符串中多余的空格，但会在英文字符串中保留一个作为词与词之间分隔的空格",
        checkFunc: (target) => {
            target = getValidValue(target, "string");

            for (var i = 0; i < target.length; i++) {
                if (target[i] == ' ') {
                    if (target[i + 1] == ' ') {
                        var buffer1 = target.substring(0, i);
                        var buffer2 = target.substring(i + 1, target.length);
                        target = buffer1 + buffer2;
                        i--;
                    }
                }
            }
            return target.trim();
        }
    },
    {
        type: "CONCATENATE",
        describe: "CONCATENATE(text1,text2,...) 将多个文本合并成一个文本",
        checkFunc: (...dataArray) => {
            dataArray = _flattenArray(dataArray);

            return dataArray.join("");
        }
    },
    {
        type: "LEN",
        describe: "LEN(text) 获取文本中的字符个数",
        checkFunc: (target) => {
            target = getValidValue(target, "string");

            return target.length
        }
    },
    {
        type: "SPLIT",
        describe: "SPLIT(text,text_chars) 将文本按照指定分隔符分割为几个部分",
        checkFunc: (text, text_chars) => {
            text = getValidValue(text, "string");
            text_chars = getValidValue(text_chars, "string");

            return text.split(text_chars);
        }
    },
    {
        type: "SEARCH",
        describe: "SEARCH(text1,text2)   返回text1在text2中的位置",
        checkFunc: (target, resource) => {
            target = getValidValue(target, "string");
            resource = getValidValue(resource, "string");

            return target.search(resource);
        }
    },
    {
        type: "VALUE",
        describe: 'VALUE("3.1415") 将文本转化为数字',
        checkFunc: (target) => {
            return getValidValue(target, "number");
        }
    },
    {
        type: "TEXT",
        describe: "TEXT(3.1415) 将数字转化为文本",
        checkFunc: (target) => {
            return getValidValue(target, "string");
        }
    },
    {
        type: "UNION",
        describe: "剔除重复数据",
        checkFunc: (...dataArray) => {
            dataArray = _flattenArray(dataArray);

            return [...new Set(dataArray)]
        }
    },
];


export const numberCheckType = [
    {
        type: "AVERAGE",
        describe: " AVERAGE(num1,num2,...)   返回一组数据的算术平均值",
        checkFunc: (...dataArray) => {
            dataArray = _flattenArray(dataArray);

            return (
                dataArray
                    .map(item => Number(item))
                    .reduce((sum, item) => sum + item, 0)
            ) / dataArray.length;
        }
    },
    {
        type: "COUNT",
        describe: " COUNT(num1,num2,...)   返回一组数据的个数",
        checkFunc: (...dataArray) => {
            dataArray = _flattenArray(dataArray);

            return dataArray.length;
        }
    },
    // {
    //     type: "COUNTIF",
    //     describe: 'COUNTIF("requirement", array)   返回一个数组中符合条件的数据个数',
    //     checkFunc: (requirement,...dataArray) => { //这里参数换了顺序
    //         return dataArray.filter(data =>{
    //             return requirement(data);    //这里有问题？？
    //         }).length;
    //     }
    // },
    {
        type: "MAX",
        describe: 'MAX(num1,num2,...)   返回一组数据的最大值',
        checkFunc: (...dataArray) => {
            dataArray = _flattenArray(dataArray);

            return Math.max(...dataArray);
        }
    },
    {
        type: "MIN",
        describe: 'MIN(num1,num2,...)   返回一组数据的最小值',
        checkFunc: (...dataArray) => {
            dataArray = _flattenArray(dataArray);

            return Math.min(...dataArray);
        }
    },
    {
        type: "MOD",
        describe: 'MOD(num1,num2)   取余',
        checkFunc: (num1, num2) => {
            num1 = getValidValue(num1, "number");
            num2 = getValidValue(num2, "number");

            return num1 % num2;
        }
    },
    {
        type: "POWER",
        describe: 'POWER(num1,num2)   乘方',
        checkFunc: (num1, num2) => {
            num1 = getValidValue(num1, "number");
            num2 = getValidValue(num2, "number");

            return Math.pow(num1, num2);
        }
    },
    {
        type: "SUM",
        describe: " SUM(num1,num2,...)   返回一组数据的和",
        checkFunc: (...dataArray) => {
            dataArray = _flattenArray(dataArray);

            return dataArray.map(item => Number(item)).reduce((sum, item) => sum + item, 0)
        }
    },
    {
        type: "INT",
        describe: " INT(num)   获取数据的整数部分",
        checkFunc: (num) => {
            num = getValidValue(num, "number");

            return Math.floor(num);
        }
    },
    {
        type: "ROUND",
        describe: 'ROUND(num1,num2)   将数字四舍五入到指定位数',
        checkFunc: (num1, num2) => {
            num1 = getValidValue(num1, "number");
            num2 = getValidValue(num2, "number");

            return num1.toFixed(num2);
        }
    },
    {
        type: "LARGE",
        describe: 'LARGE(data,i)  返回数据集中第i大的数',
        checkFunc: (data, i) => {
            data = _flattenArray(data);

            const sortedArray = data.sort(function (a, b) { return b - a });
            return sortedArray[i - 1];
        }
    },
    {
        type: "SMALL",
        describe: 'SMALL(data,i)  返回数据集中第i小的数',
        checkFunc: (data, i) => {
            data = _flattenArray(data);
            const sortedArray = data.sort(function (a, b) { return a - b });
            return sortedArray[i - 1];
        }
    },
    {
        type: "PRODUCT",
        describe: "PRODUCT(num1,num2,...)   返回一组数据的乘积",
        checkFunc: (...dataArray) => {
            dataArray = _flattenArray(dataArray);

            return dataArray.map(item => Number(item)).reduce((sum, item) => sum * item, 1);
        }
    },
    {
        type: "SUMPRODUCT",
        describe: "SUMPRODUCT(array1,array2,...)   加权求和",
        checkFunc: (arr1, arr2) => {
            dataArray = _flattenArray(dataArray);

            return arr1.map(item => Number(item)).reduce((sum, item, index) => sum + (item * Number(arr2[index])), 0)
        }
    },
];

export const specificCheckType = [
    {
        type: "<",
        checkFunc: (left, right) => {
            left = Number(left);
            right = Number(right);

            return left < right
        }
    },
    {
        type: ">",
        checkFunc: (left, right) => {
            left = Number(left);
            right = Number(right);

            return left > right
        }
    },
    {
        type: "<=",
        checkFunc: (left, right) => {
            left = Number(left);
            right = Number(right);

            return left <= right
        }
    },
    {
        type: ">=",
        checkFunc: (left, right) => {
            left = Number(left);
            right = Number(right);

            return left >= right
        }
    },
    {
        type: "==",
        checkFunc: (left, right) => {
            left = String(left);
            right = String(right);

            return left == right
        }
    },
];

export const logicCheckType = [
    {
        type: "AND",
        describe: "AND(logic_expression1,logic_expression2,...)   所有参数为真，返回true",
        checkFunc: (...dataArray) => {
            console.log(dataArray)
            return dataArray.reduce((result, item) => {
                return result == false ? result : item
            }, true)
        }
    },
    {
        type: "OR",
        describe: "OR(logic_expression1,logic_expression2,...)   任意参数为真，返回true",
        checkFunc: (...dataArray) => {

            return dataArray.reduce((result, item) => {
                return result == true ? result : item
            }, false)
        }
    },
    {
        type: "NOT",
        describe: "NOT(logic_expression)   返回与逻辑表达式判定结果相反的值",
        checkFunc: (target) => {
            return !target
        }
    },
];
