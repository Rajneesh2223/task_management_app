import React from 'react';
import {Link } from 'react-router-dom'


const Dashboard = () => {
  return (
    <div className="bg-gray-200 min-h-screen flex justify-center items-center">
      <div className="bg-white shadow-lg rounded-lg w-full max-w-4xl p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <div className="flex space-x-4">
           <Link to='/tasks'>
            <button className="bg-indigo-500 text-white px-4 py-2 rounded-md hover:bg-indigo-600">
              Task List
            </button>
            </Link>
            <button className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600">
              Sign out
            </button>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-8">
          <div>
            <h2 className="text-lg font-bold mb-4">Summary</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-4xl font-bold">25</p>
                <p className="text-gray-500">Total tasks</p>
              </div>
              <div>
                <p className="text-4xl font-bold">40%</p>
                <p className="text-gray-500">Tasks completed</p>
              </div>
              <div>
                <p className="text-4xl font-bold">60%</p>
                <p className="text-gray-500">Tasks pending</p>
              </div>
              <div>
                <p className="text-4xl font-bold">3.5 hrs</p>
                <p className="text-gray-500">Average time per completed task</p>
              </div>
            </div>
          </div>
          <div>
            <h2 className="text-lg font-bold mb-4">Pending task summary</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-4xl font-bold">15</p>
                <p className="text-gray-500">Pending tasks</p>
              </div>
              <div>
                <p className="text-4xl font-bold">56 hrs</p>
                <p className="text-gray-500">Total time lapsed</p>
              </div>
              <div>
                <p className="text-4xl font-bold">24 hrs</p>
                <p className="text-gray-500">Total time to finish estimated based on endtime</p>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-8">
          <h2 className="text-lg font-bold mb-4">Pending tasks</h2>
          <div className="overflow-x-auto">
            <table className="w-full table-auto">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-4 py-2 text-left">Task priority</th>
                  <th className="px-4 py-2 text-left">Pending tasks</th>
                  <th className="px-4 py-2 text-left">Time lapsed (hrs)</th>
                  <th className="px-4 py-2 text-left">Time to finish (hrs)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="px-4 py-2">1</td>
                  <td className="px-4 py-2">3</td>
                  <td className="px-4 py-2">12</td>
                  <td className="px-4 py-2">8</td>
                </tr>
                <tr>
                  <td className="px-4 py-2">2</td>
                  <td className="px-4 py-2">5</td>
                  <td className="px-4 py-2">6</td>
                  <td className="px-4 py-2">3</td>
                </tr>
                <tr>
                  <td className="px-4 py-2">3</td>
                  <td className="px-4 py-2">1</td>
                  <td className="px-4 py-2">8</td>
                  <td className="px-4 py-2">7</td>
                </tr>
                <tr>
                  <td className="px-4 py-2">4</td>
                  <td className="px-4 py-2">0</td>
                  <td className="px-4 py-2">0</td>
                  <td className="px-4 py-2">0</td>
                </tr>
                <tr>
                  <td className="px-4 py-2">5</td>
                  <td className="px-4 py-2">6</td>
                  <td className="px-4 py-2">30</td>
                  <td className="px-4 py-2">6</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;