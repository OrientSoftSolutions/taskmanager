import React, { useEffect, useState } from 'react';
import profile from '../assets/image.jfif';
import Cookies from "js-cookie";
import axios from 'axios';

function UserTasks() {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]); // State to manage the selected date
  const [tasks, setTasks] = useState([])

  const FetchTasks = async (date) => {
    const teamdata = await axios.get(import.meta.env.VITE_API_URL + `/api/projects/tasks?date=${date}`, { withCredentials: true });
    setTasks(teamdata.data);
  }

  useEffect(() => {
    FetchTasks(date)
  }, [])


  return (
    <div className="h-[50vh] bg-white lg:col-span-4 md:col-span-3 p-6 rounded-3xl shadow-md overflow-y-auto">
      <h1 className="text-2xl font-bold mb-4">Tasks by User</h1>
      <div className="grid grid-cols-1 gap-4">
        {tasks.map((elem, index) => (
          <div key={index} className="p-4 bg-white rounded-lg shadow-sm border-b-4">
            <div className="flex items-center mb-4">
              <img
                src={"https://cdn.iconscout.com/icon/free/png-256/free-laptop-user-1-1179329.png?f=webp"}
                alt={`${elem.assignedTo.username}'s profile`}
                className="w-10 h-10 rounded-full mr-4"
              />
              <h2 className="text-lg font-bold">{elem.assignedTo.username}</h2>
            </div>
            <div>
              <div className="flex items-center mb-2 text-xs font-normal">
                <span className="flex-1 text-lg">{elem.description}</span>

                <span className="text-gray-500 text-lg">{elem.deadline}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default UserTasks;
