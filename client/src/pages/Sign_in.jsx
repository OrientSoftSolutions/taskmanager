import React, { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import axios from "axios";
import jwt_decode from "jwt-decode"
import Cookies from "js-cookie";
import { useAuthContext } from '../contexts/AuthContext';

function Sign_in() {
    const [cred, setCred] = useState({ email: "", password: "" })
    const { user, setUser, setLoading } = useAuthContext();
    const navigate = useNavigate()

    const Login = async (e) => {
        e.preventDefault();
        if (cred.email.length > 0 && cred.password.length > 0) {
            setLoading(true);
            const { data } = await axios.post(import.meta.env.VITE_API_URL + "/api/auth/login", {
                email: cred.email,
                password: cred.password,
            } , { withCredentials: true });

            if (data.success) {
                const { data: userData } = await axios.get(import.meta.env.VITE_API_URL + "/api/auth/userinfo", { withCredentials: true });
                setUser(userData);
                navigate("/");
            } else {
                alert(data.message);
            }

            setLoading(false);
        } else {
            setLoading(false);
            alert("Please fill all fields");
        }
    };


    return (
        <>
            <div className="flex justify-center items-center login_page flex-col h-lvh">
                <img class="logo" src="https://orientsoftsolutions.com/assets/images/logo.png"
                    alt="oss" />

                <div className="form flex flex-col  h-fit justify-center rounded-xl align-middle sm:px-10 py-5 md:">
                    <h1 className='font-semibold text-4xl p-3 text-center'>Login to your account</h1>
                    <p className='text-white'>Welcome back! Please enter your details.</p>

                    <form className='my-8 flex flex-col' onSubmit={Login}>
                        <div className="mb-3 flex flex-col justify-start">
                            <p className='text-black text-left'>Email</p>
                            <input onChange={(e) => setCred((prev) => ({ ...prev, email: e.target.value }))} className='bg-white border w-100 border-slate outline-none  p-3 mt-2 rounded-md text-black' type="email" name='email' />
                        </div>
                        <div className="mb-3 flex flex-col justify-start">
                            <p className=' text-left'>Password</p>
                            <input className='bg-white  text-black border w-100 border-slate p-3 mt-2 rounded-md outline-none'
                                onChange={(e) => setCred((prev) => ({ ...prev, password: e.target.value }))} type="password" name='password' />
                        </div>

                        <div className="flex flex-col justify-center">
                            <div className="flex flex-col mt-0">
                                <input className='p-3 w-100 bg-blue-700 cursor-pointer text-white my-5 uppercase font-semibold rounded-md'
                                    type="submit" value="Signin" />
                            </div>
                        </div>

                    </form>
                </div>
            </div>
        </>)
}

export default Sign_in