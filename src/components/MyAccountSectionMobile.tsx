'use client';

import { useState } from "react";
import { useUser } from "@/context/UserContext";
import useAuth from "@/hooks/useAuth";
import { useAlert } from "@/context/AlertContext";
import { AxiosError } from "axios";
import { ApiResponse } from "@/types/auth";
import UniversitySearchModal from "@/components/UniversitySearchModal";
import MajorSearchModal from "@/components/MajorSearchModal";

export default function MyAccountSectionMobile() {
  const { user } = useUser();
  const { useUpdateUser } = useAuth();
  const updateUser = useUpdateUser();
  const { showAlert } = useAlert();

  // 로컬 상태 (수정 가능한 필드들)
  const [university, setUniversity] = useState<string | null>(null);
  const [universityId, setUniversityId] = useState<string | null>(null);
  const [major, setMajor] = useState<string | null>(null);
  const [isUniversityModalOpen, setIsUniversityModalOpen] = useState(false);
  const [isMajorModalOpen, setIsMajorModalOpen] = useState(false);

  if (!user) return null;

  // 사용자 정보가 로드되면 로컬 상태 업데이트 (초기화 시에만)
  const displayUniversity = university !== null ? university : (user.university || "");
  const displayMajor = major !== null ? major : (user.major || "");

  // 변경사항이 있는지 확인
  const hasChanges = () => {
    const universityChanged = university !== null && university !== (user.university || "");
    const majorChanged = major !== null && major !== (user.major || "");
    
    return universityChanged || majorChanged;
  };

  const handleUpdateUser = async () => {
    try {
      const updateData: {
        id: number;
        university?: string | null;
        major?: string | null;
        recommendNickname?: string;
      } = {
        id: parseInt(user.userId)
      };
      
      // 대학교 처리: 수정된 값이 있으면 수정값, 없으면 기존값 유지
      if (university !== null) {
        updateData.university = university;
      } else if (user.university) {
        updateData.university = user.university;
      }
      
      // 학과 처리: 수정된 값이 있으면 수정값, 없으면 기존값 유지
      if (major !== null) {
        updateData.major = major;
      } else if (user.major) {
        updateData.major = user.major;
      }

      await updateUser.mutateAsync(updateData);
      showAlert("계정 정보가 수정되었습니다.");
      // 수정 후 로컬 상태 초기화
      setUniversity(null);
      setMajor(null);
    } catch (error) {
      console.error('계정 수정 실패:', error);
      if (error instanceof AxiosError && error.response?.data) {
        const errorResponse = error.response.data as ApiResponse<null>;
        showAlert(errorResponse.message);
      } else {
        showAlert("계정 수정에 실패했습니다. 다시 시도해주세요.");
      }
    }
  };

  const handleUniversitySelect = (university: string, universityId: string) => {
    setUniversity(university);
    setUniversityId(universityId);
  };

  const handleMajorSelect = (major: string) => {
    setMajor(major);
  };

  return (
    <>
      <div className="flex flex-col items-start gap-12 self-stretch w-full">
        <h1 className="text-white font-pretendard text-xl font-semibold leading-[140%]">내 계정</h1>

        {/* 사용자 정보 섹션 - 모바일 */}
        <div className="flex w-full pl-5 flex-col justify-center items-start gap-6">
          {/* 사용자 정보들 - 모바일 */}
          <div className="flex flex-col justify-center items-start gap-5 self-stretch">
            {/* 사용자 이메일 */}
            <div className="flex flex-col gap-5 w-full">
              <label className="text-sm font-medium text-white whitespace-nowrap">사용자 이메일</label>
              <input
                type="email"
                value={user.email}
                disabled
                className="flex w-full h-[41px] px-[14px] py-2 items-center gap-2 text-white rounded-[10px] border border-white/60 bg-white/30 focus:outline-none cursor-not-allowed"
              />
            </div>

            {/* 사용자 닉네임 */}
            <div className="flex flex-col gap-5 w-full">
              <label className="text-sm font-medium text-white whitespace-nowrap">사용자 닉네임</label>
              <input
                type="text"
                value={user.nickname}
                disabled
                className="flex w-full h-[41px] px-[14px] py-2 items-center gap-2 text-white rounded-[10px] border border-white/60 bg-white/30 focus:outline-none cursor-not-allowed"
              />
            </div>

            {/* 대학교 */}
            <div className="flex flex-col gap-5 w-full">
              <label className="text-sm font-medium text-white whitespace-nowrap">대학교</label>
              <div className="flex gap-2 w-full">
                <input
                  type="text"
                  value={displayUniversity}
                  onChange={(e) => setUniversity(e.target.value)}
                  placeholder="대학교를 입력해주세요"
                  className="flex flex-1 h-[41px] px-[14px] py-2 items-center gap-2 text-white rounded-[10px] border border-white/60 bg-white/30 focus:outline-none"
                  readOnly
                />
                <button
                  type="button"
                  onClick={() => setIsUniversityModalOpen(true)}
                  className="flex h-[41px] px-4 justify-center items-center text-white rounded-[10px] bg-white/30 hover:bg-white/40 transition whitespace-nowrap text-sm flex-shrink-0"
                >
                  검색
                </button>
              </div>
            </div>

            {/* 학과 */}
            <div className="flex flex-col gap-5 w-full">
              <label className="text-sm font-medium text-white whitespace-nowrap">학과</label>
              <div className="flex gap-2 w-full">
                <input
                  type="text"
                  value={displayMajor}
                  onChange={(e) => setMajor(e.target.value)}
                  placeholder="학과를 입력해주세요"
                  className="flex flex-1 h-[41px] px-[14px] py-2 items-center gap-2 text-white rounded-[10px] border border-white/60 bg-white/30 focus:outline-none"
                  readOnly
                />
                <button
                  type="button"
                  onClick={() => setIsMajorModalOpen(true)}
                  disabled={!universityId}
                  className="flex h-[41px] px-4 justify-center items-center text-white rounded-[10px] bg-white/30 hover:bg-white/40 transition whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed text-sm flex-shrink-0"
                >
                  검색
                </button>
              </div>
            </div>
          </div>

          {/* 수정하기 버튼 */}
          <div className="flex flex-col items-start gap-5 w-full">
            <button
              type="button"
              onClick={handleUpdateUser}
              disabled={updateUser.isPending || !hasChanges()}
              className="flex w-full h-[41px] px-[24.957px] justify-center items-center flex-shrink-0 text-white rounded-[10px] bg-[rgba(72,86,105,0.80)] shadow-[0_0_4px_0_rgba(255,255,255,0.50)] hover:bg-[rgba(72,86,105,0.90)] transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {updateUser.isPending ? "수정 중..." : "수정하기"}
            </button>
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
        selectedUniversity={displayUniversity}
        selectedUniversityId={universityId || ""}
      />
    </>
  );
}
