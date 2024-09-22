import axios from 'axios'
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { Link, useNavigate } from 'react-router-dom'
import logo from '../assets/logo.svg'
import { registerRoute } from '../utils/APIRoutes'
import Cookies from 'js-cookie'
import { useDispatch, useSelector } from 'react-redux'
import { selectUser, setUser } from '../utils/slices/userSlice'

const Register = () => {
    const navigate = useNavigate()
    const initialState = {
        username: null,
        email: null,
        password: null,
        confirmPassword: null,
    }

    const dispatch = useDispatch()
    const user = useSelector(selectUser)

    const [values, setValues] = useState(initialState)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        const { password, username, email } = values
        if (!handleValidation()) return;

        try {
            setIsSubmitting(true)
            const { data } = await axios.post(registerRoute, {
                username,
                email,
                password
            });

            if (data.status === false) {
                throw new Error(data.msg);
            }

            if (data.status === true) {
                Cookies.set('user', JSON.stringify(data.user))
                dispatch(setUser(data.user))
                setValues(initialState)
                navigate('/set-avatar')
            }
        } catch (error) {
            toast.error(error.message)
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleValidation = () => {
        const { password, confirmPassword, username, email } = values

        if (!password) {
            toast.error("Password is required.")
            return false
        }
        if (!username) {
            toast.error("Username is required.")
            return false
        }
        if (!confirmPassword) {
            toast.error("Please confirm password")
            return false
        }
        if (!email) {
            toast.error("Email is required.")
            return false
        }
        if (password !== confirmPassword) {
            toast.error("Passwords do not match.")
            return false
        }

        return true
    }

    const handleChange = (e) => {
        setValues({ ...values, [e.target.name]: e.target.value })
    }

    useEffect(() => {
        if (user) {
            navigate('/')
        }
    }, [navigate, user])

    return (
        <main className='page__container'>
            <form className='flex flex-col space-y-4 rounded-3xl bg-dark-900 p-12' onSubmit={handleSubmit}>
                <div className="flex flex-col justify-center items-center">
                    <img className='h-20' src={logo} alt="Babble! Logo" />
                    <h1 className='text-dark-900 dark:text-light'>Babble!</h1>
                </div>

                <input className='input' type="text" name="username" id="username" placeholder='Username' onChange={handleChange} required disabled={isSubmitting} minLength={3} maxLength={50} />
                <input className='input' type="email" name="email" id="email" placeholder='Email' onChange={handleChange} required disabled={isSubmitting} />
                <input className='input' type="password" name="password" id="password" placeholder='Password' onChange={handleChange} required disabled={isSubmitting} minLength={8} maxLength={32} />
                <input className='input' type="password" name="confirmPassword" id="confirmPassword" placeholder='Confirm Password' onChange={handleChange} required disabled={isSubmitting} minLength={8} maxLength={32} />
                <button disabled={isSubmitting} className='gradient__button' type='submit'>Create User</button>
                <p className='text-light-500 font-light'>Already have an account ? <span className='font-base text-light-50 hover:underline underline-offset-2'><Link to="/login">Login</Link></span></p>
            </form>
        </main>
    )
}

export default Register