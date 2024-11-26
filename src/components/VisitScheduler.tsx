import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { Calendar, Clock, Users, MapPin, MessageSquare } from 'lucide-react';
import toast from 'react-hot-toast';

type TimeSlot = {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  available: boolean;
};

type VisitType = 'in-person' | 'virtual';

type VisitSchedulerProps = {
  propertyId: string;
  propertyTitle: string;
  propertyAddress: string;
  className?: string;
  onSchedule?: (visitDetails: any) => void;
};

export function VisitScheduler({
  propertyId,
  propertyTitle,
  propertyAddress,
  className = '',
  onSchedule
}: VisitSchedulerProps) {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [visitType, setVisitType] = useState<VisitType>('in-person');
  const [participants, setParticipants] = useState(1);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  // Generate available time slots for the selected date
  const getAvailableTimeSlots = (date: string): TimeSlot[] => {
    // In production, fetch from backend based on real availability
    const slots: TimeSlot[] = [];
    const startHour = 9;
    const endHour = 17;
    
    for (let hour = startHour; hour < endHour; hour++) {
      slots.push({
        id: `${date}-${hour}`,
        date,
        startTime: `${hour}:00`,
        endTime: `${hour + 1}:00`,
        available: Math.random() > 0.3 // Simulate some slots being unavailable
      });
    }
    
    return slots;
  };

  // Get next 7 available dates
  const getAvailableDates = () => {
    const dates: string[] = [];
    const today = new Date();
    
    for (let i = 1; i <= 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      if (date.getDay() !== 0) { // Exclude Sundays
        dates.push(date.toISOString().split('T')[0]);
      }
    }
    
    return dates;
  };

  const handleScheduleVisit = async () => {
    if (!user) {
      toast.error('Please sign in to schedule a visit');
      return;
    }

    if (!selectedDate || !selectedTime) {
      toast.error('Please select a date and time');
      return;
    }

    try {
      setLoading(true);

      const visitDetails = {
        propertyId,
        userId: user.uid,
        date: selectedDate,
        time: selectedTime,
        type: visitType,
        participants,
        notes,
        status: 'pending'
      };

      // TODO: Submit to backend
      await new Promise(resolve => setTimeout(resolve, 1000));

      toast.success('Visit scheduled successfully!');
      onSchedule?.(visitDetails);

      // Reset form
      setSelectedDate('');
      setSelectedTime('');
      setVisitType('in-person');
      setParticipants(1);
      setNotes('');
    } catch (error) {
      toast.error('Failed to schedule visit');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`bg-white rounded-xl shadow-lg p-6 ${className}`}>
      <div className="flex items-center gap-2 mb-6">
        <Calendar className="h-5 w-5 text-red-600" />
        <h2 className="text-xl font-bold text-gray-900">Schedule a Visit</h2>
      </div>

      <div className="mb-6">
        <h3 className="font-medium text-gray-900">{propertyTitle}</h3>
        <p className="text-sm text-gray-600">{propertyAddress}</p>
      </div>

      {/* Visit Type Selection */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Visit Type
        </label>
        <div className="grid grid-cols-2 gap-4">
          <button
            type="button"
            onClick={() => setVisitType('in-person')}
            className={`flex items-center justify-center gap-2 p-3 rounded-lg border ${
              visitType === 'in-person'
                ? 'border-red-600 bg-red-50 text-red-600'
                : 'border-gray-300 hover:border-gray-400'
            }`}
          >
            <Users className="h-5 w-5" />
            In-Person Visit
          </button>
          <button
            type="button"
            onClick={() => setVisitType('virtual')}
            className={`flex items-center justify-center gap-2 p-3 rounded-lg border ${
              visitType === 'virtual'
                ? 'border-red-600 bg-red-50 text-red-600'
                : 'border-gray-300 hover:border-gray-400'
            }`}
          >
            <MessageSquare className="h-5 w-5" />
            Virtual Tour
          </button>
        </div>
      </div>

      {/* Date Selection */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select Date
        </label>
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
          {getAvailableDates().map((date) => (
            <button
              key={date}
              onClick={() => setSelectedDate(date)}
              className={`p-2 text-sm rounded-lg border ${
                selectedDate === date
                  ? 'border-red-600 bg-red-50 text-red-600'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              {new Date(date).toLocaleDateString('en-US', {
                weekday: 'short',
                month: 'short',
                day: 'numeric'
              })}
            </button>
          ))}
        </div>
      </div>

      {/* Time Selection */}
      {selectedDate && (
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Time
          </label>
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
            {getAvailableTimeSlots(selectedDate).map((slot) => (
              <button
                key={slot.id}
                onClick={() => setSelectedTime(slot.startTime)}
                disabled={!slot.available}
                className={`p-2 text-sm rounded-lg border ${
                  selectedTime === slot.startTime
                    ? 'border-red-600 bg-red-50 text-red-600'
                    : slot.available
                    ? 'border-gray-300 hover:border-gray-400'
                    : 'border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed'
                }`}
              >
                {slot.startTime}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Number of Participants */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Number of Participants
        </label>
        <select
          value={participants}
          onChange={(e) => setParticipants(parseInt(e.target.value))}
          className="w-full rounded-lg border-gray-300 focus:border-red-500 focus:ring-red-500"
        >
          {[1, 2, 3, 4, 5].map((num) => (
            <option key={num} value={num}>
              {num} {num === 1 ? 'person' : 'people'}
            </option>
          ))}
        </select>
      </div>

      {/* Additional Notes */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Additional Notes
        </label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Any special requests or questions?"
          className="w-full rounded-lg border-gray-300 focus:border-red-500 focus:ring-red-500"
          rows={3}
        />
      </div>

      {/* Schedule Button */}
      <button
        onClick={handleScheduleVisit}
        disabled={loading || !selectedDate || !selectedTime}
        className="w-full bg-red-600 text-white py-3 px-6 rounded-lg hover:bg-red-700 transition-colors font-medium disabled:bg-gray-300 disabled:cursor-not-allowed"
      >
        {loading ? 'Scheduling...' : 'Schedule Visit'}
      </button>

      {/* Visit Policy */}
      <div className="mt-4 text-sm text-gray-500">
        <p>
          {visitType === 'in-person' ? (
            <>
              • Please arrive 5 minutes before your scheduled time
              <br />
              • Bring a valid ID for verification
              <br />
              • Masks may be required for in-person visits
            </>
          ) : (
            <>
              • Virtual tour link will be sent 15 minutes before the scheduled time
              <br />
              • Make sure you have a stable internet connection
              <br />
              • Test your camera and microphone before the tour
            </>
          )}
        </p>
      </div>
    </div>
  );
}