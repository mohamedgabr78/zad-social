import { Flex, Image, useColorMode, Link, Button } from "@chakra-ui/react"
import { useRecoilValue } from "recoil"
import { userAtom } from "../atoms"
import { AiFillHome } from "react-icons/ai"
import { RxAvatar } from "react-icons/rx"
import { Link as RouterLink } from "react-router-dom"
import { authScreenAtom } from "../atoms"
import { GrLogout } from "react-icons/gr";
import useLogOut from "../hooks/useLogOut"



const Header = () => {

    const {colorMode, toggleColorMode} = useColorMode()
    const logOut = useLogOut()
    const user = useRecoilValue(userAtom)
    return (
        <Flex justifyContent={"space-between"} mt={6} mb={12}>

            {user && (
				<Link as={RouterLink} to='/'>
					<AiFillHome size={24} />
				</Link>
			)}

			{!user && window.location.pathname !== "/auth" && (
                <Button colorScheme="blue" variant="solid" size="sm" mb={5} >
				<Link as={RouterLink} to={"/auth"} onClick={() => authScreenAtom("login")}>
                    Login
                </Link>
                </Button>
			)}

            {!user && (
				<Link as={RouterLink} to={"/auth"} onClick={() => authScreenAtom("login")} />
			)}


            <Image
            cursor={"pointer"}
            w={6}
            src={colorMode === "dark" ? "/light_logo.svg" : "/dark_logo.svg"}
            onClick={()=>toggleColorMode()}
            alt="logo" />

{user && (
				<Flex alignItems={"center"} gap={4}>
					<Link as={RouterLink} to={`/${user.username}`}>
						<RxAvatar size={24} />
					</Link>
                    <Button colorScheme="blue" variant="solid" size="sm" onClick={logOut}>
                    <GrLogout size={24} />
                    </Button>
				</Flex>
			)}

        </Flex>
    )
}

export default Header