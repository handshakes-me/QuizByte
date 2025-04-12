import React from "react";

type PropsType = {
  text: string;
  icon: React.ReactNode;
};

const Badge = ({ icon: Icon, text }: PropsType) => {
  return (
    <div className="flex gap-x-2 text-xs items-center text-black font-normal bg-sky-400/20 px-3 py-1 tracking-wide rounded-full">
      <span>{Icon}</span>
      <p className="uppercase">{text}</p>
    </div>
  );
};

export default Badge;
