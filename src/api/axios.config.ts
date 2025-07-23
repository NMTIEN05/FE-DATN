import axios from 'axios';

const instance = axios.create({
    baseURL: 'http://localhost:8888/api',  // json-server chạy trên port 3000
    timeout: 50000,  // Timeout 5 giây
    headers: {
        'Content-Type': 'application/json'
    }
});


// Thêm interceptor để xử lý token
instance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Xử lý response
instance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Xử lý khi token hết hạn
            localStorage.removeItem('token');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default instance; 