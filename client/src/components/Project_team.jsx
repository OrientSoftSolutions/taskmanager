import React from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import profile from '../assets/image.jfif';
import UserTasks from './UserTasks';

function Project_team() {

  return (
    <div className="grid lg:grid-cols-6 md:grid-cols-6 grid-cols-1 gap-8 mt-8">
      {/* Calendar */}
      <div className="h-auto bg-white lg:col-span-2 md:col-span-3 md:p-6 rounded-3xl shadow-md">
        <h2 className="text-xl font-bold mb-4">Team Directory</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Team Member 1 */}
          <div className="col-span-1">
            <div className="bg-[#f8f8f8] p-4 rounded-md text-center">
              <img src={profile} alt="Profile" className="rounded-full w-12 h-12 mb-2 m-auto" />
              <p className="text-lg font-bold ">Abbas</p>
            </div>
          </div>

          {/* Team Member 2 */}
          <div className="col-span-1">
            <div className="bg-[#f8f8f8] p-4 rounded-md text-center">
              <img src={profile} alt="Profile" className="rounded-full w-12 h-12 mb-2 m-auto" />
              <p className="text-lg font-bold">Saif</p>
            </div>
          </div>

          {/* Team Member 3 */}
          <div className="col-span-1">
            <div className="bg-[#f8f8f8] p-4 rounded-md text-center">
              <img src={profile} alt="Profile" className="rounded-full w-12 h-12 mb-2 m-auto" />
              <p className="text-lg font-bold">Hasnain</p>
            </div>
          </div>

          {/* Team Member 4 */}
          <div className="col-span-1">
            <div className="bg-[#f8f8f8] p-4 rounded-md text-center">
              <img src={profile} alt="Profile" className="rounded-full w-12 h-12 mb-2 m-auto" />
              <p className="text-lg font-bold">Raza</p>

            </div>
          </div>
        </div>
      </div>
      <UserTasks />

    </div>
  );
}

export default Project_team;
