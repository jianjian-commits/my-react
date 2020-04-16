import React, { useRef, useEffect } from "react";
import {
  compose,
  withHandlers,
  withState,
  withProps,
  lifecycle
} from "recompose";
import clx from "classnames";
import classes from "./position.module.scss";
import { Checkbox } from "antd";

export default compose(
  withProps(({ data }) => {
    return {};
  }),
  withState("open", "setOpen", false),
  withState("widageRef", "setRef", null),
  // withState("rolesOrder", "setRolesOrder", "alphabet"),
  withHandlers({
    onWidageClick: props => () => {
      if (props.open) return false;
      props.setOpen(true);
    },
    removeUser: props => i => {
      const updatedUsers = props.elementModel.approveUsers.slice();
      updatedUsers.splice(i, 1);
      props.onUsersChange(updatedUsers);
    },
    hideDropdown: props => event => {
      if (!props.open) return false;
      if (
        props.widageRef &&
        !props.widageRef.current.contains(event.target) &&
        event.target.type !== "checkbox" &&
        props.open
      ) {
        props.setOpen(false);
      }
    }
  }),
  lifecycle({
    componentDidMount() {
      document.addEventListener("click", this.props.hideDropdown);
    },
    componentWillUnmount() {
      document.removeEventListener("click", this.props.hideDropdown);
    }
  })
)(
  ({
    open,
    disabled,
    setRef,
    users,
    removeUser,
    onUsersChange,
    onWidageClick
  }) => {
    const divRef = useRef(null);
    useEffect(() => {
      setRef(divRef);
      return () => {};
    }, [divRef, setRef]);
    return (
      <div
        ref={div => (divRef.current = div)}
        className={classes.customWidageWrapper}
      >
        <div
          className={clx(classes.customWidage, open ? classes.active : null)}
          onClick={onWidageClick}
        >
          {open ? (
            <div className={classes.customTabs}>
              <div className={classes.customTabPane}>
              {users.map(u => {
                return (
                  <div className={classes.customTabPaneRow}>
                    <Checkbox />
                    &nbsp;&nbsp;{u.name}
                  </div>
                );
              })}
              </div>
            </div>
          ) : null}
          点击关联
        </div>
      </div>
    );
  }
);
