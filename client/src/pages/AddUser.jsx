import React, { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';

import profile from '../assets/image.jfif';
import { useAuthContext } from '../contexts/AuthContext';
import axios from 'axios';
import Cookies from "js-cookie";


const AddUser = () => {
    const [values, setValues] = useState('');
    const { user } = useAuthContext()


    const addUser = async () => {
        if (values.username?.length > 0 &&
            values?.email?.length > 0 &&
            values?.role?.length > 0 &&
            values?.designation?.length > 0 &&
            values?.password?.length > 0
        ) {
            try {
                await axios.post(import.meta.env.VITE_API_URL + "/api/auth/create", { ...values },  
                    { withCredentials: true }
                );
                alert("USER CREATED")
                setValues({ username: "", email: "", designation: "", password: "", cpassword: "" })
            } catch (error) {
                console.log(error);
            }
        } else {
            alert("FILL ALL THE FIELDS")
        }
    }


    return (
        <div className="bg-gray-100 min-h-screen">
            <Sidebar />
            <div className="w-[92%] md:w-full md:ml-0 ml-[3%] md:pl-32 pl-24 pr-0 md:pr-5 py-16">
                <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md">
                    <h2 className="text-3xl font-bold mb-6">New User</h2>

                    <div className="mb-6 flex">
                        <label htmlFor="name" className="mt-3 mr-6 text-md font-medium text-gray-400">Name</label>
                        <input className="mt-1 p-2 block w-full border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                            onChange={(e) => setValues({ ...values, username: e.target.value })} placeholder='Username' value={values?.username} />
                    </div>
                    <div className="mb-6 flex">
                        <label htmlFor="email" className="mt-3 mr-6 text-md font-medium text-gray-400">Email</label>
                        <input type='email' className="mt-1 p-2 block w-full border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                            onChange={(e) => setValues({ ...values, email: e.target.value })} placeholder='Email' value={values?.email} />
                    </div>

                    <div className="mb-6 flex">
                        <label htmlFor="role" className="mt-3 mr-6 text-md font-medium text-gray-400">Role</label>
                        <select id="role" className="mt-1 p-2 block w-full border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                            onChange={(e) => setValues({ ...values, role: e.target.value })} value={values?.role}>
                            <option value="" disabled>Role</option>
                            <option value={"admin"}>Admin</option>
                            <option value={"viewer"}>Viewer</option>
                            <option value={"member"}>Member</option>
                        </select>
                    </div>
                    <div className="mb-6 flex">
                        <label htmlFor="designation" className="mt-3 mr-6 text-md font-medium text-gray-400">Designation</label>
                        <input type='text' className="mt-1 p-2 block w-full border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" placeholder='Designation'
                            onChange={(e) => setValues({ ...values, designation: e.target.value })} value={values?.designation} />
                    </div>

                    <div className="mb-6 flex">
                        <label htmlFor="password" className="mt-3 mr-6 text-md font-medium text-gray-400">Password</label>
                        <input type='password' className="mt-1 p-2 block w-full border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                            onChange={(e) => setValues({ ...values, password: e.target.value })} value={values?.password}
                            placeholder='Password' />
                    </div>

                    <div className="mb-6 flex">
                        <label htmlFor="cpassword" className="mt-3 mr-6 text-md font-medium text-gray-400">Confirm Password</label>
                        <input type='password' className="mt-1 p-2 block w-full border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                            onChange={(e) => setValues({ ...values, cpassword: e.target.value })} placeholder='Confirm Password' value={values?.cpassword} />
                    </div>

                    <div className="flex justify-center">
                        <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                            onClick={addUser}>Add User</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddUser;
