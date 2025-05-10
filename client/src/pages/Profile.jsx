import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { FaUserCircle, FaCamera, FaExclamationCircle } from "react-icons/fa";
import "./Profile.css";
import { getUserProfile, updateUserProfile, API_URL } from "../api";

const ProfilePage = () => {
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    profilePic: "",
  });

  const [imagePreview, setImagePreview] = useState(null);
  const [file, setFile] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [errors, setErrors] = useState({
    email: "",
    phone: ""
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await getUserProfile();
        setUserData(res.data);
        if (res.data.profilePic) {
          setImagePreview(`${API_URL}/uploads/profilePics/${res.data.profilePic}`);
        }
      } catch (err) {
        toast.error("Failed to load profile");
      }
    };
    fetchProfile();
  }, []);

  const handleImageChange = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      setFile(selected);
      setImagePreview(URL.createObjectURL(selected));
    }
  };

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const validatePhone = (phone) => {
    const regex = /^\+?[0-9]{10}$/;
    return regex.test(phone);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
    
    // Validate on change
    if (name === 'email') {
      if (value && !validateEmail(value)) {
        setErrors(prev => ({ ...prev, email: "Please enter a valid email address" }));
      } else {
        setErrors(prev => ({ ...prev, email: "" }));
      }
    }
    
    if (name === 'phone') {
      if (value && !validatePhone(value)) {
        setErrors(prev => ({ ...prev, phone: "Please enter a valid phone number" }));
      } else {
        setErrors(prev => ({ ...prev, phone: "" }));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate before submission
    const emailValid = !userData.email || validateEmail(userData.email);
    const phoneValid = !userData.phone || validatePhone(userData.phone);
    
    if (!emailValid) {
      setErrors(prev => ({ ...prev, email: "Please enter a valid email address" }));
    }
    
    if (!phoneValid) {
      setErrors(prev => ({ ...prev, phone: "Please enter a valid phone number" }));
    }
    
    // Stop submission if validation fails
    if (!emailValid || !phoneValid) {
      toast.error("Please fix the errors before submitting");
      return;
    }
    
    setIsUpdating(true);

    try {
      const formData = new FormData();
      formData.append("name", userData.name);
      formData.append("email", userData.email);
      formData.append("phone", userData.phone);
      formData.append("address", userData.address);
      if (file) formData.append("profilePic", file);

      await updateUserProfile(formData);
      toast.success("Profile updated successfully!");

      const res = await getUserProfile();
      setUserData(res.data);
      if (res.data.profilePic) {
        setImagePreview(`${API_URL}/uploads/profilePics/${res.data.profilePic}`);
      }
      setFile(null);
    } catch (err) {
      toast.error("Failed to update profile");
    } finally {
      setIsUpdating(false);
    }
  };

  const fileInputRef = React.createRef();

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="profile-container">
      <div className="profile-card">
        <div className="profile-header">
          <h2>My Profile</h2>
          <p>Manage your personal information</p>
        </div>

        <div className="profile-content">
          <div className="profile-img-container">
            {imagePreview ? (
              <img src={imagePreview} alt="Profile" className="profile-img" />
            ) : (
              <FaUserCircle className="default-icon" />
            )}
            <div className="camera-icon" onClick={triggerFileInput}>
              <FaCamera />
            </div>
            <input 
              type="file" 
              ref={fileInputRef}
              accept="image/*" 
              onChange={handleImageChange}
              className="hidden-input" 
            />
          </div>

          <form onSubmit={handleSubmit} className="profile-form">
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input
                id="name"
                type="text"
                name="name"
                placeholder="Enter your name"
                value={userData.name}
                onChange={handleChange}
              />
            </div>

            <div className={`form-group ${errors.email ? 'has-error' : ''}`}>
              <label htmlFor="email">Email Address</label>
              <div className="input-container">
                <input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  value={userData.email}
                  onChange={handleChange}
                  className={errors.email ? 'input-error' : ''}
                />
                {errors.email && (
                  <div className="error-icon">
                    <FaExclamationCircle />
                  </div>
                )}
              </div>
              {errors.email && <p className="error-message">{errors.email}</p>}
            </div>

            <div className={`form-group ${errors.phone ? 'has-error' : ''}`}>
              <label htmlFor="phone">Phone Number</label>
              <div className="input-container">
                <input
                  id="phone"
                  type="tel"
                  name="phone"
                  placeholder="Enter your phone number"
                  value={userData.phone}
                  onChange={handleChange}
                  className={errors.phone ? 'input-error' : ''}
                />
                {errors.phone && (
                  <div className="error-icon">
                    <FaExclamationCircle />
                  </div>
                )}
              </div>
              {errors.phone && <p className="error-message">{errors.phone}</p>}
            </div>

            <div className="form-group">
              <label htmlFor="address">Shipping Address</label>
              <textarea
                id="address"
                name="address"
                placeholder="Enter your address"
                rows="3"
                value={userData.address}
                onChange={handleChange}
              />
            </div>

            <button type="submit" className="update-btn" disabled={isUpdating}>
              {isUpdating ? "Updating..." : "Update Profile"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;