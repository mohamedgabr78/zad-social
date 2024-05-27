import {
	Avatar,
	AvatarBadge,
	Box,
	Flex,
	Image,
	Stack,
	Text,
	WrapItem,
	useColorMode,
	useColorModeValue,
} from "@chakra-ui/react";

function Conversation() {
  return (
    <Flex
    gap={4}
    alignItems={"center"}
    p={"1"}
    _hover={{
        cursor: "pointer",
        bg: useColorModeValue("gray.600", "gray.dark"),
        color: "white",
    }}
    borderRadius={"md"}
    >
        <WrapItem>
            <Avatar size={{
                base: "xs",
                sm: "sm",
                md: "md",
            }}>
                <AvatarBadge boxSize="1em" bg="green.500" />
            </Avatar>
        </WrapItem>
        <Stack>
            <Text fontWeight={700} display={'flex'} alignItems={'center'}>
                Username
                <Image src="/verified.png" alt="online" boxSize={2} ml={1} w={4} h={4} />
                </Text>
            <Text fontSize={"xs"} display={'flex'} alignItems={'center'} gap={1}>Last message</Text>
        </Stack>
    </Flex>
  )
}

export default Conversation