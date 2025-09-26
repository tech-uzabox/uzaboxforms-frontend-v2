import { UtilsService } from "@/services/utils/utils.service";
import { unauthorizedAPI, authorizedAPI } from "@/config/axios.config";

const utils = new UtilsService();

export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface ChangePasswordDto {
  userId: string;
  currentPassword: string;
  newPassword: string;
}

export interface UpdateProfileDto {
  userId: string;
  firstName: string;
  lastName: string;
  photo?: string;
}

class AuthService {
  register(userData: RegisterDto) {
    return utils.handleApiRequest(() =>
      unauthorizedAPI.post("/auth/register", userData)
    );
  }

  login(userData: LoginDto) {
    return utils.handleApiRequest(() =>
      unauthorizedAPI.post("/auth/login", userData)
    );
  }

  logout() {
    return utils.handleApiRequest(() => authorizedAPI.post("/auth/logout"));
  }

  getProfile() {
    return utils.handleApiRequest(async () =>
      authorizedAPI.get("/auth/profile")
    );
  }

  sendOtp(email: string) {
    return utils.handleApiRequest(() =>
      unauthorizedAPI.post("/auth/request-password-reset", { email })
    );
  }

  verifyEmail({ email, OTP }: { email: string; OTP: string }) {
    return utils.handleApiRequest(() =>
      unauthorizedAPI.post("/auth/validate/email", { email, OTP })
    );
  }

  resetPassword({
    email,
    OTP,
    newPassword,
  }: {
    email: string;
    OTP: string;
    newPassword: string;
  }) {
    return utils.handleApiRequest(() =>
      unauthorizedAPI.post("/auth/reset/password", { email, OTP, newPassword })
    );
  }

  changePassword({ userId, currentPassword, newPassword }: ChangePasswordDto) {
    return utils.handleApiRequest(() =>
      authorizedAPI.post("/auth/change-password", {
        userId,
        currentPassword,
        newPassword,
      })
    );
  }

  updateProfile({ userId, firstName, lastName, photo }: UpdateProfileDto) {
    return utils.handleApiRequest(() =>
      authorizedAPI.put("/auth/profile", { userId, firstName, lastName, photo })
    );
  }

  uploadAvatar(file: File) {
    const formData = new FormData();
    formData.append("file", file);

    return utils.handleApiRequest(() =>
      authorizedAPI.post("/auth/upload-avatar", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
    );
  }

  // OTP endpoints
  generateOtp(email: string, type: string) {
    return utils.handleApiRequest(() =>
      unauthorizedAPI.post("/otp/generate", { email, type })
    );
  }

  validateOtp(email: string, otp: string, type: string) {
    return utils.handleApiRequest(() =>
      unauthorizedAPI.post("/otp/validate", { email, otp, type })
    );
  }

  // Google OAuth endpoints
  initiateGoogleLogin() {
    return utils.handleApiRequest(() =>
      unauthorizedAPI.get("/auth/google")
    );
  }

  handleGoogleCallback() {
    return utils.handleApiRequest(() =>
      unauthorizedAPI.get("/auth/google/callback")
    );
  }

  // Token refresh
  refreshToken() {
    return utils.handleApiRequest(() =>
      unauthorizedAPI.post("/auth/refresh-token")
    );
  }
}

export const authService = new AuthService();
