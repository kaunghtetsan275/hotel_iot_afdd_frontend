import React from 'react';

interface Thresholds {
  id: number | null;
  updated_at: string | null;
  temperature_min: number | null;
  temperature_max: number | null;
  humidity_min: number | null;
  humidity_max: number | null;
  co2_min: number | null;
  co2_max: number | null;
  power_kw_min: number | null;
  power_kw_max: number | null;
  occupancy_required: boolean;
  sensor_online_required: boolean;
  sensitivity_min: number | null;
  sensitivity_max: number | null;
}

interface ThresholdFormProps {
  thresholds: Thresholds;
  isEditing: boolean;
  isSaving: boolean;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleEditClick: () => void;
  handleCancel: () => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

const ThresholdForm: React.FC<ThresholdFormProps> = ({
  thresholds,
  isEditing,
  isSaving,
  handleInputChange,
  handleEditClick,
  handleCancel,
  handleSubmit,
}) => (
  <div className="flex-1 flex flex-col bg-[#4c37e73b] shadow-md box-border rounded-3xl">
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', margin: '1rem', padding: '0.5rem', gap: '1rem' }}>
      <div className="flex-1 grid grid-cols-1 md:grid-cols-5 justify-center items-center gap-2">
        {/* Temperature Section */}
        <div className="border border-gray-200 rounded-lg p-4 bg-indigo-400 text-center">
          <h3 className="text-lg font-semibol">Temperature (°C)</h3>
          <div className="">
            <label className="block text-sm font-bold">Minimum</label>
            {isEditing ? (
              <input
                type="number"
                step="0.1"
                className="text-center shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
                name="temperature_min"
                value={thresholds.temperature_min || ''}
                onChange={handleInputChange}
                placeholder="Enter minimum temperature"
              />
            ) : (
              <p>{thresholds.temperature_min || 'Not set'}</p>
            )}
          </div>
          <div className="">
            <label className="block text-sm font-bold ">Maximum</label>
            {isEditing ? (
              <input
                type="number"
                step="0.1"
                className="text-center shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
                name="temperature_max"
                value={thresholds.temperature_max || ''}
                onChange={handleInputChange}
                placeholder="Enter maximum temperature"
              />
            ) : (
              <p>{thresholds.temperature_max || 'Not set'}</p>
            )}
          </div>
        </div>

        {/* CO2 Section */}
        <div className="border border-gray-200 rounded-lg p-4 bg-indigo-400 text-center">
          <h3 className="text-lg font-semibol ">CO2 (ppm)</h3>
          <div className="">
            <label className="block text-sm font-bold ">Minimum</label>
            {isEditing ? (
              <input
                type="number"
                step="1"
                className="text-center shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
                name="co2_min"
                value={thresholds.co2_min || ''}
                onChange={handleInputChange}
                placeholder="Enter minimum CO2 level"
              />
            ) : (
              <p>{thresholds.co2_min || 'Not set'}</p>
            )}
          </div>
          <div className="">
            <label className="block text-sm font-bold ">Maximum</label>
            {isEditing ? (
              <input
                type="number"
                step="1"
                className="text-center shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
                name="co2_max"
                value={thresholds.co2_max || ''}
                onChange={handleInputChange}
                placeholder="Enter maximum CO2 level"
              />
            ) : (
              <p>{thresholds.co2_max || 'Not set'}</p>
            )}
          </div>
        </div>

        {/* Power Section */}
        <div className="border border-gray-200 rounded-lg p-4 bg-indigo-400 text-center">
          <h3 className="text-lg font-semibol ">Power (kW)</h3>
          <div className="">
            <label className="block text-sm font-bold ">Minimum</label>
            {isEditing ? (
              <input
                type="number"
                step="0.01"
                className="text-center shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
                name="power_kw_min"
                value={thresholds.power_kw_min || ''}
                onChange={handleInputChange}
                placeholder="Enter minimum power level"
              />
            ) : (
              <p>{thresholds.power_kw_min || 'Not set'}</p>
            )}
          </div>
          <div className="">
            <label className="block text-sm font-bold ">Maximum</label>
            {isEditing ? (
              <input
                type="number"
                step="0.01"
                className="text-center shadow appearance-auto border rounded max-w-full py-2 px-3 focus:outline-none focus:shadow-outline"
                name="power_kw_max"
                value={thresholds.power_kw_max || ''}
                onChange={handleInputChange}
                placeholder="Enter maximum power level"
              />
            ) : (
              <p>{thresholds.power_kw_max || 'Not set'}</p>
            )}
          </div>
        </div>

        {/* Sensitivity Section */}
        <div className="border border-gray-200 rounded-lg p-4 bg-indigo-400 text-center">
          <h3 className="text-lg font-semibol ">Sensitivity</h3>
          <div className="">
            <label className="block text-sm font-bold ">Minimum</label>
            {isEditing ? (
              <input
                type="number"
                step="0.1"
                className="text-center shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
                name="sensitivity_min"
                value={thresholds.sensitivity_min || ''}
                onChange={handleInputChange}
                placeholder="Enter minimum sensitivity"
              />
            ) : (
              <p>{thresholds.sensitivity_min || 'Not set'}</p>
            )}
          </div>
          <div className="">
            <label className="block text-sm font-bold ">Maximum</label>
            {isEditing ? (
              <input
                type="number"
                step="0.1"
                className="text-center shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
                name="sensitivity_max"
                value={thresholds.sensitivity_max || ''}
                onChange={handleInputChange}
                placeholder="Enter maximum sensitivity"
              />
            ) : (
              <p>{thresholds.sensitivity_max || 'Not set'}</p>
            )}
          </div>
        </div>

        {/* Other Section */}
        <div className="border border-gray-200 rounded-lg p-4 bg-indigo-400 text-center">
          <h3 className="text-lg font-semibol ">Other Settings</h3>
          <div className="flex items-center justify-center gap-5 ">
            <input
              type="checkbox"
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              name="occupancy_required"
              id="occupancyRequired"
              checked={thresholds.occupancy_required}
              onChange={handleInputChange}
              disabled={!isEditing}
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
              disabled={!isEditing}
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
          className="hover:bg-blue-700 font-bold rounded"
          type="button"
        >
          Edit Thresholds
        </button>
      )}

      {/* Action Buttons */}
      {isEditing && (
        <div className="flex justify-center gap-4">
          <button
            type="submit"
            className={`hover:bg-blue-70 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${isSaving ? 'opacity-50 cursor-not-allowed' : ''}`}
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
            className="hover:bg-gray-700 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Cancel
          </button>
        </div>
      )}
    </form>
  </div>
);

export default ThresholdForm;