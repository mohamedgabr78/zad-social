import { Button } from '@chakra-ui/react'
import { useSetRecoilState } from 'recoil'
import { userAtom } from '../atoms/userAtoms'
import useShowToast from '../hook/useShowToast'

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
    <Button colorScheme='red' onClick={handleLogout}>
        Logout
    </Button>
  )
}

export default LogoutButton