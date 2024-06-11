import React, { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import { useAuthContext } from '../contexts/AuthContext';
import axios from 'axios';
import Cookies from "js-cookie";
import { Link } from 'react-router-dom';


const Report = () => {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const { user , tasks, setTasks} = useAuthContext();

  const FetchTasks = async (date) => {
    const { data } = await axios.get(import.meta.env.VITE_API_URL + `/api/projects/tasks?date=${date}`, { withCredentials: true });
    setTasks(data);
  }

  useEffect(() => {
    FetchTasks(date)
  }, [])

  

  return (
    <div className="bg-gray-100 min-h-screen">
      <Sidebar />

      <div className="w-[92%] md:w-full md:ml-0 ml-[3%] md:pl-32 pl-24 pr-0 md:pr-5 py-16">
        <div className="flex justify-between items-center mb-3">
        <h1 className='font-bold text-3xl mb-3'>Today Tasks</h1>
        <Link to={"/preview"} target='_blank' className='bg-blue-500 p-2 rounded text-white'>Download</Link>
        </div>

        <div className="relative overflow-x-auto shadow-lg rounded-md">
          <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="px-6 py-3 font-bold text-xl">
                  Tasks
                </th>
                <th scope="col" className="px-6 py-3 font-bold text-xl">
                  Done By
                </th>
                <th scope="col" className="px-6 py-3 font-bold text-xl">
                  Designation
                </th>
                <th scope="col" className="px-6 py-3 font-bold text-xl">
                  Project
                </th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((elem) => {
                return <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700" key={elem.id}>
                  <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap text-lg dark:text-white">
                    {elem.description}
                  </th>
                  <td className="px-6 py-4 text-lg">
                    {elem.assignedTo.username}
                  </td>
                  <td className="px-6 py-4 text-lg">
                    {elem.assignedTo.designation}
                  </td>
                  <td className="px-6 py-4 text-lg">
                   {elem.project.name}
                  </td>
                </tr>
              })}

            </tbody>
          </table>
        </div>


      </div>
    </div>
  );
};

export default Report;
