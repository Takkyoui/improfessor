'use client';

import { useState } from "react";
import Header from "@/components/Header";
import Pagination from "@/components/Pagination";
import useNotice from "@/hooks/useNotice";
export default function NoticePage() {
  const { useNoticeList } = useNotice();
  const { data: noticeResponse, isLoading } = useNoticeList();

  const [currentPage, setCurrentPage] = useState(1);
  const [expandedNotice, setExpandedNotice] = useState<number | null>(null);
  const itemsPerPage = 10;

  const notices = noticeResponse?.data || [];
  const totalPages = Math.ceil(notices.length / itemsPerPage);

  // 현재 페이지에 해당하는 공지사항만 필터링
  const currentNotices = notices.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // 공지사항 확장/축소 토글
  const toggleExpanded = (noticeId: number) => {
    setExpandedNotice(expandedNotice === noticeId ? null : noticeId);
  };

  if (isLoading) {
    return <div>로딩 중...</div>;
  }

  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="w-full lg:max-w-7xl lg:mx-auto lg:px-8 py-8">
        <div>
          <div>
            <h1 className="text-white font-pretendard text-2xl lg:text-[30px] font-semibold leading-[140%] mb-8">
              공지사항
            </h1>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-white/20">
                <thead>
                  <tr className="border-b border-white/50 bg-white/10">
                    <th scope="col" className="h-[30px] px-2 lg:px-6 py-4 text-center text-white font-pretendard text-xs lg:text-[20px] font-semibold leading-[140%] w-12 lg:w-auto">
                      No
                    </th>
                    <th scope="col" className="h-[30px] px-2 lg:px-6 py-4 text-center text-white font-pretendard text-xs lg:text-[20px] font-semibold leading-[140%] w-16 lg:w-auto">
                      작성자
                    </th>
                    <th scope="col" className="h-[30px] px-2 lg:px-6 py-4 text-center text-white font-pretendard text-xs lg:text-[20px] font-semibold leading-[140%]">
                      제목
                    </th>
                    <th scope="col" className="h-[30px] px-2 lg:px-6 py-4 text-center text-white font-pretendard text-xs lg:text-[20px] font-semibold leading-[140%] w-20 lg:w-auto">
                      작성일
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/20">
                  {currentNotices.map((notice) => (
                    <>
                      <tr 
                        key={notice.noticeId}
                        className="hover:bg-white/10 cursor-pointer transition-colors relative"
                        onClick={() => toggleExpanded(notice.noticeId)}
                      >
                        <td className="px-2 lg:px-6 py-4 text-center text-white font-pretendard text-xs lg:text-base w-12 lg:w-auto">
                          {notice.noticeId}
                        </td>
                        <td className="px-2 lg:px-6 py-4 text-center text-white font-pretendard text-xs lg:text-base w-16 lg:w-auto">
                          유니랩
                        </td>
                        <td className="px-2 lg:px-6 py-4 text-center text-white font-pretendard text-xs lg:text-base">
                          <div className="flex items-center justify-center gap-1 lg:gap-2">
                            <span className="truncate">{notice.title}</span>
                            {/* 최근 3일 이내의 공지사항에 NEW 표시 */}
                            {new Date().getTime() - new Date(notice.createdAt).getTime() < 3 * 24 * 60 * 60 * 1000 && (
                              <span className="bg-white/20 text-white text-xs px-1 lg:px-2 py-0.5 rounded flex-shrink-0">
                                NEW
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-2 lg:px-6 py-4 text-center text-white font-pretendard text-xs lg:text-base w-20 lg:w-auto">
                          {new Date(notice.createdAt).toLocaleDateString()}
                        </td>
                        {/* 화살표 - absolute로 우측 끝에 배치 */}
                        <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                          {expandedNotice === notice.noticeId ? (
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                            </svg>
                          ) : (
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          )}
                        </div>
                      </tr>
                      {expandedNotice === notice.noticeId && (
                        <tr>
                          <td colSpan={4} className="px-6 py-4 bg-white/5">
                            <div className="text-white font-pretendard text-sm lg:text-base leading-relaxed">
                              {notice.content || "공지사항 내용이 없습니다."}
                            </div>
                          </td>
                        </tr>
                      )}
                    </>
                  ))}
                </tbody>
              </table>
            </div>

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        </div>
      </main>
    </div>
  );
} 