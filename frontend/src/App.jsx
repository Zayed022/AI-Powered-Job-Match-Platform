import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Route, Routes } from 'react-router-dom'
import SignIn from './Pages/SignIn'
import Login from './Pages/Login'
import Home from './Pages/Home'
import Profile from './Pages/Profile'
import Jobs from './Pages/Jobs'
import RegisterAdmin from './Pages/admin/RegisterAdmin'
import LoginAdmin from './Pages/admin/LoginAdmin'
import HomeAdmin from './Pages/admin/HomeAdmin'
import CreateJobs from './Pages/admin/CreateJobs'
import UpdateJobs from './Pages/admin/UpdateJobs'
import GetJobById from './Pages/admin/GetJobsById'
import DeleteJobs from './Pages/admin/DeleteJob'
import SearchJobs from './Pages/SearchJobs'

function App() {
  

  return (
    <>
      <Routes>
        <Route path="/register" element={<SignIn />} />
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Home />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/jobs" element={<Jobs />} />
        <Route path="/register-admin" element={<RegisterAdmin />} />
        <Route path="/login-admin" element={<LoginAdmin />} />
        <Route path="/home-admin" element={<HomeAdmin />} />
        <Route path="/admin/jobs/create-job" element={<CreateJobs />} />
        <Route path="/admin/jobs/update-job" element={<UpdateJobs />} />
        <Route path = "/admin/jobs/search" element = {<GetJobById/>}/>
        <Route path = "/admin/jobs/delete" element = {<DeleteJobs/>}/>
        <Route path = "/search" element = {<SearchJobs/>}/>
      </Routes>
    </>
  )
}

export default App
