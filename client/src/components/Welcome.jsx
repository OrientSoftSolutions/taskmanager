import React from 'react';

import profile from '../assets/image.jfif';
import { useAuthContext } from '../contexts/AuthContext';



function Welcome() {
  const { user, setUser, setLoading } = useAuthContext();

  return (
    <>
        <div className="grid grid-cols-1 lg:grid-cols-6 gap-20">
          <div className="col-span-2">
            <div>
              <h1 className="text-4xl font-bold">Welcome, {user?.username}</h1>
              <p className="text-2xl  font-light">Here is your agenda for today</p>
            </div>
          </div>

          <div className="col-span-3">
            <input
              type="text"
              className="w-full bg-[#eeeeee] rounded-2xl px-4 py-3 md:py-5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
              placeholder="Enter your text..."
            />
          </div>

          <div className="hidden lg:block col-span-1">
            <div className="relative">
              <img
                src={"https://cdn.iconscout.com/icon/free/png-256/free-laptop-user-1-1179329.png?f=webp"}
                alt="Profile"
                className="rounded-full ml-20 w-12 h-12 object-cover"
              />
            </div>
          </div>
        </div>
    </>
  );
}

export default Welcome;


