import {useRecoilValue } from 'recoil'
import { userAtom } from '../atoms/'
import { useState } from 'react'
import useShowToast from './useShowToast'

function useFollowing(user) {

    const currentUser = useRecoilValue(userAtom)
    const showToast = useShowToast()
    const [following, setFollowing] = useState(user.followers.includes(currentUser?._id))
    const [updating, setUpdating] = useState(false)

    const handleFollowing = async() => {

        if(!currentUser) {
            showToast('Error', 'You need to login first', 'error')
            return
        }

        if(updating) return
        setUpdating(true)
        try{
            const res = await fetch(`/api/users/follow/${user._id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            })
            const data = await res.json()
            if(data.error) {
                showToast('Error', data.error, 'error')
                return
            }
            if(following){
                showToast('Success', `Unfollowed ${user.name}`, 'success')
                user.followers = user.followers.filter(follower => follower !== currentUser?._id)
            }else{
                showToast('Success', `Followed ${user.name}`, 'success')
                user.followers.push(currentUser?._id)
            }
            setFollowing(!following)
        }
        catch(error) {
            showToast('Error', error, 'error');
        }finally{
            setUpdating(false)
        }
    }
  return (
    {following, handleFollowing, updating}
  )
}

export default useFollowing