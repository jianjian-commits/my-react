export const initialState = {
  sider: {
    collapsed: false,
    openKeys: []
  },
};

const TOGGLE_SIDER_COLLASPE = "Layout/TOGGLE_SIDER_COLLASPE";
const UPDATE_SIDER_OPENKEYS = "Layout/UPDATE_SIDER_OPENKEYS";

export const toggleSiderCollapsed = () => ({ type: TOGGLE_SIDER_COLLASPE });
export const updateSiderOpenKeys = payload => ({ type: UPDATE_SIDER_OPENKEYS, payload });

export default function layoutReducer(state = initialState, { type, payload }) {
  switch (type) {
    case TOGGLE_SIDER_COLLASPE: {
      const collapsed = !state.sider.collapsed;
      return {
        ...state,
        sider: {
          ...state.sider,
          collapsed,
          openKeys: collapsed ? [] : state.sider.openKeys
        },
      };
    }
    case UPDATE_SIDER_OPENKEYS:
      return {
        ...state,
        sider: {
          ...state.sider,
          openKeys: payload
        },
      };
    default:
      return state;
  }
}
