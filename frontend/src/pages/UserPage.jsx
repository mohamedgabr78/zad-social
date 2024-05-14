import { useEffect, useState } from 'react'
import UserHeader from '../components/UserHeader'
import UserPost from './PostPage'
import { useParams } from 'react-router-dom'
import useShowToast from '../hooks/useShowToast'
import { Flex, Spinner } from '@chakra-ui/react'

const UserPage = () => {


  const [users, setUsers] = useState(null)
  const { username } = useParams()
  const showToast = useShowToast()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    try {
    const getUser = async () => {
    const res = await fetch(`/api/users/profile/${username}`)
    const data = await res.json()
    if (data.error) {
    showToast('Error', data.error, 'error')
    return
    }
    setUsers(data)
    }
    getUser()
    } catch (error) {
    showToast('Error', error, 'error')
    } finally {
    setLoading(false)
    }

  }, [username, showToast])

  if(!users && loading){
    return (
      <Flex justify='center'>
        <Spinner size={'xl'}/>
      </Flex>
  )
  }

  if(!users && !loading) return <h1>User not found</h1>

  if (!users) return null


    return (
        <>
          <UserHeader user={users}/>
          <UserPost  likes={151} replies={92} postImage="/post2.PNG" postText={"guys I found this linkedIn account, that guys has to get hired immediately!!"}/>
          <UserPost  likes={278} replies={56} postImage="/post1.PNG" postText={"check his Resume"}/>
          <UserPost  likes={169} replies={80} postImage="/post3.PNG" postText={"OMG!! he have an interesting experience around the world"}/>
        </>
    )
}
export default UserPage