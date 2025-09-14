import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Save, Upload, User, School, MapPin, Target, Camera, X } from 'lucide-react';
import { useStudent } from '../contexts/StudentContext';
import { useAuth } from '../contexts/AuthContext';
import GlassCard from '../components/GlassCard';

const ProfileEdit: React.FC = () => {
  const navigate = useNavigate();
  const { currentStudent, updateStudent, getOwnedItems } = useStudent();
  const { currentUser, updateProfile } = useAuth();

  // Use auth user data if available, fallback to student context
  const profileData = {
    name: currentUser?.name || currentStudent.name,
    school: currentUser?.school || currentStudent.school,
    state: currentUser?.state || currentStudent.state,
    grade: currentUser?.grade || currentStudent.grade,
    weeklyGoal: currentStudent.weeklyGoal,
    monthlyGoal: currentStudent.monthlyGoal
  };

  const [formData, setFormData] = useState({
    name: profileData.name,
    school: profileData.school,
    state: profileData.state,
    grade: profileData.grade,
    weeklyGoal: profileData.weeklyGoal,
    monthlyGoal: profileData.monthlyGoal
  });

  const indianStates = [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
    'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
    'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
    'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
    'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal'
  ];

  const grades = ['6th', '7th', '8th', '9th', '10th', '11th', '12th'];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'weeklyGoal' || name === 'monthlyGoal' ? parseInt(value) || 0 : value
    }));
  };

  const handleSave = () => {
    // Update both auth and student contexts
    if (currentUser) {
      updateProfile({
        name: formData.name,
        school: formData.school,
        state: formData.state,
        grade: formData.grade
      });
    }
    updateStudent({
      name: formData.name,
      school: formData.school,
      state: formData.state,
      grade: formData.grade,
      weeklyGoal: formData.weeklyGoal,
      monthlyGoal: formData.monthlyGoal
    });
    navigate('/profile');
  };

  const handleCancel = () => {
    navigate('/profile');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#091D23] to-[#774C3E]">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <button
            onClick={handleCancel}
            className="flex items-center space-x-2 text-white/70 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-[#E1664C] rounded-lg px-2 py-1"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Back to Profile</span>
          </button>
          
          <h1 className="text-3xl font-bold text-white">Edit Profile</h1>
          
          <div className="w-24"></div> {/* Spacer for centering */}
        </motion.div>

        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <GlassCard className="p-8">
              <form className="space-y-8">
                {/* Personal Information */}
                <div>
                  <h3 className="text-xl font-bold text-white mb-6 flex items-center space-x-2">
                    <User className="h-5 w-5" />
                    <span>Personal Information</span>
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-white/80 text-sm font-medium mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#E1664C] focus:border-transparent backdrop-blur-sm"
                        placeholder="Enter your full name"
                      />
                    </div>

                    <div>
                      <label className="block text-white/80 text-sm font-medium mb-2">
                        Grade *
                      </label>
                      <select
                        name="grade"
                        value={formData.grade}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-[#E1664C] focus:border-transparent backdrop-blur-sm"
                      >
                        {grades.map(grade => (
                          <option key={grade} value={grade} className="bg-[#091D23] text-white">
                            {grade}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* School Information */}
                <div>
                  <h3 className="text-xl font-bold text-white mb-6 flex items-center space-x-2">
                    <School className="h-5 w-5" />
                    <span>School Information</span>
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-white/80 text-sm font-medium mb-2">
                        School Name *
                      </label>
                      <input
                        type="text"
                        name="school"
                        value={formData.school}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#E1664C] focus:border-transparent backdrop-blur-sm"
                        placeholder="Enter your school name"
                      />
                    </div>

                    <div>
                      <label className="block text-white/80 text-sm font-medium mb-2">
                        State *
                      </label>
                      <select
                        name="state"
                        value={formData.state}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-[#E1664C] focus:border-transparent backdrop-blur-sm"
                      >
                        {indianStates.map(state => (
                          <option key={state} value={state} className="bg-[#091D23] text-white">
                            {state}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Goals */}
                <div>
                  <h3 className="text-xl font-bold text-white mb-6 flex items-center space-x-2">
                    <Target className="h-5 w-5" />
                    <span>Learning Goals</span>
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-white/80 text-sm font-medium mb-2">
                        Weekly Goal (Eco Points)
                      </label>
                      <input
                        type="number"
                        name="weeklyGoal"
                        value={formData.weeklyGoal}
                        onChange={handleChange}
                        min="50"
                        max="1000"
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#E1664C] focus:border-transparent backdrop-blur-sm"
                        placeholder="200"
                      />
                      <p className="text-white/50 text-xs mt-1">Recommended: 150-300 points</p>
                    </div>

                    <div>
                      <label className="block text-white/80 text-sm font-medium mb-2">
                        Monthly Goal (Eco Points)
                      </label>
                      <input
                        type="number"
                        name="monthlyGoal"
                        value={formData.monthlyGoal}
                        onChange={handleChange}
                        min="200"
                        max="5000"
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#E1664C] focus:border-transparent backdrop-blur-sm"
                        placeholder="800"
                      />
                      <p className="text-white/50 text-xs mt-1">Recommended: 600-1200 points</p>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 pt-6">
                  <button
                    type="button"
                    onClick={handleSave}
                    className="flex-1 flex items-center justify-center space-x-2 bg-gradient-to-r from-[#F8D991] to-[#F6B080] text-[#091D23] py-4 rounded-xl font-bold text-lg hover:shadow-2xl hover:shadow-[#F8D991]/25 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#E1664C] focus:ring-offset-2 focus:ring-offset-transparent"
                  >
                    <Save className="h-5 w-5" />
                    <span>Save Changes</span>
                  </button>
                  
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="flex-1 flex items-center justify-center space-x-2 bg-white/10 border border-white/20 text-white py-4 rounded-xl font-semibold text-lg hover:bg-white/20 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#E1664C] focus:ring-offset-2 focus:ring-offset-transparent"
                  >
                    <X className="h-5 w-5" />
                    <span>Cancel</span>
                  </button>
                </div>
              </form>
            </GlassCard>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ProfileEdit;