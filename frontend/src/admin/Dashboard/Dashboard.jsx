import React, { useState, useEffect } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import Stats from '../Stats/Stats';
import './Dashboard.css';
import {
  FaChartBar, FaCar, FaPlus, FaUser,
  FaFileContract, FaCalendarCheck, FaHome,
  FaAngleDoubleLeft, FaAngleDoubleRight
} from 'react-icons/fa';

const Dashboard = () => {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  
  const isRootDashboard = location.pathname === '/admin/dashboard' || 
                         location.pathname === '/admin/dashboard/';

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setCollapsed(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  return (
    <div className="admin-layout">
      <aside className={`admin-sidebar ${collapsed ? 'collapsed' : ''}`}>
        <div className="sidebar-header">
          {!collapsed && <h2>Taza Rent Car</h2>}
          <button className="collapse-btn" onClick={toggleSidebar}>
            {collapsed ? <FaAngleDoubleRight /> : <FaAngleDoubleLeft />}
          </button>
        </div>
        <nav>
          <ul>
            <li>
              <Link to="/admin/dashboard" className={isRootDashboard ? 'active' : ''}>
                <FaChartBar />
                {!collapsed && <span>Dashboard</span>}
              </Link>
            </li>
            <li>
              <Link to="/admin/dashboard/cars">
                <FaCar />
                {!collapsed && <span>Cars</span>}
              </Link>
            </li>
            <li>
              <Link to="/admin/dashboard/add-car">
                <FaPlus />
                {!collapsed && <span>Add Car</span>}
              </Link>
            </li>
            <li>
              <Link to="/admin/dashboard/users">
                <FaUser />
                {!collapsed && <span>Users</span>}
              </Link>
            </li>
            <li>
              <Link to="/admin/dashboard/contrats">
                <FaFileContract />
                {!collapsed && <span>Contracts</span>}
              </Link>
            </li>
            <li>
              <Link to="/admin/dashboard/reservations">
                <FaCalendarCheck />
                {!collapsed && <span>Reservations</span>}
              </Link>
            </li>
            <li className="back-to-site">
              <Link to="/">
                <FaHome />
                {!collapsed && <span>Back to Site</span>}
              </Link>
            </li>
          </ul>
        </nav>
      </aside>
      
      <main className={`admin-content ${collapsed ? 'collapsed' : ''}`}>
        {isRootDashboard ? <Stats /> : <Outlet />}
      </main>
    </div>
  );
};

export default Dashboard;