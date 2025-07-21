const BASE_URL = 'https://ruh-backend-production.up.railway.app/api';

// Auth functions
export const login = async (email, password) => {
    const response = await fetch(`${BASE_URL}/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    });

    const data = await response.json();
    if (data.success) {
        localStorage.setItem('accessToken', data.data.accessToken);
        localStorage.setItem('refreshToken', data.data.refreshToken);
        localStorage.setItem('admin', JSON.stringify(data.data.admin));
        return data.data;
    }
    throw new Error(data.message);
};

export const refreshToken = async () => {
    const refreshToken = localStorage.getItem('refreshToken');

    const response = await fetch(`${BASE_URL}/admin/refresh-token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken })
    });

    const data = await response.json();
    if (data.success) {
        localStorage.setItem('accessToken', data.data.accessToken);
        localStorage.setItem('refreshToken', data.data.refreshToken);
        return data.data;
    } else {
        localStorage.clear();
        window.location.href = '/login';
        throw new Error('Session expired');
    }
};

export const makeAuthenticatedRequest = async (url, options = {}) => {
    const token = localStorage.getItem('accessToken');

    const response = await fetch(url, {
        ...options,
        headers: {
            ...options.headers,
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });

    if (response.status === 401) {
        await refreshToken();
        return makeAuthenticatedRequest(url, options);
    }

    return response.json();
};

// Client APIs
export const getAllClients = async () => {
    return await makeAuthenticatedRequest(`${BASE_URL}/clients`);
};

export const getClientById = async (clientId) => {
    return await makeAuthenticatedRequest(`${BASE_URL}/clients/${clientId}`);
};

// Appointment APIs
export const getAllAppointments = async () => {
    return await makeAuthenticatedRequest(`${BASE_URL}/appointments`);
};

export const createAppointment = async (clientId, appointmentTime) => {
    return await makeAuthenticatedRequest(`${BASE_URL}/appointments`, {
        method: 'POST',
        body: JSON.stringify({
            client_id: clientId,
            time: appointmentTime
        })
    });
};

export const updateAppointment = async (appointmentId, updates) => {
    return await makeAuthenticatedRequest(`${BASE_URL}/appointments/${appointmentId}`, {
        method: 'PUT',
        body: JSON.stringify(updates)
    });
};

export const cancelAppointment = async (appointmentId) => {
    return await makeAuthenticatedRequest(`${BASE_URL}/appointments/${appointmentId}`, {
        method: 'DELETE'
    });
};

export const getClientAppointments = async (clientId) => {
    return await makeAuthenticatedRequest(`${BASE_URL}/appointments/client/${clientId}`);
};

export const logout = () => {
    localStorage.clear();
    window.location.href = '/login';
}; 