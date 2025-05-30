import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import bgImage from '../assets/image.png'

function Register() {
    const [values, setValues] = useState({
        username: '',
        email: '',
        password: ''
    })
    const navigate = useNavigate()

    const handleChanges = (e) => {
        setValues({ ...values, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const response = await axios.post('http://localhost:3000/auth/register', values)
            if (response.status === 201) {
                navigate('/login')
            }
        } catch (err) {
            console.log(err.message)
        }
    }

    return (
        <div
            className="min-h-screen flex items-center bg-cover bg-center"
            style={{ backgroundImage: `url(${bgImage})` }}
        >
            <div className="bg-white/5 backdrop-blur-lg p-8 rounded-3xl shadow-xl w-[500px] border border-white/20 ml-16">
                <h2 className="text-2xl font-semibold text-center mb-2 text-gray-800">Register</h2>
                <p className="text-center text-gray-700 mb-6">Create your account!</p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-gray-800 mb-2">Username</label>
                        <input
                            type="text"
                            name="username"
                            placeholder="Enter your username"
                            onChange={handleChanges}
                            className="w-full px-4 py-3 rounded-lg bg-white/30 border border-white/30 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all placeholder-gray-500"
                        />
                    </div>
                    <div>
                        <label className="block text-gray-800 mb-2">Email</label>
                        <input
                            type="email"
                            name="email"
                            placeholder="stock@zilla.com"
                            onChange={handleChanges}
                            className="w-full px-4 py-3 rounded-lg bg-white/30 border border-white/30 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all placeholder-gray-500"
                        />
                    </div>
                    <div>
                        <label className="block text-gray-800 mb-2">Password</label>
                        <input
                            type="password"
                            name="password"
                            placeholder="••••••••••"
                            onChange={handleChanges}
                            className="w-full px-4 py-3 rounded-lg bg-white/30 border border-white/30 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all placeholder-gray-500"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 transition-colors flex items-center justify-center gap-2 mt-6"
                    >
                        Sign Up
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                    </button>
                </form>

                <div className="text-center mt-6">
                    <span className="text-gray-700">Already have an account? </span>
                    <Link to="/login" className="text-green-600 hover:text-green-700 font-medium">
                        Sign In
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default Register;
