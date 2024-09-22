import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { addMessage, selectMessages, selectSelectedChat, setMessages } from '../utils/slices/chatSlice'
import { Bars3Icon, FaceSmileIcon, PaperAirplaneIcon } from '@heroicons/react/24/outline'
import classNames from 'classnames'
import EmojiPicker from 'emoji-picker-react'
import toast from 'react-hot-toast'
import { selectUser } from '../utils/slices/userSlice'
import axios from 'axios'
import { getMessagesRoute, sendMessageRoute } from '../utils/APIRoutes'
import { v4 as uuid } from 'uuid'
import { toggelDrawerOpen } from '../utils/slices/navSlice'

const ChatWindow = ({ socket }) => {
    const selectedChat = useSelector(selectSelectedChat)
    const msgRef = useRef()
    const [showEmojiPicker, setShowEmojiPicker] = useState(false)
    const user = useSelector(selectUser)
    const [sendingMsg, setSendingMsg] = useState(false)
    const dispatch = useDispatch()
    const messages = useSelector(selectMessages)
    const scrollRef = useRef()

    useEffect(() => {
        const fetchMessages = async () => {
            await axios.post(getMessagesRoute, {
                from: user._id,
                to: selectedChat._id,
            }).then((res) => {
                dispatch(setMessages(res.data))
            })
        }

        fetchMessages()
        return;
    }, [user, dispatch, selectedChat])

    const handleSendMsg = async (e) => {
        e.preventDefault()
        const msg = msgRef.current.value
        msgRef.current.value = '';

        if (msg.length > 0) {
            setSendingMsg(true)
            const messageToSend = {
                from: user._id,
                to: selectedChat._id,
                message: msg,
            }

            dispatch(addMessage({ ...messageToSend, fromSelf: true }))

            await axios.post(sendMessageRoute, messageToSend).then((res) => {
                res.status === 200 ?
                    toast.success("Message Sent!")
                    :
                    toast.error("Some error occured while sending message.")
            })

            socket.current.emit("send-message", {
                to: selectedChat._id,
                from: user._id,
                messages: msg
            })

            setSendingMsg(false)
        } else {
            toast.error("Message should be atleast 1 charecter.")
        }
    }

    useEffect(() => {
        if (socket.current) {
            socket.current.on("message-recieve", (msg) => {
                dispatch(addMessage({ message: msg, fromSelf: false }))
            })
        }
    }, [socket, dispatch])

    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behaviour: "smooth" })
    }, [messages])

    const handleEmojiClick = (emoji) => {
        msgRef.current.value += emoji.emoji
    }

    const MessageCard = ({ msg }) => {
        const { message, fromSelf } = msg
        return (
            <div ref={scrollRef} key={uuid()} className={classNames("text-white max-w-xs px-4 py-2 w-fit", fromSelf ? "self-end bg-blue-500 rounded-tl-2xl" : "self-start bg-purple-500 rounded-tr-2xl")}>
                <p>{message}</p>
            </div>
        )
    }

    const handleDrawer = () => {
        dispatch(toggelDrawerOpen())
    }

    return (
        selectedChat ?
            <section className='relative flex-1'>
                <header className="absolute px-4 sm:px-10 py-4 right-0 top-0 w-full bg-dark-900/60">
                    <div className="flex items-center space-x-4 w-full">
                        <img className='bg-white rounded-full h-12' src={selectedChat?.avatarImage} alt={`${selectedChat?.username}'s Avatar`} />
                        <div className="flex w-full flex-col">
                            <h3 className='text-white truncate w-24 lg:w-36'>{selectedChat?.username}</h3>
                            <h4 className='text-light-500 text-sm font-light truncate w-24 lg:w-36'>{selectedChat?.email}</h4>
                        </div>
                        <Bars3Icon className='text-white sm:hidden h-10 w-10' onClick={handleDrawer} />
                    </div>
                </header>

                <div className="flex flex-col space-y-4 h-screen py-28 px-4 overflow-y-auto scrollbar-track-light scrollbar-thumb-purple-500 scrollbar-thin">
                    {
                        messages ?
                            messages.map((msg) => {
                                return (
                                    <MessageCard msg={msg} key={uuid()} />
                                )
                            })
                            :
                            <div className="">
                                No Messages to show
                            </div>
                    }
                </div>

                <footer className="absolute px-10 py-8 right-0 bottom-0 w-full bg-dark-900">
                    <form onSubmit={handleSendMsg} className="flex items-center space-x-4 w-full">
                        <div className="relative">
                            <div className={classNames("absolute bottom-16 transition-all ease-in-out duration-300", showEmojiPicker ? "translate-y-0 z-10 opacity-100 block" : "translate-y-full -z-10 hidden")}>
                                <EmojiPicker onEmojiClick={handleEmojiClick} theme='dark' />
                            </div>
                            <FaceSmileIcon className='text-yellow-500 h-8 w-8 shadow-sm cursor-pointer' onClick={() => { setShowEmojiPicker(!showEmojiPicker) }} />
                        </div>
                        <input type="text" className='flex-1 p-3 disabled:opacity-60' placeholder={sendingMsg ? 'Sending Message...' : 'Enter your message..'} required disabled={sendingMsg} ref={msgRef} min={1} />

                        <button type='submit' disabled={sendingMsg} >
                            <PaperAirplaneIcon className='text-white h-6 w-6 cursor-pointer hover:translate-x-1 transition-all ease-in-out duration-300' />
                        </button>
                    </form>
                </footer>
            </section>
            :
            <div className="">Loading...</div>
    )
}

export default ChatWindow