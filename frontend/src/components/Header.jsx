import { Flex, Image, useColorMode, Link, Button } from "@chakra-ui/react"
import { useRecoilValue } from "recoil"
import { userAtom } from "../atoms"
import { AiFillHome } from "react-icons/ai"
import { RxAvatar } from "react-icons/rx"
import { Link as RouterLink } from "react-router-dom"
import { authScreenAtom } from "../atoms"
import { GrLogout } from "react-icons/gr";
import useLogOut from "../hooks/useLogOut"
import { BsFillChatFill } from "react-icons/bs"
import { MdOutlineSettings } from "react-icons/md"



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
            src={colorMode === "dark" ? "/light-logo.svg" : "/dark-logo.svg"}
            onClick={()=>toggleColorMode()}
            alt="logo" />

{user && (
				<Flex alignItems={"center"} gap={4}>
					<Link as={RouterLink} to={`/${user.username}`}>
						<RxAvatar size={24} />
					</Link>
					<Link as={RouterLink} to={`/chat`}>
						<BsFillChatFill size={20} />
					</Link>
                    <Link as={RouterLink} to={`/setting`}>
						<MdOutlineSettings size={20} />
					</Link>
                    <Button colorScheme="blue" variant="solid" size="xs" onClick={logOut} mt={1}>
                    <GrLogout size={15} />
                    </Button>
				</Flex>
			)}

        </Flex>
    )
}

export default Header