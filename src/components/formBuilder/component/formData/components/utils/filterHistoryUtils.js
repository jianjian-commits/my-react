/*
 * @Author: your name
 * @Date: 2020-04-16 10:56:48
 * @LastEditors: komons
 * @LastEditTime: 2020-04-17 09:17:38
 * @Description:
 * @FilePath: \form-builderc:\Komons\work\all\davinci-paas-frontend\src\components\formBuilder\component\formData\components\utils\filterHistoryUtils.js
 */
const filterHistory = {
  DateInput: record => {},
  FileUpload: record => {
    /*
     * status
     * 1 新增文件
     * 0 修改文件
     * -1 删除文件
     */
    const { beforeValue, afterValue } = record;
    let afterFileName = [],
      afterFileSize = [];
    let beforeFileName = [],
      beforeFileSize = [];

    beforeValue.forEach(item => {
      beforeFileName.push(item.name);
      beforeFileSize.push(item.size);
    });

    let resArr = [
      {
        content: `修改${record.label}的值：`
      }
    ];
    for (let i = 0; i < afterValue.length; i++) {
      let afterName = afterValue[i].name;
      let afterSize = afterValue[i].size;
      afterFileName.push(afterName);
      afterFileSize.push(afterSize);

      let index = beforeFileName.indexOf(afterName);
      if (index === -1) {
        resArr.push({
          status: 1,
          content: `新增文件 ${afterName} (${afterSize})`
        });
      } else if (afterSize !== beforeFileSize[index]) {
        beforeFileName.splice(index, 1);
        beforeFileSize.splice(index, 1);
        resArr.push({
          status: 0,
          content: `修改文件 ${afterName} (${afterFileSize})`
        });
      } else {
        beforeFileName.splice(index, 1);
        beforeFileSize.splice(index, 1);
      }
    }
    // 仅删除数据的情况
    beforeFileName.forEach((item, index) => {
      resArr.push({
        status: -1,
        content: `删除文件 ${item} (${beforeFileSize[index]})`
      });
    });
    return resArr;
  }
};

export default filterHistory;
