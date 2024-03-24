import React from 'react'
import Home from './pages/Home';
import About from './pages/About';
import Project from './pages/Project';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Dashboard from './pages/Dashboard';
import Header from './components/Header';
import { BrowserRouter as Router, Route, Routes, BrowserRouter } from 'react-router-dom';
import FooterComponent from './components/Footer';
import PrivateRoute from './components/PrivateRoute';
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
      <Route  element={<PrivateRoute />}>
      <Route path="/dashboard" element={<Dashboard />}></Route>
      </Route>
    </Routes>
    <FooterComponent/>
    </BrowserRouter>
  )
}

export default App