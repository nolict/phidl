export const C = {
  page: "_page_bwga5_1",
  scene: "_scene_bwga5_154",
  hero: "_hero_bwga5_173",
  section2: "_section2_bwga5_184",
  s2inner: "_s2inner_bwga5_200",
  s2head: "_s2head_bwga5_205",
  s2line: "_s2line_bwga5_214",
  s2body: "_s2body_bwga5_220",
  in: "_in_bwga5_49",
  nav: "_nav_bwga5_415",
  logo: "_logo_bwga5_427",
  logoBtn: "_logoBtn_bwga5_434",
  tagline: "_tagline_bwga5_440",
  cta: "_cta_bwga5_449",
  headline: "_headline_bwga5_473",
  word: "_word_bwga5_496",
  letter: "_letter_bwga5_500",
  space: "_space_bwga5_504",
  waitPill: "_waitPill_bwga5_520",
  waitPillOn: "_waitPillOn_bwga5_520",
  pillMark: "_pillMark_bwga5_613",
  pillBtn: "_pillBtn_bwga5_622",
  section5: "_section5_bwga5_683",
  s5inner: "_s5inner_bwga5_696",
  s5head: "_s5head_bwga5_699",
  s5headLine: "_s5headLine_bwga5_709",
  s5in: "_s5in_bwga5_696",
  s5sub: "_s5sub_bwga5_748",
  s5list: "_s5list_bwga5_755",
  s5row: "_s5row_bwga5_758",
  s5left: "_s5left_bwga5_780",
  s5chanceLabel: "_s5chanceLabel_bwga5_787",
  s5chance: "_s5chance_bwga5_787",
  s5num: "_s5num_bwga5_799",
  s5photo: "_s5photo_bwga5_805",
  s5desc: "_s5desc_bwga5_813",
} as const;

export const BRAND = "phidl";
export const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://phidl.web.id";
export const REPO = "https://github.com/nolict/phinime-release/releases";
// /latest/download/ always serves the newest asset, no version pin to update
export const APK = `${REPO}/latest/download/app-release.apk`;
export const REPO_PK = "https://github.com/artsbymat/phioskop-release/releases";
export const APK_PK = `${REPO_PK}/releases/latest`;
export const TG = "https://t.me/phidl";

export const HEADLINE = "Tiga aplikasi tanpa bayar";
export const TAGLINE =
  "Anime, manga, manhwa, film bioskop, dan drakor di satu tempat. Tanpa bayar, tanpa iklan.";

export const S2_LINES: { t: string; ml: string }[] = [
  { t: "Tanpa iklan.", ml: "38vw" },
  { t: "Tanpa bayar,", ml: "21vw" },
  { t: "tanpa batasan,", ml: "11vw" },
  { t: "tanpa ribet.", ml: "0" },
];
export const S2_BODY =
  "Phinime buat nonton anime, donghua, dan baca manga. Phikor buat nonton drakor. Phioskop buat nonton film bioskop. Tinggal pasang di handphone, buka, langsung dipakai. Tanpa iklan, gratis, tanpa langganan bulanan.";

export const APPS_HEAD = ["Download satu.", "Atau download", "ketiganya."];
export const APPS_SUB = "Dua sudah bisa dipakai. Satu masih disiapkan.";
export type App = {
  name: string;
  slug: string;
  status: string;
  desc: string;
  tags: string[];
  initial: string;
  color: string;
  href?: string;
  logo?: string;
  seo: { title: string; desc: string; h1: string; body: string[] };
};

export const APPS: App[] = [
  {
    name: "Phinime",
    slug: "phinime",
    status: "Tersedia",
    desc: "Nonton anime dan donghua, baca manga. Sub dan dub, tanpa iklan.",
    tags: ["Anime", "Donghua", "Manga"],
    initial: "Ph",
    color: "#c9c4ff",
    logo: "/phinime.png",
    href: APK,
    seo: {
      title: "Phinime APK — Download & Nonton Anime Sub Indo Gratis",
      desc: "Download APK Phinime untuk Android dan nonton anime sub Indo gratis, plus donghua dan manga. Tanpa iklan, tanpa langganan, langsung dari repo GitHub.",
      h1: "Download Phinime APK",
      body: [
        "Phinime adalah aplikasi Android untuk nonton anime sub Indo dan donghua sekaligus membaca manga dalam satu tempat. Semua judul bisa dibuka langsung setelah aplikasi dipasang, tanpa daftar akun dan tanpa langganan bulanan.",
        "Tidak ada iklan yang memotong tontonan, tidak ada batas resolusi, dan tidak ada kunci episode di tengah seri. Riwayat tontonan tersimpan di perangkat, jadi lanjut nonton tetap di posisi terakhir meski aplikasi ditutup.",
        "Cara pasang: unduh berkas APK lewat tombol di atas, buka Notification atau folder Download di HP, lalu pilih Install. Aktifkan izin \"Install unknown apps\" untuk browser atau file manager yang dipakai kalau Android memintanya.",
        "APK diperbarui lewat halaman Releases di GitHub. Tombol di halaman ini selalu mengarah ke build terbaru, jadi tidak perlu cari versi baru secara manual setiap kali ada pembaruan.",
      ],
    },
  },
  {
    name: "Phioskop",
    slug: "phioskop",
    status: "Tersedia",
    desc: "Nonton film bioskop kapan saja, gratis tanpa langganan.",
    tags: ["Film"],
    initial: "Po",
    color: "#a4d6e7",
    logo: "/phioskop.png",
    href: APK_PK,
    seo: {
      title: "Phioskop APK — Download & Nonton Film Sub Indo Gratis",
      desc: "Download APK Phioskop untuk Android dan nonton film sub Indo gratis tanpa langganan. Film bioskop terbaru, tanpa iklan mengganggu, build dari repo.",
      h1: "Download Phioskop APK",
      body: [
        "Phioskop dipakai untuk nonton film sub Indo di HP: film baru, film lama, sampai judul yang sulit ditemukan di layanan streaming resmi Indonesia. Semua tersedia tanpa tiket dan tanpa langganan.",
        "Katalog film di dalamnya bisa ditelusuri per genre dan diurutkan, dan pemutar video mendukung subtitle Indonesia. Tidak ada iklan pop-up yang menutup player di tengah film.",
        "Cara pasang: unduh APK dari tautan di atas, buka berkasnya, izinkan pemasangan dari sumber tidak dikenal bila diminta, lalu jalankan aplikasi. Ukuran berkas sekitar 30 MB sehingga hemat kuota.",
        "Versi ditandai di nama berkas (Phioskop-vX.Y.Z.apk), jadi halaman ini mengambil rilis terakhir dari GitHub dan mengarahkan tombol ke berkas terbaru secara otomatis.",
      ],
    },
  },
  {
    name: "Phikor",
    slug: "phikor",
    status: "Segera",
    desc: "Nonton drakor lengkap, tanpa iklan yang motong tontonan.",
    tags: ["Drakor"],
    initial: "Pk",
    color: "#e7c9a4",
    seo: {
      title: "Phikor APK — Nonton Drakor Sub Indo Gratis (Segera)",
      desc: "Phikor APK untuk nonton drakor sub Indo gratis tanpa iklan. Dalam pengerjaan — daftar lewat Telegram untuk tahu saat build pertama dirilis.",
      h1: "Phikor APK — segera hadir",
      body: [
        "Phikor disiapkan untuk nonton drakor sub Indo lengkap dengan subtitle Indonesia. Fokusnya satu: satu seri utuh dalam satu tempat, episode berurutan, tanpa iklan yang memotong atau mengulang adegan.",
        "Aplikasi ini masih dalam pengerjaan. Belum ada APK yang bisa dipasang, jadi tombol unduh di halaman ini sengaja belum aktif.",
        "Pengumuman build pertama akan dikirim di kanal Telegram phidl. Bergabung lebih awal supaya tidak ketinggalan saat versi perdananya dibuka.",
      ],
    },
  },
];

export const POSTERS = Array.from({ length: 12 }, (_, i) => `/posters/${String(i + 1).padStart(2, "0")}.jpg`);
