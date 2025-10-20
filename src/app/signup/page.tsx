'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import useAuth from "@/hooks/useAuth";
import { useAlert } from "@/context/AlertContext";
import { AxiosError } from "axios";
import { ApiResponse } from "@/types/auth";
import UniversitySearchModal from "@/components/UniversitySearchModal";
import MajorSearchModal from "@/components/MajorSearchModal";
import CustomInput from "@/components/CustomInput";
import CustomInputMobile from "@/components/CustomInputMobile";

export default function SignupPage() {
  const router = useRouter();
  const { useSendVerificationEmail, useVerifyEmail, useRegister } = useAuth();
  const sendVerification = useSendVerificationEmail();
  const verifyEmail = useVerifyEmail();
  const register = useRegister();
  const { showAlert } = useAlert();

  const [formData, setFormData] = useState({
    email: "",
    verificationCode: "",
    nickname: "",
    password: "",
    confirmPassword: "",
    university: "",
    universityId: "",
    major: "",
    referralCode: "",
  });

  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [timer, setTimer] = useState<number | null>(null);
  const [canResend, setCanResend] = useState(true);
  const [passwordValidation, setPasswordValidation] = useState({
    isValid: false,
    hasMinLength: false,
    hasLetter: false,
    hasNumber: false,
    hasSpecialChar: false,
  });
  const [isUniversityModalOpen, setIsUniversityModalOpen] = useState(false);
  const [isMajorModalOpen, setIsMajorModalOpen] = useState(false);

  // 비밀번호 정규식 검증 함수
  const validatePassword = (password: string) => {
    const minLength = password.length >= 8;
    const hasLetter = /[a-zA-Z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    return {
      isValid: minLength && hasLetter && hasNumber && hasSpecialChar,
      hasMinLength: minLength,
      hasLetter,
      hasNumber,
      hasSpecialChar,
    };
  };

  useEffect(() => {
    if (timer === null) return;
    
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev === null || prev <= 0) {
          setCanResend(true);
          return null;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));

    // 비밀번호 입력 시 실시간 검증
    if (id === 'password') {
      setPasswordValidation(validatePassword(value));
    }
  };

  const handleUniversitySelect = (university: string, universityId: string) => {
    setFormData(prev => ({
      ...prev,
      university,
      universityId
    }));
  };

  const handleMajorSelect = (major: string) => {
    setFormData(prev => ({
      ...prev,
      major
    }));
  };

  const handleSendVerification = async () => {
    if (!formData.email) {
      showAlert("이메일을 입력해주세요.");
      return;
    }

    if (!canResend) {
      showAlert(`${Math.ceil(timer! / 60)}분 ${timer! % 60}초 후에 다시 시도해주세요.`);
      return;
    }

    try {
      await sendVerification.mutateAsync({ email: formData.email });
      setTimer(180);
      setCanResend(false);
      showAlert("인증 코드가 전송되었습니다. 이메일을 확인해주세요.");
    } catch (error) {
      console.error('인증 코드 전송 실패:', error);
      if (error instanceof AxiosError && error.response?.data) {
        const errorResponse = error.response.data as ApiResponse<null>;
        showAlert(errorResponse.message);
      } else {
        showAlert("인증 코드 전송에 실패했습니다. 다시 시도해주세요.");
      }
    }
  };

  const handleVerifyEmail = async () => {
    if (!formData.verificationCode) {
      showAlert("인증 코드를 입력해주세요.");
      return;
    }

    try {
      await verifyEmail.mutateAsync({
        email: formData.email,
        code: formData.verificationCode
      });
      setIsEmailVerified(true);
      showAlert("이메일이 인증되었습니다.");
    } catch (error) {
      console.error('이메일 인증 실패:', error);
      if (error instanceof AxiosError && error.response?.data) {
        const errorResponse = error.response.data as ApiResponse<null>;
        showAlert(errorResponse.message);
      } else {
        showAlert("이메일 인증에 실패했습니다. 다시 시도해주세요.");
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isEmailVerified) {
      showAlert("이메일 인증을 완료해주세요.");
      return;
    }

    if (!passwordValidation.isValid) {
      showAlert("비밀번호 조건을 만족하지 않습니다.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      showAlert("비밀번호가 일치하지 않습니다.");
      return;
    }

    try {
      await register.mutateAsync({
        email: formData.email,
        nickname: formData.nickname,
        password: formData.password,
        university: formData.university,
        major: formData.major,
        recommendNickname: formData.referralCode,
        freeCount: 5,
        recommendCount: formData.referralCode ? 1 : 0
      });
      showAlert("회원가입이 완료되었습니다.");
      router.push("/login");
    } catch (error) {
      console.error('회원가입 실패:', error);
      if (error instanceof AxiosError && error.response?.data) {
        const errorResponse = error.response.data as ApiResponse<null>;
        showAlert(errorResponse.message);
      } else {
        showAlert("회원가입에 실패했습니다. 다시 시도해주세요.");
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black z-50 overflow-y-auto">
      <div 
        className="absolute inset-0 w-full h-full"
        style={{
          backgroundImage: 'url("/background.gif")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      />
      <div className="flex items-center justify-center min-h-screen py-12 relative z-10">
        <div className="flex flex-col items-center text-center">
          <div className="relative w-full flex items-center justify-center mb-8">
            <Link 
              href="/"
              className="absolute left-[46px] lg:left-6 flex w-[40px] px-[11px] py-3 justify-center items-center gap-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors z-50"
            >
              <svg 
                className="w-4 h-4" 
                fill="none" 
                stroke="white" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </Link>
            <h1 className="text-white font-[Pretendard] text-[30px] lg:text-[40px] font-semibold leading-normal">회원가입</h1>
          </div>
          
          <form className="flex flex-col items-center gap-6 mb-8" onSubmit={handleSubmit}>
            {/* 모바일 버전 */}
            <div className="lg:hidden flex flex-col gap-6 w-full">
              <CustomInputMobile
                label="이메일"
                type="email"
                id="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="your@email.com"
                required
                button={{
                  text: sendVerification.isPending ? "전송 중..." : "인증번호 전송",
                  onClick: handleSendVerification,
                  disabled: isEmailVerified || sendVerification.isPending
                }}
              />

              <CustomInputMobile
                label="인증번호"
                type="text"
                id="verificationCode"
                value={formData.verificationCode}
                onChange={handleChange}
                placeholder="인증번호"
                required
                button={{
                  text: verifyEmail.isPending ? "확인 중..." : "확인",
                  onClick: handleVerifyEmail,
                  disabled: isEmailVerified || verifyEmail.isPending
                }}
              />

              <CustomInputMobile
                label="닉네임"
                type="text"
                id="nickname"
                value={formData.nickname}
                onChange={handleChange}
                placeholder="닉네임을 입력해주세요"
                required
              />
            </div>
            
            {/* PC 버전 */}
            <div className="hidden lg:flex flex-col items-center gap-6">
              <CustomInput
                label="이메일"
                type="email"
                id="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="your@email.com"
                required
                button={{
                  text: sendVerification.isPending ? "전송 중..." : "인증번호 전송",
                  onClick: handleSendVerification,
                  disabled: isEmailVerified || sendVerification.isPending
                }}
              />

              <CustomInput
                label="인증번호"
                type="text"
                id="verificationCode"
                value={formData.verificationCode}
                onChange={handleChange}
                placeholder="인증번호"
                required
                button={{
                  text: verifyEmail.isPending ? "확인 중..." : "확인",
                  onClick: handleVerifyEmail,
                  disabled: isEmailVerified || verifyEmail.isPending
                }}
              />

              <CustomInput
                label="닉네임"
                type="text"
                id="nickname"
                value={formData.nickname}
                onChange={handleChange}
                placeholder="닉네임을 입력해주세요"
                required
              />
            </div>
            
            {/* 비밀번호 필드들 - 모바일 버전 */}
            <div className="lg:hidden flex flex-col gap-6 w-full">
              <CustomInputMobile
                label="비밀번호"
                type="password"
                id="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="비밀번호를 입력해주세요"
                required
              />

              <CustomInputMobile
                label="비밀번호 확인"
                type="password"
                id="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="비밀번호를 다시 입력해주세요"
                required
              />
            </div>
            
            {/* 비밀번호 필드들 - PC 버전 */}
            <div className="hidden lg:flex flex-col items-center gap-6">
              <CustomInput
                label="비밀번호"
                type="password"
                id="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="비밀번호를 입력해주세요"
                required
              />

              <CustomInput
                label="비밀번호 확인"
                type="password"
                id="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="비밀번호를 다시 입력해주세요"
                required
              />
            </div>

            {/* 비밀번호 검증 표시 */}
            {formData.password && (
              <div className="flex flex-col items-start gap-2 mt-4 w-[300px] lg:w-[328px]">
                <div className={`text-xs flex items-center gap-1 ${passwordValidation.hasMinLength ? 'text-green-400' : 'text-red-400'}`}>
                  <span>{passwordValidation.hasMinLength ? '✓' : '✗'}</span>
                  최소 8자 이상
                </div>
                <div className={`text-xs flex items-center gap-1 ${passwordValidation.hasLetter ? 'text-green-400' : 'text-red-400'}`}>
                  <span>{passwordValidation.hasLetter ? '✓' : '✗'}</span>
                  영문 포함
                </div>
                <div className={`text-xs flex items-center gap-1 ${passwordValidation.hasNumber ? 'text-green-400' : 'text-red-400'}`}>
                  <span>{passwordValidation.hasNumber ? '✓' : '✗'}</span>
                  숫자 포함
                </div>
                <div className={`text-xs flex items-center gap-1 ${passwordValidation.hasSpecialChar ? 'text-green-400' : 'text-red-400'}`}>
                  <span>{passwordValidation.hasSpecialChar ? '✓' : '✗'}</span>
                  특수문자 포함
                </div>
              </div>
            )}

            {/* 나머지 필드들 - 모바일 버전 */}
            <div className="lg:hidden flex flex-col gap-6 w-full">
              <CustomInputMobile
                label="대학교"
                type="text"
                id="university"
                value={formData.university}
                onChange={handleChange}
                placeholder="대학교를 입력해주세요"
                button={{
                  text: "검색",
                  onClick: () => setIsUniversityModalOpen(true),
                  disabled: false
                }}
              />

              <CustomInputMobile
                label="학과"
                type="text"
                id="major"
                value={formData.major}
                onChange={handleChange}
                placeholder="학과를 입력해주세요"
                button={{
                  text: "검색",
                  onClick: () => setIsMajorModalOpen(true),
                  disabled: !formData.universityId
                }}
              />

              <CustomInputMobile
                label="추천인 코드"
                type="text"
                id="referralCode"
                value={formData.referralCode}
                onChange={handleChange}
                placeholder="추천인 코드를 입력해주세요"
              />
            </div>
            
            {/* 나머지 필드들 - PC 버전 */}
            <div className="hidden lg:flex flex-col items-center gap-6">
              <CustomInput
                label="대학교"
                type="text"
                id="university"
                value={formData.university}
                onChange={handleChange}
                placeholder="대학교를 입력해주세요"
                button={{
                  text: "검색",
                  onClick: () => setIsUniversityModalOpen(true),
                  disabled: false
                }}
              />

              <CustomInput
                label="학과"
                type="text"
                id="major"
                value={formData.major}
                onChange={handleChange}
                placeholder="학과를 입력해주세요"
                button={{
                  text: "검색",
                  onClick: () => setIsMajorModalOpen(true),
                  disabled: !formData.universityId
                }}
              />

              <CustomInput
                label="추천인 코드"
                type="text"
                id="referralCode"
                value={formData.referralCode}
                onChange={handleChange}
                placeholder="추천인 코드를 입력해주세요"
              />
            </div>

            <div className="mt-[50px] lg:mt-6">
              <button
              type="submit"
              disabled={!isEmailVerified || register.isPending}
              className="flex w-[300px] lg:w-[328px] h-[40px] lg:h-[41px] px-[24.957px] justify-center items-center flex-shrink-0 rounded-[8px] lg:rounded-[10px] bg-black shadow-[0_0_10px_0_rgba(255,255,255,0.70)] text-white font-[Pretendard] text-base font-semibold leading-[140%] hover:bg-black/90 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {register.isPending ? "처리 중..." : "회원가입"}
              </button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <p className="text-white">
              이미 계정이 있으신가요?{" "}
              <Link href="/login" className="text-white underline hover:text-white/80 transition">
                로그인
              </Link>
            </p>
          </div>
        </div>
      </div>

      <UniversitySearchModal
        isOpen={isUniversityModalOpen}
        onClose={() => setIsUniversityModalOpen(false)}
        onSelect={handleUniversitySelect}
      />
      
      <MajorSearchModal
        isOpen={isMajorModalOpen}
        onClose={() => setIsMajorModalOpen(false)}
        onSelect={handleMajorSelect}
        selectedUniversity={formData.university}
        selectedUniversityId={formData.universityId}
      />
    </div>
  );
} 