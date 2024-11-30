import React, { useState } from 'react';
import axios from 'axios'; 
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const SignupPage = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);

  // Use navigation hook
  const navigate = useNavigate();

  // Use authentication context
  const { login } = useAuth();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};
    if (!formData.username) newErrors.username = "Username is required";
    if (!formData.email) newErrors.email = "Email is required";
    if (!formData.password) newErrors.password = "Password is required";
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = "Passwords do not match";

    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      try {
        setLoading(true);
        
        // Send registration request using Axios
        const response = await axios.post('http://localhost:5000/api/auth/register', {
          username: formData.username,
          email: formData.email,
          password: formData.password,
        }, {
          headers: {
            'Content-Type': 'application/json',
          }
        });
        const { token, user } = response.data;
        login(token, user);
        setSuccessMessage('Signup successful!');
        setFormData({ username: '', email: '', password: '', confirmPassword: '' });
        navigate('/dashboard');
      } catch (error) {
        if (error.response) {
          setErrors({ 
            apiError: error.response.data.message || 'Something went wrong, please try again.' 
          });
        } else if (error.request) {
          setErrors({ 
            apiError: 'Failed to connect to the server. Please try again later.' 
          });
        } else {
          setErrors({ 
            apiError: 'An unexpected error occurred.' 
          });
        }
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="form-container">
      <h2>Sign Up</h2>
      {successMessage && <p className="success">{successMessage}</p>}
      {errors.apiError && <p className="error">{errors.apiError}</p>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Username</label>
          <input 
            type="text" 
            name="username" 
            value={formData.username}
            onChange={handleInputChange}
            placeholder="Enter your username"
          />
          {errors.username && <p className="error">{errors.username}</p>}
        </div>

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

        <div className="form-group">
          <label>Confirm Password</label>
          <input 
            type="password" 
            name="confirmPassword" 
            value={formData.confirmPassword}
            onChange={handleInputChange}
            placeholder="Confirm your password"
          />
          {errors.confirmPassword && <p className="error">{errors.confirmPassword}</p>}
        </div>

        <button type="submit" disabled={loading}>
          {loading ? 'Signing Up...' : 'Sign Up'}
        </button>
      </form>
    </div>
  );
};

export default SignupPage;