"use client";

import { useState } from "react";
import {
  Menu,
  X,
  HelpCircle,
  Settings,
  User,
  Bell,
  Sun,
  Moon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import logo from "@/assets/logo.png";
import "@/components/css/dashboard_header.css";

export function DashboardHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [notifications] = useState(3);

  const toggleTheme = () => {
    document.documentElement.classList.toggle("dark");
    setDarkMode(!darkMode);
  };

  return (
    <header className="dashboard-header">
      <div className="header-container">
        {/* Logo */}
        <div className="header-left">
          <img src={logo} alt="Logo" className="header-logo" />
          <div className="header-title">
            <h1>Radiance Star Homes</h1>
            <p>Airbnb property management</p>
          </div>
        </div>

        <div className="header-actions desktop-only">
          {/* Notifications */}
          <button className="icon-btn notification-btn">
            <Bell />
            {notifications > 0 && (
              <span className="notification-badge">{notifications}</span>
            )}
          </button>

          {/* Theme Toggle */}
          <button className="icon-btn" onClick={toggleTheme}>
            {darkMode ? <Sun /> : <Moon />}
          </button>

          {/* Profile */}
          <div className="profile-wrapper">
            <button
              className="profile-btn"
              onClick={() => setProfileOpen(!profileOpen)}
            >
              <User />
            </button>

            {profileOpen && (
              <div className="profile-dropdown">
                <button>My Profile</button>
                <button>Settings</button>
                <button className="danger">Logout</button>
              </div>
            )}
          </div>
        </div>

        <button
          className="mobile-menu-btn mobile-only"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="mobile-menu">
          <button>Notifications</button>
          <button onClick={toggleTheme}>
            {darkMode ? "Light Mode" : "Dark Mode"}
          </button>
          <button>Help</button>
          <button>Settings</button>
          <button>My Profile</button>
          <button className="danger">Logout</button>
        </div>
      )}
    </header>
  );
}
