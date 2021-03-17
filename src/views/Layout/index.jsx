import React, { useState } from 'react'
import Scroll from './scroll'
import './index.css'

export default function Index() {
    
    const arr = new Array(30).fill(1)

    const [listData, setListData] = useState(arr)

    return (
        <Scroll>
            {
                listData.map((item, index) =>{
                    return(
                        <li className='item' key={ index }>{item}</li>
                    )
                })
            }
        </Scroll>
    )
}
