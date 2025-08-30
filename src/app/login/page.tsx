'use client';

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import useAuth from "@/hooks/useAuth";
import { useAlert } from "@/context/AlertContext";
import { AxiosError } from "axios";
import { ApiResponse } from "@/types/auth";

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
    <div className="min-h-screen bg-gradient-to-b from-[#D9EAFD] to-[#F8FAFC] relative">
      <div 
        className="absolute inset-0 w-full h-full"
        style={{
          backgroundImage: 'url("/background.gif")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          opacity: '0.3',
        }}
      />
      <Link 
        href="/"
        className="absolute top-6 left-6 text-black hover:text-[#BCCCDC] transition-colors z-50"
      >
        <svg 
          className="w-6 h-6" 
          fill="none" 
          stroke="currentColor" 
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
      
      <div className="flex items-center justify-center min-h-screen relative z-10">
        <div className="bg-white p-8 shadow-lg w-full max-w-md rounded-lg">
          <h1 className="text-4xl font-bold text-center text-black mb-8">로그인</h1>

          {/* 이메일/비밀번호 입력 */}
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white border border-[#BCCCDC] rounded-lg focus:ring-2 focus:ring-[#D9EAFD] focus:border-transparent text-black placeholder-black/50"
                placeholder="이메일 입력"
                required
              />
            </div>
            <div>
              <input
                type="password"
                id="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white border border-[#BCCCDC] rounded-lg focus:ring-2 focus:ring-[#D9EAFD] focus:border-transparent text-black placeholder-black/50"
                placeholder="비밀번호 입력"
                required
              />
            </div>
            <button
              type="submit"
              disabled={login.isPending}
              className="w-full bg-black text-white py-3 rounded-lg hover:bg-black/90 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {login.isPending ? "로그인 중..." : "로그인"}
            </button>
          </form>

          {/* 카카오로 계속하기 */}
          <div className="mt-4">
            <a
              href={kakaoUrl}
              className="block w-full py-3 rounded-lg text-center font-medium bg-[#FEE500] text-black hover:brightness-95 transition"
            >
              카카오톡으로 계속하기
            </a>
          </div>

          {/* 회원가입 링크 */}
          <div className="mt-6 text-center">
            <Link href="/signup" className="text-black/70 hover:text-black transition">
              이메일로 회원가입
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 