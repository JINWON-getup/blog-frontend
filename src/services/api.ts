import axios from "axios";

// src/services/api.ts
export interface Post {
    id?: number;
    title: string;
    content: string;
    author: string;
    boardType: string;
    category: string;
    tags: string; // 배열에서 문자열로 변경!
    createdAt?: string;
    updatedAt?: string;
}

// API 기본 URL (공통으로 사용)
export const API_BASE_URL =
    import.meta.env.VITE_API_URL || "http://localhost:8080";

const API_URL = `${API_BASE_URL}/api/post`;

export const getPosts = async (): Promise<Post[]> => {
    const res = await axios.get<Post[]>(API_URL);
    return res.data;
};

export const createPost = async (
    post: Omit<Post, "id" | "createdAt" | "updatedAt">,
): Promise<Post> => {
    console.log("API 요청 데이터:", post);

    try {
        const res = await axios.post<Post>(API_URL, post, {
            headers: { "Content-Type": "application/json" },
        });

        console.log("API 응답 상태:", res.status, res.statusText);

        const result = res.data;
        console.log("API 응답 데이터:", result);
        return result;
    } catch (error) {
        console.error("API 요청 실패:", error);
        throw error;
    }
};

// 관리자 로그인 관련 인터페이스
export interface AdminLoginRequest {
    id: string;
    password: string;
}

export interface AdminLoginResponse {
    success: boolean;
    message: string;
}

export interface AdminInfo {
    adminName: string;
    id: string;
    email: string;
    role: string;
}

// 관리자 로그인 API 함수
export const adminLogin = async (
    loginData: AdminLoginRequest,
): Promise<AdminLoginResponse> => {
    try {
        const response = await axios.post<AdminLoginResponse>(
            `${API_BASE_URL}/api/admin/login`,
            loginData,
            {
                headers: {
                    "Content-Type": "application/json",
                },
            },
        );

        if (!response.data.success) {
            throw new Error(response.data.message || "로그인에 실패했습니다.");
        }

        return response.data;
    } catch (error) {
        console.error("관리자 로그인 API 요청 실패:", error);
        throw error;
    }
};

// 관리자 로그아웃 API 함수
export const adminLogout = async (): Promise<void> => {
    try {
        const response = await axios.post<{ success: boolean }>(
            `${API_BASE_URL}/api/admin/logout`,
            {},
            {
                headers: {
                    "Content-Type": "application/json",
                },
            },
        );

        if (!response.data.success) {
            throw new Error("로그아웃에 실패했습니다.");
        }
    } catch (error) {
        console.error("관리자 로그아웃 API 요청 실패:", error);
        throw error;
    }
};

// 관리자 정보 조회 API 함수
export const getAdminInfo = async (id: string): Promise<AdminInfo> => {
    try {
        const response = await axios.get<{ success: boolean; data: AdminInfo }>(
            `${API_BASE_URL}/api/admin/${id}`,
            {
                headers: {
                    "Content-Type": "application/json",
                },
            },
        );

        if (!response.data.success) {
            throw new Error("관리자 정보 조회에 실패했습니다.");
        }

        return response.data.data;
    } catch (error) {
        console.error("관리자 정보 조회 API 요청 실패:", error);
        throw error;
    }
};

// 회원가입 관련 인터페이스
export interface RegisterRequest {
    userId: string;
    nickName: string;
    password: string;
    email: string;
    phoneNumber: string;
}

export interface RegisterResponse {
    success: boolean;
    message: string;
    data?: {
        pid: number;
        userId: string;
        nickName: string;
        email: string;
    };
}

// 회원가입 API 함수
export const register = async (
    registerData: RegisterRequest,
): Promise<RegisterResponse> => {
    try {
        const response = await axios.post<RegisterResponse>(
            `${API_BASE_URL}/api/users/register`,
            registerData,
            {
                headers: {
                    "Content-Type": "application/json",
                },
            },
        );

        if (!response.data.success) {
            throw new Error(
                response.data.message || "회원가입에 실패했습니다.",
            );
        }

        return response.data;
    } catch (error) {
        console.error("회원가입 API 요청 실패:", error);
        throw error;
    }
};
