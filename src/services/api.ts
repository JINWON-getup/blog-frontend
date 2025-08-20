import axios from "axios";

// src/services/api.ts
export interface Post {
    id?: number;
    userId: number;
    userType: string; // "USER" 또는 "ADMIN"
    title: string;
    content: string;
    boardType: string;
    category: string;
    tags: string; // 배열에서 문자열로 변경!
    nickName: string;
    createdAt?: string;
    updatedAt?: string;
}

// 댓글 인터페이스 추가
export interface Comment {
    id?: number;
    content: string;
    postId: number;
    userId: number;
    userType: string; // "USER" 또는 "ADMIN"
    parentCommentId?: number;
    isReply: boolean;
    createdAt?: string;
    updatedAt?: string;
    nickName?: string; // 프론트엔드에서 사용할 닉네임
}

// API 기본 URL (공통으로 사용)
export const API_BASE_URL =
    import.meta.env.VITE_API_URL || "http://localhost:8080";

const API_URL = `${API_BASE_URL}/api/post`;

export const getPosts = async (): Promise<Post[]> => {
    const res = await axios.get<Post[]>(API_URL);
    return res.data;
};

// 관리자용 게시글 삭제 API
export const deletePost = async (postId: number): Promise<void> => {
    await axios.delete(`${API_URL}/${postId}`);
};

export const createPost = async (
    post: Omit<Post, "id" | "createdAt" | "updatedAt">,
): Promise<Post> => {
    try {
        const res = await axios.post<Post>(API_URL, post, {
            headers: { "Content-Type": "application/json" },
        });

        const result = res.data;
        return result;
    } catch (error) {
        console.error("API 요청 실패:", error);

        // Axios 에러인 경우 더 자세한 정보 출력
        if (error && typeof error === "object" && "response" in error) {
            const axiosError = error as {
                response: { status: number; data: unknown; headers: unknown };
            };
            console.error("에러 응답 상태:", axiosError.response.status);
            console.error("에러 응답 데이터:", axiosError.response.data);
            console.error(
                "에러 응답 데이터 타입:",
                typeof axiosError.response.data,
            );
            console.error(
                "에러 응답 데이터 JSON:",
                JSON.stringify(axiosError.response.data, null, 2),
            );
            console.error("에러 응답 헤더:", axiosError.response.headers);
        }

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
    admin: {
        adminName: string;
        id: number;
        email: string;
        role?: string;
    };
}

export interface AdminInfo {
    adminName: string;
    id: number;
    email: string;
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

export interface WithdrawRequest {
    pid: number;
    password: string;
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

export interface WithdrawResponse {
    success: boolean;
    message: string;
}

// 비밀번호 변경 API 함수
export const updatePassword = async (
    updateData: UpdatePasswordRequest,
): Promise<UpdateResponse> => {
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

// 회원탈퇴 API 함수
export const withdrawUser = async (
    withdrawData: WithdrawRequest,
): Promise<WithdrawResponse> => {
    try {
        const response = await axios.post<WithdrawResponse>(
            `${API_BASE_URL}/api/users/${withdrawData.pid}/withdraw`,
            { password: withdrawData.password },
            {
                headers: {
                    "Content-Type": "application/json",
                },
            },
        );

        if (!response.data.success) {
            throw new Error(
                response.data.message || "회원탈퇴에 실패했습니다.",
            );
        }

        return response.data;
    } catch (error) {
        console.error("회원탈퇴 API 요청 실패:", error);

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

// 사용자 관련 인터페이스
export interface User {
    pid: number;
    userId: string;
    nickName: string;
    email: string;
    phoneNumber: string;
    experience: number;
    level: number;
    point: number;
    totalPost: number;
    totalComment: number;
    totalLike: number;
    consecutiveLogin: number;
    createdAt?: string;
    updatedAt?: string;
}

// 사용자 관련 API 함수들
export const getUsers = async (): Promise<User[]> => {
    const response = await axios.get(`${API_BASE_URL}/api/users`);
    const root: unknown = response.data;

    // 응답이 배열이든 여러 중첩 구조이든 안전하게 정규화
    const extractArray = (source: unknown): unknown[] => {
        if (Array.isArray(source)) return source;
        if (!source || typeof source !== "object") return [];
        const obj = source as Record<string, unknown>;

        const directArrayKeys = [
            "data",
            "users",
            "userList",
            "list",
            "items",
            "content",
            "result",
            "results",
        ];

        for (const key of directArrayKeys) {
            const value = obj[key];
            if (Array.isArray(value)) return value;
        }

        // 흔한 중첩: { success, data: { users | list | items | content } }
        if (obj["data"] && typeof obj["data"] === "object") {
            const nested = obj["data"] as Record<string, unknown>;
            for (const key of directArrayKeys) {
                const value = nested[key];
                if (Array.isArray(value)) return value;
            }
        }

        return [];
    };

    const raw = extractArray(root);

    const toNumber = (value: unknown, fallback = 0): number => {
        if (typeof value === "number") return value;
        if (
            typeof value === "string" &&
            value.trim() !== "" &&
            !isNaN(Number(value))
        ) {
            return Number(value);
        }
        return fallback;
    };

    const toString = (value: unknown, fallback = ""): string => {
        if (typeof value === "string") return value;
        if (typeof value === "number") return String(value);
        return fallback;
    };

    const coerceUser = (input: unknown): User => {
        const obj: Record<string, unknown> =
            input && typeof input === "object"
                ? (input as Record<string, unknown>)
                : {};

        const createdAtRaw =
            obj["createdAt"] ?? obj["created_at"] ?? obj["joinedAt"];
        const updatedAtRaw = obj["updatedAt"] ?? obj["updated_at"];

        return {
            pid: toNumber(obj["pid"] ?? obj["id"], 0),
            userId: toString(obj["userId"] ?? obj["id"], ""),
            nickName: toString(
                obj["nickName"] ?? obj["nickname"] ?? obj["name"],
                "",
            ),
            email: toString(obj["email"] ?? obj["userEmail"], ""),
            phoneNumber: toString(obj["phoneNumber"] ?? obj["phone"], ""),
            experience: toNumber(obj["experience"] ?? obj["exp"], 0),
            level: toNumber(obj["level"], 0),
            point: toNumber(obj["point"] ?? obj["points"], 0),
            totalPost: toNumber(obj["totalPost"] ?? obj["postCount"], 0),
            totalComment: toNumber(
                obj["totalComment"] ?? obj["commentCount"],
                0,
            ),
            totalLike: toNumber(obj["totalLike"] ?? obj["likeCount"], 0),
            consecutiveLogin: toNumber(
                obj["consecutiveLogin"] ?? obj["streak"],
                0,
            ),
            createdAt:
                typeof createdAtRaw === "string" ? createdAtRaw : undefined,
            updatedAt:
                typeof updatedAtRaw === "string" ? updatedAtRaw : undefined,
        };
    };

    const arrayData = Array.isArray(raw) ? raw : [];
    return arrayData.map(coerceUser);
};

export const deleteUser = async (pid: number): Promise<void> => {
    await axios.delete(`${API_BASE_URL}/api/users/${pid}`);
};

// 댓글 관련 API 함수들
export const createComment = async (
    comment: Omit<Comment, "id" | "createdAt" | "updatedAt">,
): Promise<Comment> => {
    const response = await axios.post<Comment>(
        `${API_BASE_URL}/api/comments`,
        comment,
    );
    return response.data;
};

export const getCommentsByPostId = async (
    postId: number,
): Promise<Comment[]> => {
    const response = await axios.get<Comment[]>(
        `${API_BASE_URL}/api/comments/post/${postId}`,
    );
    return response.data;
};

export const updateComment = async (
    id: number,
    comment: Pick<Comment, "content">,
): Promise<Comment> => {
    const response = await axios.put<Comment>(
        `${API_BASE_URL}/api/comments/${id}`,
        comment,
    );
    return response.data;
};

export const deleteComment = async (id: number): Promise<void> => {
    await axios.delete(`${API_BASE_URL}/api/comments/${id}`);
};

export const getCommentCountByPostId = async (
    postId: number,
): Promise<number> => {
    const response = await axios.get<number>(
        `${API_BASE_URL}/api/comments/post/${postId}/count`,
    );
    return response.data;
};
