import React, { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';

import profile from '../assets/image.jfif';
import { useAuthContext } from '../contexts/AuthContext';
import axios from 'axios';
import Cookies from "js-cookie";


const Task = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [assignee, setAssignee] = useState({ name: '', profilePic: '', id: "" });
  const [description, setDescription] = useState("")
  const [deadline, setDeadline] = useState("")
  const [project, setProject] = useState("")
  const [status, setStatus] = useState('');
  const [projects, setProjects] = useState([]);
  const [team, setTeam] = useState([]);
  const { user } = useAuthContext()


  const handleAssigneeSelection = (name, id, profilePic) => {
    setAssignee({ ...assignee, id,name, profilePic });
    setIsDropdownOpen(false);
  };


  useEffect(() => {
    const FetchTeam = async () => {
      const { data } = await axios.get(import.meta.env.VITE_API_URL + "/api/projects/getprojects", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
      });

      setProjects(data.results);

      if (user?.user?.role === "admin" || user?.user?.role === "viewer") {
        const teamdata = await axios.get(import.meta.env.VITE_API_URL + "/api/auth/getmembers", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${Cookies.get("token")}`,
          },
        });
        setTeam(teamdata.data);
      }
    }
    FetchTeam()
  }, [])



  const addTask = async () => {
    try {
      await axios.post(import.meta.env.VITE_API_URL + "/api/projects/createTask", { projectId: project.id, description: description, assignedTo: assignee.id, deadline: deadline }, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
      });
      alert("TASK CREATED")
    } catch (error) {
      console.log(error);
    }
  }


  return (
    <div className="bg-gray-100 min-h-screen">
      <Sidebar />
      <div className="w-[92%] md:w-full md:ml-0 ml-[3%] md:pl-32 pl-24 pr-0 md:pr-5 py-16">
        <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-3xl font-bold mb-6">New Task</h2>
          <hr className="mb-4" />
          <div className="mb-6 flex items-center">
            <label htmlFor="assignee" className="block text-md font-medium text-gray-400 mr-4">Assignee</label>
            <div className="relative">
              <button
                type="button"
                className="inline-flex items-center justify-center w-10 h-10 rounded-full overflow-hidden bg-gray-200 focus:outline-none"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                {assignee.profilePic ? (
                  <img className="w-full h-full object-cover" src={assignee.profilePic} alt="Profile" />
                ) : (
                  <svg className="w-6 h-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                )}
              </button>
              {isDropdownOpen && (
                <div className="absolute z-20 top-12 left-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                  <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">

                    {team.map((elem) => {
                      return <button
                        type="button"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                        onClick={() => handleAssigneeSelection(elem.username, elem.id, profile)}
                        role="menuitem"
                        key={elem.id}
                      >
                        <img className="w-8 h-8 rounded-full mr-2" src={profile} alt="Member 1" />
                        {elem.username}
                      </button>
                    })}
                  </div>
                </div>
              )}
            </div>
            <span className="ml-2">{assignee.name}</span>
          </div>
          {/* <div className="mb-6 flex">
            <label htmlFor="status" className="mt-3 text-md font-medium text-gray-400">Status</label>
            <div className="relative ml-6 ">
              <select
                id="status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className=" p-2 block w-full border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 "
              >
                <option value="">Select Status</option>
                <option value="Not Started">Not Started</option>
                <option value="Open">Open</option>
                <option value="Started">Started</option>
              </select>
              <svg
                className="absolute z-10 top-0 right-0 m-2 pointer-events-none w-5 h-5 text-gray-400"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M6.293 7.293a1 1 0 011.414 1.414L10 11.414l2.293-2.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414zM8 4a1 1 0 100-2 1 1 0 000 2z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div> */}

          <div className="mb-6 flex">
            <label htmlFor="project" className="mt-3 mr-6 text-md font-medium text-gray-400">Project</label>
            <select id="project" className="mt-1 p-2 block w-full border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              onChange={(e) => setProject({ id: e.target.value })}>
              <option value="">Select Project</option>
              {projects.map((elem) => {
                return <option value={elem.id} key={elem.id}>{elem.name}</option>
              })}
            </select>
          </div>
          <div className="mb-6 flex">
            <label htmlFor="dueDate" className="mr-4 mt-3 text-md font-medium text-gray-400 w-20">Due Date</label>
            <input type="date" id="dueDate" className="mt-1 p-2 block w-full border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              onChange={(e) => setDeadline( e.target.value)}
            />
          </div>
          {/* <div className="mb-6 flex">
            <label htmlFor="priority" className="mt-3 mr-6 text-md font-medium text-gray-400">Priority</label>
            <select id="priority" className="mt-1 p-2 block w-full border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500">
              <option value="">Select Priority</option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div> */}
          <div className="mb-6">
            <label htmlFor="description" className="block text-md font-bold text-gray-700">Description</label>
            <textarea
              id="description"
              onChange={(e) => setDescription(e.target.value)}
              className="mt-1 p-8 block w-full border border-gray-300 bg-gray-100 rounded-md focus:ring-blue-500 focus:border-blue-500"
            ></textarea>
          </div>

          {/* <div className="mb-4 col-span-4 h-auto">
     
        <div className="grid grid-cols-2 gap-4 mt-8">

<div className="md:col-span-1 col-span-2">
<h2 className='text-md font-bold'>Sub task</h2>
</div>

<div className="md:col-span-1 col-span-2">
<h2 className='text-md font-bold'>Comments</h2>
    
</div>

        </div>
      </div> */}
          <div className="flex justify-center">
            <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            onClick={addTask}>Add Task</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Task;
