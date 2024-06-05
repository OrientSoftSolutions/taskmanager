import React from 'react';
import profile from '../assets/image.jfif';

function UserTasks() {
  // Dummy data for demonstration
  const users = [
    {
      name: 'Alice Johnson',
      profilePic: profile,
      tasks: [

        {
          title: 'Graphic Design',
          image: 'https://via.placeholder.com/30',
          dueDate: '2024-06-05',
        },
      ],
    },
    {
      name: 'Bob Smith',
      profilePic: profile,
      tasks: [

        {
          title: 'API Testing',
          image: 'https://via.placeholder.com/30',
          dueDate: '2024-06-15',
        },
      ],
    },
  ];

  return (
    <div className="h-auto bg-white lg:col-span-4 md:col-span-3 p-6 rounded-3xl shadow-md">
      <h1 className="text-2xl font-bold mb-4">Tasks by User</h1>
      <div className="grid grid-cols-1 gap-4">
        {users.map((user, index) => (
          <div key={index} className="p-4 bg-white rounded-lg shadow-sm border-b-4">
            <div className="flex items-center mb-4">
              <img
                src={user.profilePic}
                alt={`${user.name}'s profile`}
                className="w-10 h-10 rounded-full mr-4"
              />
              <h2 className="text-xs font-bold">{user.name}</h2>
              {/* <h2 className="text-sm font-bold">{user.duetitle}</h2> */}

            </div>
            <div>
              {user.tasks.map((task, taskIndex) => (
                <div key={taskIndex} className="flex items-center mb-2 text-xs font-normal">
      <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-gray-400 mr-2"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M15.942 4.698A1 1 0 0117 5.38v10.274a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h8.368l.444-.537a2 2 0 011.273-.465l.415-.014a1 1 0 01.874 1.41l-.008.01-.001.002L15.942 4.698zM5 3a3 3 0 00-3 3v10a3 3 0 003 3h10a3 3 0 003-3V6a3 3 0 00-3-3H5z"
                    clipRule="evenodd"
                  />
                </svg>
                  <span className="flex-1 text-xs">{task.title}</span>
                  
                  <span className="text-gray-500">{task.dueDate}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default UserTasks;
