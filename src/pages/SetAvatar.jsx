import axios from 'axios'
import classNames from 'classnames'
import Cookies from 'js-cookie'
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { setAvatarRoute } from '../utils/APIRoutes'
import { selectUser, setUser } from '../utils/slices/userSlice'

const SetAvatar = () => {
    const user = useSelector(selectUser)
    const [selectedAvatar, setSelectedAvatar] = useState()

    const avatars = [
        'adventurer',
        'micah',
        'croodles',
        'initials',
        'miniavs',
        'avataaars',
    ]
    const api = `https://avatars.dicebear.com/api/`
    const navigate = useNavigate()
    const dispatch = useDispatch()

    useEffect(() => {
        if (!user) {
            navigate('/login')
        }
    }, [navigate, user])

    const setProfilePicture = async () => {
        if (!selectedAvatar) {
            toast.error("Please select an avatar first!")
            return;
        }

        const avatar = api + `${selectedAvatar}/${user?.username.replace(' ', '-').toLocaleLowerCase()}.svg`

        try {
            const { data } = await axios.post(`${setAvatarRoute}/${user._id}`, { image: avatar })

            if (data.isSet) {
                const newUser = {
                    ...user,
                    isAvatarImageSet: true,
                    avatarImage: data.image
                }

                Cookies.set('user', JSON.stringify(newUser))
                dispatch(setUser(newUser))
                navigate('/')
            } else {
                throw new Error('Error setting avatar. Please try again.')
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    return (
        <main className='page__container'>
            <div className="flex flex-col justify-center space-y-6 px-10 md:px-0">
                <h1 className='text-light text-2xl text-center font-light'>Pick an <span className='font-medium text-blue-400'>avatar</span> as your profile picture.</h1>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-8">
                    {
                        avatars.map((avatar, key) => {
                            return (
                                <img className={classNames('rounded-full cursor-pointer hover:opacity-100 transition-all ease-in-out duration-300 focus:ring-2 bg-white', selectedAvatar === avatar ? 'opacity-100 border-4 border-blue-500' : 'opacity-60')} onClick={() => setSelectedAvatar(avatar)} key={key} src={api + `${avatar}/${user?.username.replace(' ', '-').toLocaleLowerCase()}.svg`} alt={`Avatar ${key + 1}`} />
                            )
                        })
                    }
                </div>

                <button className='gradient__button' onClick={setProfilePicture}>Set Avatar!</button>
            </div>
        </main>
    )
}

export default SetAvatar