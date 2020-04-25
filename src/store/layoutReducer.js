export const initialState = {
  sider: {
    collapsed: false
  }
};

const TOGGLE_SIDER_COLLASPE = "Layout/TOGGLE_SIDER_COLLASPE";

export const toggleSiderCollapsed = () => ({ type: TOGGLE_SIDER_COLLASPE });

export default function layoutReducer(state = initialState, { type, payload }) {
  switch (type) {
    case TOGGLE_SIDER_COLLASPE:
      return {
        ...state,
        sider: {
          ...state.sider,
          collapsed: !state.sider.collapsed
        }
      };
    default:
      return state;
  }
}
