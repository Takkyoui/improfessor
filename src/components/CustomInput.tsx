interface CustomInputProps {
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

export default function CustomInput({
  label,
  type,
  id,
  value,
  onChange,
  placeholder,
  required = false,
  button,
}: CustomInputProps) {
  return (
    <div className="relative flex items-center justify-center">
      <input
        type={type}
        id={id}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className="flex w-[328px] h-[41px] px-[14px] py-2 items-center gap-2 rounded-[10px] border border-white/60 bg-white/30 text-white font-[Pretendard] text-base font-normal leading-[140%] placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/40"
      />
      <label 
        htmlFor={id}
        className="absolute -left-[120px] text-white font-[Pretendard] text-[18px] font-normal leading-normal whitespace-nowrap pointer-events-none text-right w-[80px]"
      >
        {label}
      </label>
      {button && (
        <button
          type="button"
          onClick={button.onClick}
          disabled={button.disabled}
          className="absolute left-[348px] inline-flex h-[41px] px-6 justify-center items-center flex-shrink-0 rounded-[10px] bg-white/30 text-white font-['Apple_SD_Gothic_Neo'] text-base font-semibold leading-[150%] hover:bg-white/40 transition disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
        >
          {button.text}
        </button>
      )}
    </div>
  );
}

