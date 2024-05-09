import UserHeader from '../components/UserHeader'
import UserPost from './PostPage'

const UserPage = () => {
    return (
        <>
          <UserHeader />
          <UserPost  likes={151} replies={92} postImage="/post2.PNG" postText={"guys I found this linkedIn account, that guys has to get hired immediately!!"}/>
          <UserPost  likes={278} replies={56} postImage="/post1.PNG" postText={"check his Resume"}/>
          <UserPost  likes={169} replies={80} postImage="/post3.PNG" postText={"OMG!! he have an interesting experience around the world"}/>
        </>
    )
}
export default UserPage