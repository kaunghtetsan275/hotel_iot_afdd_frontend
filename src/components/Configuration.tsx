import React, { useState, useEffect } from 'react';
import axiosInstance, { SET_THRESH } from './AxiosInstance';
import { supabase} from './supabaseClient';


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

      // Update threshold via  Django API
      const djangoResponse = await axiosInstance.put(SET_THRESH, updateData);
      if (djangoResponse.status !== 200) {
        console.log('Failed to update thresholds via Django API');
      }
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
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', margin: '1rem', padding: '0.5rem', gap: '1rem' }}> 
        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 justify-center items-center gap-2">
          {/* Temperature Section */}
          <div className="border border-gray-200 rounded-lg p-4 bg-indigo-400 text-center">
          <h3 className="text-lg font-semibol mb-4">Temperature (°C)</h3>
          <div className="mb-4">
            <label className="block text-sm font-bold mb-2">
            Minimum
            </label>
            {isEditing ? (
            <input
              type="number"
              step="0.1"
              className="text-center shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
              name="temperature_min"
              value={thresholds.temperature_min || ''}
              onChange={handleInputChange}
            />
            ) : (
            <p>{thresholds.temperature_min || 'Not set'}</p>
            )}
          </div>
          <div className="mb-4">
            <label className="block text-sm font-bold mb-2">
            Maximum
            </label>
            {isEditing ? (
            <input
              type="number"
              step="0.1"
              className="text-center shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
              name="temperature_max"
              value={thresholds.temperature_max || ''}
              onChange={handleInputChange}
            />
            ) : (
            <p>{thresholds.temperature_max || 'Not set'}</p>
            )}
          </div>
          </div>

          {/* CO2 Section */}
          <div className="border border-gray-200 rounded-lg p-4 bg-indigo-400 text-center">
          <h3 className="text-lg font-semibol mb-4">CO2 (ppm)</h3>
          <div className="mb-4">
            <label className="block text-sm font-bold mb-2">
            Minimum
            </label>
            {isEditing ? (
            <input
              type="number"
              step="1"
              className="text-center shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
              name="co2_min"
              value={thresholds.co2_min || ''}
              onChange={handleInputChange}
            />
            ) : (
            <p>{thresholds.co2_min || 'Not set'}</p>
            )}
          </div>
          <div className="mb-4">
            <label className="block text-sm font-bold mb-2">
            Maximum
            </label>
            {isEditing ? (
            <input
              type="number"
              step="1"
              className="text-center shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
              name="co2_max"
              value={thresholds.co2_max || ''}
              onChange={handleInputChange}
            />
            ) : (
            <p>{thresholds.co2_max || 'Not set'}</p>
            )}
          </div>
          </div>

          {/* Power Section */}
          <div className="border border-gray-200 rounded-lg p-4 bg-indigo-400 text-center">
          <h3 className="text-lg font-semibol mb-4">Power (kW)</h3>
          <div className="mb-4">
            <label className="block text-sm font-bold mb-2">
            Minimum
            </label>
            {isEditing ? (
            <input
              type="number"
              step="0.01"
              className="text-center shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
              name="power_kw_min"
              value={thresholds.power_kw_min || ''}
              onChange={handleInputChange}
            />
            ) : (
            <p>{thresholds.power_kw_min || 'Not set'}</p>
            )}
          </div>
          <div className="mb-4">
            <label className="block text-sm font-bold mb-2">
            Maximum
            </label>
            {isEditing ? (
            <input
              type="number"
              step="0.01"
              className="text-center shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
              name="power_kw_max"
              value={thresholds.power_kw_max || ''}
              onChange={handleInputChange}
            />
            ) : (
            <p>{thresholds.power_kw_max || 'Not set'}</p>
            )}
          </div>
          </div>

          {/* Sensitivity Section */}
          <div className="border border-gray-200 rounded-lg p-4 bg-indigo-400 text-center">
          <h3 className="text-lg font-semibol mb-4">Sensitivity</h3>
          <div className="mb-4">
            <label className="block text-sm font-bold mb-2">
            Minimum
            </label>
            {isEditing ? (
            <input
              type="number"
              step="0.1"
              className="text-center shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
              name="sensitivity_min"
              value={thresholds.sensitivity_min || ''}
              onChange={handleInputChange}
            />
            ) : (
            <p>{thresholds.sensitivity_min || 'Not set'}</p>
            )}
          </div>
          <div className="mb-4">
            <label className="block text-sm font-bold mb-2">
            Maximum
            </label>
            {isEditing ? (
            <input
              type="number"
              step="0.1"
              className="text-center shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
              name="sensitivity_max"
              value={thresholds.sensitivity_max || ''}
              onChange={handleInputChange}
            />
            ) : (
            <p>{thresholds.sensitivity_max || 'Not set'}</p>
            )}
          </div>
          </div>

          {/* Other Section */}
          <div className="border border-gray-200 rounded-lg p-4 bg-indigo-400 text-center">
            <h3 className="text-lg font-semibol mb-4">Other Settings</h3>
            <div className="flex items-center justify-center gap-5 mb-4">
              <input
          type="checkbox"
          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          name="occupancy_required"
          id="occupancyRequired"
          checked={thresholds.occupancy_required}
          onChange={handleInputChange}
              />
              <label htmlFor="occupancyRequired" className="block text-sm font-bold">
          Occupancy Required
              </label>
            </div>
            <div className="flex items-center justify-center gap-5">
              <input
          type="checkbox"
          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          name="sensor_online_required"
          id="sensorOnlineRequired"
          checked={thresholds.sensor_online_required}
          onChange={handleInputChange}
              />
              <label htmlFor="sensorOnlineRequired" className="block text-sm font-bold">
          Sensor Online Required
              </label>
            </div>
          </div>
        </div>
        
        {!isEditing && (
          <button
            onClick={handleEditClick}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold rounded"
          >
            Edit Thresholds
          </button>
        )}

        {/* Action Buttons */}
        {isEditing && (
          <div className="flex justify-center gap-4">
            <button
              type="submit"
              className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${isSaving ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={isSaving}
            >
              {isSaving ? (
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
              ) : (
          'Save Settings'
              )}
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Cancel
            </button>
          </div>
        )}
      </form>
      </div>
    </div>
  );
};

export default Configuration;