import { Box, Container } from "@chakra-ui/react";
import { Navigate, Route, Routes } from "react-router-dom";
import UserPage from "./pages/UserPage";
import PostPage from "./pages/PostPage";
import AuthPage from "./pages/AuthPage";
import Header from "./components/Header";
import { useRecoilValue } from "recoil";
import HomePage from "./pages/HomePage";
import { userAtom } from "./atoms/userAtoms";
import UpdateProfile from "./pages/UpdateProfile";
import CreatePost from "./components/CreatePost";
import ChatPage from "./pages/ChatPage";
import { useLocation } from 'react-router-dom';



function App() {

  const user = useRecoilValue(userAtom)
  const location = useLocation();
  const path = location.pathname;

  return (
    <Box position={'relative'} w={'full'}>
    <Container maxW={path==="/"? "900px" :'620'}>
      <Header />
      <Routes>
        <Route path="/" element={user? <HomePage/> : <Navigate to={'/auth'}/> } />
        <Route path='/auth' element={!user? <AuthPage /> : <Navigate to={'/'}/>} />
        <Route path='/update' element={user? <UpdateProfile /> : <Navigate to={'/auth'}/>} />
        <Route path='/:username' element={<UserPage />} />
        <Route path='/:username/post/:pid' element={<PostPage />} />
        <Route path='/chat' element={user? <ChatPage /> : <Navigate to={'/auth'}/>} />
      </Routes>  

      {user && path !== '/chat' && <CreatePost />}
    </Container>
    </Box>
  )
}

export default App
