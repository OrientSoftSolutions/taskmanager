import React, { useEffect, useState } from 'react';
import Calendar from 'react-calendar'; // Import the Calendar component
import 'react-calendar/dist/Calendar.css'; // Import the default calendar styles
import { useAuthContext } from '../contexts/AuthContext';
import axios from 'axios';
import Cookies from "js-cookie";
import { MdModeEditOutline } from "react-icons/md";



function Grid() {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]); // State to manage the selected date
  const { user } = useAuthContext();
  const [tasks, setTasks] = useState([])

  const FetchTasks = async (date) => {
    const teamdata = await axios.get(import.meta.env.VITE_API_URL + `/api/projects/tasks?date=${date}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${Cookies.get("token")}`,
      },
    });
    setTasks(teamdata.data);
  }

  useEffect(() => {
    FetchTasks(date)
  }, [])


  const handleStatus = async (elem) => {
    try {
      await axios.put(import.meta.env.VITE_API_URL + `/api/projects/changeTstatus/${elem.id}`, {
        status: elem.status === 0 ? 1 : 0
      }, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
      });
      alert(`Task Marked as ${elem.status === 0 ? "Complete!" : "Incomplete!"}`)
      FetchTasks(date)
    } catch (error) {
      console.log(error);
    }
  }



  const normalizeDate = (date) => {
    const normalized = new Date(date);
    normalized.setHours(0, 0, 0, 0); // Reset the time part to midnight
    return normalized;
  };


  return (
    <>
      <div className="grid lg:grid-cols-6 md:grid-cols-6 grid-cols-1 gap-8 mt-8 ">
        <div className="h-auto bg-white lg:col-span-2 md:col-span-3 md:p-6 rounded-3xl shadow-md">
          <h2 className="text-lg font-bold mb-4">Calendar</h2>
          <Calendar
            onChange={(e) => {
              setDate(e)
              const date = new Date(e);

              const year = date.getFullYear();
              const month = String(date.getMonth() + 1).padStart(2, '0');
              const day = String(date.getDate()).padStart(2, '0');

              FetchTasks(`${year}-${month}-${day}`)
            }}
            value={date} // Set the selected date
            className="border-none rounded-md contents" // Customizing calendar style
          />
        </div>

        <div className="h-auto bg-white lg:col-span-4 md:col-span-3 p-6 rounded-3xl shadow-md overflow-y-auto">
          <h2 className="text-xl font-bold mb-4">Today Tasks</h2>
          {tasks.map((elem) => {
            return <div className="mb-4 flex justify-between items-center border-b pb-2" key={elem.id}>
              <div className="flex items-center">
                <p className="text-gray-700">{elem.description} </p>
                <p className="text-gray-700">- {elem.assignedTo.username}</p>
              </div>
              <div className="flex items-center">
                {user.user.role === "admin" && <MdModeEditOutline size={30} />}
                {user.user.role !== "viewer" && <input type='checkbox'
                  onChange={() => {
                    if (normalizeDate(elem.deadline) >= normalizeDate(new Date())) {
                      handleStatus(elem)
                    } else {
                      alert("Deadline ended")
                    }
                  }} className='ms-3 w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600'
                  checked={elem.status === 1} />
                }
                <p className={`${elem.status === 0 ? "text-red-600" : "text-green-600"} font-semibold ms-3`}>Today</p>
              </div>
            </div>
          })
          }

        </div>

      </div>
    </>
  );
}

export default Grid;


