import React, { useState } from 'react';
import { FiUserPlus, FiSearch, FiBarChart2, FiMail, FiPhone, FiCalendar } from 'react-icons/fi';

const Home = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Mock data - replace with API calls
  const stats = [
    { title: 'Total Leads', value: 142, change: '+12%', color: 'bg-blue-500' },
    { title: 'New Leads', value: 24, change: '+5%', color: 'bg-green-500' },
    { title: 'Contacted', value: 68, change: '-3%', color: 'bg-yellow-500' },
    { title: 'Converted', value: 42, change: '+8%', color: 'bg-purple-500' }
  ];

  const recentLeads = [
    { id: 1, name: 'Sarah Johnson', email: 'sarah@example.com', phone: '(555) 123-4567', status: 'New', source: 'Website', lastContact: '2 hours ago' },
    { id: 2, name: 'Michael Chen', email: 'michael@example.com', phone: '(555) 987-6543', status: 'Contacted', source: 'Referral', lastContact: 'Yesterday' },
    { id: 3, name: 'Emma Rodriguez', email: 'emma@example.com', phone: '(555) 456-7890', status: 'Qualified', source: 'Social Media', lastContact: '3 days ago' },
    { id: 4, name: 'James Wilson', email: 'james@example.com', phone: '(555) 234-5678', status: 'New', source: 'Website', lastContact: '5 hours ago' },
  ];

  const activityFeed = [
    { id: 1, user: 'You', action: 'added new lead', target: 'Sarah Johnson', time: '2 hours ago' },
    { id: 2, user: 'Alex Morgan', action: 'changed status to', target: 'Qualified', time: '3 hours ago' },
    { id: 3, user: 'You', action: 'sent email to', target: 'Michael Chen', time: 'Yesterday' },
    { id: 4, user: 'Taylor Kim', action: 'assigned lead to', target: 'You', time: '2 days ago' },
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
          <p className="text-gray-600">Welcome back! Here's your lead overview</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 mt-4 md:mt-0 w-full md:w-auto">
          <div className="relative">
            <FiSearch className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search leads..."
              className="pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center justify-center">
            <FiUserPlus className="mr-2" />
            Add Lead
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-500 text-sm">{stat.title}</p>
                <p className="text-3xl font-bold mt-1">{stat.value}</p>
              </div>
              <div className={`${stat.color} p-3 rounded-lg text-white`}>
                <FiBarChart2 size={20} />
              </div>
            </div>
            <p className="text-green-500 text-sm mt-3">{stat.change} from last week</p>
          </div>
        ))}
      </div>

      {/* Recent Leads & Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Leads */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-800">Recent Leads</h2>
            <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
              View All
            </button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-gray-500 text-sm border-b">
                  <th className="pb-3">Name</th>
                  <th className="pb-3">Contact</th>
                  <th className="pb-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentLeads.map(lead => (
                  <tr key={lead.id} className="border-b hover:bg-gray-50">
                    <td className="py-4">
                      <div className="font-medium text-gray-800">{lead.name}</div>
                      <div className="text-gray-500 text-sm">{lead.source}</div>
                    </td>
                    <td className="py-4">
                      <div className="flex items-center text-gray-600 mb-1">
                        <FiMail className="mr-2" size={14} />
                        <span>{lead.email}</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <FiPhone className="mr-2" size={14} />
                        <span>{lead.phone}</span>
                      </div>
                    </td>
                    <td className="py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        lead.status === 'New' ? 'bg-blue-100 text-blue-800' :
                        lead.status === 'Contacted' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {lead.status}
                      </span>
                      <div className="text-gray-500 text-sm mt-1">{lead.lastContact}</div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Activity Feed */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-800">Recent Activity</h2>
            <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
              See All
            </button>
          </div>
          
          <div className="space-y-6">
            {activityFeed.map(activity => (
              <div key={activity.id} className="flex">
                <div className="mr-4">
                  <div className="bg-gray-200 border-2 border-dashed rounded-xl w-12 h-12" />
                </div>
                <div>
                  <p className="text-gray-800">
                    <span className="font-medium">{activity.user}</span> {activity.action}{' '}
                    <span className="font-medium">{activity.target}</span>
                  </p>
                  <div className="flex items-center text-gray-500 text-sm mt-1">
                    <FiCalendar className="mr-1" size={14} />
                    {activity.time}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8 bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Add Lead', icon: <FiUserPlus size={24} />, color: 'bg-blue-100 text-blue-600' },
            { label: 'Send Email', icon: <FiMail size={24} />, color: 'bg-green-100 text-green-600' },
            { label: 'Schedule Call', icon: <FiPhone size={24} />, color: 'bg-purple-100 text-purple-600' },
            { label: 'Generate Report', icon: <FiBarChart2 size={24} />, color: 'bg-yellow-100 text-yellow-600' }
          ].map((action, index) => (
            <button 
              key={index}
              className={`flex flex-col items-center justify-center p-6 rounded-lg hover:shadow-md transition-shadow ${action.color}`}
            >
              <div className="mb-3">{action.icon}</div>
              <span className="font-medium">{action.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;