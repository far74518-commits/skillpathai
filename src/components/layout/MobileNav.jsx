import React from 'react';
import { NavLink } from 'react-router-dom';
import { Compass, Map, Award, FileText, Briefcase } from 'lucide-react';

export default function MobileNav() {
  const navItems = [
    { to: '/dashboard', label: 'Dashboard', icon: Compass },
    { to: '/roadmap', label: 'Roadmap', icon: Map },
    { to: '/skills', label: 'Skills', icon: Award },
    { to: '/cv-builder', label: 'CV', icon: FileText },
    { to: '/jobs', label: 'Jobs', icon: Briefcase }
  ];

  return (
    <nav className="mobile-bottom-nav">
      {navItems.map((item) => {
        const Icon = item.icon;
        return (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => `mobile-nav-link ${isActive ? 'active' : ''}`}
          >
            <Icon size={20} />
            <span>{item.label}</span>
          </NavLink>
        );
      })}
    </nav>
  );
}
