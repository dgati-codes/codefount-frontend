/**
 * api/api.js
 * ==========
 * Centralised Axios client for the CodeFount FastAPI backend.
 *
 * Features:
 *  - Base URL from REACT_APP_API_URL env var (defaults to localhost:8000)
 *  - Request interceptor: injects Bearer token from localStorage
 *  - Response interceptor: on 401, attempts one silent token refresh,
 *    then redirects to /login on failure
 *  - Namespaced helper objects (auth, courses, workshops, schedules, etc.)
 *    that mirror every backend endpoint, so pages never construct URLs manually.
 */

import axios from 'axios';

const BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const client = axios.create({
  baseURL: `${BASE}/api/v1`,
  headers: { 'Content-Type': 'application/json' },
});

// ── Token helpers ─────────────────────────────────────────────────────────────

export const token = {
  getAccess:  () => localStorage.getItem('cf_access'),
  getRefresh: () => localStorage.getItem('cf_refresh'),
  set: (access, refresh) => {
    localStorage.setItem('cf_access',  access);
    if (refresh) localStorage.setItem('cf_refresh', refresh);
  },
  clear: () => {
    localStorage.removeItem('cf_access');
    localStorage.removeItem('cf_refresh');
  },
};

// ── Request interceptor — inject Bearer token ────────────────────────────────

client.interceptors.request.use((config) => {
  const t = token.getAccess();
  if (t) config.headers.Authorization = `Bearer ${t}`;
  return config;
});

// ── Response interceptor — silent refresh on 401 ────────────────────────────

let refreshing = false;
let pendingQueue = [];

const processQueue = (error, newToken = null) => {
  pendingQueue.forEach(({ resolve, reject }) =>
    error ? reject(error) : resolve(newToken)
  );
  pendingQueue = [];
};

client.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;
    if (error.response?.status !== 401 || original._retry) {
      return Promise.reject(error);
    }
    if (refreshing) {
      return new Promise((resolve, reject) => {
        pendingQueue.push({ resolve, reject });
      }).then((newToken) => {
        original.headers.Authorization = `Bearer ${newToken}`;
        return client(original);
      });
    }
    original._retry = true;
    refreshing = true;
    try {
      const rt = token.getRefresh();
      if (!rt) throw new Error('No refresh token');
      const { data } = await axios.post(`${BASE}/api/v1/auth/refresh`, {
        refresh_token: rt,
      });
      token.set(data.access_token, data.refresh_token);
      processQueue(null, data.access_token);
      original.headers.Authorization = `Bearer ${data.access_token}`;
      return client(original);
    } catch (err) {
      processQueue(err);
      token.clear();
      window.location.href = '/login';
      return Promise.reject(err);
    } finally {
      refreshing = false;
    }
  }
);

// ── Auth ──────────────────────────────────────────────────────────────────────

export const auth = {
  /** POST /auth/login-json  →  { access_token, refresh_token, user } */
  login: (email, password) =>
    client.post('/auth/login-json', { email, password }).then(r => r.data),

  /** POST /auth/register  →  { access_token, refresh_token, user } */
  register: (data) =>
    client.post('/auth/register', {
      full_name:    data.name,
      email:        data.email,
      password:     data.password,
      phone:        data.phone   || null,
      gender:       data.gender  || null,
      country_code: data.code    || '+233',
    }).then(r => r.data),

  /** GET /auth/me  →  UserResponse */
  me: () => client.get('/auth/me').then(r => r.data),

  /** PATCH /auth/me  →  UserResponse */
  updateMe: (data) => client.patch('/auth/me', data).then(r => r.data),

  /** POST /auth/change-password */
  changePassword: (current_password, new_password) =>
    client.post('/auth/change-password', { current_password, new_password }).then(r => r.data),

  /** POST /auth/me/avatar  (multipart) →  UserResponse */
  uploadAvatar: (file) => {
    const fd = new FormData();
    fd.append('file', file);
    return client.post('/auth/me/avatar', fd, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }).then(r => r.data);
  },
};

// ── Courses ───────────────────────────────────────────────────────────────────

export const courses = {
  /** GET /courses?category=&search=&page=&size= */
  list: (params = {}) => client.get('/courses', { params }).then(r => r.data),

  /** GET /courses/:id */
  get: (id) => client.get(`/courses/${id}`).then(r => r.data),

  /** POST /courses  [ADMIN] */
  create: (body) => client.post('/courses', body).then(r => r.data),

  /** PATCH /courses/:id  [ADMIN] */
  update: (id, body) => client.patch(`/courses/${id}`, body).then(r => r.data),

  /** DELETE /courses/:id  [ADMIN] */
  delete: (id) => client.delete(`/courses/${id}`),
};

// ── Enrollments ───────────────────────────────────────────────────────────────

export const enrollments = {
  /** GET /enrollments/my */
  my: () => client.get('/enrollments/my').then(r => r.data),

  /** POST /enrollments/:courseId */
  enroll: (courseId) =>
    client.post(`/enrollments/${courseId}`).then(r => r.data),

  /** DELETE /enrollments/:courseId */
  unenroll: (courseId) => client.delete(`/enrollments/${courseId}`),

  /** PATCH /enrollments/:courseId/progress?progress= */
  updateProgress: (courseId, progress) =>
    client.patch(`/enrollments/${courseId}/progress`, null, {
      params: { progress },
    }),
};

// ── Workshops ─────────────────────────────────────────────────────────────────

export const workshops = {
  /** GET /workshops */
  list: (params = {}) => client.get('/workshops', { params }).then(r => r.data),

  /** GET /workshops/:id */
  get: (id) => client.get(`/workshops/${id}`).then(r => r.data),

  /** POST /workshops  [ADMIN] */
  create: (body) => client.post('/workshops', body).then(r => r.data),

  /** PATCH /workshops/:id  [ADMIN] */
  update: (id, body) => client.patch(`/workshops/${id}`, body).then(r => r.data),

  /** DELETE /workshops/:id  [ADMIN] */
  delete: (id) => client.delete(`/workshops/${id}`),
};

// ── Workshop registrations ────────────────────────────────────────────────────

export const wsRegs = {
  /** GET /workshop-registrations/my */
  my: () => client.get('/workshop-registrations/my').then(r => r.data),

  /** POST /workshop-registrations/:workshopId */
  register: (workshopId) =>
    client.post(`/workshop-registrations/${workshopId}`).then(r => r.data),

  /** DELETE /workshop-registrations/:workshopId */
  cancel: (workshopId) => client.delete(`/workshop-registrations/${workshopId}`),
};

// ── Schedules ─────────────────────────────────────────────────────────────────

export const schedules = {
  /** GET /schedules */
  list: () => client.get('/schedules').then(r => r.data),
};

// ── Services ──────────────────────────────────────────────────────────────────

export const services = {
  /** GET /services */
  list: () => client.get('/services').then(r => r.data),
};

// ── Testimonials ──────────────────────────────────────────────────────────────

export const testimonials = {
  /** GET /testimonials */
  list: (params = {}) => client.get('/testimonials', { params }).then(r => r.data),

  /** POST /testimonials/me  (authenticated) */
  submit: (body) => client.post('/testimonials/me', body).then(r => r.data),

  /** GET /testimonials/admin  [ADMIN] */
  listAll: (params = {}) =>
    client.get('/testimonials/admin', { params }).then(r => r.data),

  /** PATCH /testimonials/:id  [ADMIN] */
  update: (id, body) =>
    client.patch(`/testimonials/${id}`, body).then(r => r.data),

  /** DELETE /testimonials/:id  [ADMIN] */
  delete: (id) => client.delete(`/testimonials/${id}`),
};

// ── Enquiries ─────────────────────────────────────────────────────────────────

export const enquiries = {
  /** POST /enquiries  (guest) */
  submit: (body) => client.post('/enquiries', body).then(r => r.data),

  /** POST /enquiries/me  (authenticated) */
  submitAuth: (body) => client.post('/enquiries/me', body).then(r => r.data),

  /** GET /enquiries  [ADMIN] */
  list: () => client.get('/enquiries').then(r => r.data),
};

// ── Notifications ─────────────────────────────────────────────────────────────

export const notifications = {
  /** GET /notifications/me */
  inbox: (params = {}) =>
    client.get('/notifications/me', { params }).then(r => r.data),

  /** GET /notifications/me/unread-count */
  unreadCount: () =>
    client.get('/notifications/me/unread-count').then(r => r.data),

  /** PATCH /notifications/me/:id/read */
  markRead: (id) =>
    client.patch(`/notifications/me/${id}/read`),

  /** PATCH /notifications/me/read-all */
  markAllRead: () =>
    client.patch('/notifications/me/read-all').then(r => r.data),

  /** POST /notifications/broadcast  [ADMIN / TRAINER] */
  broadcast: (body) =>
    client.post('/notifications/broadcast', body).then(r => r.data),

  /** GET /notifications/sent  [ADMIN] */
  listSent: (params = {}) =>
    client.get('/notifications/sent', { params }).then(r => r.data),
};

// ── Tutor Resources ───────────────────────────────────────────────────────────

export const resources = {
  /** GET /courses/:courseId/resources */
  forCourse: (courseId, params = {}) =>
    client.get(`/courses/${courseId}/resources`, { params }).then(r => r.data),

  /** GET /resources/me */
  mine: () => client.get('/resources/me').then(r => r.data),

  /** POST /resources  [TRAINER / ADMIN] */
  create: (body) => client.post('/resources', body).then(r => r.data),

  /** PATCH /resources/:id  [TRAINER / ADMIN] */
  update: (id, body) => client.patch(`/resources/${id}`, body).then(r => r.data),

  /** DELETE /resources/:id  [TRAINER / ADMIN] */
  delete: (id) => client.delete(`/resources/${id}`),
};

// ── Payment Proofs ────────────────────────────────────────────────────────────

export const paymentProofs = {
  /**
   * POST /payment-proofs/upload  (multipart)
   * Provide enrollmentId OR workshopRegistrationId, not both.
   */
  upload: (file, { enrollmentId, workshopRegistrationId } = {}) => {
    const fd = new FormData();
    fd.append('file', file);
    const params = {};
    if (enrollmentId)            params.enrollment_id = enrollmentId;
    if (workshopRegistrationId)  params.workshop_registration_id = workshopRegistrationId;
    return client.post('/payment-proofs/upload', fd, {
      params,
      headers: { 'Content-Type': 'multipart/form-data' },
    }).then(r => r.data);
  },

  /** GET /payment-proofs/me */
  mine: () => client.get('/payment-proofs/me').then(r => r.data),

  /** GET /payment-proofs/admin  [ADMIN] */
  listAll: (params = {}) =>
    client.get('/payment-proofs/admin', { params }).then(r => r.data),

  /** PATCH /payment-proofs/admin/:id/verify  [ADMIN] */
  verify: (id, body) =>
    client.patch(`/payment-proofs/admin/${id}/verify`, body).then(r => r.data),

  /** GET /payment-proofs/admin/:id/download  [ADMIN] */
  downloadUrl: (id) => `${BASE}/api/v1/payment-proofs/admin/${id}/download`,
};

// ── Admin ─────────────────────────────────────────────────────────────────────

export const admin = {
  /** GET /admin/users */
  listUsers: () => client.get('/admin/users').then(r => r.data),

  /** PATCH /admin/users/:id/deactivate */
  deactivateUser: (id) =>
    client.patch(`/admin/users/${id}/deactivate`),

  /** GET /admin/reports/dashboard */
  dashboard: () =>
    client.get('/admin/reports/dashboard').then(r => r.data),
};

export default client;