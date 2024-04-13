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
import OnlyPrivateRoute from './components/OnlyPrivateRoute';
import CreatePost from './pages/CreatePost';
import UpdatePost from './pages/UpdatePost';
import Users from './components/Users';
import PostPage from './pages/PostPage';
import ScrollToTop from './components/ScrollToTop';
function App() {
  return (
    <BrowserRouter>
    <ScrollToTop/>
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
      <Route  element={<OnlyPrivateRoute />}>
      <Route path="/createpost" element={<CreatePost />}></Route>
      <Route path="/updatepost/:postId" element={<UpdatePost />}></Route>
      <Route path='/users' element={<Users/>}></Route>
      </Route>
      <Route path="/post/:postslug" element={<PostPage />}></Route>
    </Routes>
    <FooterComponent/>
    </BrowserRouter>
  )
}

export default App