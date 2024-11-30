import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import axios from 'axios';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate(); 

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.password) newErrors.password = 'Password is required';

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      try {
        setLoading(true);
        setApiError('');

        // Send API request to login endpoint using Axios
        const response = await axios.post(
          'http://localhost:5000/api/auth/login',
          {
            email: formData.email,
            password: formData.password,
          },
          {
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );

        // Axios automatically throws an error for non-200 status codes
        console.log('Login successful:', response.data);

        // Store token for authentication
        localStorage.setItem('token', response.data.token);

        // Navigate to /tasks page
        navigate('/dashboard');

        // Clear form after successful login
        setFormData({ email: '', password: '' });
      } catch (error) {
        // Axios error handling
        if (error.response) {
          setApiError(error.response.data.message || 'Invalid email or password');
        } else if (error.request) {
          setApiError('Failed to connect to the server. Please try again later.');
        } else {
          setApiError('An unexpected error occurred.');
        }
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="form-container">
      <h2>Log In</h2>
      {apiError && <p className="error">{apiError}</p>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="Enter your email"
          />
          {errors.email && <p className="error">{errors.email}</p>}
        </div>

        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            placeholder="Enter your password"
          />
          {errors.password && <p className="error">{errors.password}</p>}
        </div>

        <button type="submit" disabled={loading}>
          {loading ? 'Logging In...' : 'Log In'}
        </button>
      </form>
    </div>
  );
};

export default LoginPage;
