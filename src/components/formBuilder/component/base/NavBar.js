import React, { PureComponent } from 'react'
import { Button, Icon } from 'antd';

export default class NavBar extends PureComponent {
    render() {
        const {
            backCallback,
            name = "",
            isShowBtn,
            btnValue = "创建表单",
            isShowBackBtn = true,
            clickCallback = (() => { return 0; }),
            clickExtendCallBack
        } = this.props;
        return (
            <div className="formBuilder-NavBar">

                {
                    isShowBackBtn === true ?
                        <div className="headerBarBack">
                            <Button type="link" onClick={() => backCallback()}>
                                <Icon type="left" />
                                返回
                            </Button>
                        </div> : <div style={{flexGrow:1}}/>
                }

                <div className="headerBarTitle">
                    <span>{name}</span>
                </div>
                <div className="headerBarExtraTitle">
                    <span> 显示字段 </span>
                    <span onClick ={ clickExtendCallBack } > 筛选条件 </span>
                </div>
                <div className="headerBarButton">
                    {isShowBtn === true ?
                        <Button type="primary" onClick={() => clickCallback()}>
                            <Icon type="plus"></Icon>
                            {btnValue}
                        </Button> :
                        <></>}
                </div>
            </div>
        )
    }
}