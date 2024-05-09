
import { useRecoilValue } from 'recoil'
import { authScreenAtom } from '../atoms/authAtoms'
import LoginCard from '../components/LoginCard'
import SignupCard from '../components/SignupCard'

const AuthPage = () => {

    const authScreenState = useRecoilValue(authScreenAtom)

return (

    <div>
        {authScreenState === 'login' ? <LoginCard /> : <SignupCard />}
    </div>
)
}

export default AuthPage