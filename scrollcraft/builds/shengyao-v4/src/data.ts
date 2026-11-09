// Every figure here comes from Resume_Siew Sheng Yao.pdf or the Microsoft
// Learn study guide. Nothing is invented. Keep it that way.

export const EMAIL = "shengyao330@gmail.com";
export const LINKEDIN = "https://www.linkedin.com/in/sheng-yao-siew-a02716278/";
export const GITHUB = "https://github.com/shengyaosiew";
export const CREDENTIAL = "https://learn.microsoft.com/en-us/users/yao-7536/credentials/e877120f43cbe1db";
export const STUDY_GUIDE = "https://learn.microsoft.com/en-gb/credentials/certifications/resources/study-guides/pl-300";
export const CV = "./media/resume-siew-sheng-yao.pdf";

export const media = (f: string) => `./media/${f}`;

// Labels live in i18n.tsx; these are the ids and order.
export const NAV = ["power-bi", "impact", "journey", "skills", "events", "projects"] as const;

// Certificates (from the CV and the old site). Only PL-300 has a public verify link.
export const CERTS = [
  { logo: "ms-associate-badge.svg", year: "2025", href: CREDENTIAL, key: "pl300" },
  { logo: "aws.png", year: "2025", key: "aws" },
  { logo: "google.png", year: "2025", key: "google" },
  { logo: "postman.png", year: "2024", key: "postman" },
] as const;

// Exam weights from the Microsoft Learn study guide. Text is in i18n.tsx.
export const EXAM_SKILLS = [
  { pct: "25–30%", weight: 27.5 },
  { pct: "25–30%", weight: 27.5 },
  { pct: "25–30%", weight: 27.5 },
  { pct: "15–20%", weight: 17.5 },
];

// Project images are real screenshots of the live sites (scripts/shoot-projects.cjs)
// or the project's own YouTube thumbnail. No image = we could not capture it honestly.
export type Project = { slug: string; href?: string; img?: string; shape: "wide" | "phone" | "photo"; note?: "noLink" | "asleep" };
export const PROJECTS: Project[] = [
  { slug: "klt", href: "https://www.klt.com.my/", img: "pj-klt.webp", shape: "wide" },
  { slug: "artivo", href: "https://edu-artivo.com/en/", img: "pj-artivo.webp", shape: "wide" },
  { slug: "namecard", href: "https://weycang.my.canva.site/", img: "pj-namecard.webp", shape: "phone" },
  { slug: "grocery", href: "https://www.youtube.com/watch?v=acIB2kOPO2M", img: "pj-grocery.webp", shape: "wide" },
  { slug: "chatbot", href: "https://iai-chatbot-15.streamlit.app/", img: "pj-chatbot.webp", shape: "photo" },
  { slug: "ipsskin", href: "https://ibeautynew.demo.com.my/en/", img: "pj-ipsskin.webp", shape: "photo" },
];
