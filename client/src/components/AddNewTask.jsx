import React, { useState } from 'react';
import {useAuth } from "../context/AuthContext"
import { v4 as uuidv4 } from 'uuid';
const AddNewTask = ({ 
  onClose, 
  onTaskAdded, 
  authToken, 
  userId 
}) => {
  // State variables for form inputs
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState('1');
  const [status, setStatus] = useState('pending');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [error, setError] = useState(null);
  const {token} = useAuth()

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission

    // Validation checks
    if (!title.trim()) {
      setError('Title is required');
      return;
    }

    const start = new Date(startTime);
    const end = new Date(endTime);

    if (end <= start) {
      setError('End time must be after start time');
      return;
    }

    // Generate unique task ID
    const taskId = uuidv4();

    // Prepare task data
    const taskData = {
      taskId,
      title: title.trim(),
      priority: priority.toString(),
      status,
      startTime: start.toISOString(),
      endTime: end.toISOString(),
      totalTimeToFinish: calculateTotalTime(start, end),
      user: userId
    };

    try {
      // API call to create task
      const response = await fetch('http://localhost:5000/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        },
        body: JSON.stringify(taskData)
      });

      // Handle response
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to create task');
      }

      const result = await response.json();
      
      // Notify parent component and close modal
      onTaskAdded(result);
      onClose();

    } catch (err) {
      setError(err.message || 'An unexpected error occurred');
      console.error('Task creation error:', err);
    }
  };

  // Calculate total time in hours
  const calculateTotalTime = (start, end) => {
    const diffMs = end - start;
    return Math.round(diffMs / (1000 * 60 * 60)); // Convert to hours
  };

  // Render the form
  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-8">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Create New Task</h2>
        
        {/* Error message */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Title Input */}
          <div className="mb-4">
            <label 
              htmlFor="title" 
              className="block text-gray-700 font-semibold mb-2"
            >
              Task Title
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter task title"
              required
            />
          </div>

          {/* Priority Select */}
          <div className="mb-4">
            <label 
              htmlFor="priority" 
              className="block text-gray-700 font-semibold mb-2"
            >
              Priority
            </label>
            <select
              id="priority"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {[1, 2, 3, 4, 5].map((num) => (
                <option key={num} value={num.toString()}>
                  {num}
                </option>
              ))}
            </select>
          </div>

          {/* Status Radio Buttons */}
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">
              Status
            </label>
            <div className="flex space-x-4">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="status"
                  value="pending"
                  checked={status === 'pending'}
                  onChange={(e) => setStatus(e.target.value)}
                  className="form-radio h-5 w-5 text-indigo-600"
                />
                <span className="ml-2">Pending</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="status"
                  value="finished"
                  checked={status === 'finished'}
                  onChange={(e) => setStatus(e.target.value)}
                  className="form-radio h-5 w-5 text-indigo-600"
                />
                <span className="ml-2">Finished</span>
              </label>
            </div>
          </div>

          {/* Start Time Input */}
          <div className="mb-4">
            <label 
              htmlFor="start-time" 
              className="block text-gray-700 font-semibold mb-2"
            >
              Start Time
            </label>
            <input
              type="datetime-local"
              id="start-time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          {/* End Time Input */}
          <div className="mb-6">
            <label 
              htmlFor="end-time" 
              className="block text-gray-700 font-semibold mb-2"
            >
              End Time
            </label>
            <input
              type="datetime-local"
              id="end-time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
            >
              Create Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddNewTask;