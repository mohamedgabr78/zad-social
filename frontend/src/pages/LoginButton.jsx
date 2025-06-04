import { Button } from '@chakra-ui/react'
import { Link } from 'react-router-dom'

function LoginButton() {

    const handleLogin = () => {
        window.location.href = '/auth'
    }
    
  return (
    <>
    <Button colorScheme="blue" variant="solid" size="sm" mb={5} >
    <Link to="/auth" onClick={handleLogin}>Login</Link>
    </Button>
    </>
  )
}

export default LoginButton