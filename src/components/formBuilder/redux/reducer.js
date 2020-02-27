import {
    RECEIVED_LOGIN_DATA,
    RECEIVED_ACCESS_DATA,
    RECEIVED_SUBMIT_ACCESS
} from "./action";


const initState = {
    submissionAccess: [],
    access: []
};

export default function rootReducer(state = initState, action) {
    switch (action.type) {
        case RECEIVED_LOGIN_DATA: {
            return {
                ...state,
                token: action.token,
                isLogin: true
            };
        }
        case RECEIVED_SUBMIT_ACCESS: {
            return {
                ...state,
                submissionAccess: action.submissionAccess,
            };
        }
        case RECEIVED_ACCESS_DATA: {
            return {
                ...state,
                access: action.access,
            };
        }
        default: {
            return state;
        }
    }
}
