import React, { useEffect, useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import UserTasks from './UserTasks';
import axios from 'axios';
import Cookies from "js-cookie";

function Project_team() {
  const [team, setTeam] = useState([]);

  useEffect(() => {
    const FetchTeam = async () => {
      const teamdata = await axios.get(import.meta.env.VITE_API_URL + "/api/auth/getmembers", { withCredentials: true });
      setTeam(teamdata.data);
    }
    FetchTeam()
  }, [])


  return (
    <div className="grid lg:grid-cols-6 md:grid-cols-6 grid-cols-1 gap-8 mt-8">
      {/* Calendar */}
      <div className="h-[50vh] bg-white lg:col-span-2 md:col-span-3 md:p-6 rounded-3xl shadow-md overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">Team Directory</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Team Member 1 */}
          {team.map((elem) => {
            return <div className="bg-[#f8f8f7]  p-4 rounded-md mb-4" key={elem.id}>
              <img src={"https://cdn.iconscout.com/icon/free/png-256/free-laptop-user-1-1179329.png?f=webp"} className="rounded-full w-12 h-12 mb-2" />
              <p className="text-lg font-bold">{elem.username}</p>
              <small className="text-sm text-gray-800">{elem.designation}</small>
            </div>
          })}
        </div>
      </div>
      <UserTasks />

    </div>
  );
}

export default Project_team;
