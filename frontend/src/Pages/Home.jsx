import React from 'react'
import Navbar from '../Components/Navbar'
import Sidebar from '../Components/Sidebar'
import FindMyMatches from './FindMatches'

function Home() {
  return (
    <div>
      <Navbar/>
      <Sidebar/>
      <FindMyMatches/>
    </div>
  )
}

export default Home
