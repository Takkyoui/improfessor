'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import useAuth from '@/hooks/useAuth';
import { useUser } from '@/context/UserContext';

export default function Header() {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const router = useRouter();
  const { useLogout } = useAuth();
  const logoutMutation = useLogout();
  const { user, isLoading: userLoading, isAuthenticated } = useUser();

  // 디버깅: 로그인 상태 확인
  useEffect(() => {
    console.log('[Header] Auth state:', { isAuthenticated, user, userLoading });
  }, [isAuthenticated, user, userLoading]);

  // 초기 토큰 설정
  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
      // axiosInstance의 Authorization 헤더 설정은 lib/axios.ts에서 처리
    }
  }, []);

  const handleLogout = async () => {
    try {
      await logoutMutation.mutateAsync();
      setIsProfileOpen(false);
      router.push('/');
    } catch (error) {
      console.error('로그아웃 실패:', error);
      // 에러가 발생해도 로컬 토큰은 제거
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      setIsProfileOpen(false);
      router.push('/');
    }
  };

  return (
    <header 
      className="flex max-w-[1200px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-[50px] py-3 sm:py-4 md:py-5 lg:py-6 xl:py-[20px] justify-between items-center self-stretch rounded-[99px] border-b border-white/40 bg-[rgba(50,116,239,0.04)] shadow-[0_0_10px_0_rgba(0,0,0,0.25)]"
    >
        <div className="flex items-center">
          <Link 
            href="/generate" 
            className="text-white text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-[26px] font-bold leading-[140%] font-[Pretendard]"
            style={{ textShadow: '0 0 10px rgba(255, 255, 255, 0.70)' }}
          >
            내가 교수님
          </Link>
        </div>

        <div className="flex items-center space-x-4">
          {/* 공지사항 버튼 */}
          <Link
            href="/notice"
            className="text-white hover:opacity-70 transition-opacity"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
              <mask id="mask0_227_52" maskUnits="userSpaceOnUse" x="0" y="0" width="24" height="24" style={{maskType:'alpha'}}>
                <rect width="24" height="24" fill="#D9D9D9"/>
              </mask>
              <g mask="url(#mask0_227_52)">
                <path d="M4 19V17H6V10C6 8.61667 6.41667 7.3875 7.25 6.3125C8.08333 5.2375 9.16667 4.53333 10.5 4.2V3.5C10.5 3.08333 10.6458 2.72917 10.9375 2.4375C11.2292 2.14583 11.5833 2 12 2C12.4167 2 12.7708 2.14583 13.0625 2.4375C13.3542 2.72917 13.5 3.08333 13.5 3.5V4.2C14.8333 4.53333 15.9167 5.2375 16.75 6.3125C17.5833 7.3875 18 8.61667 18 10V17H20V19H4ZM12 22C11.45 22 10.9792 21.8042 10.5875 21.4125C10.1958 21.0208 10 20.55 10 20H14C14 20.55 13.8042 21.0208 13.4125 21.4125C13.0208 21.8042 12.55 22 12 22ZM8 17H16V10C16 8.9 15.6083 7.95833 14.825 7.175C14.0417 6.39167 13.1 6 12 6C10.9 6 9.95833 6.39167 9.175 7.175C8.39167 7.95833 8 8.9 8 10V17Z" fill="white"/>
              </g>
            </svg>
          </Link>

          {/* 로그인 상태에 따른 UI */}
          {isAuthenticated ? (
            /* 프로필 드롭다운 */
            <div className="relative">
              <button
                className="flex items-center text-white hover:opacity-70 transition-opacity"
                onClick={() => setIsProfileOpen(!isProfileOpen)}
              >
                <div className="flex items-center space-x-2">
                  {user ? (
                    <span className="text-white text-sm sm:text-base font-normal leading-[140%] font-[Pretendard]">
                      {user.nickname}
                    </span>
                  ) : userLoading ? (
                    <span className="text-white text-sm sm:text-base font-normal leading-[140%] font-[Pretendard]">
                      로딩 중...
                    </span>
                  ) : (
                    <span className="text-white text-sm sm:text-base font-normal leading-[140%] font-[Pretendard]">
                      사용자
                    </span>
                  )}
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <mask id="mask0_227_59" maskUnits="userSpaceOnUse" x="0" y="0" width="24" height="24" style={{maskType:'alpha'}}>
                      <rect width="24" height="24" fill="#D9D9D9"/>
                    </mask>
                    <g mask="url(#mask0_227_59)">
                      <path d="M12 12C13.35 12 14.7583 11.8625 16.225 11.5875C17.6917 11.3125 18.95 10.95 20 10.5V20.5C19 20.95 17.7833 21.3125 16.35 21.5875C14.9167 21.8625 13.4667 22 12 22C10.5333 22 9.08333 21.8625 7.65 21.5875C6.21667 21.3125 5 20.95 4 20.5V10.5C5.05 10.95 6.30833 11.3125 7.775 11.5875C9.24167 11.8625 10.65 12 12 12ZM18 19V13.25C17.1667 13.4833 16.2042 13.6667 15.1125 13.8C14.0208 13.9333 12.9833 14 12 14C11.0167 14 9.97917 13.9333 8.8875 13.8C7.79583 13.6667 6.83333 13.4833 6 13.25V19C6.83333 19.3 7.79167 19.5417 8.875 19.725C9.95833 19.9083 11 20 12 20C13 20 14.0417 19.9083 15.125 19.725C16.2083 19.5417 17.1667 19.3 18 19ZM12 2C13.1 2 14.0417 2.39167 14.825 3.175C15.6083 3.95833 16 4.9 16 6C16 7.1 15.6083 8.04167 14.825 8.825C14.0417 9.60833 13.1 10 12 10C10.9 10 9.95833 9.60833 9.175 8.825C8.39167 8.04167 8 7.1 8 6C8 4.9 8.39167 3.95833 9.175 3.175C9.95833 2.39167 10.9 2 12 2ZM12 8C12.55 8 13.0208 7.80417 13.4125 7.4125C13.8042 7.02083 14 6.55 14 6C14 5.45 13.8042 4.97917 13.4125 4.5875C13.0208 4.19583 12.55 4 12 4C11.45 4 10.9792 4.19583 10.5875 4.5875C10.1958 4.97917 10 5.45 10 6C10 6.55 10.1958 7.02083 10.5875 7.4125C10.9792 7.80417 11.45 8 12 8Z" fill="white"/>
                    </g>
                  </svg>
                </div>
              </button>

              {/* 드롭다운 메뉴 */}
              {isProfileOpen && (
                <div className="absolute right-0 mt-2 bg-white rounded-md shadow-lg border border-[#BCCCDC] inline-flex py-[10px] flex-col justify-center items-center">
                  {user && (
                    <div className="border-b border-[#BCCCDC] flex w-[200px] px-[20px] py-[10px] flex-col justify-center items-start">
                      <div className="font-medium text-gray-500 text-xs">{user.email}</div>
                      <div className="text-gray-500 text-xs">무료 생성: {user.freeCount}회</div>
                    </div>
                  )}
                  <Link
                    href="/mypage"
                    className="block w-full flex p-[20px] items-center gap-[8px] self-stretch text-white text-lg font-semibold leading-[140%] font-[Pretendard]"
                    onClick={() => setIsProfileOpen(false)}
                  >
                    마이페이지
                  </Link>
                  <button
                    className="block w-full text-left disabled:opacity-50 flex p-[20px] items-center gap-[8px] self-stretch text-white text-lg font-semibold leading-[140%] font-[Pretendard]"
                    onClick={handleLogout}
                    disabled={logoutMutation.isPending}
                  >
                    {logoutMutation.isPending ? '로그아웃 중...' : '로그아웃'}
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* 로그인/회원가입 버튼 */
            <div className="flex items-center space-x-2">
              <Link
                href="/login"
                className="text-white hover:opacity-70 transition-opacity text-sm sm:text-base font-normal leading-[140%] font-[Pretendard]"
              >
                로그인
              </Link>
              <span className="text-white opacity-50">|</span>
              <Link
                href="/signup"
                className="text-white hover:opacity-70 transition-opacity text-sm sm:text-base font-normal leading-[140%] font-[Pretendard]"
              >
                회원가입
              </Link>
            </div>
          )}
        </div>
    </header>
  );
}