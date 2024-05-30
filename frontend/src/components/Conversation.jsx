import {
	Avatar,
	AvatarBadge,
	Flex,
	Image,
	Stack,
	Text,
	WrapItem,
	useColorModeValue,
} from "@chakra-ui/react";
import { useRecoilState } from "recoil";
import { userAtom } from "../atoms";
import { BsCheck2All } from "react-icons/bs";
import { selectedConversationAtom } from "../atoms/messagesAtoms";



function Conversation(conversation) {

    const currentUser = useRecoilState(userAtom);
    const colorMode = useColorModeValue("gray.600", "gray.dark");
    const [selectedConversation, setSelectedConversation] = useRecoilState(selectedConversationAtom);
    const user = conversation.conversation.members[0];
    const lastMessage = conversation.conversation.lastMessage;


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
    onClick={() => setSelectedConversation({
        conversationId: conversation.conversation._id,
        userId: user._id,
        username: user.username,
        profilePic: user.profilePic,
    })}
    bg={selectedConversation.userId === user._id ? colorMode: ""}
    borderRadius={"md"}
    >
        <WrapItem>
            <Avatar size={{
                base: "xs",
                sm: "sm",
                md: "md",
            }}
            src={user.profilePic}
            >
                <AvatarBadge boxSize="1em" bg="green.500" />
            </Avatar>
        </WrapItem>
        <Stack>
            <Text fontWeight={700} display={'flex'} alignItems={'center'}>
                {user.username}
                <Image src="/verified.png" alt="online" boxSize={2} ml={1} w={4} h={4} />
                </Text>
            <Text fontSize={"xs"} display={'flex'} alignItems={'center'} gap={1}>
                {lastMessage.sender === currentUser[0]._id ? <BsCheck2All size={16}/> : ''}
                {lastMessage.text.length > 15 ? lastMessage.text.slice(0, 15) + '...' : lastMessage.text    
        }</Text>
        </Stack>
    </Flex>
  )
}

export default Conversation