'use client';

import Header from "@/components/Header";
import { useEffect, useState, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import useProblem from "@/hooks/useProblem";
import { useAlert } from "@/context/AlertContext";
import { useUser } from "@/context/UserContext";
import { axiosInstance } from "@/lib/axios";

export default function GeneratePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { showAlert } = useAlert();
  const { user, isAuthenticated } = useUser();
  const [isLoading, setIsLoading] = useState(false);
  const conceptFileRef = useRef<HTMLInputElement>(null);
  const formatFileRef = useRef<HTMLInputElement>(null);
  const [conceptFileName, setConceptFileName] = useState<string>('');
  const [formatFileName, setFormatFileName] = useState<string>('');

  const { useGenerateProblem } = useProblem();
  const generateProblemMutation = useGenerateProblem();

  // 카카오 리다이렉트 처리: 쿼리에서 토큰 수신 시 저장 및 헤더 설정
  useEffect(() => {
    const accessToken = searchParams.get('accessToken');
    const refreshToken = searchParams.get('refreshToken');
    const grantType = searchParams.get('grant_type');
    const error = searchParams.get('error');
    const message = searchParams.get('message');

    // 에러 케이스 처리
    if (error) {
      console.error('[Kakao OAuth] Error:', { error, message });
      showAlert(`카카오 로그인 실패: ${message || error}`);
      // 쿼리스트링 정리
      const url = new URL(window.location.href);
      url.searchParams.delete('error');
      url.searchParams.delete('message');
      window.history.replaceState({}, '', url.toString());
      return;
    }

    if (accessToken && refreshToken) {
      // 디버깅: 카카오 OAuth 토큰 확인
      console.log('[Kakao OAuth] tokens received', {
        grantType,
        accessToken,
        refreshToken,
      });

      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
      
      // 쿼리스트링 정리
      const url = new URL(window.location.href);
      url.searchParams.delete('accessToken');
      url.searchParams.delete('refreshToken');
      url.searchParams.delete('grant_type');
      window.history.replaceState({}, '', url.toString());
      
      // 토큰 변경 이벤트 발생 (UserContext에서 상태 업데이트)
      window.dispatchEvent(new Event('tokenChange'));
      
      // 환영 안내
      showAlert('카카오 로그인에 성공했어요!');
    }
  }, [searchParams, showAlert]);

  const handleConceptFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // 파일 크기 체크 (15MB = 15 * 1024 * 1024 bytes)
      const maxSize = 15 * 1024 * 1024; // 15MB
      if (file.size > maxSize) {
        showAlert('파일 크기가 15MB를 초과합니다. 더 작은 파일을 선택해주세요.');
        e.target.value = ''; // 파일 선택 초기화
        setConceptFileName('');
        return;
      }
      setConceptFileName(file.name);
    }
  };

  const handleFormatFileClick = (e: React.MouseEvent) => {
    if (!conceptFileRef.current?.files?.length) {
      e.preventDefault();
      showAlert('수업 자료를 먼저 업로드해 주세요.');
      return;
    }
  };

  const handleFormatFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // 파일 크기 체크 (15MB = 15 * 1024 * 1024 bytes)
      const maxSize = 15 * 1024 * 1024; // 15MB
      if (file.size > maxSize) {
        showAlert('파일 크기가 15MB를 초과합니다. 더 작은 파일을 선택해주세요.');
        e.target.value = ''; // 파일 선택 초기화
        setFormatFileName('');
        return;
      }
      setFormatFileName(file.name);
    }
  };

  const handleGenerate = async () => {
    // 로그인 체크
    if (!isAuthenticated) {
      showAlert('로그인이 필요합니다.');
      return;
    }

    // freeCount 체크
    if (!user || user.freeCount <= 0) {
      showAlert('무료 생성 횟수가 부족합니다. 마이페이지에서 확인해주세요.');
      return;
    }

    const conceptFiles = conceptFileRef.current?.files;
    if (!conceptFiles || conceptFiles.length === 0) {
      showAlert('수업 자료를 업로드해주세요.');
      return;
    }

    // 파일 크기 재체크
    const maxSize = 15 * 1024 * 1024; // 15MB
    for (let i = 0; i < conceptFiles.length; i++) {
      if (conceptFiles[i].size > maxSize) {
        showAlert(`수업 자료 파일 "${conceptFiles[i].name}"의 크기가 15MB를 초과합니다.`);
        return;
      }
    }

    setIsLoading(true);
    try {
      const formatFiles = formatFileRef.current?.files;
      
      // 족보 파일 크기 체크
      if (formatFiles) {
        for (let i = 0; i < formatFiles.length; i++) {
          if (formatFiles[i].size > maxSize) {
            showAlert(`족보 파일 "${formatFiles[i].name}"의 크기가 15MB를 초과합니다.`);
            setIsLoading(false);
            return;
          }
        }
      }

      const response = await generateProblemMutation.mutateAsync({
        conceptFiles: Array.from(conceptFiles),
        formatFiles: formatFiles ? Array.from(formatFiles) : undefined,
      });

      const state = {
        problems: response.data.problems,
        downloadKey: response.data.downloadKey,
      };
      router.push(`/result?state=${encodeURIComponent(JSON.stringify(state))}`);
    } catch (error) {
      console.error('문제 생성 실패:', error);
      showAlert('문제 생성에 실패했습니다.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-[53px] pb-4 sm:pb-6 md:pb-8">
        {/* 페이지 제목과 설명 */}
        <div className="text-center mb-6 sm:mb-8 md:mb-12">
          <h1 
            className="mb-4 text-[40px] xl:text-[50px]"
            style={{
              color: '#FFF',
              textShadow: '0 0 10px rgba(255, 255, 255, 0.70)',
              fontFamily: 'Pretendard',
              fontWeight: 700,
              lineHeight: 'normal'
            }}
          >
            내가 교수님
          </h1>
          <p 
            className="text-[14px] xl:text-[18px]"
            style={{
              color: '#FFF',
              fontFamily: 'Pretendard',
              fontWeight: 400,
              lineHeight: '140%'
            }}
          >
            자료 업로드 후 문제 생성하기 버튼을 눌러주세요
          </p>
        </div>

        <div className="flex flex-col items-center xl:pb-[180px]">
          {/* 수업 자료 업로드 섹션 */}
          <div className="flex w-[318px] min-w-[300px] max-w-[1100px] px-[20px] py-[30px] flex-col gap-[30px] rounded-[20px] xl:w-[1100px] xl:px-[50px] xl:gap-[43px]" style={{background: 'rgba(255, 255, 255, 0.10)'}}>
            <div className="w-full">
              <h2 
                className="text-[20px] xl:text-[30px]"
                style={{
                  color: 'rgb(255, 255, 255)',
                  fontFamily: 'Pretendard',
                  fontWeight: 600,
                  lineHeight: '140%'
                }}
              >
                수업 자료 업로드 (필수)
              </h2>

              <p 
                className="mb-6 sm:mb-8 md:mb-10 lg:mb-12 xl:mb-[43px] text-[12px] xl:text-[16px]"
                style={{
                  color: '#FFF',
                  fontFamily: 'Pretendard',
                  fontWeight: 400,
                  lineHeight: '140%'
                }}
              >
                문제를 만들어 드릴까요? 개념 학습 자료를 업로드 해주세요
              </p>

              <div 
                className="flex min-w-[260px] max-w-[1000px] px-0 py-[30px] flex-col justify-center items-center gap-[20px] self-stretch text-center"
                style={{
                  borderRadius: '20px',
                  border: '1px solid rgba(255, 255, 255, 0.50)',
                  background: 'rgba(255, 255, 255, 0.10)'
                }}
              >
                <input
                  type="file"
                  accept=".pdf,.ppt,.pptx"
                  className="hidden"
                  id="concept-upload"
                  ref={conceptFileRef}
                  onChange={handleConceptFileChange}
                />
                <label
                  htmlFor="concept-upload"
                  className="inline-flex flex-col items-center cursor-pointer"
                >
                  <img
                    src="/upload.svg"
                    alt="Upload"
                    className="mb-4 w-[60px] h-[60px] xl:w-[100px] xl:h-[100px]"
                  />
                  <span 
                    className="mb-4 sm:mb-6 md:mb-8 lg:mb-10 xl:mb-[20px] text-[14px] xl:text-[16px]"
                    style={{
                      color: '#FFF',
                      textAlign: 'center',
                      fontFamily: 'Pretendard',
                      fontWeight: 400,
                      lineHeight: '140%'
                    }}
                  >
                    {conceptFileName || '파일 선택하기 (필수)'}
                  </span>
                  <div 
                    className="flex items-center gap-2"
                    style={{
                      color: '#FFF',
                      fontFamily: 'Pretendard',
                      fontSize: '16px',
                      fontWeight: 400,
                      lineHeight: '140%'
                    }}
                  >
                    <span>PDF</span>
                    <span style={{color: '#00FF00'}}>✓</span>
                    <span>PPT</span>
                    <span style={{color: '#00FF00'}}>✓</span>
                    <span>각 15MB 이하</span>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* 족보 올리기 섹션 */}
          <div 
            className="flex w-[318px] min-w-[300px] max-w-[1100px] px-[20px] py-[30px] flex-col gap-[30px] rounded-[20px] mt-[69px] xl:w-[1100px] xl:px-[50px] xl:gap-[43px] xl:mt-[71px]"
            style={{
              background: 'rgba(255, 255, 255, 0.10)'
            }}
          >
            <div className="w-full">
              <h2 
                className="text-[20px] xl:text-[30px]"
                style={{
                  color: 'rgb(255, 255, 255)',
                  fontFamily: 'Pretendard',
                  fontWeight: 600,
                  lineHeight: '140%'
                }}
              >
                족보 올리기 (선택)
              </h2>

              <p 
                className="mb-6 sm:mb-8 md:mb-10 lg:mb-12 xl:mb-[43px] text-[12px] xl:text-[16px]"
                style={{
                  color: '#FFF',
                  fontFamily: 'Pretendard',
                  fontWeight: 400,
                  lineHeight: '140%'
                }}
              >
                유사한 스타일로 만들어 드릴까요? 원하는 문제 유형 자료를 업로드 해주세요
              </p>

              <div 
                className="flex min-w-[260px] max-w-[1000px] px-0 py-[30px] flex-col justify-center items-center gap-[20px] self-stretch text-center"
                style={{
                  borderRadius: '20px',
                  border: '1px solid rgba(255, 255, 255, 0.50)',
                  background: 'rgba(255, 255, 255, 0.10)'
                }}
              >
                <input
                  type="file"
                  accept=".pdf,.ppt,.pptx"
                  className="hidden"
                  id="reference-upload"
                  ref={formatFileRef}
                  onChange={handleFormatFileChange}
                />
                <label
                  htmlFor="reference-upload"
                  className="inline-flex flex-col items-center cursor-pointer"
                  onClick={handleFormatFileClick}
                >
                  <img
                    src="/upload.svg"
                    alt="Upload"
                    className="mb-4 w-[60px] h-[60px] xl:w-[100px] xl:h-[100px]"
                  />
                  <span 
                    className="mb-4 sm:mb-6 md:mb-8 lg:mb-10 xl:mb-[20px] text-[14px] xl:text-[16px]"
                    style={{
                      color: '#FFF',
                      textAlign: 'center',
                      fontFamily: 'Pretendard',
                      fontWeight: 400,
                      lineHeight: '140%'
                    }}
                  >
                    {formatFileName || '파일 선택하기 (선택)'}
                  </span>
                  <div 
                    className="flex items-center gap-2"
                    style={{
                      color: '#FFF',
                      fontFamily: 'Pretendard',
                      fontSize: '16px',
                      fontWeight: 400,
                      lineHeight: '140%'
                    }}
                  >
                    <span>PDF</span>
                    <span style={{color: '#00FF00'}}>✓</span>
                    <span>PPT</span>
                    <span style={{color: '#00FF00'}}>✓</span>
                    <span>각 15MB 이하</span>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* 문제 생성하기 버튼 */}
          <button
            type="button"
            className={`flex w-[280px] h-[60px] xl:w-[616px] xl:h-auto p-[30px] justify-center items-center gap-[8px] flex-shrink-0 rounded-[12px] xl:rounded-[20px] transition relative mt-[69px] xl:mt-[107px] text-sm sm:text-base md:text-lg lg:text-xl xl:text-[30px] shadow-[0_0_10px_0_#20212B] xl:shadow-[0_0_20px_0_#20212B] ${
              isLoading 
                ? 'cursor-not-allowed'
                : 'hover:opacity-90'
            }`}
            style={{
              background: 'rgba(72, 86, 105, 0.80)',
              color: '#FFF',
              fontFamily: 'Pretendard',
              fontWeight: 600,
              lineHeight: '140%'
            }}
            onClick={handleGenerate}
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                문제 생성 중...
              </div>
            ) : (
              '문제 생성하기'
            )}
          </button>
        </div>
      </main>
    </div>
  );
} 