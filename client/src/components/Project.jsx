import React, { useEffect, useRef, useState } from 'react';
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
  const [show2, setShow2] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const assignee = useRef([]);
  const [selectedProject, setselectedProject] = useState([]);
  const [members, setMembers] = useState([]);



  const handleAssigneeSelection = async (name, id, profilePic) => {
    if (!members.filter((elem) => { return elem.user_id == Number(id) }).length > 0) {
      await axios.post(import.meta.env.VITE_API_URL + "/api/projects/addpmembers",
        {
          project_id: selectedProject.id,
          userId: id
        },
        { withCredentials: true });
      assignee.current = ([...assignee.current, { id, name, profilePic }]);
      setIsDropdownOpen(false);
      getProjectMembers(selectedProject)
    }
  };

  const fetchProjects = async () => {
    const { data } = await axios.get(import.meta.env.VITE_API_URL + "/api/projects/getprojects",  { withCredentials: true });

    setProjects(data.results);
    if (user?.role === "admin" || user?.role === "viewer") {
      const teamdata = await axios.get(import.meta.env.VITE_API_URL + "/api/auth/getmembers", { withCredentials: true });
      setTeam(teamdata.data);
    }
  }

  useEffect(() => {
    fetchProjects()
  }, [])


  const addProject = async () => {
    if (values?.name?.length > 0 &&
      values?.budget?.length > 0 &&
      values?.deadline?.length > 0
    ) {
      try {
        axios.post(import.meta.env.VITE_API_URL + "/api/projects/create", { ...values }, { withCredentials: true });

        alert("PROJECT ADDED");
        fetchProjects();
        setValues({ name: "", budget: "", deadline: "" })
        setShow(false)
      } catch (error) {
        console.log(error);
      }
    } else {
      alert("FILL ALL FIELDS")
    }
  }


  const getProjectMembers = async (project) => {
    const { data } = await axios.get(import.meta.env.VITE_API_URL + `/api/projects/getprojectmembers?project_id=${project.id}`, { withCredentials: true });

    setMembers(data.results)
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
                  <div className="">
                    {user?.role === "admin" &&
                     <button className='mr-5 bg-blue-500 p-2 text-sm text-white rounded-md' onClick={() => {
                      setShow2(true)
                      setselectedProject(project)
                      getProjectMembers(project)
                    }}>Add Members</button>
                    }
                    <div className="relative">
                      <div className={`absolute ${project.status === 0 ? "bg-red-500" : "bg-green-500"} rounded-full w-3 h-3 bottom-3 right-0`}></div>
                    </div>
                  </div>
                </div>
              ))}

              {user?.role === "admin" && <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 mt-2 px-4 rounded-md"
                onClick={() => setShow(true)}>
                Add More
              </button>
              }
            </div>

          </div>

          


          {(user?.role === "admin" || user?.role === "viewer") && <div className="lg:col-span-2 md:col-span-1 bg-white p-4 rounded-md">
            <h2 className="text-xl font-bold mb-4">Team Directory</h2>

            <div className="grid w-full gap-4">
              <div className="col-span-2 md:col-span-1 flex flex-wrap justify-between">
                {/* Box 1 */}
                {team.map((elem) => {
                  return <div className="bg-[#f8f8f7]  p-4 rounded-md mb-4 lg:w-2/5 w-full" key={elem.id}>
                    <img src={"https://cdn.iconscout.com/icon/free/png-256/free-laptop-user-1-1179329.png?f=webp"} className="rounded-full w-12 h-12 mb-2" />
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




      {(show2 && user?.role === "admin") && <div className='h-lvh w-full bg-slate-400 flex items-center justify-center fixed top-0 left-0'>
        <div className='lg:w-1/2 w-10/12 bg-white p-5 rounded'>
          <MdClose size={30} className="d-block ms-auto" onClick={() => setShow2(false)} cursor="pointer" />

          <h1 className='font-bold text-4xl text-center'>Add Members to {selectedProject.name}</h1>
          <h1>Current Members:</h1>
          {members.map((elem) => {
            return <p>{elem.username}</p>
          })}
          <div className="mb-6 flex items-center mt-4">
            <label htmlFor="assignee" className="block text-md font-medium text-gray-400 mr-4">Add More</label>
            <div className="relative">
              <button
                type="button"
                className="inline-flex items-center justify-center w-10 h-10 rounded-full overflow-hidden bg-gray-200 focus:outline-none"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >

                <svg className="w-6 h-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
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
            {assignee.current.map((elem) => {
              return <div className='flex ml-4 items-center'>
                <img className="inline-flex items-center justify-center w-10 h-11 rounded-full overflow-hidden bg-gray-200 focus:outline-none" src={elem.profilePic} alt="Profile" />
                <span className="ml-3">{elem.name}</span>
              </div>
            })}
          </div>
        </div>
      </div>}
    </>
  );
}

export default Project;


