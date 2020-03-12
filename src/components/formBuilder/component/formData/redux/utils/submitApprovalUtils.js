import config from "../../../../config/config";
import { instanceAxios } from "../../../../utils/tokenUtils";
// 获得表单数据详情
// appId: 是当前应用ID
// metadataId: 数据的ID
// name ,value 是数据
export const submitSubmissionApproval = (
  appId,
  metadataId,
  fieldInfos
) => dispatch => {
  instanceAxios({
    url: config.apiUrl + `/form`,
    method: "POST",
    data: {
      appId,
      metadataId,
      fieldInfos
    },
    headers: {
      "Content-Type": "application/json"
    }
  })
    .then(response => {
      console.log(response);
    })
    .catch(err => {
      console.info(err);
    });
};
