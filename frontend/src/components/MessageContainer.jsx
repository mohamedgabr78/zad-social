import { Avatar, Flex, Text, Image, Divider, SkeletonCircle, Skeleton } from '@chakra-ui/react'
import Message from './Message'
import MessageInput from './MessageInput'
import { useEffect, useState, useRef } from 'react'
import useShowToast from '../hooks/useShowToast'
import { useRecoilState, useRecoilValue } from 'recoil'
import { conversationAtom, selectedConversationAtom, userAtom } from '../atoms/'
import { useSocket } from '../context/SocketContext'
import messageSound from '../assets/sounds/notification.wav'


function MessageContainer() {

    const showToast = useShowToast()
    const selectedConversation = useRecoilValue(selectedConversationAtom);
    const [loading, setLoading] = useState(true);
    const [messages, setMessages] = useState([]);
    const currentUser = useRecoilValue(userAtom);
    const messagesEndRef = useRef(null);
    const {socket} = useSocket();
    const setConversation = useRecoilState(conversationAtom);
    
    useEffect(() => {
        socket.on('newMessage', (message) => {

            if(selectedConversation._id === message.conversationId) {
                setMessages((prev) => [...prev, message]);
            }

            if(!document.hasFocus()){
            const sound = new Audio(messageSound);
            sound.play();
        }
            setConversation((prev) => {
                const updatedConversations = prev.map((conversation) => {
                    if (conversation._id === message.conversationId) {
                        return {
                            ...conversation,
                            lastMessage: {
                                text: message.text,
                                sender: message.sender,
                            }
                        }
                    }
                    return conversation;
                });
                return updatedConversations;
            });
        }
        );
        return () => socket && socket.off('newMessage');
    }, [socket, selectedConversation, setConversation]);

    useEffect(() => {
        const lastMessageFromOtherUser = messages.length && messages[messages.length-1].sender !== currentUser._id;

        if (lastMessageFromOtherUser) {
            socket.emit('markMessageSeen', {
                conversationId: selectedConversation._id,
                userId: selectedConversation.userId
            });
        }
        socket.on('messageSeen', ({conversationId}) => {
            if (selectedConversation._id === conversationId) {
                setMessages((prev) =>{
                    const updatedMessages = prev.map((message) => {
                        if (!message.seen) {
                            return {
                                ...message,
                                seen: true
                            }
                        }
                        return message;
                    });
                    return updatedMessages;
                });
            }
        });

    },[messages, currentUser._id, selectedConversation, socket]);


    useEffect(() => {
        const getMessages = async () => {
            if(selectedConversation.mock) return;
            setLoading(true);
            try {
                const res = await fetch(`/api/messages/${selectedConversation.userId}`);
                const data = await res.json();
                if (data.error) {
                    showToast("Error", data.error, "error")
                }
                setMessages(data);
                setLoading(false);
            }
            catch (error) {
                showToast("Error", error, "error")
            }
        }
        getMessages();
    }
    , [showToast, selectedConversation.userId, selectedConversation.mock]);

    useEffect(() => {
        if (!loading) {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages, loading]);


  return (
    <Flex borderRadius={"md"} p={2} flexDir={"column"} bg={"gray.600"} w={'full'} m={2}>
        <Flex flexDir={"row"} p={2} overflowY={"auto"} maxH={"80vh"}>
            {/* Messages */}
			<Flex w={"full"} h={7} alignItems={"center"} gap={2}>
				<Avatar src={selectedConversation.profilePic} size={"sm"} />
				<Text display={"flex"} alignItems={"center"}>
                    {selectedConversation.username}
					<Image src='/assets/verified.png' w={4} h={4} ml={1} />
				</Text>
			</Flex>

        </Flex>
        <Divider />
        <Flex flexDir={"column"} gap={4} my={4} p={2} height={"400px"} overflowY={"auto"}>
            {loading && 
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
                    ))}

            {!loading && messages.map((message) => (
                <Message key={message._id} ownMessage={currentUser._id === message.sender} message={message} />
            ))}
                    <div ref={messagesEndRef} />
        </Flex>
        <MessageInput setMessages={setMessages}/>
    </Flex>
  )
}

export default MessageContainer