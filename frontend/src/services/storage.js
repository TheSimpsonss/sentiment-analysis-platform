const TOKEN_KEY = "auth_token";
const USER_PREFERENCES = "user_preferences";

const storageService = {
  getToken: () => {
    return localStorage.getItem(TOKEN_KEY);
  },

  setToken: (token) => {
    localStorage.setItem(TOKEN_KEY, token);
  },

  removeToken: () => {
    localStorage.removeItem(TOKEN_KEY);
  },

  setPreferences: (preferences) => {
    localStorage.setItem(USER_PREFERENCES, JSON.stringify(preferences));
  },

  getPreferences: () => {
    const prefs = localStorage.getItem(USER_PREFERENCES);
    return prefs ? JSON.parse(prefs) : null;
  },
};

export default storageService;
