import { Avatar, Box, Flex, VStack,Text, Menu, Portal, MenuButton, MenuItem, MenuList, useToast } from "@chakra-ui/react"
import { Link } from "react-router-dom"
import { BsGithub, BsLinkedin } from "react-icons/bs";
import { CgMoreO } from "react-icons/cg";

const UserHeader = () => {

    const toast = useToast()

    const CopyURL = () => {
        navigator.clipboard.writeText(window.location.href).then(function() {
            toast({
                title: "Copied to clipboard",
                status: "success",
                duration: 2000,
                isClosable: true,
              })
          }, function(err) {
            console.error('Async: Could not copy text: ', err);
          });
    }

    return (
        <VStack gap={4} alignItems={"start"}>
            <Flex justifyContent={"space-between"} w={"full"}>   
                <Box>
                    <Text fontSize={"2xl"} fontWeight={"bold"}>Mohamed Gabr</Text>
                    <Flex gap={2}>
                        <Text fontSize={"sm"}>MohamedGabr</Text>
                        <Text fontSize={"xs"} bg={"gray.dark"} color={"gray.light"}>
                            threads.net
                        </Text>
                    </Flex>
                </Box>
                <Box>
                    <Avatar
                        size={{
                            base: "md",
                            md: "lg",
                        }} 
                        name="Mohamed Gabr"
                        src="/user_image.jpg"
                    />
                </Box>
            </Flex>
            <Text fontSize={"sm"}>Software Engineer</Text>
            <Flex justifyContent={"space-between"} w={"full"}>
            <Flex w={'full'} justifyContent={"space-between"}>
                <Flex gap={2} alignItems={"center"}>
                    <Text color={"gray.light"}>100 Followers</Text>
                    <Box w={1} h={1} bg={"gray.light"} borderRadius={"full"}></Box>
                    <Link color={"gray.light"} to={"https://www.linkedin.com/in/mohamed-gabr78/"}>LinkedIn.com</Link>
                    <Link color={"gray.light"} to={"https://github.com/mohamedgabr78"}>GitHub.com</Link>
                </Flex>
                <Flex gap={2}>
                    <Box>
                        <BsLinkedin size={24} cursor={"pointer"}/>
                    </Box>
                    <Box>
                        <BsGithub size={24} cursor={"pointer"} />
                    </Box>
                    <Box>
                        <Menu>
                            <MenuButton>
                                <CgMoreO size={24} cursor={"pointer"} />
                            </MenuButton>
                            <Portal>
                                <MenuList bg={"gray.dark"}>
                                    <MenuItem bg={"gray.dark"} onClick={CopyURL}>Copy Link</MenuItem>
                                </MenuList>
                            </Portal>
                        </Menu>
                    </Box>
                </Flex>
            </Flex>
            <Flex/>
            </Flex>
            <Flex w={"full"}>
            <Flex flex={1} borderBottom={"1.5px solid white"} justifyContent={"center"}
            cursor={"pointer"} padding={3} >
                <Text fontWeight={"bold"}>Threads</Text>
            </Flex>
            <Flex flex={1} borderBottom={"1.5px solid gray"} justifyContent={"center"}
             cursor={"pointer"} padding={3} color={"gray.light"}>
            <Text fontWeight={"bold"}>Replies</Text>
            </Flex>
            </Flex>
                
        </VStack>
    )
}

export default UserHeader