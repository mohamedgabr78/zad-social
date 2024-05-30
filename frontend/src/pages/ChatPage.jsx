import { Box, Flex, Text, Button, Input, SkeletonCircle, Skeleton } from '@chakra-ui/react'
import { SearchIcon } from '@chakra-ui/icons'
import Conversation from '../components/Conversation';
import { GiConversation } from 'react-icons/gi';
import MessageContainer from '../components/MessageContainer';
import { useEffect, useState } from 'react';
import useShowToast from '../hooks/useShowToast';
import { useRecoilState } from 'recoil';
import { conversationAtom } from '../atoms/messagesAtoms';

function ChatPage() {
	
	const showToast = useShowToast()
	const [loading, setLoading] = useState(true);
	const [conversations, setConversations] = useRecoilState(conversationAtom);

	useEffect(() => {
		const getConversations = async () => {
			try {
				const res = await fetch("/api/messages/conversations");
				const data = await res.json();
				if (data.error) {
					showToast(data.error, "error");
				}
				setConversations(data);
			}
			catch (error) {
				showToast("An error occurred", "error");
			}finally {
				setLoading(false);
		}
		};
		getConversations();
	}
	, [showToast, setConversations]);


  return (
    <Box
			position={"absolute"}
			left={"50%"}
			w={{ base: "100%", md: "80%", lg: "750px" }}
			p={4}
			transform={"translateX(-50%)"}
		>
			<Flex
				gap={4}
				flexDirection={{ base: "column", md: "row" }}
				maxW={{
					sm: "400px",
					md: "full",
				}}
				mx={"auto"}
			>
				<Flex flex={30} gap={2} flexDirection={"column"} maxW={{ sm: "250px", md: "full" }} mx={"auto"}>
					<Text fontWeight={700}>
						Your Conversations
					</Text>
					<form >
						<Flex alignItems={"center"} gap={2}>
							<Input placeholder='Search for a user'/>
							<Button size={"sm"}>
								<SearchIcon />
							</Button>
						</Flex>
					</form>
                    {loading && (
                        [0,1,2,3,4].map((i) => (
                            <Flex key={i} p={2}
                            gap={4}
                            borderRadius={"md"}
                            alignItems={"center"}
                            justifyContent={"space-between"}>
                                <Box>
                                    <SkeletonCircle size={10} />
                                </Box>
								<Flex w={"full"} flexDirection={"column"} gap={3}>
									<Skeleton h={"10px"} w={"80px"} />
									<Skeleton h={"8px"} w={"90%"} />
								</Flex>
                            </Flex>
                        ))
                    )}
					{!loading && (
					conversations.map((conversation) =>
					<Conversation key={conversation._id} conversation={conversation}/>)
					)}
				</Flex>
                { false && 
					<Flex
						flex={70}
						borderRadius={"md"}
						p={2}
						flexDir={"column"}
						alignItems={"center"}
						justifyContent={"center"}
						height={"400px"}
					>
						<GiConversation size={100} />
						<Text fontSize={20}>Select a conversation to start messaging</Text>
					</Flex>
}

                    <MessageContainer />
			</Flex>
		</Box>
	);
}

export default ChatPage;


