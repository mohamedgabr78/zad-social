import { Flex, Text, Box, Avatar } from '@chakra-ui/react'
import { BsCheck2All } from 'react-icons/bs'

function Message({ownMessage}) {
  return (
    <>
    {ownMessage ? (
    <Flex gap={2} alignSelf={'flex-end'}>
        <Flex bg={"blue.500"} maxW={"350px"} p={1} borderRadius={"md"}>
        <Text color={"white"}>
            Lorem ipsum dolor sit amet consectetue modi nam possimus aut, voluptatem eligendi eum quos numquam!
        </Text>
							{/* <Box
								alignSelf={"flex-end"}
								ml={1}
								color={true? "blue.400" : ""}
								fontWeight={"bold"}
							>
								<BsCheck2All size={16} />
							</Box> */}
        </Flex>
        <Avatar size="sm" src=''/>
    </Flex>
    ) : (
    <Flex gap={2} >
        <Avatar size="sm" src=''/>
        <Flex bg={"gray.500"} maxW={"350px"} p={1} borderRadius={"md"}>
        <Text color={"white"}>
            Lorem ipsum dolor sit amet consecut, voluptatem eligendi eum quos numquam!
        </Text>
        </Flex>
    </Flex>
    )

    }
    </>
  )
}

export default Message