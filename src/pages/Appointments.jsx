import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllAppointments, cancelAppointment } from '../utils/api';

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');

  useEffect(() => {
    loadAppointments();
  }, []);

  useEffect(() => {
    filterAppointments();
  }, [appointments, searchTerm, statusFilter, dateFilter]);

  const loadAppointments = async () => {
    try {
      setLoading(true);
      const response = await getAllAppointments();
      if (response.success) {
        setAppointments(response.data);
      } else {
        setError(response.message);
      }
    } catch (err) {
      setError(err.message || 'Failed to load appointments');
    } finally {
      setLoading(false);
    }
  };

  const filterAppointments = () => {
    let filtered = [...appointments];

    // Apply search filter
    if (searchTerm.trim()) {
      filtered = filtered.filter(appointment =>
        appointment.client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        appointment.client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        appointment.client.phone.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      const now = new Date();
      filtered = filtered.filter(appointment => {
        const appointmentDate = new Date(appointment.time);
        const isPast = appointmentDate < now;
        
        if (statusFilter === 'scheduled') return !isPast;
        if (statusFilter === 'completed') return isPast;
        return true;
      });
    }

    // Apply date filter
    if (dateFilter !== 'all') {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);
      const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
      const nextMonth = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);

      filtered = filtered.filter(appointment => {
        const appointmentDate = new Date(appointment.time);
        
        switch (dateFilter) {
          case 'today':
            return appointmentDate >= today && appointmentDate < tomorrow;
          case 'tomorrow':
            return appointmentDate >= tomorrow && appointmentDate < new Date(tomorrow.getTime() + 24 * 60 * 60 * 1000);
          case 'week':
            return appointmentDate >= today && appointmentDate < nextWeek;
          case 'month':
            return appointmentDate >= today && appointmentDate < nextMonth;
          default:
            return true;
        }
      });
    }

    setFilteredAppointments(filtered);
  };

  const handleCancelAppointment = async (appointmentId) => {
    if (window.confirm('Are you sure you want to cancel this appointment?')) {
      try {
        const response = await cancelAppointment(appointmentId);
        if (response.success) {
          setAppointments(prev => prev.filter(apt => apt.id !== appointmentId));
        } else {
          alert(response.message);
        }
      } catch (err) {
        alert(err.message || 'Failed to cancel appointment');
      }
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setDateFilter('all');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#40A6BD]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
        {error}
      </div>
    );
  }

  const hasActiveFilters = searchTerm || statusFilter !== 'all' || dateFilter !== 'all';

  return (
    <div>
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">Appointments</h1>
          <p className="mt-2 text-sm text-gray-700">
            A list of all scheduled appointments with client details.
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <Link
            to="/appointments/create"
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-[#40A6BD] px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-[#359bb2] focus:outline-none focus:ring-2 focus:ring-[#40A6BD] focus:ring-offset-2"
          >
            Create Appointment
          </Link>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Search */}
        <div className="lg:col-span-2">
          <label htmlFor="appointment-search" className="block text-sm font-medium text-gray-700 mb-2">
            Search appointments
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              id="appointment-search"
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-[#40A6BD] focus:border-[#40A6BD] sm:text-sm"
              placeholder="Search by client name, email, or phone..."
            />
            {searchTerm && (
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                <button
                  type="button"
                  onClick={() => setSearchTerm('')}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Status Filter */}
        <div>
          <label htmlFor="status-filter" className="block text-sm font-medium text-gray-700 mb-2">
            Status
          </label>
          <select
            id="status-filter"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-[#40A6BD] focus:border-[#40A6BD] sm:text-sm"
          >
            <option value="all">All Status</option>
            <option value="scheduled">Scheduled</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        {/* Date Filter */}
        <div>
          <label htmlFor="date-filter" className="block text-sm font-medium text-gray-700 mb-2">
            Date Range
          </label>
          <select
            id="date-filter"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-[#40A6BD] focus:border-[#40A6BD] sm:text-sm"
          >
            <option value="all">All Dates</option>
            <option value="today">Today</option>
            <option value="tomorrow">Tomorrow</option>
            <option value="week">Next 7 Days</option>
            <option value="month">Next 30 Days</option>
          </select>
        </div>
      </div>

      {/* Filter Results Info */}
      {hasActiveFilters && (
        <div className="mt-4 flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Found {filteredAppointments.length} appointment{filteredAppointments.length !== 1 ? 's' : ''} 
            {searchTerm && ` matching "${searchTerm}"`}
            {statusFilter !== 'all' && ` with status "${statusFilter}"`}
            {dateFilter !== 'all' && ` in date range "${dateFilter}"`}
          </div>
          <button
            onClick={clearFilters}
            className="text-sm text-[#40A6BD] hover:text-[#359bb2] font-medium"
          >
            Clear all filters
          </button>
        </div>
      )}

      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Client
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contact
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date & Time
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="relative px-6 py-3">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredAppointments.map((appointment) => {
                    const appointmentDate = new Date(appointment.time);
                    const isPast = appointmentDate < new Date();
                    
                    return (
                      <tr key={appointment.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {appointment.client.name}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">
                            {appointment.client.email}
                          </div>
                          <div className="text-sm text-gray-500">
                            {appointment.client.phone}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {appointmentDate.toLocaleDateString()}
                          </div>
                          <div className="text-sm text-gray-500">
                            {appointmentDate.toLocaleTimeString()}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            isPast 
                              ? 'bg-gray-100 text-gray-800' 
                              : 'bg-green-100 text-green-800'
                          }`}>
                            {isPast ? 'Completed' : 'Scheduled'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                          {!isPast && (
                            <>
                              <Link
                                to={`/appointments/${appointment.id}/edit`}
                                className="text-[#40A6BD] hover:text-[#359bb2] font-medium"
                              >
                                Edit
                              </Link>
                              <button
                                onClick={() => handleCancelAppointment(appointment.id)}
                                className="text-red-600 hover:text-red-900 font-medium"
                              >
                                Cancel
                              </button>
                            </>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {filteredAppointments.length === 0 && hasActiveFilters && (
        <div className="text-center py-12">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No appointments found</h3>
          <p className="mt-1 text-sm text-gray-500">
            No appointments match your current filters. Try adjusting your search criteria.
          </p>
          <div className="mt-6">
            <button
              onClick={clearFilters}
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-[#40A6BD] hover:bg-[#359bb2] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#40A6BD]"
            >
              Clear all filters
            </button>
          </div>
        </div>
      )}

      {appointments.length === 0 && !hasActiveFilters && (
        <div className="text-center py-12">
          <h3 className="mt-2 text-sm font-medium text-gray-900">No appointments</h3>
          <p className="mt-1 text-sm text-gray-500">
            No appointments have been scheduled yet.
          </p>
          <div className="mt-6">
            <Link
              to="/appointments/create"
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-[#40A6BD] hover:bg-[#359bb2] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#40A6BD]"
            >
              Create your first appointment
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default Appointments; 