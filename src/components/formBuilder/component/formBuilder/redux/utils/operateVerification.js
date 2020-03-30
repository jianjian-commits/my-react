export const ADD_VERIFICATION = "ADD_VERIFICATION";
export const DELETE_VERIFICATION = "DELETE_VERIFICATION";
export const EDIT_VERIFICATION = "EDIT_VERIFICATION";
export const SET_VERIFICATION = "SET_VERIFICATION";
export const SET_VERIFICATION_MSG = "SET_VERIFICATION_MSG";



// 增加和删除校验条件
export const addVerification = (verificationStr,verificationValue) => dispatch => {
    dispatch({
      type: ADD_VERIFICATION,
      name: verificationStr,
      value: verificationValue
    })
  }
  
  export const deleteVerification = (index) => dispatch => {
    dispatch({
      type: DELETE_VERIFICATION,
      index
    })
  }
  export const editVerification = (verificationStr, verificationValue, index) => dispatch => {
    dispatch({
      type: EDIT_VERIFICATION,
      name: verificationStr,
      value: verificationValue,
      index
    })
  }
  
  export const setVerification = (verificationStr) => dispatch => {
    dispatch({
      type: SET_VERIFICATION,
      value: verificationStr
    })
  }
  export const setVerificationMsg = (msg,doType) => {
    return {
      type: SET_VERIFICATION_MSG,
      errMessage: msg,
      doType
    }
  }