import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { PencilIcon, PlusIcon, TrashIcon } from 'lucide-react';
import AddNewTask from './AddNewTask';
import EditTask from './EditTask';
import { useAuth } from '../context/AuthContext';

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [selectedTasks, setSelectedTasks] = useState([]);
  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);
  const [isEditTaskModalOpen, setIsEditTaskModalOpen] = useState(false);
  const [currentTask, setCurrentTask] = useState(null);
  const [sortColumn, setSortColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState(null);
  const [priorityFilter, setPriorityFilter] = useState(null);
  const [statusFilter, setStatusFilter] = useState(null);
  const { token, logout } = useAuth();
  const selectAllCheckboxRef = useRef(null);

  useEffect(() => {
    fetchTasks();
  }, []);

  useEffect(() => {
    if (selectAllCheckboxRef.current) {
      selectAllCheckboxRef.current.indeterminate = isSomeSelected;
    }
  }, [selectedTasks, filteredTasks]);

  const fetchTasks = async () => {
    try {
      const response = await axios.get('https://task-management-app-iike.onrender.com/api/tasks', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setTasks(response.data);
      setFilteredTasks(response.data);
      setSelectedTasks([]);
    } catch (err) {
      console.error('Failed to fetch tasks:', err);
      if (err.response && err.response.status === 401) {
        logout();
      }
    }
  };

  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
    sortTasks();
  };

  const handlePriorityFilter = (priority) => {
    setPriorityFilter(priority);
    filterTasks();
  };

  const handleStatusFilter = (status) => {
    setStatusFilter(status);
    filterTasks();
  };

  const filterTasks = () => {
    const filtered = tasks.filter((task) => {
      if (priorityFilter !== null && task.priority !== priorityFilter) {
        return false;
      }
      if (statusFilter !== null && task.status !== statusFilter) {
        return false;
      }
      return true;
    });
    setFilteredTasks(filtered);
  };

  const sortTasks = () => {
    setFilteredTasks((prevTasks) =>
      sortColumn
        ? [...prevTasks].sort((a, b) => {
            if (a[sortColumn] < b[sortColumn]) return sortDirection === 'asc' ? -1 : 1;
            if (a[sortColumn] > b[sortColumn]) return sortDirection === 'asc' ? 1 : -1;
            return 0;
          })
        : prevTasks
    );
  };

  const handleTaskSelection = (taskId) => {
    setSelectedTasks((prev) =>
      prev.includes(taskId) 
        ? prev.filter((id) => id !== taskId)  
        : [...prev, taskId]  
    );
  };

  const handleDeleteSelectedTasks = async () => {
    if (selectedTasks.length === 0) {
      return;
    }

    try {
      await axios.delete('https://task-management-app-iike.onrender.com/api/tasks', {
        data: { ids: selectedTasks },
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      fetchTasks();
    } catch (err) {
      console.error('Failed to delete tasks:', err);
    }
  };

  const handleEditTask = (task) => {
    setCurrentTask(task);
    setIsEditTaskModalOpen(true);
  };

  const handleAddTask = () => {
    setIsAddTaskModalOpen(true);
  };

 
  const isAllSelected = filteredTasks.length > 0 && selectedTasks.length === filteredTasks.length;

  const isSomeSelected = selectedTasks.length > 0 && selectedTasks.length < filteredTasks.length;

  const handleSelectAll = () => {
    if (isAllSelected) {
      setSelectedTasks([]); 
    } else {
      setSelectedTasks(filteredTasks.map((task) => task.id));
    }
  };

  const handleRemoveFilter = () => {
    setPriorityFilter(null);
    setStatusFilter(null);
    setFilteredTasks(tasks);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Task list</h1>
        <div className="flex items-center">
          <button
            onClick={handleAddTask}
            className="bg-indigo-500 text-white px-4 py-2 rounded-md hover:bg-indigo-600 mr-2"
          >
            <PlusIcon className="h-4 w-4 mr-2" />
            Add task
          </button>
          <button
            onClick={handleDeleteSelectedTasks}
            disabled={selectedTasks.length === 0}
            className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 disabled:opacity-50"
          >
            <TrashIcon className="h-4 w-4 mr-2" />
            Delete selected
          </button>
          <div className="flex items-center ml-2">
            <button
              className="bg-gray-400 text-white px-4 py-2 rounded-md hover:bg-gray-500 mr-2"
              onClick={() => handleSort('priority')}
            >
              Sort
            </button>
            <select
              value={priorityFilter || 'all'}
              onChange={(e) => handlePriorityFilter(e.target.value === 'all' ? null : parseInt(e.target.value))}
              className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300"
            >
              <option value="all">All priorities</option>
              <option value="1">Priority 1</option>
              <option value="2">Priority 2</option>
              <option value="3">Priority 3</option>
              <option value="4">Priority 4</option>
              <option value="5">Priority 5</option>
            </select>
            <select
              value={statusFilter || 'all'}
              onChange={(e) => handleStatusFilter(e.target.value === 'all' ? null : e.target.value)}
              className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 ml-2"
            >
              <option value="all">All statuses</option>
              <option value="Pending">Pending</option>
              <option value="Finished">Finished</option>
            </select>
            {(priorityFilter !== null || statusFilter !== null) && (
              <button
                onClick={handleRemoveFilter}
                className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 ml-2"
              >
                Remove filter
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-200">
              <th className="px-4 py-2 text-left">
                <input
                  ref={selectAllCheckboxRef}
                  type="checkbox"
                  checked={isAllSelected}
                  onChange={handleSelectAll}
                  className="form-checkbox h-4 w-4 text-indigo-600"
                />
              </th>
              <th className="px-4 py-2 text-left">
                <button
                  className="bg-gray-400 text-white px-4 py-2 rounded-md hover:bg-gray-500"
                  onClick={() => handleSort('taskId')}
                >
                  Task ID
                </button>
              </th>
              <th className="px-4 py-2 text-left">
                <button
                  className="bg-gray-400 text-white px-4 py-2 rounded-md hover:bg-gray-500"
                  onClick={() => handleSort('title')}
                >
                  Title
                </button>
              </th>
              <th className="px-4 py-2 text-left">
                <button
                  className="bg-gray-400 text-white px-4 py-2 rounded-md hover:bg-gray-500"
                  onClick={() => handleSort('priority')}
                >
                  Priority
                </button>
              </th>
              <th className="px-4 py-2 text-left">
                <button
                  className="bg-gray-400 text-white px-4 py-2 rounded-md hover:bg-gray-500"
                  onClick={() => handleSort('status')}
                >
                  Status
                </button>
              </th>
              <th className="px-4 py-2 text-left">Start Time</th>
              <th className="px-4 py-2 text-left">End Time</th>
              <th className="px-4 py-2 text-left">Total time to finish (hrs)</th>
              <th className="px-4 py-2 text-left">Edit</th>
            </tr>
          </thead>
          <tbody>
            {filteredTasks.map((task) => (
              <tr key={task.id} className="hover:bg-gray-100">
                <td className="px-4 py-2">
                  <input
                    type="checkbox"
                    checked={selectedTasks.includes(task.id)}
                    onChange={() => handleTaskSelection(task.id)}
                    className="form-checkbox h-4 w-4 text-indigo-600"
                  />
                </td>
                <td className="px-4 py-2">{task.id}</td>
                <td className="px-4 py-2">{task.title}</td>
                <td className="px-4 py-2">{task.priority}</td>
                <td className="px-4 py-2">{task.status}</td>
                <td className="px-4 py-2">
                  {new Date(task.startTime).toLocaleString()}
                </td>
                <td className="px-4 py-2">
                  {new Date(task.endTime).toLocaleString()}
                </td>
                <td className="px-4 py-2">{task.totalTimeTo}</td>
                <td className="px-4 py-2">
                  <button
                    onClick={() => handleEditTask(task)}
                    className="bg-indigo-500 text-white px-2 py-1 rounded-md hover:bg-indigo-600"
                  >
                    <PencilIcon className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isAddTaskModalOpen && (
        <AddNewTask
          onClose={() => setIsAddTaskModalOpen(false)}
          onTaskAdded={fetchTasks}
        />
      )}

      {isEditTaskModalOpen && currentTask && (
        <EditTask
          task={currentTask}
          onClose={() => setIsEditTaskModalOpen(false)}
          onTaskUpdated={fetchTasks}
        />
      )}
    </div>
  );
};

export default TaskList;