export const API_BASE_URL = 'https://classroom.googleapis.com/v1';

// Classe para erros da api
export class ApiError extends Error {
    constructor(public status: number, message: string) {
        super(message);
        this.name = 'ApiError';
    }
}

// Método para chamar a api e retornar em json
export async function apiRequest<T>(
    endpoint: string,
    token: string,
    options: RequestInit = {}
): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;

    const response = await fetch(url, {...options,
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            ...options.headers,
        },
    });

    if(!response.ok) {
        throw new ApiError(response.status, `Erro na API: ${response.statusText}`);
    }

    return response.json();
}