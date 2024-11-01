"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "~/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import Footer from "./_components/Footer";
import Header from "./_components/Header";

interface Song {
  id: number;
  name: string;
  note: string[];
}

export default function Page() {
  // const [data, setData] = useState<string>("");
  const [songs, setSongs] = useState<Song[]>([]);
  const [selectedSongId, setSelectedSongId] = useState<number>(0);
  
  useEffect(() => {
    const fetchSongs = async () => {
      try {
        const response = await fetch("/api/songs");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const data = await response.json();
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        setSongs(data);
      } catch (error) {
        console.error("Error fetching songs:", error);
      }
    };

    void fetchSongs();
  }, []);

  const handleSongSelect = (songId: string) => {
    setSelectedSongId(Number(songId));
  };

  return (
    <div>
      <Header />
      <div className="mt-10 flex flex-col items-center">
        <p className="mb-4">お題に合わせて音を鳴らし、速さを競うゲームです。</p>
        <div className="inline-flex items-center space-x-4">
          <Select onValueChange={handleSongSelect}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="曲名を選択してください" />
            </SelectTrigger>
            <SelectContent>
            {songs.map((song) => (
                <SelectItem key={song.id} value={song.id.toString()}>
                  {song.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button  variant="outline" disabled={selectedSongId == 0}>
          <Link href={`/music/?id=${encodeURIComponent(selectedSongId)}`}>
          演奏開始
          </Link>
          </Button>
        </div>
      </div>
      <Footer />
    </div>
  );
}
