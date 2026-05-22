"use client";

import { ReactNode, useState } from "react";

interface Props {
  title: string;
  children: ReactNode;
}

export default function FilterSection({
  title,
  children,
}: Props) {
  const [open, setOpen] = useState(true);

  return (
    <div className="border-b border-slate-200 dark:border-neutral-800 pb-5">

      <button
        onClick={() => setOpen(!open)}
        className="w-full py-4 flex items-center justify-between"
      >
        <span className="text-xs font-bold uppercase tracking-widest">
          {title}
        </span>

        <span>
          {open ? "-" : "+"}
        </span>
      </button>

      {open && children}
    </div>
  );
}