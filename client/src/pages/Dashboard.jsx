import React from 'react';

import Sidebar from '../components/Sidebar';
import Welcome from '../components/Welcome';
import Grid from '../components/Grid';
import Project from '../components/Project';

function Dashboard() {

  return (
    <div className="bg-[#f8f8f7] ">
      <Sidebar />

      <div className="w-[92%] md:w-full md:ml-0 ml-[3%] md:pl-32 pl-24 pr-0 md:pr-5 py-16">

        <Welcome />
        <Grid />
        <Project />

      </div>
    </div>
  );
}

export default Dashboard;
