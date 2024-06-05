import React, { useEffect, useState } from 'react';
import profile from '../assets/image.jfif';
import axios from 'axios';
import Cookies from "js-cookie";
import { useAuthContext } from '../contexts/AuthContext';
import { MdClose } from "react-icons/md";

function Project() {
  const [projects, setProjects] = useState([]);
  const [team, setTeam] = useState([]);
  const { user } = useAuthContext()
  const [values, setValues] = useState({})
  const [show, setShow] = useState(false)

  useEffect(() => {
    const fetchProjects = async () => {
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
    fetchProjects()
  }, [])


  const addProject = async () => {
    if (values?.name?.length > 0 &&
      values?.budget?.length > 0 &&
      values?.deadline?.length > 0
    ) {
      try {
        axios.post(import.meta.env.VITE_API_URL + "/api/projects/create", { ...values }, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${Cookies.get("token")}`,
          },
        });

        alert("PROJECT ADDED");
        setValues({ name: "", budget: "", deadline: "" })
        setShow(false)
      } catch (error) {
        console.log(error);
      }
    } else {
      alert("FILL ALL FIELDS")
    }
  }

  return (
    <>
      <div className=" col-span-4 h-auto">
        {/* Content */}

        {/* New Grid */}
        <div className="grid lg:grid-cols-4 grid-cols-1 gap-4 mt-8">
          {/* First Column */}
          <div className="lg:col-span-1 md:col-span-1 bg-white p-4 rounded-md">
            <h2 className="text-xl font-bold mb-4">Project directory</h2>
            <div className="col-span-4 md:col-span-1  rounded-md">
              {projects.map(project => (
                <div key={project.id} className="flex justify-between items-center mb-4">
                  <div className="flex items-center">

                    <p className="text-gray-700">{project.name}</p>
                  </div>
                  <div className="relative">
                    {/* <img
                    src={profile}
                    alt="Profile"
                    className="rounded-full w-8 h-8 object-cover"
                  /> */}
                    <div className={`absolute ${project.status === 0 ? "bg-red-500" : "bg-green-500"} rounded-full w-3 h-3 bottom-0 right-0`}></div>
                  </div>
                </div>
              ))}

              {user?.user?.role === "admin" && <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 mt-2 px-4 rounded-md"
                onClick={() => setShow(true)}>
                Add More
              </button>
              }
            </div>

          </div>

          <div className="lg:col-span-1 md:col-span-1 ">
            {/* Upper Div */}
            <div className="mb-4 bg-white p-4 rounded-md border border-gray-200 shadow-md">
              <h2 className="text-xl font-bold mb-4">New Comments</h2>
              <div className=" bg-[#f8f8f7] mb-3 p-2">
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <img src={profile} alt="Profile" className="h-10 w-10 rounded-full" />
                  </div>
                  <div className="flex flex-col">
                    <p className="text-gray-800 font-semibold">Ahsan Raza</p>
                    <p className="text-gray-500 text-sm">May 20, 2024</p>
                  </div>
                </div>
                <p className="text-gray-700 mt-4">
                  Completed the task
                </p>

              </div>
              <div className=" bg-[#f8f8f7] mb-1 p-2">
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <img src={profile} alt="Profile" className="h-10 w-10 rounded-full" />
                  </div>
                  <div className="flex flex-col">
                    <p className="text-gray-800 font-semibold">Hasnain shabeer</p>
                    <p className="text-gray-500 text-sm">May 20, 2024</p>
                  </div>
                </div>
                <p className="text-gray-700 mt-4">
                  Completed the task
                </p>

              </div>
            </div>
            {/* Lower Div */}
            <div className="bg-white block p-2 rounded-md xl:flex">
              {/* Content */}
              <div className="bg-purple-100  mr-1 md:p-4 p-2">
                <p className='md:text-xl sm:text-xs text-md'>Surwey design</p>
              </div>
              <div className="bg-green-100  mr-1 md:p-4 p-2">
                <p className='md:text-xl sm:text-xs text-md'>SWOT anaylysis</p>
              </div>
              <div className="bg-orange-100  mr-1 md:p-4 p-2">
                <p className='md:text-xl sm:text-xs text-md'>Structure design</p>
              </div>
            </div>
          </div>


          {user?.user?.role === "admin" && <div className="lg:col-span-2 md:col-span-1 bg-white p-4 rounded-md">
            <h2 className="text-xl font-bold mb-4">Team Directory</h2>

            <div className="grid w-full gap-4">
              <div className="col-span-2 md:col-span-1 flex flex-wrap justify-between">
                {/* Box 1 */}
                {team.map((elem) => {
                  return <div className="bg-[#f8f8f7]  p-4 rounded-md mb-4 lg:w-2/5 w-full" key={elem.id}>
                    <img src={profile} className="rounded-full w-12 h-12 mb-2" />
                    <p className="text-lg font-bold">{elem.username}</p>
                    <small className="text-sm text-gray-800">{elem.designation}</small>
                  </div>
                })}

              </div>

            </div>
          </div>
          }
        </div>
      </div>

      {show && <div className='h-lvh w-full bg-slate-400 flex items-center justify-center fixed top-0 left-0'>
        <div className='lg:w-1/2 w-10/12 bg-white p-5 rounded'>
          <MdClose size={30} className="d-block ms-auto" onClick={() => setShow(false)} cursor="pointer" />
          <div className="mb-6">
            <label htmlFor="name" className="mt-3 mr-6 text-md font-medium text-gray-800">Project Name:</label>
            <input className="mt-1 p-2 block w-full border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              onChange={(e) => setValues({ ...values, name: e.target.value })} placeholder='Project Name' value={values?.name} />
          </div>

          <div className="mb-6">
            <label htmlFor="budget" className="mt-3 mr-6 text-md font-medium text-gray-800">Budget:</label>
            <input className="mt-1 p-2 block w-full border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              onChange={(e) => setValues({ ...values, budget: e.target.value })} placeholder='Budget' value={values?.budget} />
          </div>

          <div className="mb-6">
            <label htmlFor="deadline" className="mt-3 mr-6 text-md font-medium text-gray-800">Deadline:</label>
            <input className="mt-1 p-2 block w-full border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              type='date'
              onChange={(e) => setValues({ ...values, deadline: e.target.value })} placeholder='Deadline' value={values?.deadline} />
          </div>

          <button className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            onClick={addProject}>Add Project</button>
        </div>

      </div>}
    </>
  );
}

export default Project;


