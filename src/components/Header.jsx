import { Flex, Image, useColorMode } from "@chakra-ui/react"

const Header = () => {

    const {colorMode, toggleColorMode} = useColorMode()
    return (
        <Flex justifyContent={"center"} mt={6} mb={12}>
            <Image
            cursor={"pointer"}
            w={6}
            src={colorMode === "dark" ? "/light_logo.svg" : "/dark_logo.svg"}
            onClick={()=>toggleColorMode()}
            alt="logo" />

        </Flex>
    )
}

export default Header