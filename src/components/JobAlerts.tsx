import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { updateUserPreferences } from '../services/userService';
import toast from 'react-hot-toast';

type JobAlertsProps = {
  className?: string;
};

export function JobAlerts({ className = '' }: JobAlertsProps) {
  const { user, userData } = useAuth();

  const toggleJobAlerts = async () => {
    if (!user || !userData) return;

    try {
      await updateUserPreferences(user.uid, {
        jobAlerts: !userData.preferences.jobAlerts
      });
      toast.success(
        userData.preferences.jobAlerts
          ? 'Job alerts disabled'
          : 'Job alerts enabled'
      );
    } catch (error) {
      toast.error('Failed to update job alerts');
    }
  };

  if (!user) return null;

  return (
    <div className={`bg-white rounded-xl shadow-sm p-6 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xl text-red-600">🔔</span>
          <h3 className="font-semibold text-gray-900">Job Alerts</h3>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={userData?.preferences.jobAlerts}
            onChange={toggleJobAlerts}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
        </label>
      </div>
      <p className="text-sm text-gray-600 mt-2">
        Get notified when new jobs match your preferences
      </p>
    </div>
  );
}