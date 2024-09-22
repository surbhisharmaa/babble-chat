import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { selectContacts, selectUser, setUser } from '../utils/slices/userSlice'
import logo from '../assets/logo.svg'
import classNames from 'classnames'
import Cookies from 'js-cookie'
import { selectSelectedChat, setMessages, setSelectedChat } from '../utils/slices/chatSlice'
import { selectDrawerOpen, toggelDrawerOpen } from '../utils/slices/navSlice'
import { XMarkIcon } from '@heroicons/react/24/outline'

const Contacts = ({ socket }) => {
    const contacts = useSelector(selectContacts)
    const dispatch = useDispatch()
    const user = useSelector(selectUser)
    const drawerOpen = useSelector(selectDrawerOpen)
    if (!user) return
    const { username, avatarImage, email } = user

    const handleDrawer = () => {
        dispatch(toggelDrawerOpen())
    }

    const ContactCard = ({ contact }) => {
        const { username, avatarImage, email } = contact
        const handleChatSelect = () => {
            dispatch(setSelectedChat(contact))
            Cookies.set('activeChat', JSON.stringify(contact))
        }

        const selectedChat = useSelector(selectSelectedChat)

        return (
            <div onClick={handleChatSelect} className={classNames("w-full bg-dark hover:bg-dark-700 transition-all ease-in-out duration-300 shadow-md cursor-pointer rounded-lg p-4", selectedChat?._id === contact._id ? 'border-2 border-white' : '')}>
                <div className="flex space-x-4 w-full">
                    <img className='bg-white rounded-full h-12' src={avatarImage} alt={`${username}'s Avatar`} />
                    <div className="flex w-full flex-col">
                        <h3 className='text-white truncate w-24 lg:w-36'>{username}</h3>
                        <h4 className='text-light-500 text-sm font-light truncate w-24 lg:w-36'>{email}</h4>
                    </div>
                </div>
            </div>
        )
    }

    const handleLogout = () => {
        socket.current.disconnect()
        Cookies.remove('user')
        Cookies.remove('activeChat')
        dispatch(setUser(undefined))
        dispatch(setSelectedChat(undefined))
        dispatch(setMessages([]))
    }

    return (
        <aside className={classNames('h-screen w-screen absolute z-50  transition-all ease-in-out duration-300 top-0 left-0 sm:translate-x-0 sm:w-60 md:w-72 lg:w-80 xl:w-96 flex flex-col items-center bg-dark-900 px-4 py-8 sm:relative', drawerOpen ? 'translate-x-0' : '-translate-x-full')}>
            <XMarkIcon onClick={handleDrawer} className='text-white h-10 w-10 absolute right-6 sm:hidden' />
            <div className="flex flex-col items-center">
                <img src={logo} alt="Babble! Logo" />
                <h1 className='text-light'>Babble!</h1>
            </div>

            <div className="self-start px-2 pt-10 pb-4 w-full">
                <h1 className='text-left pb-2 text-xl text-white'>Available Chats:</h1>
                <hr className='w-full opacity-40' />
            </div>


            <div className="flex w-full flex-col h-96 sm:h-80 overflow-y-scroll space-y-4 px-2 scrollbar-thin scrollbar-track-white scrollbar-thumb-purple-500">
                {
                    contacts ?
                        contacts.map((contact) => {
                            return (
                                <ContactCard key={contact._id} contact={contact} />
                            )
                        })
                        :
                        <h1 className='text-white'>No Contacts Available</h1>
                }
            </div>

            <div className="w-full bg-dark p-4 absolute bottom-0 left-0 space-y-3">
                {user ?
                    <div className="flex space-x-4 w-full">
                        <img className='bg-white rounded-full h-12' src={avatarImage} alt={`${username}'s Avatar`} />
                        <div className="flex w-full flex-col">
                            <h3 className='text-white truncate'>{username}</h3>
                            <h4 className='text-light-300 text-sm font-light truncate w-36 xl:w-64'>{email}</h4>
                        </div>
                    </div>
                    :
                    <div className="">Loading...</div>
                }

                <button onClick={handleLogout} className='gradient__button w-full'>Logout</button>
            </div>
        </aside>
    )
}

export default Contacts