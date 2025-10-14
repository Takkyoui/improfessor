'use client';

import { useState } from 'react';
import { useAlert } from '@/context/AlertContext';

interface Major {
  korMjrNm: string;
  kediMjrId: string;
  clgNm: string;
  pbnfDgriCrseDivNm: string;
  lsnTrmNm: string;
}

interface MajorSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (major: string) => void;
  selectedUniversity: string;
  selectedUniversityId: string;
}

export default function MajorSearchModal({ 
  isOpen, 
  onClose, 
  onSelect,
  selectedUniversity,
  selectedUniversityId
}: MajorSearchModalProps) {
  const { showAlert } = useAlert();
  const [searchKeyword, setSearchKeyword] = useState('');
  const [majors, setMajors] = useState<Major[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);

  // 학과 검색
  const searchMajors = async (keyword: string = '', page: number = 1) => {
    if (!selectedUniversityId) {
      setMajors([]);
      setTotalCount(0);
      return;
    }

    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        type: 'major',
        universityId: selectedUniversityId,
        page: page.toString()
      });

      const response = await fetch(`/api/university?${params}`);
      const xmlText = await response.text();
      
      // XML을 파싱하여 학과 목록 추출
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlText, 'text/xml');
      
      // 에러 체크
      const resultCode = xmlDoc.querySelector('resultCode')?.textContent;
      const resultMsg = xmlDoc.querySelector('resultMsg')?.textContent;
      
      if (resultCode === '99') {
        throw new Error(`API 에러: ${resultMsg}`);
      }
      
      const items = xmlDoc.querySelectorAll('item');
      const majorList: Major[] = [];
      
      items.forEach((item) => {
        const korMjrNm = item.querySelector('korMjrNm')?.textContent || '';
        const kediMjrId = item.querySelector('kediMjrId')?.textContent || '';
        const clgNm = item.querySelector('clgNm')?.textContent || '';
        const pbnfDgriCrseDivNm = item.querySelector('pbnfDgriCrseDivNm')?.textContent || '';
        const lsnTrmNm = item.querySelector('lsnTrmNm')?.textContent || '';
        
        // 검색어가 있으면 필터링
        if (!keyword || korMjrNm.toLowerCase().includes(keyword.toLowerCase())) {
          majorList.push({
            korMjrNm,
            kediMjrId,
            clgNm,
            pbnfDgriCrseDivNm,
            lsnTrmNm
          });
        }
      });

      setMajors(majorList);
      setTotalCount(majorList.length);
    } catch (error) {
      console.error('학과 검색 실패:', error);
      showAlert('학과 검색에 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  // 학과 선택
  const handleMajorSelect = (major: Major) => {
    onSelect(major.korMjrNm);
    onClose();
  };

  // 검색 실행
  const handleSearch = () => {
    searchMajors(searchKeyword, 1);
  };

  // 모달이 열릴 때 학과 목록 로드 (사용하지 않음)
  // const handleOpen = () => {
  //   if (isOpen && selectedUniversityId) {
  //     searchMajors();
  //   }
  // };

  // 모달 닫기
  const handleClose = () => {
    setSearchKeyword('');
    setMajors([]);
    setTotalCount(0);
    onClose();
  };

  // 모달이 열릴 때마다 학과 목록 로드 (검색 버튼을 눌러야만 로드)
  // if (isOpen && selectedUniversityId && majors.length === 0 && !isLoading) {
  //   handleOpen();
  // }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="flex w-full lg:w-[650px] p-6 lg:p-10 flex-col justify-center items-center rounded-[20px] bg-black/85 shadow-[0_0_4px_0_rgba(255,255,255,0.25)] backdrop-blur-[2px] max-h-[80vh] overflow-hidden">
        <div className="flex justify-between items-center w-full mb-[19px]">
          <h2 className="text-xl font-bold text-white">학과 검색</h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-white transition"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* 선택된 대학교 표시 */}
        <div className="w-full p-3 bg-white/20 rounded-[10px] mb-[19px]">
          <p className="text-sm text-white">
            선택된 대학교: <span className="font-semibold">{selectedUniversity}</span>
          </p>
        </div>

        {/* 검색 입력 */}
        <div className="flex gap-[19px] w-full mb-[50px]">
          <input
            type="text"
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            placeholder="학과명을 입력하세요"
            className="flex flex-1 h-[41px] px-[14px] py-2 items-center gap-2 text-white rounded-[10px] border border-white/60 bg-white/30 focus:outline-none placeholder-white/60"
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          />
          <button
            onClick={handleSearch}
            disabled={isLoading}
            className="flex h-[41px] px-6 justify-center items-center text-white rounded-[10px] bg-white/30 hover:bg-white/40 transition disabled:opacity-50"
          >
            {isLoading ? '검색 중...' : '검색'}
          </button>
        </div>

        {/* 검색 결과가 없을 때 기본 메시지 */}
        {!isLoading && majors.length === 0 && !searchKeyword && (
          <div>
            <p className="text-white/60">검색 결과가 없습니다.</p>
          </div>
        )}

        {/* 결과 목록 */}
        <div className="overflow-y-auto max-h-96 w-full">
          {isLoading ? (
            <div className="text-center py-8">
              <p className="text-white/60">검색 중...</p>
            </div>
          ) : (
            <div className="space-y-2">
              {majors.map((major) => (
                <div
                  key={major.kediMjrId}
                  onClick={() => handleMajorSelect(major)}
                  className="p-3 border border-white/30 rounded-[10px] hover:bg-white/20 cursor-pointer transition text-white"
                >
                  <div className="font-semibold text-white">{major.korMjrNm}</div>
                  <div className="text-sm text-white/70">
                    {major.clgNm} • {major.pbnfDgriCrseDivNm} • {major.lsnTrmNm}
                  </div>
                </div>
              ))}
              {majors.length === 0 && (
                <p className="text-center py-8 text-white/60">학과 정보가 없습니다.</p>
              )}
            </div>
          )}
        </div>

        {/* 결과 개수 */}
        {totalCount > 0 && (
          <div className="text-sm text-white/60 text-center">
            총 {totalCount}개의 결과
          </div>
        )}
      </div>
    </div>
  );
} 