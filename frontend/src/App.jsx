import { Container } from "@chakra-ui/react";
import { Navigate, Route, Routes } from "react-router-dom";
import UserPage from "./pages/UserPage";
import PostPage from "./pages/PostPage";
import AuthPage from "./pages/AuthPage";
import Header from "./components/Header";
import { useRecoilValue } from "recoil";
import HomePage from "./pages/HomePage";
import { userAtom } from "./atoms/userAtoms";
import LogoutButton from "./pages/LogoutButton";

function App() {

  const user = useRecoilValue(userAtom)

  return (
    <Container maxW='620'>
      <Header />
      <Routes>
        <Route path="/" element={user? <HomePage/> : <Navigate to={'/auth'}/> } />
        <Route path='/auth' element={!user? <AuthPage /> : <Navigate to={'/'}/>} />
        <Route path='/:username' element={<UserPage />} />
        <Route path='/:username/post/:pid' element={<PostPage />} />
      </Routes>  

      {user? <LogoutButton /> : null}
    </Container>
  )
}

export default App
