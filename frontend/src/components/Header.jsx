import { Flex, Image, useColorMode, Link } from "@chakra-ui/react"
import { useRecoilValue } from "recoil"
import { userAtom } from "../atoms"
import { AiFillHome } from "react-icons/ai"
import { RxAvatar } from "react-icons/rx"


const Header = () => {

    const {colorMode, toggleColorMode} = useColorMode()
    const user = useRecoilValue(userAtom)
    return (
        <Flex justifyContent={"space-between"} mt={6} mb={12}>

            {user && <Link to="/">
            <AiFillHome size={24} />
            </Link>
            }

            <Image
            cursor={"pointer"}
            w={6}
            src={colorMode === "dark" ? "/light_logo.svg" : "/dark_logo.svg"}
            onClick={()=>toggleColorMode()}
            alt="logo" />

            {user && <Link to={`/${user.username}`}>
            <RxAvatar size={24}/>
            </Link>
            }

        </Flex>
    )
}

export default Header