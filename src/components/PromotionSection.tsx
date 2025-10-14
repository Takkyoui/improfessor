'use client';

import { useState } from "react";
import { useUser } from "@/context/UserContext";
import useAuth from "@/hooks/useAuth";
import { useAlert } from "@/context/AlertContext";
import { AxiosError } from "axios";
import { ApiResponse } from "@/types/auth";

export default function PromotionSection() {
  const { user } = useUser();
  const { useUpdateUser } = useAuth();
  const updateUser = useUpdateUser();
  const { showAlert } = useAlert();

  const [inputReferral, setInputReferral] = useState("");

  if (!user) return null;

  const handleReferralSubmit = async () => {
    if (!inputReferral.trim()) {
      showAlert("추천인 코드를 입력해주세요.");
      return;
    }

    try {
      const updateData: {
        id: number;
        recommendNickname: string;
        university?: string;
        major?: string;
      } = {
        id: parseInt(user.userId),
        recommendNickname: inputReferral.trim()
      };

      // 기존 학교, 학과 값이 있으면 함께 전송
      if (user.university) {
        updateData.university = user.university;
      }
      if (user.major) {
        updateData.major = user.major;
      }

      await updateUser.mutateAsync(updateData);
      showAlert("추천인 코드가 입력되었습니다. 문제 생성 횟수가 1회 추가됩니다.");
      setInputReferral("");
    } catch (error) {
      console.error('추천인 코드 입력 실패:', error);
      if (error instanceof AxiosError && error.response?.data) {
        const errorResponse = error.response.data as ApiResponse<null>;
        showAlert(errorResponse.message);
      } else {
        showAlert("추천인 코드 입력에 실패했습니다. 다시 시도해주세요.");
      }
    }
  };

  return (
    <div className="mt-12 pt-8 border-t border-[#444444] space-y-6">
      <h2 className="text-xl font-semibold text-white">프로모션</h2>
      <p className="text-white">
        친구를 추천하여 최대 99회의 무료 생성 횟수를 받으세요!<br />
        친구가 내 추천인 코드를 입력하면 친구는 3회, 나는 3회의 무료 생성 횟수를 받습니다.<br />
        추천인 코드 입력은 1회만 가능하고, 추천받는 것은 최대 33회까지 가능합니다.
      </p>

      {/* 내 추천인 코드 */}
      <div className="flex p-5 justify-center items-center gap-8 rounded-[10px] border border-white">
        <span className="text-white font-pretendard text-lg font-normal leading-[140%]">내 추천인 코드</span>
        <span className="text-white font-pretendard text-[30px] font-semibold leading-[140%]">{user.nickname}</span>
      </div>

      {/* 추천인 코드 입력 */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-white">추천인 코드 입력</label>
        <div className="flex gap-2">
          <input
            type="text"
            value={inputReferral}
            onChange={(e) => setInputReferral(e.target.value)}
            placeholder="추천인 코드"
            className="w-full px-4 py-2 border border-[#444444] rounded focus:ring-2 focus:ring-[#666666] focus:border-transparent text-white"
          />
          <button
            type="button"
            onClick={handleReferralSubmit}
            disabled={updateUser.isPending || !inputReferral.trim()}
            className="px-4 py-2 border border-[#444444] text-white rounded hover:border-[#666666] transition whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {updateUser.isPending ? "처리 중..." : "입력"}
          </button>
        </div>
        <p className="text-xs text-white">문제 생성 횟수가 1회 추가됩니다. (1회만 가능)</p>
      </div>
    </div>
  );
}
