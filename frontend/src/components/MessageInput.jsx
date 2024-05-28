import { Input, InputGroup, InputRightElement } from '@chakra-ui/react'
import { IoSendSharp } from 'react-icons/io5'

function MessageInput() {
  return (
    <form>
        <InputGroup>
            <Input type="text" placeholder="Type a message" width={'full'}/>
            <InputRightElement>
            <IoSendSharp />
            </InputRightElement>
        </InputGroup>
    </form>
  )
}

export default MessageInput