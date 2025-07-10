import React, { useState } from "react";
import {
  LayoutDashboard,
  Users,
  FileText,
  Settings,
  Bell,
  Search,
  Filter,
} from "lucide-react";
import "./App.css";

const initialLeads = [
  {
    id: 1,
    name: "John Doe",
    company: "Innovate Inc.",
    email: "john@innovate.com",
    phone: "555-1234",
    status: "New",
    assignedTo: "Alice",
  },
  {
    id: 2,
    name: "Jane Smith",
    company: "Tech Solutions",
    email: "jane@tech.com",
    phone: "555-5678",
    status: "Contacted",
    assignedTo: "Bob",
  },
];

export default function App() {
  const [leads, setLeads] = useState(initialLeads);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");

  const filteredLeads = leads.filter((lead) => {
    const matchesSearch =
      lead.name.toLowerCase().includes(search.toLowerCase()) ||
      lead.company.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = filterStatus === "All" || lead.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="app-container">
      <aside className="sidebar">
        <div className="sidebar-header">Lead Management</div>
        <ul className="sidebar-menu">
          <li><LayoutDashboard size={18} /> <span>Dashboard</span></li>
          <li><Users size={18} /> <span>Leads</span></li>
          <li><FileText size={18} /> <span>Reports</span></li>
          <li><Settings size={18} /> <span>Settings</span></li>
        </ul>
      </aside>

      <main className="main-content">
        <div className="header">
          <div className="title">Leads</div>
          <div className="profile">
            <Bell className="icon" />
            <img src="https://i.pravatar.cc/40" alt="Profile" className="avatar" />
          </div>
        </div>

        <div className="filters">
          <div className="search-box">
            <Search className="search-icon" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or company"
              className="search-input"
            />
          </div>
          <div className="status-filter">
            <Filter className="icon" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="filter-select"
            >
              <option>All</option>
              <option>New</option>
              <option>Contacted</option>
              <option>Qualified</option>
              <option>Proposal</option>
              <option>Won</option>
              <option>Lost</option>
            </select>
          </div>
        </div>

        <div className="table-wrapper">
          <table className="leads-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Company</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Status</th>
                <th>Assigned To</th>
              </tr>
            </thead>
            <tbody>
              {filteredLeads.map((lead) => (
                <tr key={lead.id}>
                  <td>{lead.name}</td>
                  <td>{lead.company}</td>
                  <td>{lead.email}</td>
                  <td>{lead.phone}</td>
                  <td><span className={`status-tag ${lead.status.toLowerCase()}`}>{lead.status}</span></td>
                  <td>{lead.assignedTo}</td>
                </tr>
              ))}
              {filteredLeads.length === 0 && (
                <tr>
                  <td colSpan="6" className="no-leads">No leads found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
