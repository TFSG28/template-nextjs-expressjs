'use client';
import Switch from "@/components/Switch";
import Tooltip from "@/components/Tooltip";
import Image from "next/image";
import { toast } from "react-toastify";
import { useState, useEffect } from "react";
import Link from "next/link";
import Skeleton from "react-loading-skeleton";
import { useAuth } from "@/context/auth-context";
import SlideBar from "@/components/SlideBar";
import { Button } from "@mui/material";
export default function Home() {
  const [isSelected, setIsSelected] = useState(false);
  const [loading, setLoading] = useState(true);
  const { logout, user } = useAuth();

  useEffect(() => {
    // Simulate loading delay
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <div className="flex flex-col gap-[32px] row-start-2 items-center">
        {loading ? (
          <Skeleton width={180} height={20} />
        ) : (
          <Image
            className="dark:invert"
            src="/next.svg"
            alt="Next.js logo"
            width={180}
            height={38}
            priority
          />
        )}
        <div className="flex gap-4 items-center justify-center flex-col sm:flex-row">
          {loading ? (
            <div className="flex gap-4 flex-wrap justify-center">
              <Skeleton width={120} height={38} borderRadius={50} count={4} inline={true}/>
            </div>
          ) : (
            <>
              <Tooltip text="Hello Success">
                <button className="rounded-full bg-green-500 border border-solid border-transparent transition-colors flex items-center justify-center text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-auto" 
                  onClick={() => toast.success('Hello Success')}>
                  <p>Toast Success</p>  
                </button>
              </Tooltip>
              <Tooltip text="Hello Warning">
                <button className="rounded-full bg-yellow-500 border border-solid border-transparent transition-colors flex items-center justify-center text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-auto" 
                  onClick={() => toast.warning('Hello Warning')}>
                  <p>Toast Warning</p>  
                </button>
              </Tooltip>
              <Tooltip text="Hello Error">
                <button className="rounded-full bg-red-500 border border-solid border-transparent transition-colors flex items-center justify-center text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-auto" 
                onClick={() => toast.error('Hello Error')}>
                  <p>Toast Error</p>  
                </button>
              </Tooltip>
              <Tooltip text="Hello Info">
                <button className="rounded-full bg-blue-500 border border-solid border-transparent transition-colors flex items-center justify-center text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-auto" 
                  onClick={() => toast.info('Hello Info')}>
                  <p>Toast Info</p>  
                </button>
              </Tooltip>
            </>
          )}
        </div>
        {loading ? (
          <Skeleton width={60} height={20}/>
        ) : (
          <Switch isSelected={isSelected} onValueChange={() => {setIsSelected(!isSelected)}}/>
        )}
        {loading ? (
          <Skeleton width={300} height={38} borderRadius={50}/>
        ) : (
          <div>
            <SlideBar />
          </div>
        )}
        {loading ? (
          <Skeleton width={100} height={38} borderRadius={50}/>
        ) : (
          <>
            {!user ? (
              <Link href="/login">
                <Button variant="contained" sx={{ borderRadius: 50 }}>Login</Button>
              </Link>
            ) : (
              <Button variant="contained" color="error" onClick={logout} sx={{ borderRadius: 50 }}>Logout</Button>
            )}
          </>
        )}
      </div>
    </div>
  );
} 
