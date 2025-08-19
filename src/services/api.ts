import axios from "axios";

// src/services/api.ts
export interface Post {
    id?: number;
    userId: number;
    title: string;
    content: string;
    boardType: string;
    category: string;
    tags: string; // 배열에서 문자열로 변경!
    nickName: string;
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

// 로그인 관련 인터페이스
export interface LoginRequest {
    userId: string;
    password: string;
}

export interface LoginResponse {
    success: boolean;
    message: string;
    user?: {
        pid: number;
        userId: string;
        email: string;
        phoneNumber: string;
        experience: number;
        level: number;
        point: number;
        totalPost: number;
        totalComment: number;
        totalLike: number;
        consecutiveLogin: number;
    };
}

// 회원가입 API 함수
export const register = async (
    registerData: RegisterRequest,
): Promise<RegisterResponse> => {
    console.log("회원가입 요청 데이터(원본):", registerData);
    console.log("API URL:", `${API_BASE_URL}/api/users/register`);

    // 백엔드 필드명에 맞춰 변환
    const payload = {
        userId: registerData.userId,
        nickName: registerData.nickName,
        userPassword: registerData.password,
        userEmail: registerData.email,
        phoneNumber: registerData.phoneNumber,
    } as const;

    try {
        const response = await axios.post<RegisterResponse>(
            `${API_BASE_URL}/api/users/register`,
            payload,
            {
                headers: {
                    "Content-Type": "application/json",
                },
            },
        );

        console.log("회원가입 응답:", response.data);
        console.log("응답 상태:", response.status);

        if (!response.data.success) {
            throw new Error(
                response.data.message || "회원가입에 실패했습니다.",
            );
        }

        // 서버 응답을 프론트에서 기대하는 형태로 정규화
        const server = response.data as unknown as {
            success: boolean;
            message: string;
            data?: {
                pid?: number;
                id?: number;
                userId: string;
                nickName: string;
                email?: string;
                userEmail?: string;
            };
        };

        if (server.data) {
            return {
                success: server.success,
                message: server.message,
                data: {
                    pid: server.data.pid ?? server.data.id ?? 0,
                    userId: server.data.userId,
                    nickName: server.data.nickName,
                    email: server.data.email ?? server.data.userEmail ?? "",
                },
            } satisfies RegisterResponse;
        }

        return server as unknown as RegisterResponse;
    } catch (error: unknown) {
        console.error("회원가입 API 요청 실패:", error);

        // Axios 에러인 경우 더 자세한 정보 출력
        if (error && typeof error === "object" && "response" in error) {
            const axiosError = error as {
                response: { status: number; data: unknown; headers: unknown };
            };
            console.error("에러 응답 상태:", axiosError.response.status);
            console.error("에러 응답 데이터:", axiosError.response.data);
            console.error("에러 응답 헤더:", axiosError.response.headers);

            // 서버에서 보낸 에러 메시지가 있으면 사용
            if (
                axiosError.response?.data &&
                typeof axiosError.response.data === "object" &&
                "message" in axiosError.response.data
            ) {
                throw new Error(String(axiosError.response.data.message));
            }
        } else if (error && typeof error === "object" && "request" in error) {
            console.error(
                "요청은 보냈지만 응답을 받지 못함:",
                (error as { request: unknown }).request,
            );
        } else if (error instanceof Error) {
            console.error("요청 설정 중 에러:", error.message);

            // 네트워크 에러인 경우
            if (error.message.includes("Network Error")) {
                throw new Error(
                    "서버에 연결할 수 없습니다. 서버가 실행 중인지 확인해주세요.",
                );
            }
        }

        throw error;
    }
};

// 로그인 API 함수
export const login = async (
    loginData: LoginRequest,
): Promise<LoginResponse> => {
    console.log("로그인 요청 데이터:", loginData);
    console.log("API URL:", `${API_BASE_URL}/api/users/login`);

    try {
        const response = await axios.post<LoginResponse>(
            `${API_BASE_URL}/api/users/login`,
            loginData,
            {
                headers: {
                    "Content-Type": "application/json",
                },
            },
        );

        console.log("로그인 응답:", response.data);
        console.log("응답 상태:", response.status);

        if (!response.data.success) {
            throw new Error(response.data.message || "로그인에 실패했습니다.");
        }

        return response.data;
    } catch (error: unknown) {
        console.error("로그인 API 요청 실패:", error);

        // Axios 에러인 경우 더 자세한 정보 출력
        if (error && typeof error === "object" && "response" in error) {
            const axiosError = error as {
                response: { status: number; data: unknown; headers: unknown };
            };
            console.error("에러 응답 상태:", axiosError.response.status);
            console.error("에러 응답 데이터:", axiosError.response.data);
            console.error("에러 응답 헤더:", axiosError.response.headers);

            // 서버에서 보낸 에러 메시지가 있으면 사용
            if (
                axiosError.response?.data &&
                typeof axiosError.response.data === "object" &&
                "message" in axiosError.response.data
            ) {
                throw new Error(String(axiosError.response.data.message));
            }
        } else if (error && typeof error === "object" && "request" in error) {
            console.error(
                "요청은 보냈지만 응답을 받지 못함:",
                (error as { request: unknown }).request,
            );
        } else if (error instanceof Error) {
            console.error("요청 설정 중 에러:", error.message);

            // 네트워크 에러인 경우
            if (error.message.includes("Network Error")) {
                throw new Error(
                    "서버에 연결할 수 없습니다. 서버가 실행 중인지 확인해주세요.",
                );
            }
        }

        throw error;
    }
};

// 사용자 정보 업데이트 관련 인터페이스
export interface UpdatePasswordRequest {
    pid: number; // userId 대신 pid 사용
    currentPassword: string;
    newPassword: string;
}

export interface UpdateResponse {
    success: boolean;
    message: string;
    user?: {
        pid: number;
        userId: string;
        email: string;
        phoneNumber: string;
        nickName: string;
    };
}

// 비밀번호 변경 API 함수
export const updatePassword = async (
    updateData: UpdatePasswordRequest,
): Promise<UpdateResponse> => {
    console.log("비밀번호 변경 요청 데이터:", updateData);
    console.log(
        "비밀번호 변경 API URL:",
        `${API_BASE_URL}/api/users/${updateData.pid}`,
    );

    // 백엔드가 기대하는 User 객체 형태로 변환
    const userDetails = {
        userPassword: updateData.newPassword, // 백엔드가 기대하는 필드명
    };

    try {
        const response = await axios.put<UpdateResponse>(
            `${API_BASE_URL}/api/users/${updateData.pid}`,
            userDetails,
            {
                headers: {
                    "Content-Type": "application/json",
                },
            },
        );

        console.log("비밀번호 변경 응답:", response.data);
        console.log("응답 상태:", response.status);

        if (!response.data.success) {
            throw new Error(
                response.data.message || "비밀번호 변경에 실패했습니다.",
            );
        }

        return response.data;
    } catch (error) {
        console.error("비밀번호 변경 API 요청 실패:", error);

        // Axios 에러인 경우 더 자세한 정보 출력
        if (error && typeof error === "object" && "response" in error) {
            const axiosError = error as {
                response: { status: number; data: unknown; headers: unknown };
            };
            console.error("에러 응답 상태:", axiosError.response.status);
            console.error("에러 응답 데이터:", axiosError.response.data);
            console.error("에러 응답 헤더:", axiosError.response.headers);

            // 서버에서 보낸 에러 메시지가 있으면 사용
            if (
                axiosError.response?.data &&
                typeof axiosError.response.data === "object" &&
                "message" in axiosError.response.data
            ) {
                throw new Error(String(axiosError.response.data.message));
            }
        }

        throw error;
    }
};
