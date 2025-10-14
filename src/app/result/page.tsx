'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Header from "@/components/Header";
import { Problem } from '@/types/problem';
import useProblem from '@/hooks/useProblem';

export default function ResultPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { downloadProblemPDF } = useProblem();
  
  const [isLoading, setIsLoading] = useState(false);
  const [problems, setProblems] = useState<Problem[]>([]);

  useEffect(() => {
    // URL에서 상태 복원
    const state = searchParams.get('state');
    if (state) {
      try {
        const { problems } = JSON.parse(state);
        setProblems(problems);
      } catch (error) {
        console.error('상태 복원 실패:', error);
        router.push('/generate');
      }
    } else {
      router.push('/generate');
    }
  }, [searchParams, router]);

  const handleDownload = async () => {
    if (!problems.length) return;

    setIsLoading(true);
    try {
      await downloadProblemPDF(problems);
    } catch (error) {
      alert(`PDF 다운로드에 실패했습니다: ${error instanceof Error ? error.message : '알 수 없는 오류'}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="flex flex-col items-center pt-[52px] xl:max-w-7xl xl:mx-auto xl:px-[50px] xl:pt-[77px]">
        <div className="flex w-[318px] min-w-[300px] max-w-[1100px] px-[20px] py-[30px] flex-col gap-[30px] rounded-[20px] xl:w-auto xl:px-8 xl:py-8" style={{background: 'rgba(255, 255, 255, 0.10)'}}>
          <div>
            <div className="flex max-w-[1008px] justify-between items-center self-stretch mb-8">
              <h1 
                className="text-[20px] xl:text-[30px]"
                style={{
                  color: '#FFF',
                  fontFamily: 'Pretendard',
                  fontWeight: 600,
                  lineHeight: '140%'
                }}
              >
                생성된 문제
              </h1>
              <button
                onClick={handleDownload}
                disabled={isLoading || !problems.length}
                className={`hidden xl:flex px-[14px] py-[8px] justify-center items-center gap-[8px] rounded-[10px] transition-opacity ${
                  isLoading
                    ? 'opacity-50 cursor-not-allowed'
                    : 'hover:opacity-80'
                }`}
                style={{
                  background: 'rgba(255, 255, 255, 0.80)',
                  color: '#405348',
                  fontFamily: 'Pretendard',
                  fontSize: '20px',
                  fontWeight: 600,
                  lineHeight: '140%'
                }}
              >
                {isLoading ? '다운로드 중...' : 'PDF 다운로드'}
              </button>
            </div>

            <div className="flex flex-col gap-[43px]">
              {problems.map((problem) => (
                <div
                  key={problem.number}
                  className="flex max-w-[1008px] px-[20px] py-[30px] flex-col justify-center items-start gap-[20px] self-stretch rounded-[10px] xl:p-[30px] xl:gap-[24px]"
                  style={{
                    border: '1px solid rgba(255, 255, 255, 0.50)',
                    background: 'rgba(255, 255, 255, 0.10)'
                  }}
                >
                  <h3 
                    className="text-[18px] xl:text-[20px]"
                    style={{
                      color: '#FFF',
                      fontFamily: 'Pretendard',
                      fontWeight: 600,
                      lineHeight: '140%'
                    }}
                  >
                    문제 {problem.number}
                  </h3>
                  
                  <div className="flex flex-col gap-[24px] w-full">
                    <div>
                      <h4 
                        className="mb-2 text-[16px] xl:text-[18px]"
                        style={{
                          color: '#FFF',
                          fontFamily: 'Pretendard',
                          fontWeight: 600,
                          lineHeight: '140%'
                        }}
                      >
                        문제 내용
                      </h4>
                      <p 
                        className="whitespace-pre-wrap text-[14px] xl:text-[16px]"
                        style={{
                          color: '#FFF',
                          fontFamily: 'Pretendard',
                          fontWeight: 400,
                          lineHeight: '140%'
                        }}
                      >
                        {problem.content}
                      </p>
                    </div>

                    {problem.description && (
                      <div>
                        <h4 
                          className="mb-2 text-[16px] xl:text-[18px]"
                          style={{
                            color: '#FFF',
                            fontFamily: 'Pretendard',
                            fontWeight: 600,
                            lineHeight: '140%'
                          }}
                        >
                          설명
                        </h4>
                        <p 
                          className="whitespace-pre-wrap text-[14px] xl:text-[16px]"
                          style={{
                            color: '#FFF',
                            fontFamily: 'Pretendard',
                            fontWeight: 400,
                            lineHeight: '140%'
                          }}
                        >
                          {problem.description}
                        </p>
                      </div>
                    )}

                    <div>
                      <h4 
                        className="mb-2 text-[16px] xl:text-[18px]"
                        style={{
                          color: '#FFF',
                          fontFamily: 'Pretendard',
                          fontWeight: 600,
                          lineHeight: '140%'
                        }}
                      >
                        정답
                      </h4>
                      <p 
                        className="whitespace-pre-wrap text-[14px] xl:text-[16px]"
                        style={{
                          color: '#FFF',
                          fontFamily: 'Pretendard',
                          fontWeight: 400,
                          lineHeight: '140%'
                        }}
                      >
                        {problem.answer}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="py-[50px] xl:py-[77px] text-center">
          <button
            onClick={() => router.push('/generate')}
            className="hover:opacity-70 transition-opacity text-[14px] xl:text-[20px]"
            style={{
              color: '#FFF',
              fontFamily: 'Pretendard',
              fontWeight: 600,
              lineHeight: '140%',
              textDecoration: 'underline',
              textDecorationStyle: 'solid',
              textDecorationSkipInk: 'none',
              textUnderlineOffset: '25%'
            }}
          >
            새로운 문제 생성하기
          </button>
        </div>
      </main>
    </div>
  );
} 