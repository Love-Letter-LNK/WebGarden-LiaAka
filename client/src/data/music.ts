// Local music database for the Digital Garden
export interface Song {
    id: number;
    title: string;
    artist: string;
    src: string;
    duration?: string;
}

export const musicPlaylist: Song[] = [
    {
        id: 1,
        title: "About You x Guilty As Sin",
        artist: "The 1975 x Taylor Swift",
        src: "/about you x guilty as sin_ (the 1975 x taylor swift).mp3",
    },
    {
        id: 2,
        title: "Terbuang Dalam Waktu",
        artist: "Barasuara",
        src: "/Barasuara_-_Terbuang_Dalam_Waktu_(mp3.pm).mp3",
    },
    {
        id: 3,
        title: "You Are Enough",
        artist: "Sleeping At Last",
        src: "/Sleeping_At_Last_-_You_Are_Enough_CeeNaija.com_.mp3",
    },
];
