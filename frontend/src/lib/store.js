import { writable } from 'svelte/store';

// Helper function to check if we are in the browser
const isBrowser = typeof window !== 'undefined';

// Initialize stores with data from sessionStorage if available
export const users = writable(isBrowser ? JSON.parse(sessionStorage.getItem('users') || '[]') : []);
export const currentUser = writable(isBrowser ? JSON.parse(sessionStorage.getItem('currentUser') || 'null') : null);
export const isAuthenticated = writable(isBrowser ? JSON.parse(sessionStorage.getItem('isAuthenticated') || 'false') : false);

if (isBrowser) {
  users.subscribe(value => sessionStorage.setItem('users', JSON.stringify(value)));
  currentUser.subscribe(value => sessionStorage.setItem('currentUser', JSON.stringify(value)));
  isAuthenticated.subscribe(value => sessionStorage.setItem('isAuthenticated', JSON.stringify(value)));
}
