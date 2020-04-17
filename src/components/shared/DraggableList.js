import React from "react";
import { Menu, Icon } from "antd";
import { useLocation,useParams } from "react-router-dom"
import "./draggableList.scss";
import { TableIcon } from "../../assets/icons/index"
import OperateBox from "./Operatebox"
const { SubMenu } = Menu;

const DraggableWrapper = ({ draggable = false, formId, index, onDragStart, onDrop, onDrag, onDragEnd,  onDragEnter, onDragLeave, children }) => (
  <div
    className="drag-target"
    draggable={draggable}
    // onDragStart={ onDragStart }
    onDragStart={e => {
      e.dataTransfer.setData("formId", formId)
      e.dataTransfer.setData("formIndex",index)
    }}
    onDrag = { e=> onDrag(e) }
    onDragEnd = {e =>  onDragEnd(e) }

    onDragOver={e => e.preventDefault()}
    onDragEnter =  { e=> onDragEnter(e) }
    onDragLeave = {e=> onDragLeave(e) }
    onDrop={e => onDrop(e)}
  >
    {children}
  </div>
);

//好像没有用
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
  const { pathname } = useLocation();
  const { appId } = useParams();
  const [ isShowOperate, setIsShowOperate] = React.useState(false);
  const [ originlist, setOriginlist ] = React.useState([]);

  React.useEffect(()=>{

    setOriginlist(list)

    if(!pathname.includes("/detail")){
      setIsShowOperate( true )
    }
  },[pathname])
  //针对于拖动盒子本身
//1
const onDragFun = e =>{
  // console.log(e.target)
}
//2
const onDragEndFun = e =>{
  // console.log(e.dataTransfer.getData("formId"))
}

//针对于目标盒子

//3拖动过程中
const onDragEnterFun = e =>{
  let targetDom = e.target;
  if(targetDom.className === 'drag-target'){
    let targetDomParent = targetDom.parentNode;
    targetDomParent.style.border = "1px dotted red";
    // console.log(targetDomParent)
  }
  }

//4拖动结束
const onDragLeaveFun = e =>{
  let targetDom = e.target;
  if(targetDom.className === 'drag-target'){
    let targetDomParent = targetDom.parentNode;
    targetDomParent.style.border = "";
    // console.log(targetDomParent)
  }
}

const onDropFun = e =>{
  let originIndex = e.dataTransfer.getData("formIndex");
  let targetIndex = e.target.parentNode.dataset.index;
  let newListArr = ChangeSecquence(list,originIndex,targetIndex);
  console.log(originIndex,targetIndex)
  console.log(list)
  console.log(newListArr)
}

//5
const ChangeSecquence = ( originListArr=[], originIndex, targetIndex ) =>{
      let newListArr = [];
      let originMiddleList = JSON.parse(JSON.stringify(originListArr));
      if(originIndex && targetIndex && originIndex !== targetIndex){
        let originValueObj = originListArr[ originIndex ];
        let tartgetValueObj = originListArr[ targetIndex ];
        console.log(originValueObj,tartgetValueObj)
        originMiddleList.splice(originIndex,1,tartgetValueObj);
        originMiddleList.splice(targetIndex,1,originValueObj);
        newListArr = originMiddleList;
      }else{
        newListArr = originMiddleList;
      }

      return newListArr;
}
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
          <Menu.Item data-index={n} key={l.key || n} className="draggable-menu-item">
            <DraggableWrapper
              draggable={draggable}
              formId={l.key}
              index={n}
              onDrag = {
                e=>onDragFun(e)
              }
              onDragEnd ={
                e=>onDragEndFun(e)
              }
              onDragEnter = {
                e=>onDragEnterFun(e)
              }
              onDragLeave = {
                e=>onDragLeaveFun(e)
              }
              onDrop={
                e => {
                  onDropFun(e)
                }
              }
              
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
