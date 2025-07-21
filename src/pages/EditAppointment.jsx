import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getAllClients, getAllAppointments, updateAppointment } from '../utils/api';

const EditAppointment = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [clients, setClients] = useState([]);
  const [appointment, setAppointment] = useState(null);
  const [selectedClientId, setSelectedClientId] = useState('');
  const [appointmentDate, setAppointmentDate] = useState('');
  const [appointmentTime, setAppointmentTime] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    try {
      const [clientsResponse, appointmentsResponse] = await Promise.all([
        getAllClients(),
        getAllAppointments()
      ]);

      if (clientsResponse.success) {
        setClients(clientsResponse.data);
      }

      if (appointmentsResponse.success) {
        const currentAppointment = appointmentsResponse.data.find(apt => apt.id === id);
        if (currentAppointment) {
          setAppointment(currentAppointment);
          setSelectedClientId(currentAppointment.client_id);
          
          const appointmentDateTime = new Date(currentAppointment.time);
          setAppointmentDate(appointmentDateTime.toISOString().split('T')[0]);
          setAppointmentTime(appointmentDateTime.toTimeString().slice(0, 5));
        } else {
          setError('Appointment not found');
        }
      }
    } catch (err) {
      setError(err.message || 'Failed to load data');
    } finally {
      setLoadingData(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const appointmentDateTime = new Date(`${appointmentDate}T${appointmentTime}`).toISOString();
      
      const response = await updateAppointment(id, {
        client_id: selectedClientId,
        time: appointmentDateTime
      });
      
      if (response.success) {
        navigate('/appointments');
      } else {
        setError(response.message);
      }
    } catch (err) {
      setError(err.message || 'Failed to update appointment');
    } finally {
      setLoading(false);
    }
  };

  const getCurrentDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  if (loadingData) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#40A6BD]"></div>
      </div>
    );
  }

  if (!appointment) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
        Appointment not found
      </div>
    );
  }

  return (
    <div>
      <div className="md:grid md:grid-cols-3 md:gap-6">
        <div className="md:col-span-1">
          <div className="px-4 sm:px-0">
            <h3 className="text-lg font-medium leading-6 text-gray-900">
              Edit Appointment
            </h3>
            <p className="mt-1 text-sm text-gray-600">
              Update the appointment details. You can change the client, date, or time.
            </p>
          </div>
        </div>
        
        <div className="mt-5 md:mt-0 md:col-span-2">
          <form onSubmit={handleSubmit}>
            <div className="shadow sm:rounded-md sm:overflow-hidden">
              <div className="px-4 py-5 bg-white space-y-6 sm:p-6">
                
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
                    {error}
                  </div>
                )}

                <div className="bg-gray-50 border border-gray-200 p-4 rounded-md">
                  <h4 className="text-sm font-medium text-gray-800">Current Appointment Details:</h4>
                  <div className="mt-1 text-sm text-gray-600">
                    <p><strong>Client:</strong> {appointment.client.name}</p>
                    <p><strong>Date:</strong> {new Date(appointment.time).toLocaleDateString()}</p>
                    <p><strong>Time:</strong> {new Date(appointment.time).toLocaleTimeString()}</p>
                  </div>
                </div>

                <div>
                  <label htmlFor="client" className="block text-sm font-medium text-gray-700">
                    Select Client
                  </label>
                  <select
                    id="client"
                    name="client"
                    required
                    value={selectedClientId}
                    onChange={(e) => setSelectedClientId(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#40A6BD] focus:border-[#40A6BD] sm:text-sm"
                  >
                    <option value="">Choose a client...</option>
                    {clients.map((client) => (
                      <option key={client.id} value={client.id}>
                        {client.name} - {client.email}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label htmlFor="date" className="block text-sm font-medium text-gray-700">
                      Appointment Date
                    </label>
                    <input
                      type="date"
                      id="date"
                      name="date"
                      required
                      min={getCurrentDate()}
                      value={appointmentDate}
                      onChange={(e) => setAppointmentDate(e.target.value)}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#40A6BD] focus:border-[#40A6BD] sm:text-sm"
                    />
                  </div>

                  <div>
                    <label htmlFor="time" className="block text-sm font-medium text-gray-700">
                      Appointment Time
                    </label>
                    <input
                      type="time"
                      id="time"
                      name="time"
                      required
                      value={appointmentTime}
                      onChange={(e) => setAppointmentTime(e.target.value)}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#40A6BD] focus:border-[#40A6BD] sm:text-sm"
                    />
                  </div>
                </div>

                {selectedClientId && (
                  <div className="bg-blue-50 border border-blue-200 p-4 rounded-md">
                    <h4 className="text-sm font-medium text-blue-800">Selected Client:</h4>
                    <div className="mt-1">
                      {clients.find(c => c.id === selectedClientId) && (
                        <div className="text-sm text-blue-700">
                          <p><strong>Name:</strong> {clients.find(c => c.id === selectedClientId).name}</p>
                          <p><strong>Email:</strong> {clients.find(c => c.id === selectedClientId).email}</p>
                          <p><strong>Phone:</strong> {clients.find(c => c.id === selectedClientId).phone}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
              
              <div className="px-4 py-3 bg-gray-50 text-right sm:px-6 space-x-3">
                <button
                  type="button"
                  onClick={() => navigate('/appointments')}
                  className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#40A6BD]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-[#40A6BD] hover:bg-[#359bb2] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#40A6BD] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    'Update Appointment'
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditAppointment; 