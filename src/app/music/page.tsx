"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Footer from "~/app/_components/Footer";
import Header from "~/app/_components/Header";
import { Button } from "~/components/ui/button";

interface Song {
  id: number;
  name: string;
  note: string[];
}

export default function Page() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const songId = searchParams.get("id");
  const [data, setData] = useState<string>("");
  const [notenum, setNotenum] = useState<number>(0);
  const [startTime, setStartTime] = useState(Date.now());
  const [elapsedTime, setElapsedTime] = useState(0);
  const [song, setSong] = useState<Song | null>(null);

  useEffect(() => {
    setStartTime(Date.now());
    const interval = setInterval(() => {
      setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, [startTime]);

  useEffect(() => {
    const fetchSong = async () => {
      try {
        console.log(songId);
        const response = await fetch(`/api/song?id=${songId}`);
        if (!response.ok) {
          throw new Error("Error");
        }
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const songData = await response.json();
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        setSong(songData);
      } catch (error) {
        console.error("Error:", error);
      }
    };

    if (songId) {
      void fetchSong();
    }

    const fetchData = async () => {
      try {
        const response = await fetch("/api/serial-data");
        if (!response.ok) {
          throw new Error("Error");
        }
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const result = await response.json();
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
        setData(result.data);
      } catch (error) {
        console.error("Error:", error);
      }
    };

    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    const interval = setInterval(fetchData, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (song?.note[notenum] && data.trim() == song?.note[notenum].trim()){
      if (notenum + 1 < song.note.length) {
        setNotenum((prevNotenum) => prevNotenum + 1);
      } else {
        router.push(`/result?elapsedTime=${elapsedTime}`);
      }
    }
  }, [data, song, notenum]);

  return (
    <div>
      <Header />
      <div className="mt-10 flex flex-col items-center">
        <h2 className="mb-4 text-2xl">演奏曲：{song?.name}</h2>
        <h2 className="mb-4">
          次の音は <span className="text-5xl">{song?.note[notenum]}</span>
        </h2>
        <Button variant="outline" className="mb-4">
          <Link href="/">演奏中断</Link>
        </Button>
        <p className="mb-2">
          センサーからの受け取り値 <span className="text-5xl">{data}</span>
        </p>
        <p className="mb-2"></p>
        <p>
          経過時間：<span className="text-3xl">{elapsedTime}</span> 秒
        </p>
      </div>
      <Footer />
    </div>
  );
}
