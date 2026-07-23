"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

type AlphabetIndexProps = {
  availableLetters: Set<string>;
  sectionPrefix?: string;
};

export function AlphabetIndex({ availableLetters, sectionPrefix = "companies" }: AlphabetIndexProps) {
  const [activeLetter, setActiveLetter] = useState<string | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const scrollToLetter = useCallback(
    (letter: string) => {
      const el = document.getElementById(`${sectionPrefix}-${letter}`);
      if (!el) return;
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      setActiveLetter(letter);
    },
    [sectionPrefix],
  );

  useEffect(() => {
    observerRef.current?.disconnect();

    const sections = LETTERS.filter((l) => availableLetters.has(l))
      .map((l) => document.getElementById(`${sectionPrefix}-${l}`))
      .filter(Boolean) as HTMLElement[];

    if (sections.length === 0) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) {
          const id = visible[0].target.id.replace(`${sectionPrefix}-`, "");
          setActiveLetter(id);
        }
      },
      { rootMargin: "-20% 0px -60% 0px", threshold: [0, 0.25, 0.5] },
    );

    for (const section of sections) {
      observerRef.current.observe(section);
    }

    return () => observerRef.current?.disconnect();
  }, [availableLetters, sectionPrefix]);

  return (
    <nav className="companies-alpha-index" aria-label="Jump to letter">
      <ul>
        {LETTERS.map((letter) => {
          const available = availableLetters.has(letter);
          return (
            <li key={letter}>
              <button
                type="button"
                className={[
                  "companies-alpha-index-btn",
                  available ? "available" : "disabled",
                  activeLetter === letter ? "active" : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
                disabled={!available}
                onClick={() => scrollToLetter(letter)}
                aria-label={available ? `Jump to ${letter}` : `${letter} — no companies`}
              >
                {letter}
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

export function groupCompaniesByLetter<T extends { name: string }>(
  items: T[],
): { letter: string; items: T[] }[] {
  const map = new Map<string, T[]>();

  const sorted = [...items].sort((a, b) =>
    a.name.localeCompare(b.name, undefined, { sensitivity: "base" }),
  );

  for (const item of sorted) {
    const first = item.name.trim()[0]?.toUpperCase() ?? "#";
    const letter = /[A-Z]/.test(first) ? first : "#";
    if (!map.has(letter)) map.set(letter, []);
    map.get(letter)!.push(item);
  }

  return Array.from(map.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([letter, groupItems]) => ({ letter, items: groupItems }));
}
