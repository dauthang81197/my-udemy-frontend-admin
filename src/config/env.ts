export const env = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL,
  authServicePrefix: import.meta.env.VITE_AUTH_SERVICE_PREFIX,
  courseServicePrefix: import.meta.env.VITE_COURSE_SERVICE_PREFIX,
} as const;

export const AUTH_URL = `${env.apiBaseUrl}${env.authServicePrefix}`;
export const COURSE_URL = `${env.apiBaseUrl}${env.courseServicePrefix}`;
