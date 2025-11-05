import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import * as SecureStore from 'expo-secure-store';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api';

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: API_URL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor to add auth token
    this.api.interceptors.request.use(
      async (config) => {
        const token = await SecureStore.getItemAsync('auth-token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor for error handling
    this.api.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response?.status === 401) {
          // Token expired or invalid, logout user
          await SecureStore.deleteItemAsync('auth-token');
          await SecureStore.deleteItemAsync('user');
        }
        return Promise.reject(error);
      }
    );
  }

  // Auth endpoints
  async register(data: any) {
    const response = await this.api.post('/auth/register', data);
    return response.data;
  }

  async login(email: string, password: string) {
    const response = await this.api.post('/auth/login', { email, password });
    return response.data;
  }

  async logout() {
    const response = await this.api.post('/auth/logout');
    return response.data;
  }

  async getCurrentUser() {
    const response = await this.api.get('/auth/me');
    return response.data;
  }

  // Doctor endpoints
  async getDoctors(params?: any) {
    const response = await this.api.get('/doctors', { params });
    return response.data;
  }

  async getDoctorById(id: string) {
    const response = await this.api.get(`/doctors/${id}`);
    return response.data;
  }

  // Appointment endpoints
  async getAppointments(params?: any) {
    const response = await this.api.get('/appointments', { params });
    return response.data;
  }

  async createAppointment(data: any) {
    const response = await this.api.post('/appointments', data);
    return response.data;
  }

  async updateAppointment(id: string, data: any) {
    const response = await this.api.patch(`/appointments/${id}`, data);
    return response.data;
  }

  async cancelAppointment(id: string) {
    const response = await this.api.post(`/appointments/${id}/cancel`);
    return response.data;
  }

  // Payment endpoints
  async initiatePayment(data: any) {
    const response = await this.api.post('/payments/initiate', data);
    return response.data;
  }

  async verifyPayment(data: any) {
    const response = await this.api.post('/payments/verify', data);
    return response.data;
  }

  // Notification endpoints
  async getNotifications() {
    const response = await this.api.get('/notifications');
    return response.data;
  }

  async markNotificationAsRead(id: string) {
    const response = await this.api.patch(`/notifications/${id}/read`);
    return response.data;
  }
}

export default new ApiService();
