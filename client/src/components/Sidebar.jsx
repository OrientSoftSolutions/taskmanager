import React from 'react';
import { FaHome } from "react-icons/fa";
import { FaCalendarAlt } from "react-icons/fa";
import { GiProgression } from "react-icons/gi";
import { BiSolidReport } from "react-icons/bi";
import { MdAddBox } from "react-icons/md";
import { IoSettingsSharp } from "react-icons/io5";
import { HiOutlineLogout } from "react-icons/hi";
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useAuthContext } from '../contexts/AuthContext';
import Cookies from "js-cookie";




function Sidebar() {
  const { user, setUser, setLoading } = useAuthContext();
  const navigate = useNavigate()


  const logout = () => {
    setUser(false)
    Cookies.remove('token')
    navigate('/')
  }
  return (
    <>
      <div className="bg-gray-800 text-white h-screen w-15 fixed left-0 top-0 overflow-y-auto flex flex-col justify-between">
        {/* Sidebar content */}
        <div className="p-8 mt-10">
          {/* <h1 className="text-2xl font-semibold">Dashboard</h1> */}
          <ul className="w-fit">
            <li className="mb-2"><Link to="/" className="block py-4"><FaHome size={26} className='hover:text-orange-400' /></Link></li>
            {/* <li className="mb-2"><Link to="" className="block py-4"><F  <img class="cover-img logo" src="https://orientsoftsolutions.com/assets/images/logo.png"
                            alt="oss">
aCalendarAlt size={26} className='hover:text-orange-400' /></Link></li> */}
            {(user.user.role === "admin" || user.user.role === "viewer") && <><li className="mb-2"><Link to="/project" className="block py-4"><GiProgression size={26} className='hover:text-orange-400' /></Link></li>
              <li className="mb-2"><Link to="/report" className="block py-4"><BiSolidReport size={26} className='hover:text-orange-400' /></Link></li>
            </>
            }
            {user.user.role === "admin" && <li className="mb-2"><Link to="/task" className="block py-4"><MdAddBox size={26} className='hover:text-orange-400' /></Link></li>
            }  </ul>
        </div>

        <div className="p-8">
          <ul className="w-fit">
            <li className="mb-2"><a href="#" className="block py-4"><IoSettingsSharp size={26} className='hover:text-orange-400' /></a></li>
            <li className="mb-2"><span onClick={logout} className="block py-4"><HiOutlineLogout size={26} className='hover:text-orange-400' /></span></li>
          </ul>
        </div>
      </div>
    </>
  );
}

export default Sidebar;


