"use client";

import Link from "next/link";
import { useSearchParams } from 'next/navigation';
import Footer from "~/app/_components/Footer";
import Header from "~/app/_components/Header";
import { Button } from "~/components/ui/button";

export default function Page() {
    const searchParams = useSearchParams();
    const elapsedTime = searchParams.get("elapsedTime");
    return (
     <div>
       <Header />
         <div className="flex flex-col items-center mt-10">
           <p className="text-xl mb-4">
             記録：<span className="text-3xl text-red-500">{elapsedTime}</span> 秒
           </p>
           <Button variant="outline" className="mb-4">
           <Link href="/">
           Topに戻る
           </Link>
           </Button>
         </div>
         <Footer />
     </div>
      );
    };