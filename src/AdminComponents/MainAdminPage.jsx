import React from 'react'
import { ToastContainer } from 'react-toastify'
import { Outlet } from 'react-router-dom'

const MainAdminPage = () => {
  return (
    <div className='d-flex justify-content-center align-items-center' style={{ width: '100vw', height: '100vh', backgroundColor: '#f2f7ffff' }}>
      <Outlet />
      <ToastContainer autoClose={5000} hideProgressBar={true} toastClassName="custom-toast" />
    </div>
  )
}

export default MainAdminPage