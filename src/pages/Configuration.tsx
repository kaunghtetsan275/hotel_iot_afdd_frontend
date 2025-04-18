import React, { useState, useEffect } from 'react';
// import axiosInstance, { SET_THRESH } from './AxiosInstance';
import { supabase} from '../config/supabaseClient';
import ThresholdForm from '../components/forms/ThresholdForm';


// Initialize Supabase client
const Configuration:React.FC = () => {
  const [thresholds, setThresholds] = useState({
    id: null,
    updated_at: null,
    temperature_min: null,
    temperature_max: null,
    humidity_min: null,
    humidity_max: null,
    co2_min: null,
    co2_max: null,
    power_kw_min: null,
    power_kw_max: null,
    occupancy_required: false,
    sensor_online_required: true,
    sensitivity_min: null,
    sensitivity_max: null
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const [error, setError] = useState('');

  // Fetch initial thresholds from Supabase
  useEffect(() => {
    const fetchThresholds = async () => {
      try {
        const { data, error: supabaseError } = await supabase
          .from('fault_thresholds')
          .select('*')
          .limit(1)
          .single();
        
        if (supabaseError) throw supabaseError;
        
        if (data) {
          setThresholds(data);
        }
        setIsLoading(false);
      } catch (err) {
        setError('Failed to load threshold settings from Supabase');
        console.error('Supabase fetch error:', err);
        setIsLoading(false);
      }
    };

    fetchThresholds();
  }, []);

  const handleInputChange = (e: { target: { name: any; value: any; type: any; checked: any; }; }) => {
    const { name, value, type, checked } = e.target;
    setThresholds(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value === '' ? null : parseFloat(value)
    }));
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Optionally: refetch from Supabase to discard changes
  };

  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveMessage('');
    setError('');

    try {      
      const { id, updated_at, ...updateData } = thresholds;

      // Will use django backend in another branch
      // Update threshold via  Django API
      // const djangoResponse = await axiosInstance.put(SET_THRESH, updateData);
      // if (djangoResponse.status !== 200) {
      //   console.log('Failed to update thresholds via Django API');
      // }

      // Update threshold via Supabase
      const { error: supabaseError } = await supabase
        .from('fault_thresholds')
        .update(updateData)
        .eq('id', 1); // Assuming you have an id column
      
      if (supabaseError) throw supabaseError;
      
      setSaveMessage('Threshold settings saved successfully!');
      setIsEditing(false);
      setTimeout(() => setSaveMessage(''), 3000);
    } catch (err) {
      setError(`Failed to save: ${err instanceof Error ? err.message : 'Unknown error'}`);
      console.error('Save error:', err);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex-1 justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col items-center justify-center mx-auto w-screen gap-2">
      <div className='flex-box box-border' style={{
        fontWeight: 'bold', 
        padding: '1rem', 
        backgroundColor: '#6366f1', 
        borderRadius: '10px',
        marginTop: '0.5rem',
        }}>
        <strong>Fault Detection Thresholds</strong>
      </div>
      
      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6">
          <p>{error}</p>
        </div>
      )}
      
      {saveMessage && (
        <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-6">
          <p>{saveMessage}</p>
        </div>
      )}

      <div className="flex-1 flex flex-col w-full bg-[#4c37e73b] shadow-md box-border rounded-3xl">
      <ThresholdForm
        thresholds={thresholds}
        isEditing={isEditing}
        isSaving={isSaving}
        handleInputChange={handleInputChange}
        handleEditClick={handleEditClick}
        handleCancel={handleCancel}
        handleSubmit={handleSubmit}
      />
      </div>
    </div>
  );
};

export default Configuration;