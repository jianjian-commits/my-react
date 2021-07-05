
import DataSet from '@antv/data-set';
import { Chart } from '@antv/g2';
import { QuestionCircleOutlined } from '@ant-design/icons';
import './index.scss'
import { Row, Col, Radio, Divider, Statistic, Tooltip, Badge } from 'antd'
import React, { useState, useEffect, useRef } from 'react'
import UpCom from './upCom'

function Index() {

  const [currentTime, setCurrentTime] = useState('7')
  const container = useRef()

  const timeMap = [
    {
      title: '过去7日',
      value: "7"
    },
    {
      title: '过去30日',
      value: "30"
    },
    {
      title: '过去91日',
      value: "90"
    }
  ]

  const changeTime = (e) => {
    console.log(e.target.value);
    setCurrentTime(e.target.value)
  }

  useEffect(() => {
    fetch('https://gw.alipayobjects.com/os/antvdemo/assets/data/terrorism.json')
      .then(res => res.json())
      .then(data => {
        const ds = new DataSet();

        const chart = new Chart({
          container: container.current,
          autoFit: true,
          height: 300,
          width: 500,
          syncViewPadding: true,
        });

        chart.scale({
          Deaths: {
            sync: true,
            nice: true,
          },
          death: {
            sync: true,
            nice: true,
          },
        });


        const dv1 = ds.createView().source(data);
        dv1.transform({
          type: 'map',
          callback: (row) => {
            if (typeof (row.Deaths) === 'string') {
              row.Deaths = row.Deaths.replace(',', '');
            }
            row.Deaths = parseInt(row.Deaths, 10);
            row.death = row.Deaths;
            row.year = row.Year;
            return row;
          }
        });
        const view1 = chart.createView();
        view1.data(dv1.rows);
        view1.axis('Year', {
          subTickLine: {
            count: 3,
            length: 3,
          },
          tickLine: {
            length: 6,
          },
        });
        view1.axis('Deaths', {
          label: {
            formatter: text => {
              return text.replace(/(\d)(?=(?:\d{3})+$)/g, '$1,');
            }
          }
        });
        view1.line().position('Year*Deaths');


        const dv2 = ds.createView().source(dv1.rows);
        dv2.transform({
          type: 'regression',
          method: 'polynomial',
          fields: ['year', 'death'],
          bandwidth: 0.1,
          as: ['year', 'death']
        });

        const view2 = chart.createView();
        view2.axis(false);
        view2.data(dv2.rows);
        view2.line().position('year*death').style({
          stroke: '#969696',
          lineDash: [3, 3]
        })
          .tooltip(false);
        view1.annotation().text({
          content: '趋势线',
          position: ['1970', 2500],
          style: {
            fill: '#8c8c8c',
            fontSize: 14,
            fontWeight: 300
          },
          offsetY: -70
        });
        chart.render();
      });
  }, [])

  return (
    <div className="wrap">
      <Row>
        <Col span={18} className='gutter-row'>
          <h1>数据概览  </h1>
        </Col>
        <Col span={6} className='gutter-row switch-item'>
          <Radio.Group defaultValue={currentTime} buttonStyle="solid" onChange={changeTime}>
            {
              timeMap.map(({ title, value }) => (
                <Radio.Button key={value} value={value}>{title}</Radio.Button>
              ))
            }
          </Radio.Group>
        </Col>
      </Row>
      <Row>
        <Col span={12} offset={3}>
          <Divider />
        </Col>
        <Col span={6} offset={3}>
          <Divider />
        </Col>
      </Row>
      <Row>
        <Col span={16}>
          <h1>过去七日预约贴膜趋势</h1>
          <div className='antV' ref={container}>

          </div>
        </Col>
        <Col span={8}>
          <h1>过去七日预约贴膜合计</h1>
          <div style={{
          display: 'flex',
          justifyContent: 'center',
          flexDirection: 'column'
        }}>
            <Row gutter={16} style={{ marginBottom: '50px', marginTop: '20px' }}>
              <Col span={12}>
                <Statistic title="页面浏览次数(PV)" value={112893} />
              </Col>
              <Col span={12}>
                <Statistic title="页面浏览次数(UV)" value={112893} precision={2} />
              </Col>
            </Row>
            <Row gutter={16} style={{ marginBottom: '50px' }}>
              <Col span={12}>
                <Statistic title="预约贴膜总数" value={112893} valueStyle={{
                  color: 'red'
                }} />
              </Col>
              <Col span={12}>
                <Statistic title="到店核销总数" value={112893} precision={2} />
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12} >
                <Tooltip title="到店核销率=未完成邀约数/预约贴膜总数" placement="topLeft">
                  <Statistic title={<><span>未完成邀约数</span> <QuestionCircleOutlined /></>} value={112222222893} />
                </Tooltip>
              </Col>
              <Col span={12}>
                <Tooltip title="到店核销率=未完成邀约数/预约贴膜总数" placement="topLeft">
                  <Statistic title={<><span>到店核销率</span> <QuestionCircleOutlined /></>} value={112893} />
                </Tooltip>
              </Col>
            </Row>
          </div>
        </Col>
      </Row>
      <Row>
        <Col offset={4}>
          <UpCom></UpCom>
        </Col>
      </Row>
    </div>
  )
}
export default Index
