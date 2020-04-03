import React from "react";
import { Menu, Icon } from "antd";
import { useLocation,useParams } from "react-router-dom"
import "./draggableList.scss";
import { TableIcon } from "../../assets/icons/index"
import OperateBox from "./Operatebox"
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
  const { pathname } = useLocation()
  const { appId } = useParams() 
  const [ isShowOperate, setIsShowOperate] = React.useState(false)

  React.useEffect(()=>{
    if(!pathname.includes("/detail")){
      setIsShowOperate( true )
    }
  },[])

  return (
    <Menu {...props} className="draggable-list" selectedKeys={selected} mode="inline" theme="light"
    >
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
                      {l.key !== -1 ? <Icon component={l.icon || TableIcon} /> : ""}
                      <span>{l.name}</span>
                    </DraggableWrapper>
                    {isShowOperate? 
                    <OperateBox 
                    formId = {l.key}
                    appId = { appId }
                    formname = {l.name}
                    deleteForm = { props.deleteForm }
                    updateFormName = { props.updateFormName }
                    isDeleteOne = { props.isDeleteOne}
                    />:null}
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
              {l.key !== "" ? <Icon component={l.icon || TableIcon} /> : ""}
              <span className="draggable-menu-item-title">{l.name}</span>
            </DraggableWrapper>
            {isShowOperate? 
            <OperateBox 
            formId = {l.key}
            appId = { appId }
            formname = {l.name}
            deleteForm = { props.deleteForm }
            updateFormName = { props.updateFormName }
            isDeleteOne = { props.isDeleteOne}
            />:null}
          </Menu.Item>
        ))}
        
    </Menu>
  );
};
export default DraggableList;
