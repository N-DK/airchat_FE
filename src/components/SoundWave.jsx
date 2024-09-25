import React from "react";
export default function SoundWave({ play, color }) {
  return (
    <div className="flex gap-1 md:gap-3 items-center justify-center">
      <div
        className={`${
          play
            ? "h-8 md:h-16 animate-quiet w-[8px] md:w-[15px]"
            : "h-[2px] md:h-[4px] w-[8px] md:w-[15px]"
        } bg-${color} rounded-lg`}
      ></div>
      <div
        className={`${
          play
            ? "h-6 md:h-8 animate-slow w-[8px] md:w-[15px]"
            : "h-[2px] md:h-[4px] w-[8px] md:w-[15px]"
        } bg-${color} rounded-lg`}
      ></div>
      <div
        className={`${
          play
            ? "h-6 md:h-9 animate-loud w-[8px] md:w-[15px]"
            : "h-[2px] md:h-[4px] w-[8px] md:w-[15px]"
        } bg-${color} rounded-lg`}
      ></div>
      <div
        className={`${
          play
            ? "h-8 md:h-10 animate-quiet w-[8px] md:w-[15px]"
            : "h-[2px] md:h-[4px] w-[8px] md:w-[15px]"
        } bg-${color} rounded-lg`}
      ></div>
      <div
        className={`${
          play
            ? "h-6 md:h-8 animate-slow w-[8px] md:w-[15px]"
            : "h-[2px] md:h-[4px] w-[8px] md:w-[15px]"
        } bg-${color} rounded-lg`}
      ></div>
      <div
        className={`${
          play
            ? "h-6 md:h-9 animate-quiet w-[8px] md:w-[15px]"
            : "h-[2px] md:h-[4px] w-[8px] md:w-[15px]"
        } bg-${color} rounded-lg`}
      ></div>
      <div
        className={`${
          play
            ? "h-5 md:h-6 animate-slow w-[8px] md:w-[15px]"
            : "h-[2px] md:h-[4px] w-[8px] md:w-[15px]"
        } bg-${color} rounded-lg`}
      ></div>
      <div
        className={`${
          play
            ? "h-7 md:h-9 animate-loud w-[8px] md:w-[15px]"
            : "h-[2px] md:h-[4px] w-[8px] md:w-[15px]"
        } bg-${color} rounded-lg`}
      ></div>
      <div
        className={`${
          play
            ? "h-7 md:h-9 animate-slow w-[8px] md:w-[15px]"
            : "h-[2px] md:h-[4px] w-[8px] md:w-[15px]"
        } bg-${color} rounded-lg`}
      ></div>
      <div
        className={`${
          play
            ? "h-4 md:h-8 animate-quiet w-[8px] md:w-[15px]"
            : "h-[2px] md:h-[4px] w-[8px] md:w-[15px]"
        } bg-${color} rounded-lg`}
      ></div>
      <div
        className={`${
          play
            ? "h-4 md:h-6 animate-quiet w-[8px] md:w-[15px]"
            : "h-[2px] md:h-[4px] w-[8px] md:w-[15px]"
        } bg-${color} rounded-lg`}
      ></div>
      <div
        className={`${
          play
            ? "h-8 md:h-12 animate-slow w-[8px] md:w-[15px]"
            : "h-[2px] md:h-[4px] w-[8px] md:w-[15px]"
        } bg-${color} rounded-lg`}
      ></div>
      <div
        className={`${
          play
            ? "h-4 md:h-6 animate-slow w-[8px] md:w-[15px]"
            : "h-[2px] md:h-[4px] w-[8px] md:w-[15px]"
        } bg-${color} rounded-lg`}
      ></div>
      <div
        className={`${
          play
            ? "h-7 md:h-9 animate-quiet w-[8px] md:w-[15px]"
            : "h-[2px] md:h-[4px] w-[8px] md:w-[15px]"
        } bg-${color} rounded-lg`}
      ></div>
      <div
        className={`${
          play
            ? "h-6 md:h-8 animate-slow w-[8px] md:w-[15px]"
            : "h-[2px] md:h-[4px] w-[8px] md:w-[15px]"
        } bg-${color} rounded-lg`}
      ></div>
      <div
        className={`${
          play
            ? "h-5 md:h-7 animate-slow w-[8px] md:w-[15px]"
            : "h-[2px] md:h-[4px] w-[8px] md:w-[15px]"
        } bg-${color} rounded-lg`}
      ></div>
      <div
        className={`${
          play
            ? "h-6 md:h-12 animate-quiet w-[8px] md:w-[15px]"
            : "h-[2px] md:h-[4px] w-[8px] md:w-[15px]"
        } bg-${color} rounded-lg`}
      ></div>
      <div
        className={`${
          play
            ? "h-7 md:h-9 animate-slow w-[8px] md:w-[15px]"
            : "h-[2px] md:h-[4px] w-[8px] md:w-[15px]"
        } bg-${color} rounded-lg`}
      ></div>
      <div
        className={`${
          play
            ? "h-7 md:h-9 animate-slow w-[8px] md:w-[15px]"
            : "h-[2px] md:h-[4px] w-[8px] md:w-[15px]"
        } bg-${color} rounded-lg`}
      ></div>
      <div
        className={`${
          play
            ? "h-8 md:h-12 animate-quiet w-[8px] md:w-[15px]"
            : "h-[2px] md:h-[4px] w-[8px] md:w-[15px]"
        } bg-${color} rounded-lg`}
      ></div>

      <div className="hidden lg:flex items-center gap-3">
        <div
          className={`${
            play
              ? "h-6 md:h-14 animate-loud w-[8px] md:w-[15px]"
              : "h-[2px] md:h-[4px] w-[8px] md:w-[15px]"
          } bg-${color} rounded-lg`}
        ></div>
        <div
          className={`${
            play
              ? "h-7 md:h-12 animate-quiet w-[8px] md:w-[15px]"
              : "h-[2px] md:h-[4px] w-[8px] md:w-[15px]"
          } bg-${color} rounded-lg`}
        ></div>
        <div
          className={`${
            play
              ? "h-6 md:h-14 animate-quiet w-[8px] md:w-[15px]"
              : "h-[2px] md:h-[4px] w-[8px] md:w-[15px]"
          } bg-${color} rounded-lg`}
        ></div>
        <div
          className={`${
            play
              ? "h-7 md:h-9 animate-slow w-[8px] md:w-[15px]"
              : "h-[2px] md:h-[4px] w-[8px] md:w-[15px]"
          } bg-${color} rounded-lg`}
        ></div>
        <div
          className={`${
            play
              ? "h-8 md:h-10 animate-quiet w-[8px] md:w-[15px]"
              : "h-[2px] md:h-[4px] w-[8px] md:w-[15px]"
          } bg-${color} rounded-lg`}
        ></div>
        <div
          className={`${
            play
              ? "h-6 md:h-8 animate-loud w-[8px] md:w-[15px]"
              : "h-[2px] md:h-[4px] w-[8px] md:w-[15px]"
          } bg-${color} rounded-lg`}
        ></div>
        <div
          className={`${
            play
              ? "h-7 md:h-10 animate-quiet w-[8px] md:w-[15px]"
              : "h-[2px] md:h-[4px] w-[8px] md:w-[15px]"
          } bg-${color} rounded-lg`}
        ></div>
        <div
          className={`${
            play
              ? "h-6 md:h-12 animate-quiet w-[8px] md:w-[15px]"
              : "h-[2px] md:h-[4px] w-[8px] md:w-[15px]"
          } bg-${color} rounded-lg`}
        ></div>
      </div>
    </div>
  );
}
