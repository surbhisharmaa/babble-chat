import { Bars3Icon } from '@heroicons/react/24/outline'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toggelDrawerOpen } from '../utils/slices/navSlice'
import { selectUser } from '../utils/slices/userSlice'

const Welcome = () => {
    const user = useSelector(selectUser)

    const dispatch = useDispatch()

    const handleDrawer = () => {
        dispatch(toggelDrawerOpen())
    }

    return (
        <div className='h-screen flex-1 flex flex-col justify-center items-center'>
            <Bars3Icon className='text-white sm:hidden h-10 w-10 absolute right-4 top-4' onClick={handleDrawer} />
            {user ?
                <div className="flex text-center flex-col space-y-2">
                    <h1 className='text-xl lg:text-2xl xl:text-4xl text-light-50 font-light'>Welcome, <span className='text-white font-semibold'>{user.username}</span> 🎉</h1>
                    <hr />
                    <h3 className='text-light-400 font-light'>Please select a chat to start messaging!</h3>
                </div> :
                <div className="">Loading...</div>
            }
        </div>
    )
}

export default Welcome