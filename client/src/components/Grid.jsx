import React, { useEffect, useState } from 'react';
import Calendar from 'react-calendar'; // Import the Calendar component
import 'react-calendar/dist/Calendar.css'; // Import the default calendar styles
import { useAuthContext } from '../contexts/AuthContext';
import axios from 'axios';
import Cookies from "js-cookie";
import { MdClose, MdModeEditOutline } from "react-icons/md";
import { Link } from 'react-router-dom';
import { FaRegComment } from 'react-icons/fa';

function Grid() {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]); // State to manage the selected date
  const { user } = useAuthContext();
  const [tasks, setTasks] = useState([])
  const [values, setValues] = useState({})
  const [show, setShow] = useState(false)
  const [commentsView, setCommentsView] = useState(false);
  const [comments, setComments] = useState([]);
  const [currentTask, setCurrentTask] = useState({})
  const [comment, setComment] = useState("")

  const FetchTasks = async (date) => {
    const teamdata = await axios.get(import.meta.env.VITE_API_URL + `/api/projects/tasks?date=${date}`, { withCredentials: true });
    setTasks(teamdata.data);
  }

  useEffect(() => {
    FetchTasks(date)
  }, [])


  const handleStatus = async (elem) => {
    try {
      await axios.put(import.meta.env.VITE_API_URL + `/api/projects/changeTstatus/${elem.id}`, {
        status: elem.status === 0 ? 1 : 0
      }, { withCredentials: true });
      FetchTasks(date)
      alert(`Task Marked as ${elem.status === 0 ? "Complete!" : "Incomplete!"}`)
    } catch (error) {
      console.log(error);
    } api
  }



  const normalizeDate = (date) => {
    const normalized = new Date(date);
    normalized.setHours(0, 0, 0, 0);
    return normalized;
  };

  const editTask = async () => {
    try {
      await axios.put(import.meta.env.VITE_API_URL + `/api/projects/updatetask/${values.id}`, {
        description: values.description,
        deadline: values.deadline.split("T")[0]
      }, { withCredentials: true });
      setValues({})
      FetchTasks(date)
      alert("UPDATED!")
      setShow(false)
    } catch (error) {
      console.log(error);
    }
  }



  const addComment = async () => {
    axios.post(import.meta.env.VITE_API_URL + `/api/projects/tasks/${currentTask.id}/comments`, { comment }, { withCredentials: true })
      .then(response => {
        setComments(response.data.comments);
        setComment('');
      })
      .catch(error => {
        console.error("There was an error submitting the comment!", error);
      });
  }



  const FetchComments = async (elem) => {
    axios.get(import.meta.env.VITE_API_URL + `/api/projects/tasks/${elem.id}/comments`, { withCredentials: true })
      .then(response => {
        // console.log(response.data.comments);
        setComments(response.data.comments);
      })
      .catch(error => {
        console.error("There was an error fetching the comments!", error);
        // setError("There was an error fetching the comments.");
      });
  }


  const checkUser = (elem) => {
    if (elem.userId === user?.id) {
      return true
    } else {
      return false;
    }
  }


  return (
    <>
      <div className="grid lg:grid-cols-6  grid-cols-1 gap-8 mt-8 ">
        <div className="h-[42vh] bg-white lg:col-span-2 md:col-span-3 md:p-6 rounded-3xl shadow-md">
          <h2 className="text-lg font-bold mb-4">Calendar</h2>
          <Calendar
            onChange={(e) => {
              const date = new Date(e);
              
              const year = date.getFullYear();
              const month = String(date.getMonth() + 1).padStart(2, '0');
              const day = String(date.getDate()).padStart(2, '0');
              
              setDate(`${year}-${month}-${day}`)
              FetchTasks(`${year}-${month}-${day}`)
            }}
            value={date}
            className="border-none rounded-md contents"
          />
        </div>

        <div className="h-[42vh] bg-white lg:col-span-4 md:col-span-3 p-6 rounded-3xl shadow-md overflow-y-auto">
          <h2 className="text-xl font-bold mb-4">Today Tasks</h2>
          {tasks.map((elem) => {
            return <div className="mb-4 flex justify-between items-center border-b pb-2" key={elem.id} onClick={() => {
              setCurrentTask(elem)
              FetchComments(elem)
            }}>
              <div className="">

              <div className="flex items-center">
                <p className="text-gray-700">{elem.description} </p>
              </div>
                <p className="text-gray-700">- {elem.assignedTo.username}</p>
              </div>
              <div className="flex items-center">
                {user?.role === "admin" && <MdModeEditOutline size={30} onClick={() => {
                  setShow(true)
                  setValues(elem)
                }} cursor="pointer" />}
                {(user?.role !== "viewer" && user?.role !== "admin") && <input type='checkbox'
                  onChange={() => {
                    if (normalizeDate(elem.deadline) >= normalizeDate(new Date())) {
                      handleStatus(elem)
                    } else {
                      alert("Deadline ended")
                    }
                  }} className='ms-3 w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600'
                  checked={elem.status === 1} />
                }
                <FaRegComment size={28} cursor="pointer" color="#464646" className="ms-3"
                  onClick={() => setCommentsView(true)} />
                <p className={`${elem.status === 0 ? "text-red-600" : "text-green-600"} font-semibold ms-3`}>Today</p>
              </div>
            </div>
          })
          }

        </div>

      </div>


      {show && <div className='h-lvh w-full bg-slate-400 flex items-center justify-center fixed top-0 left-0 z-50'>
        <div className='lg:w-1/2 w-10/12 bg-white p-5 rounded'>
          <MdClose size={30} className="d-block ms-auto" onClick={() => setShow(false)} cursor="pointer" />
          <div className="mb-6">
            <label htmlFor="name" className="mt-3 mr-6 text-md font-medium text-gray-800">Description:</label>
            <input className="mt-1 p-2 block w-full border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              onChange={(e) => setValues({ ...values, description: e.target.value })} placeholder='Description' value={values?.description} />
          </div>

          <div className="mb-6">
            <label htmlFor="date" className="mt-3 mr-6 text-md font-medium text-gray-800">Deadline:</label>
            <input type='date' className="mt-1 p-2 block w-full border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              onChange={(e) => setValues({ ...values, deadline: e.target.value })} placeholder='Deadline' value={values?.deadline?.split("T")[0]} />
          </div>
          <button className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            onClick={editTask}>Edit</button>
        </div>

      </div>}





      {commentsView && <div className='h-lvh w-full bg-slate-400 flex items-center justify-center fixed top-0 left-0 z-50'>
        <div className='w-full h-full bg-white p-5 rounded'>
          <MdClose size={30} className="d-block ms-auto" onClick={() => setCommentsView(false)} cursor="pointer" />


          <div className="h-[80vh] overflow-y-auto mt-4">
            {comments?.map((elem) => {
              return <div key={elem} className={`py-2 px-5 rounded-2xl w-fit ${checkUser(elem) ? "bg-blue-700 text-white ms-auto " : "bg-gray-100 "}`}>{elem.comment}</div>
            })}
          </div>

          <div className="fixed w-full bottom-3">
            <div className="mb-6 w-full ">
              <label htmlFor="date" className="mt-3 mr-6 text-md font-medium text-gray-800">Comment:</label>
              <textarea className="mt-1 p-2 block border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 w-full" placeholder='Add Comment'
                onChange={(e) => setComment(e.target.value)} value={comment}
              ></textarea>
            </div>
            <button className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              onClick={addComment}>Add</button>
          </div>
        </div>

      </div>}
    </>
  );
}

export default Grid;


