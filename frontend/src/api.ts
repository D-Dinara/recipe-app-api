const API_BASE_URL = 'http://localhost:8000/api/user';

interface User {
    name: string;
}

interface RegisterData extends User {
    email: string;
    password: string;
}

interface AuthResponse {
    token: string;
    user: User;
}

export async function registerUser(userData: RegisterData): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/create/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
    });
    return response.json();
}

export async function loginUser(credentials: RegisterData): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/token/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
    });
    return response.json();
}

export async function fetchUserProfile(token: string): Promise<User> {
    const response = await fetch(`${API_BASE_URL}/me/`, {
        method: 'GET',
        headers: {
            'Authorization': `Token ${token}`,
        },
    });
    return response.json();
}
