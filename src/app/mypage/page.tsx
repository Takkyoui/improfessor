'use client';

import Header from "@/components/Header";
import { useUser } from "@/context/UserContext";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import useAuth from "@/hooks/useAuth";
import { useAlert } from "@/context/AlertContext";
import { AxiosError } from "axios";
import { ApiResponse } from "@/types/auth";
import MyAccountSection from "@/components/MyAccountSection";
import PromotionSection from "@/components/PromotionSection";

export default function MyPage() {
  const router = useRouter();
  const { user, isLoading, error, isAuthenticated } = useUser();
  const { useDeleteUser } = useAuth();
  const deleteUser = useDeleteUser();
  const { showAlert, showConfirm } = useAlert();

  // 인증되지 않은 경우 로그인 페이지로 리다이렉트
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return null;
  }

  // 로딩 중일 때
  if (isLoading) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="max-w-xl mx-auto px-4 sm:px-6 lg:px-0 py-12">
          <div className="text-center text-white">로딩 중...</div>
        </main>
      </div>
    );
  }

  // 에러가 있을 때
  if (error) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="max-w-xl mx-auto px-4 sm:px-6 lg:px-0 py-12">
          <div className="text-center text-red-400">사용자 정보를 불러오는데 실패했습니다.</div>
        </main>
      </div>
    );
  }

  // 사용자 정보가 없을 때
  if (!user) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="max-w-xl mx-auto px-4 sm:px-6 lg:px-0 py-12">
          <div className="text-center text-white">사용자 정보를 찾을 수 없습니다.</div>
        </main>
      </div>
    );
  }

  const handleDeleteUser = () => {
    showConfirm(
      '계정을 삭제하시겠습니까?',
      '현재 해당 서비스는 초기 베타 버전으로 올해 10월 정식 서비스 런칭이 예정되어 있습니다.\n\n모든 데이터는 계정 삭제 후 30일 안에 영구적으로 삭제됩니다.',
      async () => {
      try {
        await deleteUser.mutateAsync(user.userId);
        showAlert("계정이 삭제되었습니다.");
        router.push("/");
      } catch (error) {
        console.error('계정 탈퇴 실패:', error);
        if (error instanceof AxiosError && error.response?.data) {
          const errorResponse = error.response.data as ApiResponse<null>;
          showAlert(errorResponse.message);
        } else {
          showAlert("계정 탈퇴에 실패했습니다. 다시 시도해주세요.");
        }
      }
    });
  };

  return (
    <div className="min-h-screen">
      <Header />

      <main className="max-w-xl mx-auto px-4 sm:px-6 lg:px-0 py-12">
        {/* 내 계정 섹션 */}
        <MyAccountSection />

        {/* 프로모션 섹션 */}
        <PromotionSection />

        {/* 계정 탈퇴 */}
        <button
          type="button"
          onClick={handleDeleteUser}
          disabled={deleteUser.isPending}
          className="flex w-[300px] lg:w-[328px] h-[41px] px-[24.957px] justify-center items-center flex-shrink-0 text-white font-pretendard text-base font-semibold leading-[150%] rounded-[10px] bg-black shadow-[0_0_10px_0_rgba(255,255,255,0.70)] hover:bg-gray-800 transition disabled:opacity-50 disabled:cursor-not-allowed mt-12"
        >
          {deleteUser.isPending ? "처리 중..." : "계정 탈퇴"}
        </button>
      </main>
    </div>
  );
} 