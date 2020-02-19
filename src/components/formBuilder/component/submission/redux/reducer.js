import {
  GET_FORM_COMPONENT, GET_CHILD_FORM_COMPONENT, GET_ALL_FORMS
} from './action';

export const initialState = {
  formComponent: {
    components: []
  },
  forms: [],
  childFormComponent: [],
  validation: {}
};

export default function surveyReducer(state = initialState, { type, data, ...action }) {
  switch (type) {
    case GET_FORM_COMPONENT: {
      return {
        ...state,
        formComponent: data,
        formValidation: action.formValidation
      }
    };
    case GET_CHILD_FORM_COMPONENT: {
      return {
        ...state,
        formComponent: { components: state.formComponent.components.concat(data) }
      }
    }
    case GET_ALL_FORMS: {
      return {
        ...state,
        forms: action.forms
      }
    }
    default:
      return state;
  }
}
