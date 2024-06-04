import { Flex, Text, Box, Avatar, Image, Skeleton } from '@chakra-ui/react'
import { BsCheck2All } from 'react-icons/bs'
import { useRecoilValue } from 'recoil'
import { selectedConversationAtom, userAtom } from '../atoms/'
import { useState } from 'react'

function Message({ownMessage, message}) {

  const selectedConversation = useRecoilValue(selectedConversationAtom);
  const currentUser = useRecoilValue(userAtom);
  const [imageLoaded, setImageLoaded] = useState(false);
 
  return (
    <>
    {ownMessage ? (
    <Flex gap={2} alignSelf={'flex-end'}>
      {message.text && (
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
      )}
      {message.img && !imageLoaded && (
        <Flex mt={5} w={"200px"}>
        <Image src={message.img} alt="img" borderRadius={4} hidden onLoad={()=>setImageLoaded(true)}/>
        <Box
              alignSelf={"flex-end"}
              ml={1}
              color={message.seen ? "blue.400" : ""}
              fontWeight={"bold"}
            >
              <BsCheck2All size={16} />
            </Box>
        <Skeleton w={"200px"} h={"200px"} />
      </Flex>
      )}
      {message.img && imageLoaded && (
        <Flex mt={5} w={"200px"}>
          <Image src={message.img} alt="img" borderRadius={4}/>
        </Flex>
      )}
      <Avatar size="sm" src={currentUser.profilePic}/>
        </Flex>
    ) : (
    <Flex gap={2} >
        <Avatar size="sm" src={selectedConversation.profilePic}/>
        {message.text && (
        <Flex bg={"gray.500"} maxW={"350px"} p={1} borderRadius={"md"}>
          <Text color={"white"}>
              {message.text}
          </Text>
        </Flex>
        )}
        {message.img && !imageLoaded && (
        <Flex mt={5} w={"200px"}>
          <Image src={message.img} alt="img" borderRadius={4} hidden onLoad={()=>setImageLoaded(true)}/>
          <Skeleton w={"200px"} h={"200px"} />
        </Flex>
      )}
      {message.img && imageLoaded && (
        <Flex mt={5} w={"200px"}>
          <Image src={message.img} alt="img" borderRadius={4}/>
        </Flex>
      )}
    </Flex>
    )

    }
    </>
  )
}

export default Message