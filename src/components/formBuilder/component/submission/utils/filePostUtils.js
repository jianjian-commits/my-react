import config from "../../../config/config";
import { instanceAxios } from "../../../utils/tokenUtils";
import ID from "../../../utils/UUID";

export const postFile = (singleFile, identification) => {
  var shardSize = 1024 * 1024 * 2;
  var shardCount = Math.ceil(singleFile.size / shardSize);
  var uploadFileName = singleFile.name;
  // var identification = ID.uuid();
  var currentShard = null;
  var file = [];
  console.log("singleFile", singleFile);

  for (var i = 0; i < shardCount; i++) {
    currentShard = i;
    file.push(singleFile.slice(shardSize * i, shardSize * (i + 1)));
    console.log("当前片", i);
    console.log("总共片", shardCount);
    console.log("当前文件", file);
    console.log("文件id", identification);
    var formData = new FormData();
    formData.append("shardCount", shardCount);
    formData.append("currentShard", i);
    formData.append("file", file[i]);
    formData.append("shardSize", shardSize);
    formData.append("uploadFileName", uploadFileName);
    formData.append("identification", identification);
    instanceAxios
      .post(config.apiUrl + "/file/upload", formData)
      .then(response => {
        console.log(response.data);
      })
      .catch(err => {
        console.info(err);
      });
  }
};
