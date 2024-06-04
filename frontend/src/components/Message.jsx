import { Flex, Text, Box, Avatar } from '@chakra-ui/react'
import { BsCheck2All } from 'react-icons/bs'
import { useRecoilValue } from 'recoil'
import { selectedConversationAtom, userAtom } from '../atoms/'

function Message({ownMessage, message}) {

  const selectedConversation = useRecoilValue(selectedConversationAtom);
  const currentUser = useRecoilValue(userAtom);
 
  return (
    <>
    {ownMessage ? (
    <Flex gap={2} alignSelf={'flex-end'}>
						<Flex bg={"green.400"} maxW={"350px"} p={1} borderRadius={"md"}>
							<Text color={"white"}>{message.text}</Text>
              <Box
								alignSelf={"flex-end"}
								ml={1}
								color={message.seen ? "blue.400" : ""}
								fontWeight={"bold"}
							>
								<BsCheck2All size={16} />
							</Box>
						</Flex>
      <Avatar size="sm" src={currentUser.profilePic}/>
        </Flex>
    ) : (
    <Flex gap={2} >
        <Avatar size="sm" src={selectedConversation.profilePic}/>
        <Flex bg={"gray.500"} maxW={"350px"} p={1} borderRadius={"md"}>
        <Text color={"white"}>
            {message.text}
        </Text>
        </Flex>
    </Flex>
    )

    }
    </>
  )
}

export default Message