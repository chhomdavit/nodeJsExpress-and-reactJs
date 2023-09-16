import React from 'react'
import { Outlet } from 'react-router-dom';
import Navbar from '../navbar/Navbar';
import Footer from '../footer/Footer';
import { Divider } from 'antd';

const RootLayout = () => {
  return (
    <div>
      <Navbar/>
       <main>
         <Outlet/>
      </main>
      <Divider/>
      <Footer/>
    </div>
  )
}

export default RootLayout
