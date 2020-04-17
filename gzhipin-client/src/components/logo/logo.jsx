import React,{Component} from 'react'

import './css/logo.css'
import logo from './imgs/logo.png'

export default function Logo(){
    return (
      <div className='logo-container'>
        <img src={logo} alt="logo" className='logo-img'/>
      </div>
    )
}
