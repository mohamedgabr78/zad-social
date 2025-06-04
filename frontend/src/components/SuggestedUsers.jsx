import { Box, Flex, Skeleton, SkeletonCircle, Text } from '@chakra-ui/react'
import { useEffect, useState } from 'react';
import SuggestedUser from './SuggestedUser';
import useShowToast from '../hooks/useShowToast';

function SuggestedUsers() {

    const [loading, setLoading] = useState(false)
    const showToast = useShowToast()
    const [suggestedUsers, setSuggestedUsers] = useState([])

    useEffect(() => {
        const getSuggestedUsers = async () => {
            setLoading(true)
            try{
                const res = await fetch('/api/users/suggested')
                const data = await res.json()
                if(data.error) showToast("Error", data.error, "error")
                setSuggestedUsers(data)
            }catch(error) {
                showToast("Error", error, "error")
            }
        }
        getSuggestedUsers()
        setLoading(false)
    }
    , []);
  return (
        <>
        <Text mb={3} fontWeight={'bold'}>Users you may know</Text>
        <Flex direction={'column'} gap={3}>
            {loading && [0,1,2,3,4].map((i) => (
                <Flex key={i} gap={2} alignItems={"center"} p={"1"} borderRadius={"md"}>
                                {/* avatar skeleton */}
                                <Box>
                                    <SkeletonCircle size={"10"} />
                                </Box>
                                {/* username and fullname skeleton */}
                                <Flex w={"full"} flexDirection={"column"} gap={2}>
                                    <Skeleton h={"8px"} w={"80px"} />
                                    <Skeleton h={"8px"} w={"90px"} />
                                </Flex>
                                {/* follow button skeleton */}
                                <Flex>
                                    <Skeleton h={"20px"} w={"60px"} />
                                </Flex>
                            </Flex>
            ))}
            {!loading && suggestedUsers.map((user) => (
                <SuggestedUser key={user._id} user={user} />
            ))}
        </Flex>
        
        </>
  )
}

export default SuggestedUsers