import React, { useEffect, useState } from 'react'
import './style.css'
import BScroll from '@better-scroll/core'
import Pullup from '@better-scroll/pull-up'
import PullDown from '@better-scroll/pull-down'
BScroll.use(PullDown)
BScroll.use(Pullup)

export default function Index( props ) {

    const scrollViewDom = React.createRef()
    const [beforePullDown, setBeforePullDown] = useState(true)
    useEffect(() => {
        const scroll = new BScroll(scrollViewDom.current, {
            tap: true,
            click: true,
            probeType: 3,
            // freeScroll: true,
            bounce: true,
            // scrollX: true,
            scrollbars: true,
            pullDownRefresh: {
                threshold: 100, //配置顶部下拉的距离来决定刷新时机。
                stop: 46 // 执行刷新时候 停留的距离位置
            }
        })
        scroll.on('beforeScrollStart', () => {
            scroll.refresh();
        })

        scroll.on('pullingDown', () => {
            console.log('刷新......'); // 下拉刷新时候执行的操作
            setTimeout(() => {
                scroll.finishPullDown()
            }, 2000);
        })
        
        scroll.on('scroll', () => {
            // console.log('scroll......'); // 滚动时候就会触发
        })

        scroll.on('scrollEnd', e => {
            console.log('scrollEnd......'); // 滚动结束时候会触发
          })
        
    }, [])



    return (
        <div className='scroll-view' ref={ scrollViewDom }>
            <div className="scroll-wrap">
                {
                    beforePullDown && <div className="beforePullDown">
                        loading......
                    </div>
                }
                { props.children }
            </div>
        </div>
    )
}
