import React from 'react'
import Home from './pages/Home';
import About from './pages/About';
import Project from './pages/Project';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Dashboard from './pages/Dashboard';
import Header from './components/Header';
import { BrowserRouter as Router, Route, Routes, BrowserRouter } from 'react-router-dom';
function App() {
  return (
    <BrowserRouter>
    <Header/>
    <Routes>
      <Route path="/" element={<Home />}/>
      <Route path="/about" element={<About />}></Route>
      <Route path="/projects" element={<Project />}></Route>
      <Route path="/signin" element={<SignIn />}></Route>
      <Route path="/signup" element={<SignUp />}></Route>
      <Route path="/dashboard" element={<Dashboard />}></Route>
    </Routes>
    </BrowserRouter>
  )
}

export default App