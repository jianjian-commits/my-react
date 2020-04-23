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
import { Input, Icon } from "antd";
import { Checkbox } from "../../shared/customWidget";

export default compose(
  withProps(({ currentUsers }) => {
    return {
      currentUsers: currentUsers || []
    };
  }),
  withState("open", "setOpen", false),
  withState("searchText", "setSearchText", null),
  withState("widageRef", "setRef", null),
  withHandlers({
    onWidageClick: props => () => {
      if (props.open) return false;
      props.setOpen(true);
    },
    selectUserHandler: props => (id, checked) => {
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
    searchText,
    setSearchText,
    selectedKeys,
    positionId,
    allUsers,
    selectUserHandler,
    onWidageClick
  }) => {
    const divRef = useRef(null);
    useEffect(() => {
      setRef(divRef);
      return () => {};
    }, [divRef, setRef]);
    let filterUsers;
    if (!searchText) filterUsers =  allUsers;
    else filterUsers = allUsers.filter(u => u.name.indexOf(searchText) !== -1 );
    return (
      <div
        ref={div => (divRef.current = div)}
        className={classes.customWidgetWrapper}
      >
        <div
          className={clx(classes.customWidget, open ? classes.active : null)}
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
                  value={searchText}
                  onChange={e => setSearchText(e.target.value)}
                />
                {filterUsers.map(u => {
                  const disabled = !!u.position && u.position.id !== positionId;
                  return (
                    <div
                      key={u.id}
                      className={clx(
                        classes.customTabPaneRow,
                        disabled ? classes.disabled : null
                      )}
                    >
                      <Checkbox
                        disabled={disabled}
                        checked={selectedKeys.indexOf(u.id) !== -1}
                        onClick={e => selectUserHandler(u.id, e.target.checked)}
                      />
                      &nbsp;&nbsp;{u.name}
                      {disabled && (
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
