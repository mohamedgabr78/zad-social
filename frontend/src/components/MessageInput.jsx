import { Input, InputGroup, InputRightElement } from '@chakra-ui/react'
import { IoSendSharp } from 'react-icons/io5'
import useShowToast from '../hooks/useShowToast'
import { useRecoilState, useRecoilValue } from 'recoil'
import { selectedConversationAtom, conversationAtom } from '../atoms/'
import { useState } from 'react'

function MessageInput({setMessages}) {

  const showToast = useShowToast()
  const selectedConversation = useRecoilValue(selectedConversationAtom);
  const [conversations, setConversations] = useRecoilState(conversationAtom);
  const [messageText, setMessageTest] = useState("");

  const sendMessage = async(e) => {
    e.preventDefault();
    if (!messageText) {return;}

    try {
      const res = await fetch(`/api/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ message: messageText, receiverId: selectedConversation.userId })
      });
      const data = await res.json();
      if (data.error) {
        showToast(data.error, "error", 5000);
      }
      setMessages((prev) => [...prev, data]);

      setConversations((prev) => {
        const newConversations = prev.map((conversation) => {
          if (conversation._id === selectedConversation.conversationId) {
            return {
              ...conversation,
              lastMessage: {
                text: messageText,
                sender: conversation.members[0] === selectedConversation.userId ? conversation.members[0] : conversation.members[1],
              },
            };
          }
          return conversation;
        });
        return newConversations;
      });
      
      setMessageTest("");
  }
    catch (error) {
      showToast("An error occurred", error, "");
    }
  }

  return (
    <form onSubmit={sendMessage}>
        <InputGroup>
            <Input type="text" placeholder="Type a message" width={'full'}
            onChange={(e)=> setMessageTest(e.target.value)}
            value={messageText}
            />
            <InputRightElement onClick={sendMessage} cursor="pointer" >
            <IoSendSharp/>
            </InputRightElement>
        </InputGroup>
    </form>
  )
}

export default MessageInput