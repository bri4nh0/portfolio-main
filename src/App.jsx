import { BrowserRouter, Route, Routes, Router } from 'react-router-dom'
import { Home } from './pages/Home'
import { NotFound } from './pages/NotFound'
import { Toaster } from "@/components/ui/toaster";
import  BlogDirectory  from './pages/BlogDirectory';
import  BlogPost from './pages/BlogPost';

function App() {
  return (
    <>
    <Toaster />
      <BrowserRouter>
        <Routes>
          <Route index element={<Home />} />
          <Route path="*" element={<NotFound/>} />
          <Route path="/blog" element={<BlogDirectory />} />
          <Route path="/blog/:id" element={<BlogPost />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
