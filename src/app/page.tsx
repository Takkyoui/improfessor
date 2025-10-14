'use client';

import Link from "next/link";
import { useUser } from "@/context/UserContext";
import { useAlert } from "@/context/AlertContext";

export default function Home() {
  const { isAuthenticated } = useUser();
  const { showAlert } = useAlert();

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#D9EAFD] to-[#F8FAFC] relative">
      <div 
        className="absolute inset-0 w-full h-full"
        style={{
          backgroundImage: 'url("/background.gif")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      />
      <div className="container mx-auto px-4 min-h-screen flex flex-col items-center justify-center relative z-10">
        <main className="flex flex-col items-center text-center">
          <div className="w-[315px] lg:w-[769px] h-[453px] rounded-[20px] bg-black/20 flex flex-col items-center justify-center p-8">
            <h1 className="text-white font-[Pretendard] text-[56px] lg:text-[100px] font-bold leading-normal mb-[35px] lg:mb-[14px] whitespace-nowrap" style={{textShadow: '0 0 10px rgba(255, 255, 255, 0.70)'}}>
              내가 교수님
            </h1>
            <p className="text-white font-[Pretendard] text-base lg:text-[20px] font-normal lg:font-semibold leading-[140%] mb-[41px] lg:mb-[58px] max-w-2xl text-center" style={{textShadow: '0 0 10px rgba(255, 255, 255, 0.70)'}}>
              <span className="block lg:hidden">
                PDF 파일을 업로드하면<br />
                AI가 자동으로 학습문제를 생성해주는<br />
                스마트한 교육 플랫폼
              </span>
              <span className="hidden lg:block">
                PDF 파일을 업로드하면 AI가 자동으로 학습문제를 생성해주는 스마트한 교육 플랫폼
              </span>
            </p>
            
            {isAuthenticated ? (
              <div className="flex gap-6">
                <Link 
                  href="/generate"
                  className="px-10 py-3 bg-[#D9EAFD] text-black rounded-lg hover:bg-[#BCCCDC] transition"
                >
                  문제 생성하기
                </Link>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <button
                  onClick={() => showAlert('게스트로그인은 준비중입니다')}
                  className="inline-flex px-[30px] py-[20px] justify-center items-center gap-2 rounded-[20px] bg-black/70 shadow-[0_0_4px_0_rgba(0,0,0,0.25)] text-white font-[Pretendard] text-[20px] font-semibold leading-[140%] hover:bg-black/80 transition mb-[60px] lg:mb-[62px]"
                  style={{textShadow: '0 0 10px rgba(255, 255, 255, 0.70)'}}
                >
                  시작하기
                </button>
                <div className="inline-flex items-center gap-[30px]">
                  <span className="text-white font-[Pretendard] text-[18px] font-normal leading-normal" style={{textShadow: '0 0 4px rgba(255, 255, 255, 0.30)'}}>
                    회원이 아니신가요?
                  </span>
                  <Link href="/signup" className="text-white font-[Pretendard] text-[18px] font-normal leading-normal hover:text-white/80 transition" style={{textShadow: '0 0 4px rgba(255, 255, 255, 0.30)'}}>
                    회원가입
                  </Link>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
