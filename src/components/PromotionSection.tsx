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
    <div className="mt-12 space-y-6">
      {/* 구분선 */}
      <hr className="w-full h-px bg-white/50" />
      <h2 className="text-white font-pretendard text-[20px] lg:text-[30px] font-semibold leading-[140%]">프로모션</h2>
      <p className="text-white font-pretendard text-xs lg:text-lg font-normal leading-[140%]">
        친구를 추천하여 최대 99회의 무료 생성 횟수를 받으세요!<br />
        친구가 내 추천인 코드를 입력하면 친구는 3회, 나는 3회의 무료 생성 횟수를 받습니다.<br />
        추천인 코드 입력은 1회만 가능하고, 추천받는 것은 최대 33회까지 가능합니다.
      </p>

      {/* 추천인 코드 섹션 - 반응형 배치 */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:gap-[40px] lg:self-stretch lg:justify-between">
        {/* 내 추천인 코드 */}
        <div className="inline-flex h-[50px] lg:h-[82px] px-5 lg:px-5 justify-center items-center gap-8 lg:gap-8 flex-shrink-0 w-[259px] lg:w-[315px] rounded-[6px] lg:rounded-[10px] border border-white">
          <span className="text-white font-pretendard text-base font-normal leading-[140%] lg:text-[18px]">내 추천인 코드</span>
          <span className="text-white font-pretendard text-[20px] font-semibold leading-[140%] lg:text-[30px]">{user.nickname}</span>
        </div>

        {/* 추천인 코드 입력 */}
        <div className="flex flex-col gap-2">
          <label className="text-white font-pretendard text-sm lg:text-lg font-normal leading-[140%]">추천인 코드 입력</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={inputReferral}
              onChange={(e) => setInputReferral(e.target.value)}
              placeholder="추천인 코드를 입력하세요"
              className="flex w-[200px] lg:w-[328px] h-[41px] px-[14px] py-2 items-center gap-2 flex-shrink-0 text-white rounded-[10px] border border-white/60 bg-white/30 focus:outline-none"
            />
            <button
              type="button"
              onClick={handleReferralSubmit}
              disabled={updateUser.isPending || !inputReferral.trim()}
              className="inline-flex h-[41px] px-4 lg:px-6 justify-center items-center flex-shrink-0 text-white rounded-[10px] bg-white/30 hover:bg-white/40 transition disabled:opacity-50 disabled:cursor-not-allowed text-sm lg:text-base"
            >
              {updateUser.isPending ? "처리 중..." : "입력"}
            </button>
          </div>
          <p className="text-white font-pretendard text-xs font-normal leading-[140%] text-right">문제 생성 횟수가 1회 추가됩니다. (1회만 가능)</p>
        </div>
      </div>
    </div>
  );
}
