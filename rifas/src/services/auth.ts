const ADMIN_TOKEN_KEY = "admin_token";

export const getAdminToken = (): string | null => {
    return localStorage.getItem(ADMIN_TOKEN_KEY);
};

export const setAdminToken = (token: string): void => {
    localStorage.setItem(ADMIN_TOKEN_KEY, token);
};

export const clearAdminToken = (): void => {
    localStorage.removeItem(ADMIN_TOKEN_KEY);
};

export const isAdminAuthenticated = (): boolean => {
    return Boolean(getAdminToken());
};
