import { useEffect } from 'react';
import { createPortal } from 'react-dom';

interface AlertModalProps {
  isOpen: boolean;
  message: string;
  onClose: () => void;
}

export default function AlertModal({ isOpen, message, onClose }: AlertModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div 
        className="fixed inset-0 bg-black/25 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-black/85 rounded-lg shadow-xl p-10 w-fit transform transition-all">
        <div className="flex flex-col justify-center items-center gap-[30px] w-[300px]">
          <div className="flex justify-between items-center w-full">
            <h2 className="text-white font-[Pretendard] text-[20px] font-semibold leading-[140%]">
              알림
            </h2>
            <button
              onClick={onClose}
              className="w-[15px] h-[15px] flex items-center justify-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 19 19" fill="none">
                <path d="M18.0014 1.07532L2.04443 17.0323M1.92578 1.07446L17.9132 17.0619" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
          <p className="text-white font-[Pretendard] text-base font-normal leading-[140%] text-center">
            {message}
          </p>
          <button
            onClick={onClose}
            className="flex h-[41px] px-6 justify-center items-center rounded-[10px] bg-white/30 text-white font-['Apple_SD_Gothic_Neo'] text-base font-semibold leading-[150%] hover:bg-white/40 transition w-full"
          >
            확인
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
} 