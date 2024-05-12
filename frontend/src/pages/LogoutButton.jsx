import { Button } from '@chakra-ui/react'
import { useSetRecoilState } from 'recoil'
import { userAtom } from '../atoms/userAtoms'
import useShowToast from '../hooks/useShowToast'
import { GrLogout } from "react-icons/gr";

function LogoutButton() {

    const setUser = useSetRecoilState(userAtom)
    const showToast = useShowToast()
    const handleLogout = async() => {
        try {
            const res = await fetch('/api/users/logout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            const data = await res.json()
            if(data.error) {
                showToast('Error', data.error, )
            }
            else {
                localStorage.removeItem('user-threads')
                window.location.href = '/'
                setUser(null)
            }
        } catch (error) {
            console.log(error)
        }
    }

  return (
    <Button colorScheme='red' onClick={handleLogout} position={'fixed'} top={'30px'} right={'30px'}>
        <GrLogout size={20}/> 
    </Button>
  )
}

export default LogoutButton