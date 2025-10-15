interface CustomInputMobileProps {
  label: string;
  type: string;
  id: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  required?: boolean;
  button?: {
    text: string;
    onClick: () => void;
    disabled?: boolean;
  };
}

export default function CustomInputMobile({
  label,
  type,
  id,
  value,
  onChange,
  placeholder,
  required = false,
  button,
}: CustomInputMobileProps) {
  return (
    <div className="px-[46px] flex flex-col gap-[5px] items-start">
      <label 
        htmlFor={id}
        className="text-white font-[Pretendard] text-[18px] font-normal leading-[140%]"
      >
        {label}
      </label>
      <div className={`flex items-center ${button ? 'gap-[20px] w-[300px]' : 'w-[300px]'}`}>
        <input
          type={type}
          id={id}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          className="flex h-[40px] px-[14px] py-2 items-center gap-2 rounded-[8px] border border-white/60 bg-white/30 text-white font-[Pretendard] text-base font-normal leading-[140%] placeholder:text-white placeholder:font-[Pretendard] placeholder:text-[14px] placeholder:font-normal placeholder:leading-[140%] focus:outline-none focus:ring-2 focus:ring-white/40 w-full"
        />
        {button && (
          <button
            type="button"
            onClick={button.onClick}
            disabled={button.disabled}
            className="inline-flex h-[40px] px-3 justify-center items-center flex-shrink-0 rounded-[8px] bg-white/30 text-white font-['Apple_SD_Gothic_Neo'] text-base font-semibold leading-[150%] hover:bg-white/40 transition disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
          >
            {button.text}
          </button>
        )}
      </div>
    </div>
  );
}
