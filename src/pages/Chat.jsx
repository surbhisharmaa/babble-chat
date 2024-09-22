import axios from 'axios'
import React, { useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import ChatWindow from '../components/ChatWindow'
import Contacts from '../components/Contacts'
import Welcome from '../components/Welcome'
import { baseurl, getAllUsersRoute } from '../utils/APIRoutes'
import { selectSelectedChat } from '../utils/slices/chatSlice'
import { selectUser, setContacts } from '../utils/slices/userSlice'
import { io } from 'socket.io-client'

const Chat = () => {
    const socket = useRef()
    const navigate = useNavigate()
    const user = useSelector(selectUser)
    const dispatch = useDispatch()
    const selectedChat = useSelector(selectSelectedChat)

    useEffect(() => {
        if (user) {
            socket.current = io(baseurl)
            socket.current.emit("add-user", user._id)
        }
    }, [user])


    useEffect(() => {
        if (!user) {
            navigate('/login')
            return;
        }

        if (!user.isAvatarImageSet) {
            navigate('/set-avatar')
            return;
        }

        axios.get(`${getAllUsersRoute}/${user._id}`).then(({ data }) => {
            dispatch(setContacts(data))
        })
    }, [navigate, user, dispatch])

    return (
        <main className='page__container'>
            <div className="flex w-full">
                <Contacts socket={socket} />
                {
                    selectedChat ?
                        <ChatWindow socket={socket} />
                        :
                        <Welcome />
                }
            </div>
        </main>
    )
}

export default Chat