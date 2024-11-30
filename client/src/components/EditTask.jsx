import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const EditTask = ({ task, onClose, onTaskUpdated }) => {
  const [title, setTitle] = useState(task?.title || '');
  const [priority, setPriority] = useState(task?.priority || '');
  const [status, setStatus] = useState(task?.status || 'pending');
  const [startTime, setStartTime] = useState(task?.startTime ? 
    new Date(task.startTime).toISOString().slice(0, 16) : '');
  const [endTime, setEndTime] = useState(task?.endTime ? 
    new Date(task.endTime).toISOString().slice(0, 16) : '');
  const [isLoading, setIsLoading] = useState(false);
  const { token } = useAuth();

  const handleUpdate = async () => {
    // Validate inputs
    if (!title || !priority || !startTime || !endTime) {
      alert('Please fill in all fields');
      return;
    }

    // Calculate total time to finish (in hours)
    const startDateTime = new Date(startTime);
    const endDateTime = new Date(endTime);
    const totalTimeTo = Math.abs(endDateTime - startDateTime) / (1000 * 60 * 60);

    setIsLoading(true);

    const updatedTask = {
      id: task._id,
      title,
      priority,
      status,
      startTime,
      endTime,
      totalTimeTo: totalTimeTo.toFixed(2)
    };

    try {
      const response = await fetch(`http://localhost:5000/api/tasks/${task._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updatedTask),
      });

      if (!response.ok) {
        throw new Error(`Failed to update task: ${response.statusText}`);
      }

      const data = await response.json();

      // Notify the parent component to refresh tasks
      onTaskUpdated();
      onClose();
    } catch (error) {
      console.error('Error updating task:', error);
      alert('Failed to update the task. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
        <h2 className="text-lg font-bold mb-4">Edit Task</h2>
        <div className="mb-4">
          <label htmlFor="title" className="block font-medium mb-1">
            Title
          </label>
          <input
            type="text"
            id="title"
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label htmlFor="priority" className="block font-medium mb-1">
            Priority
          </label>
          <select
            id="priority"
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
          >
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
          </select>
        </div>
        <div className="mb-4 flex items-center">
          <label htmlFor="status" className="block font-medium mr-4">
            Status
          </label>
          <label className="inline-flex items-center">
            <input
              type="radio"
              name="status"
              value="pending"
              className="form-radio h-4 w-4 text-indigo-600 cursor-pointer"
              checked={status === 'pending'}
              onChange={() => setStatus('pending')}
            />
            <span className="ml-2">Pending</span>
          </label>
          <label className="inline-flex items-center ml-4">
            <input
              type="radio"
              name="status"
              value="finished"
              className="form-radio h-4 w-4 text-indigo-600 cursor-pointer"
              checked={status === 'finished'}
              onChange={() => setStatus('finished')}
            />
            <span className="ml-2">Finished</span>
          </label>
        </div>
        <div className="mb-4">
          <label htmlFor="start-time" className="block font-medium mb-1">
            Start Time
          </label>
          <input
            type="datetime-local"
            id="start-time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="end-time" className="block font-medium mb-1">
            End Time
          </label>
          <input
            type="datetime-local"
            id="end-time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div className="flex justify-end">
          <button
            className={`bg-indigo-500 text-white px-4 py-2 rounded-md hover:bg-indigo-600 mr-2 ${
              isLoading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            onClick={handleUpdate}
            disabled={isLoading}
          >
            {isLoading ? 'Updating...' : 'Update'}
          </button>
          <button
            className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300"
            onClick={onClose}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditTask;