import { Button, Text } from '@chakra-ui/react'
import useShowToast from '../hooks/useShowToast'
import useLogOut from '../hooks/useLogOut'

function SettingPage() {

    const showToast = useShowToast()
    const logOut = useLogOut()

    const freezeAccount = async () => {
        if(!window.confirm('Are you sure you want to freeze your account?')) return
        try {
            const res = await fetch('/api/users/freeze', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            const data = await res.json()
            if(data.error) {
                showToast('Error', data.error, 'error')
                return
            }
            await logOut()
            showToast('Success', 'Your account has been frozen', 'success')
        } catch (error) {
            showToast('Error', error, 'error')
        }
    }

  return (
    <>
    <Text my={1} fontWeight={"bold"}>Freeze Your Account</Text>
    <Text my={1}>Come Back with Just Logging In</Text>
    <Button colorScheme={"red"} onClick={freezeAccount} size={'sm'}>Freeze</Button>
    </>
  )
}

export default SettingPage