import React from "react";
import { Menu, Icon } from "antd";
import "./draggableList.scss";

const { SubMenu } = Menu;

const DraggableWrapper = ({ draggable = false, formId, onDrop, children }) => (
  <div
    draggable={draggable}
    onDragStart={e => e.dataTransfer.setData("formId", formId)}
    onDragOver={e => e.preventDefault()}
    onDrop={onDrop}
  >
    {children}
  </div>
);
export const DropableWrapper = ({ onDrop, children, ...props }) => (
  <div onDragOver={e => e.preventDefault()} onDrop={onDrop} {...props}>
    {children}
  </div>
);

const DraggableList = ({
  draggable = false,
  selected,
  groups,
  list,
  onDrop,
  ...props
}) => {
  return (
    <Menu {...props} className="draggable-list" selectedKeys={selected} mode="inline" theme="light">
      {groups &&
        groups.map((g, i) => {
          const dropHandle = e =>
            onDrop(e.dataTransfer.getData("formId"), g.key);
          return (
            <SubMenu
              key={g.key || i}
              title={
                <DropableWrapper onDrop={dropHandle}>
                  <span>
                    <Icon type="folder" />
                    <span>{g.name}</span>
                  </span>
                </DropableWrapper>
              }
            >
              {g.list &&
                g.list.map((l, n) => (
                  <Menu.Item key={l.key || n} className="draggable-menu-item">
                    <DraggableWrapper
                      draggable={draggable}
                      formId={l.key}
                      onDrop={dropHandle}
                    >
                      {l.key !== -1 ? <Icon type={l.icon || "table"} /> : ""}
                      <span>{l.name}</span>
                    </DraggableWrapper>
                  </Menu.Item>
                ))}
            </SubMenu>
          );
        })}
      {list &&
        list.map((l, n) => (
          <Menu.Item key={l.key || n} className="draggable-menu-item">
            <DraggableWrapper
              draggable={draggable}
              formId={l.key}
              onDrop={e => onDrop(e.dataTransfer.getData("formId"), null)}
            >
              {l.key !== "" ? <Icon type={l.icon || "table"} /> : ""}
              <span>{l.name}</span>
            </DraggableWrapper>
          </Menu.Item>
        ))}
    </Menu>
  );
};
export default DraggableList;
