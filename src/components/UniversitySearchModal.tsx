'use client';

import { useState } from 'react';
import { useAlert } from '@/context/AlertContext';

interface University {
  schlNm: string;
  schlId: string;
  schlKndNm: string;
  mjrAreaNm: string;
}

interface UniversitySearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (university: string, universityId: string) => void;
}

export default function UniversitySearchModal({ 
  isOpen, 
  onClose, 
  onSelect 
}: UniversitySearchModalProps) {
  const { showAlert } = useAlert();
  const [searchKeyword, setSearchKeyword] = useState('');
  const [universities, setUniversities] = useState<University[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);

  // 대학교 검색
  const searchUniversities = async (keyword: string, page: number = 1) => {
    if (!keyword.trim()) {
      setUniversities([]);
      setTotalCount(0);
      return;
    }

    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        type: 'university',
        keyword,
        page: page.toString()
      });

      const response = await fetch(`/api/university?${params}`);
      const xmlText = await response.text();
      
      // XML을 파싱하여 대학교 목록 추출
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlText, 'text/xml');
      
      // 에러 체크
      const resultCode = xmlDoc.querySelector('resultCode')?.textContent;
      const resultMsg = xmlDoc.querySelector('resultMsg')?.textContent;
      
      if (resultCode === '99') {
        throw new Error(`API 에러: ${resultMsg}`);
      }
      
      const items = xmlDoc.querySelectorAll('item');
      const universityList: University[] = [];
      
      items.forEach((item) => {
        const schlNm = item.querySelector('schlNm')?.textContent || '';
        const schlId = item.querySelector('schlId')?.textContent || '';
        const schlKndNm = item.querySelector('schlKndNm')?.textContent || '';
        const mjrAreaNm = item.querySelector('mjrAreaNm')?.textContent || '';
        
        // 중복 제거
        if (!universityList.find(u => u.schlId === schlId)) {
          universityList.push({
            schlNm,
            schlId,
            schlKndNm,
            mjrAreaNm
          });
        }
      });

      setUniversities(universityList);
      setTotalCount(universityList.length);
    } catch (error) {
      console.error('대학교 검색 실패:', error);
      showAlert('대학교 검색에 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  // 대학교 선택
  const handleUniversitySelect = (university: University) => {
    onSelect(university.schlNm, university.schlId);
    onClose();
  };

  // 검색 실행
  const handleSearch = () => {
    searchUniversities(searchKeyword, 1);
  };

  // 모달 닫기
  const handleClose = () => {
    setSearchKeyword('');
    setUniversities([]);
    setTotalCount(0);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="flex w-full lg:w-[650px] p-6 lg:p-10 flex-col justify-center items-center rounded-[20px] bg-black/85 shadow-[0_0_4px_0_rgba(255,255,255,0.25)] backdrop-blur-[2px] max-h-[80vh] overflow-hidden">
        <div className="flex justify-between items-center w-full mb-[19px]">
          <h2 className="text-xl font-bold text-white">대학교 검색</h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-white transition"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* 검색 입력 */}
        <div className="flex gap-[19px] w-full mb-[50px]">
          <input
            type="text"
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            placeholder="대학교명을 입력하세요"
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
        {!isLoading && universities.length === 0 && !searchKeyword && (
          <div>
            <p className="text-white/60">검색 결과가 없습니다.</p>
          </div>
        )}

        {/* 결과 목록 */}
        <div className="overflow-y-auto max-h-96 self-stretch">
          {isLoading ? (
            <div className="text-center py-8">
              <p className="text-white/60">검색 중...</p>
            </div>
          ) : (
            <div className="space-y-2">
              {universities.map((university) => (
                <div
                  key={university.schlId}
                  onClick={() => handleUniversitySelect(university)}
                  className="p-3 border border-white/30 rounded-[10px] hover:bg-white/20 cursor-pointer transition text-white"
                >
                  <div className="font-semibold text-white">{university.schlNm}</div>
                  <div className="text-sm text-white/70">
                    {university.schlKndNm} • {university.mjrAreaNm}
                  </div>
                </div>
              ))}
              {universities.length === 0 && searchKeyword && (
                <p className="text-center py-8 text-white/60">검색 결과가 없습니다.</p>
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