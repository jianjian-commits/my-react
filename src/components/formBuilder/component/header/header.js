import React, { PureComponent } from 'react'

import { Button } from 'antd';
import config from '../../config/config';
class HeaderTitle extends PureComponent {
    render() {
        return(
            <div className="formBuilder-Header">
                <div className="headerTitle">
                    <div onClick={()=>{window.location.href = config.hostUrl}} className="headerTitleIcon">
                        <img src='/image/headerIco.jpg'/>
                        <span>&nbsp;&nbsp;&nbsp;表单</span>
                    </div>
                    <div className="headerTitleBlank"/>
                    <div className="headerTitleUser">
                        <Button type="link">Jack</Button>
                        <span className="divider">|</span>
                        <Button type="link">退出</Button>
                    </div>
                </div>
            </div>
        );
    }
}

export default HeaderTitle;