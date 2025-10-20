'use client';

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import useAuth from "@/hooks/useAuth";
import { useAlert } from "@/context/AlertContext";
import { AxiosError } from "axios";
import { ApiResponse } from "@/types/auth";
import CustomInput from "@/components/CustomInput";
import CustomInputMobile from "@/components/CustomInputMobile";

export default function LoginPage() {
  const router = useRouter();
  const { useLogin } = useAuth();
  const login = useLogin();
  const { showAlert } = useAlert();
  const [kakaoUrl, setKakaoUrl] = useState<string>("https://api.improfessor.kro.kr/oauth2/authorization/kakao");

  // 로컬 개발환경에서 리다이렉트 URI를 localhost로 설정
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
      if (isLocal) {
        const url = new URL('https://api.improfessor.kro.kr/oauth2/authorization/kakao');
        url.searchParams.set('redirect_uri', 'http://localhost:5173/generate');
        setKakaoUrl(url.toString());
      }
    }
  }, []);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await login.mutateAsync({
        email: formData.email,
        password: formData.password,
      });
      router.push("/generate");
    } catch (error) {
      console.error('로그인 실패:', error);
      if (error instanceof AxiosError && error.response?.data) {
        const errorResponse = error.response.data as ApiResponse<null>;
        showAlert(errorResponse.message);
      } else {
        showAlert("로그인에 실패했습니다. 다시 시도해주세요.");
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black z-50">
      <div 
        className="absolute inset-0 w-full h-full"
        style={{
          backgroundImage: 'url("/background.gif")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      />
      <div className="flex items-center justify-center min-h-screen relative z-10">
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
            <h1 className="text-white font-[Pretendard] text-[30px] lg:text-[40px] font-semibold leading-normal">로그인</h1>
          </div>

          {/* 이메일/비밀번호 입력 */}
          <form className="flex flex-col items-center gap-6 mb-8" onSubmit={handleSubmit}>
            {/* 모바일 버전 */}
            <div className="lg:hidden flex flex-col gap-6 w-full">
              <CustomInputMobile
                label="ID"
                type="email"
                id="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="아이디를 입력하세요"
                required
              />
              <CustomInputMobile
                label="PW"
                type="password"
                id="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="비밀번호를 입력하세요"
                required
              />
            </div>
            
            {/* PC 버전 */}
            <div className="hidden lg:flex flex-col items-center gap-6">
              <CustomInput
                label="ID"
                type="email"
                id="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="아이디를 입력하세요"
                required
              />
              <CustomInput
                label="PW"
                type="password"
                id="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="비밀번호를 입력하세요"
                required
              />
            </div>
            <button
              type="submit"
              disabled={login.isPending}
              className="flex w-[300px] lg:w-[328px] h-[40px] lg:h-[41px] px-[24.957px] justify-center items-center flex-shrink-0 rounded-[8px] lg:rounded-[10px] bg-black shadow-[0_0_10px_0_rgba(255,255,255,0.70)] text-white font-[Pretendard] text-base font-semibold leading-[140%] hover:bg-black/90 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {login.isPending ? "로그인 중..." : "로그인"}
            </button>
          </form>

          {/* 구분선 */}
          <div className="flex items-center gap-4 mb-6">
            <div className="w-[100px] h-px bg-white/30"></div>
            <span className="text-white text-sm">or</span>
            <div className="w-[100px] h-px bg-white/30"></div>
          </div>

          {/* 카카오 로그인 */}
          <div className="mb-8">
            <a
              href={kakaoUrl}
              className="flex w-[300px] h-[41px] px-10 justify-center items-center gap-3 flex-shrink-0 rounded-[10px] bg-[#FEE500] hover:brightness-95 transition"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="21" height="21" viewBox="0 0 21 21" fill="none">
                <g clipPath="url(#clip0_206_288)">
                  <path fillRule="evenodd" clipRule="evenodd" d="M10.7383 1.29333C5.21516 1.29333 0.738281 4.75219 0.738281 9.01812C0.738281 11.6712 2.46985 14.01 5.10666 15.4011L3.99721 19.454C3.89919 19.8121 4.30876 20.0975 4.62326 19.89L9.48648 16.6803C9.89688 16.7199 10.314 16.743 10.7383 16.743C16.2611 16.743 20.7383 13.2843 20.7383 9.01812C20.7383 4.75219 16.2611 1.29333 10.7383 1.29333Z" fill="black"/>
                </g>
                <defs>
                  <clipPath id="clip0_206_288">
                    <rect width="20" height="20.0001" fill="white" transform="translate(0.738281 0.626648)"/>
                  </clipPath>
                </defs>
              </svg>
              <span className="text-[rgba(0,0,0,0.85)] font-['Apple_SD_Gothic_Neo'] text-base font-semibold leading-[150%]">
                카카오 로그인
              </span>
            </a>
          </div>

          {/* 회원가입 링크 */}
          <div>
            <Link href="/signup" className="text-white underline hover:text-white/80 transition">
              이메일로 회원가입
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 