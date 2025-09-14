import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, MapPin, School, Calendar, Edit, Save, Award, Target, TrendingUp, Settings } from 'lucide-react';
import { useStudent } from '../contexts/StudentContext';
import { useAuth } from '../contexts/AuthContext';

const Profile: React.FC = () => {
  const { currentStudent, updateStudent } = useStudent();
  const { currentUser, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);

  // Use auth user data if available, fallback to student context
  const profileData = {
    name: currentUser?.name || currentStudent.name,
    school: currentUser?.school || currentStudent.school,
    state: currentUser?.state || currentStudent.state,
    grade: currentUser?.grade || currentStudent.grade,
    email: currentUser?.email || 'student@example.com',
    weeklyGoal: currentStudent.weeklyGoal,
    monthlyGoal: currentStudent.monthlyGoal
  };

  const [editForm, setEditForm] = useState(profileData);

  const handleSave = () => {
    // Update both auth and student contexts
    if (currentUser) {
      updateProfile({
        name: editForm.name,
        school: editForm.school,
        state: editForm.state,
        grade: editForm.grade
      });
    }
    updateStudent({
      name: editForm.name,
      school: editForm.school,
      state: editForm.state,
      grade: editForm.grade,
      weeklyGoal: editForm.weeklyGoal,
      monthlyGoal: editForm.monthlyGoal
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditForm(profileData);
    setIsEditing(false);
  };

  const joinDate = new Date(currentUser?.createdAt || currentStudent.joinDate);
  const daysSinceJoined = Math.floor((Date.now() - joinDate.getTime()) / (1000 * 60 * 60 * 24));

  const achievements = [
    {
      title: 'Eco Points Earned',
      value: currentStudent.ecoPoints.toLocaleString(),
      icon: Award,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      title: 'Current Level',
      value: currentStudent.level.toString(),
      icon: TrendingUp,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      title: 'Challenges Completed',
      value: currentStudent.completedChallenges.length.toString(),
      icon: Target,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
    {
      title: 'Lessons Completed',
      value: currentStudent.completedLessons.length.toString(),
      icon: School,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-4xl font-bold text-gray-800 mb-4">👤 Your Profile</h1>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
          Manage your account information and track your environmental journey.
        </p>
      </motion.div>

      {/* Profile Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-xl shadow-lg overflow-hidden"
      >
        {/* Cover Photo */}
        <div className="h-32 bg-gradient-to-r from-green-500 to-blue-500"></div>
        
        {/* Profile Content */}
        <div className="relative px-6 pb-6">
          {/* Edit Button */}
          <div className="flex justify-end pt-4">
            <Link
              to="/profile/edit"
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <Edit className="h-4 w-4" />
              <span>Edit Profile</span>
            </Link>
          </div>

          {/* Profile Info */}
          <div className="mt-4 space-y-6">
            <div>
              <h2 className="text-3xl font-bold text-gray-800">{profileData.name}</h2>
              <div className="flex items-center space-x-4 mt-2 text-gray-600">
                <div className="flex items-center space-x-1">
                  <School className="h-4 w-4" />
                  <span>Grade {profileData.grade}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <User className="h-4 w-4" />
                  <span>{profileData.school}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <MapPin className="h-4 w-4" />
                  <span>{profileData.state}</span>
                </div>
              </div>
              {currentUser?.email && (
                <div className="flex items-center space-x-1 mt-2 text-gray-600">
                  <span className="text-sm">📧 {currentUser.email}</span>
                </div>
              )}
            </div>

            {/* Level and Streak */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-green-50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-green-600">{currentStudent.level}</div>
                <div className="text-green-700">Current Level</div>
              </div>
              <div className="bg-orange-50 rounded-lg p-4 text-center">
                <div className="flex items-center justify-center space-x-1">
                  <span className="text-2xl">🔥</span>
                  <span className="text-2xl font-bold text-orange-600">{currentStudent.streak}</span>
                </div>
                <div className="text-orange-700">Day Streak</div>
              </div>
              <div className="bg-blue-50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-blue-600">{daysSinceJoined}</div>
                <div className="text-blue-700">Days Active</div>
              </div>
            </div>

            {/* Member Since */}
            <div className="flex items-center space-x-2 text-gray-600">
              <Calendar className="h-4 w-4" />
              <span>
                Member since {joinDate.toLocaleDateString('en-IN', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Achievements Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-6"
      >
        {achievements.map((achievement, index) => {
          const Icon = achievement.icon;
          return (
            <motion.div
              key={achievement.title}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              className="bg-white rounded-xl shadow-lg p-6 text-center"
            >
              <div className={`w-12 h-12 rounded-full ${achievement.bgColor} flex items-center justify-center mx-auto mb-3`}>
                <Icon className={`h-6 w-6 ${achievement.color}`} />
              </div>
              <div className={`text-2xl font-bold ${achievement.color} mb-1`}>{achievement.value}</div>
              <div className="text-gray-600 text-sm">{achievement.title}</div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Goals Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-xl shadow-lg p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-800 flex items-center space-x-2">
            <Target className="h-5 w-5" />
            <span>Current Goals</span>
          </h3>
          <Settings className="h-5 w-5 text-gray-400" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Weekly Goal */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-700 font-medium">Weekly Goal</span>
              <span className="text-gray-600">
                {currentStudent.ecoPoints % currentStudent.weeklyGoal} / {currentStudent.weeklyGoal} points
              </span>
            </div>
            <div className="bg-gray-200 rounded-full h-3">
              <motion.div
                className="bg-green-500 rounded-full h-3"
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(((currentStudent.ecoPoints % currentStudent.weeklyGoal) / currentStudent.weeklyGoal) * 100, 100)}%` }}
                transition={{ duration: 1, delay: 0.5 }}
              />
            </div>
          </div>

          {/* Monthly Goal */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-700 font-medium">Monthly Goal</span>
              <span className="text-gray-600">
                {currentStudent.ecoPoints % currentStudent.monthlyGoal} / {currentStudent.monthlyGoal} points
              </span>
            </div>
            <div className="bg-gray-200 rounded-full h-3">
              <motion.div
                className="bg-blue-500 rounded-full h-3"
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(((currentStudent.ecoPoints % currentStudent.monthlyGoal) / currentStudent.monthlyGoal) * 100, 100)}%` }}
                transition={{ duration: 1, delay: 0.6 }}
              />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white rounded-xl shadow-lg p-6"
      >
        <h3 className="text-xl font-bold text-gray-800 mb-6">Recent Activity</h3>
        <div className="space-y-4">
          {currentStudent.earnedBadges.slice(-3).reverse().map((badge, index) => (
            <div key={badge.badgeId} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <div className="flex-1">
                <p className="font-semibold text-gray-800">Earned badge: {badge.badgeId}</p>
                <p className="text-gray-600 text-sm">
                  {new Date(badge.dateEarned).toLocaleDateString('en-IN')}
                </p>
              </div>
            </div>
          ))}
          <div className="text-center">
            <button className="text-blue-600 hover:text-blue-700 font-medium">View All Activity</button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Profile;