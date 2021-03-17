import React from 'react'
import { Layout, Menu, Breadcrumb } from 'antd';
import { UploadOutlined, UserOutlined, VideoCameraOutlined } from '@ant-design/icons';
import './layout.css'

const { Header, Content, Sider } = Layout;

const { SubMenu } = Menu;

export default function Index() {

    const menuData = [
        {
            key: '/manage',
            path: '/manage',
            text: 'dooring工作台'
          },
          {
            key: '/manage/anazly',
            path: '/manage/anazly',
            text: '数据大盘',
          },
          {
            key: '/manage/auth',
            path: '/manage/auth',
            text: '会员管理',
            auth: true,
          },
          {
            key: '/manage/h5',
            text: 'H5服务中心',
            sub: [
              {
                key: '/manage/h5/config',
                path: '/manage/h5/config',
                text: 'H5页面管理',
              },
              {
                key: '/manage/h5/tpl',
                path: '/manage/h5/tpl',
                text: '模板库',
                auth: true,
              }
            ]
          }
    ]

    const createMenu = (menu = []) => {
        return (menu.map(item => {
            if(item.sub) {
                return <SubMenu key={item.key} title={item.text}>
                          { createMenu(item.sub) }
                       </SubMenu>
              }else {
                if(item.auth || !item.auth) {
                  return <Menu.Item key={item.key}>
                           {/* <Link to={item.path}>{ item.text }</Link> */}
                           { item.text }
                         </Menu.Item>
                }else {
                  return null
                }
              }
        }))
    }

    return (
        <Layout>
            <Sider
                style={{
                    height: '100vh'
                }}
                breakpoint="lg"
                collapsedWidth="0"
                onBreakpoint={broken => {
                    console.log(broken);
                }}
                onCollapse={(collapsed, type) => {
                    console.log(collapsed, type);
                }}
            >
                <div className="logo">logo</div>
                <Menu theme="dark" mode="inline" defaultSelectedKeys={['/manage/anazly']}>
                    {/* <Menu.Item key="1" icon={<UserOutlined />}>
                        nav 1
                    </Menu.Item>
                    <Menu.Item key="2" icon={<VideoCameraOutlined />}>
                        nav 2
                    </Menu.Item>
                    <Menu.Item key="3" icon={<UploadOutlined />}>
                        nav 3
                    </Menu.Item>
                    <Menu.Item key="4" icon={<UserOutlined />}>
                        nav 4
                    </Menu.Item> */}
                    {
                        createMenu(menuData)
                    }
                </Menu>
                
            </Sider>
            <Layout className="layout">
                <Header className="header site-layout-sub-header-background" style={{ padding: 0 }}>xxxx </Header>
                <Breadcrumb style={{ margin: '16px 24px 0' }}>
                    <Breadcrumb.Item>Home</Breadcrumb.Item>
                    <Breadcrumb.Item>List</Breadcrumb.Item>
                    <Breadcrumb.Item>App</Breadcrumb.Item>
                </Breadcrumb>
                <Content style={{ margin: '24px 16px 0' }}>
                    content
                </Content>
            </Layout>
        </Layout>
    )
}
