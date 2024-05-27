import { Avatar, Flex, Text, Image, Divider, SkeletonCircle, Skeleton } from '@chakra-ui/react'
import Message from './Message'

function MessageContainer() {
  return (
    <Flex flex={70} borderRadius={"md"} p={2} flexDir={"column"} bg={"gray.600"} >
        <Flex flexDir={"column"} p={2} overflowY={"auto"} maxH={"80vh"}>
            {/* Messages */}
			<Flex w={"full"} h={12} alignItems={"center"} gap={2}>
				<Avatar src='' size={"sm"} />
				<Text display={"flex"} alignItems={"center"}>
                    Username
					<Image src='/verified.png' w={4} h={4} ml={1} />
				</Text>
			</Flex>
        </Flex>
        <Divider />
        <Flex flexDir={"column"} gap={4} my={4} p={2} height={"400px"} overflowY={"auto"}>
            {true && (
					[...Array(5)].map((_, i) => (
						<Flex
							key={i}
							gap={2}
							alignItems={"center"}
							p={1}
							borderRadius={"md"}
                            // if i is even, align the message to the start, else align the message to the end
							alignSelf={i % 2 === 0 ? "flex-start" : "flex-end"}
						>
							{i % 2 === 0 && <SkeletonCircle size={7} />}
							<Flex flexDir={"column"} gap={2}>
								<Skeleton h='8px' w='250px' />
								<Skeleton h='8px' w='250px' />
								<Skeleton h='8px' w='250px' />
							</Flex>
                            {/** if i is odd, show the avatar after the message*/}
							{i % 2 !== 0 && <SkeletonCircle size={7} />}
						</Flex>
                    ))
            )}
            <Message ownMessage={true}/>
            <Message ownMessage={false}/>
            <Message ownMessage={true}/>
            <Message ownMessage={false}/>
            <Message ownMessage={false}/>
        </Flex>
    </Flex>
  )
}

export default MessageContainer