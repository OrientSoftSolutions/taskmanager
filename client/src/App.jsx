import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Dashboard from './pages/Dashboard'
import Task from './pages/Task'
import Report from './pages/Report'
import Project from './pages/Project_page'
import Project_page from './pages/Project_page'
import Welcome from './components/Welcome'
import Sign_in from './pages/Sign_in'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { useAuthContext } from './contexts/AuthContext'
import AddUser from './pages/AddUser'
import Preview from './pages/Preview'


function App() {
  const { user } = useAuthContext();

  return (
    <>
      <Routes>
        {user ? <><Route path='/' element={<Dashboard />} />
          <Route path='/project' element={<Project_page />} />

          {user?.role === 'admin' && <>
            <Route path='/adduser' element={<AddUser />} />
            <Route path='/task' element={<Task />} />
          </>}
          {(user?.role === 'admin' || user?.role === 'viewer') && <>
            <Route path='/report' element={<Report />} />
            <Route path='/preview' element={<Preview />} />

             </>} </> : <Route path='/' element={<Sign_in />} />}
      </Routes>
    </>
  )
}

export default App
