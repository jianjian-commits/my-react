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
import { Checkbox, Input, Icon } from "antd";

export default compose(
  withProps(({ currentUsers }) => {
    return {
      currentUsers: currentUsers || []
    };
  }),
  withState("open", "setOpen", false),
  withState("widageRef", "setRef", null),
  // withState("rolesOrder", "setRolesOrder", "alphabet"),
  withHandlers({
    onWidageClick: props => () => {
      if (props.open) return false;
      props.setOpen(true);
    },
    selectUserHandler: props => (id, checked) => {
      console.log(id, checked);
      if (checked) {
        props.updateSelectedKeys([...props.selectedKeys, id]);
      } else {
        props.updateSelectedKeys(props.selectedKeys.filter(e => e !== id));
      }
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
    setRef,
    selectedKeys,
    users,
    selectUserHandler,
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
                <Input
                  prefix={
                    <Icon type="search" style={{ color: "rgba(0,0,0,.25)" }} />
                  }
                  className={classes.search}
                  placeholder="请输入要搜索的内容"
                />
                {users.map(u => {
                  return (
                    <div
                      key={u.id}
                      className={clx(
                        classes.customTabPaneRow,
                        u.position ? classes.disabled : null
                      )}
                    >
                      <Checkbox
                        disabled={!!u.position}
                        checked={selectedKeys.indexOf(u.id) !== -1}
                        onClick={e => selectUserHandler(u.id, e.target.checked)}
                      />
                      &nbsp;&nbsp;{u.name}
                      {u.position && (
                        <span>&nbsp;&nbsp; ({u.position.value} )</span>
                      )}
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
