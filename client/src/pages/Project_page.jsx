import React from 'react';
import Sidebar from '../components/Sidebar';
import Project_grid from '../components/Project_grid';
import Project from '../components/Project';
import Project_team from '../components/Project_team';
import UserTasks from '../components/UserTasks';


const Project_page = () => {

  return (
    <div className="bg-[#f8f8f7] min-h-screen">
      <Sidebar />
      <div className="w-[92%] md:w-full md:ml-0 ml-[3%] md:pl-32 pl-24 pr-0 md:pr-5 py-16">
      <div>
              <h1 className="text-4xl font-bold">Project Overview</h1>
  
            </div>
    <Project_grid />
    <Project_team />

      </div>
    </div>
  );
};

export default Project_page;
