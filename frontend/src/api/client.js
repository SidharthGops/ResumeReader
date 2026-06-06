// Helper to make authenticated requests
async function request(url, options = {}) {
    const token = localStorage.getItem('token');
    const headers = { ...options.headers };
    
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(url, {
        ...options,
        headers
    });

    if (!response.ok) {
        throw new Error(`API Request failed with status ${response.status}`);
    }

    return response.json();
}

export const api = {
    // Get past scans history
    getHistory: () => {
        return request('/api/resumes/history');
    },

    // Analyze new resume PDF
    analyze: (file, jobDescription) => {
        const formData = new FormData();
        formData.append('resume', file);
        formData.append('jobDescription', jobDescription);

        return request('/api/resumes/analyze', {
            method: 'POST',
            body: formData,
            // Fetch handles Content-Type automatically for FormData with boundary
        });
    },

    // Delete single history item
    deleteHistory: (id) => {
        return request(`/api/resumes/delete/${id}`, {
            method: 'DELETE',
        });
    },

    // Clear all history
    clearHistory: () => {
        return request('/api/resumes/deleteAll', {
            method: 'DELETE',
        });
    }
};
