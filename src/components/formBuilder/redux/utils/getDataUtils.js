import axios from "axios";
import config from "../../config/config";
import { initToken } from "../../utils/tokenUtils";

import { RECEIVED_ACCESS_DATA, RECEIVED_SUBMIT_ACCESS } from "../action";

export const mockLoginAndSetData = () => dispatch => {
    // initToken();
  
    axios({
      url: config.apiUrl + "/access",
      method: "get",
      data: {
        ...config.loginData
      },
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(response => {
        let authenticatedId = response.data.roles.authenticated.id;
  
        dispatch({
          type: RECEIVED_ACCESS_DATA,
          access: [
            {
              roles: [
                response.data.roles.administrator.id,
                authenticatedId,
                response.data.roles.anonymous.id
              ],
              type: "read_all"
            }
          ]
        });
  
        dispatch({
          type: RECEIVED_SUBMIT_ACCESS,
          submissionAccess: [
            { roles: [authenticatedId], type: "create_own" },
            { roles: [authenticatedId], type: "read_own" },
            { roles: [authenticatedId], type: "update_own" },
            { roles: [authenticatedId], type: "delete_own" }
          ]
        });
      })
      .catch(err => {
        console.error(err);
      });
  };
  