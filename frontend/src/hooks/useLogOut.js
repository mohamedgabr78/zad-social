import { useSetRecoilState } from 'recoil'
import { userAtom } from '../atoms/userAtoms'
import useShowToast from './useShowToast'

function useLogOut() {
    const setUser = useSetRecoilState(userAtom)
    const showToast = useShowToast()

    const logout = async() => {
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
                setUser(null)
            }
        } catch (error) {
            showToast('Error', error, 'error')
        }
    }

  return(
    logout
)
}

export default useLogOut