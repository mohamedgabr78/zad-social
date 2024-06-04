import { Box, Flex, Text, Button, Input, SkeletonCircle, Skeleton } from '@chakra-ui/react'
import { SearchIcon } from '@chakra-ui/icons'
import Conversation from '../components/Conversation';
import { GiConversation } from 'react-icons/gi';
import MessageContainer from '../components/MessageContainer';
import { useEffect, useState } from 'react';
import useShowToast from '../hooks/useShowToast';
import { useRecoilState, useRecoilValue } from 'recoil';
import { conversationAtom, selectedConversationAtom, userAtom } from '../atoms';
import { useSocket } from '../context/SocketContext';

function ChatPage() {
	
	const showToast = useShowToast()
	const [loading, setLoading] = useState(true);
	const [conversations, setConversations] = useRecoilState(conversationAtom);
	const [selectedConversation, setSelectedConversation] = useRecoilState(selectedConversationAtom);
	const [searchText, setSearchText] = useState("");
	const [searchLoading, setSearchLoading] = useState(false);
	const currentUser = useRecoilValue(userAtom);
	const {onlineUsers, socket} = useSocket();

	const handleSearch = async (e) => {
		e.preventDefault();
		setSearchLoading(true);
		try {
			const res = await fetch(`/api/users/profile/${searchText}`);
			const searchedUser = await res.json();
			if (searchedUser.error) {
				showToast(searchedUser.error, "error");
				return;
			}

			const messagingYourself = searchedUser._id === currentUser._id
			if(messagingYourself) {
				showToast("You can't message yourself", "error");
				return;
			}

			const conversationExists = conversations.find(conversation => 
				conversation.members[0]._id === searchedUser._id)
			if(conversationExists){
				setSelectedConversation({
					_id: conversationExists._id,
					userId: searchedUser._id,
					username: searchedUser.username,
					profilePic: searchedUser.profilePic
				})
			}

			const mockConversation = {
				mock: true,
				_id: Date.now().toString(),
				members: [
				{
					_id: searchedUser._id,
					username: searchedUser.username,
					profilePic: searchedUser.profilePic
				
				}],
				lastMessage: {
					text: "",
					sender: "",
				},
			};
			setConversations((prev) => [ ...prev, mockConversation]);
		}
		catch (error) {
			showToast("An error occurred", "error");
		}finally{
			setSearchLoading(false);
		}
	}

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

	useEffect(() => {
		socket?.on("messageSeen", ({conversationId}) => {
			setConversations((prev) => {
				const updatedConversations = prev.map((conversation) => {
					if (conversation._id === conversationId) {
						return {
							...conversation,
							lastMessage: {
								...conversation.lastMessage,
								seen: true
							}
						}
					}
					return conversation;
				});
				return updatedConversations;
			});
		});
		return () => socket && socket.off("messageSeen");
	}
	, [socket, setConversations]);


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
					<form onSubmit={handleSearch}>
						<Flex alignItems={"center"} gap={2}>
							<Input placeholder='Search for a user' onChange={(e)=>{setSearchText(e.target.value)}}/>
							<Button size={"sm"} onClick={handleSearch} isLoading={searchLoading}>
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
					{!loading &&(
					conversations.map((conversation) =>
					<Conversation key={conversation._id} conversation={conversation} isOnline={
						onlineUsers.includes(conversation.members[0]._id)}/>)
					)}
				</Flex>
                { selectedConversation._id !== ''? ( 
					<MessageContainer/>
					) : (
					<Flex
					flex={70}
					borderRadius={"md"}
					p={2}
					flexDir={"column"}
					alignItems={"center"}
					justifyContent={"center"}
					height={"400px"}
					w={"full"}
				>
					<GiConversation size={100} />
					<Text fontSize={20}>Select a conversation to start messaging</Text>
				</Flex>
					)
				}
			</Flex>
		</Box>
	);
}

export default ChatPage;


