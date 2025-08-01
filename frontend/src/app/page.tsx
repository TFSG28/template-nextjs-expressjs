'use client';
import Switch from "@/components/Switch";
import Tooltip from "@/components/Tooltip";
import Image from "next/image";
import { toast } from "react-toastify";
import { useState } from "react";
import Link from "next/link";

export default function Home() {
  const [isSelected, setIsSelected] = useState(false);
  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <div className="flex flex-col gap-[32px] row-start-2 items-center">
        <Image
          className="dark:invert"
          src="/next.svg"
          alt="Next.js logo"
          width={180}
          height={38}
          priority
        />
        <ol className="font-mono list-inside list-decimal text-sm/6 text-center sm:text-left">
          <li className="mb-2 tracking-[-.01em]">
            Get started by editing{" "}
            <code className="bg-black/[.05] dark:bg-white/[.06] font-mono font-semibold px-1 py-0.5 rounded">
              src/app/page.tsx
            </code>
            .
          </li>
          <li className="tracking-[-.01em]">
            Save and see your changes instantly.
          </li>
        </ol>
        <div className="flex gap-4 items-center justify-center flex-col sm:flex-row">
          <button className="rounded-full bg-green-500 border border-solid border-transparent transition-colors flex items-center justify-center text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-auto" 
            onClick={() => toast.success('Hello Success')}>
            <p>Toast Success</p>  
          </button>
          <button className="rounded-full bg-yellow-500 border border-solid border-transparent transition-colors flex items-center justify-center text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-auto" 
            onClick={() => toast.warning('Hello Warning')}>
            <p>Toast Warning</p>  
          </button>
          <button className="rounded-full bg-red-500 border border-solid border-transparent transition-colors flex items-center justify-center text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-auto" 
            onClick={() => toast.error('Hello Error')}>
            <p>Toast Error</p>  
          </button>
        </div>
        <Tooltip text="Hello Tooltip">
          <button className="rounded-full bg-blue-500 border border-solid border-transparent transition-colors flex items-center justify-center text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-auto" 
            onClick={() => toast.info('Hello Info')}>
            <p>Toast Info</p>  
          </button>
        </Tooltip>
        <Switch isSelected={isSelected} onValueChange={() => {setIsSelected(!isSelected)}}/>
        <Link href="/login">
          <button className="rounded-full bg-white border border-solid border-transparent transition-colors flex items-center justify-center text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-auto" 
          >
            <p>Login</p>  
          </button>
        </Link>
      </div>
    </div>
  );
}
