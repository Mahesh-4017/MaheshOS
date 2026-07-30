"use client";

import { useEffect, useState } from "react";
import { Star, GitFork, Users, MapPin } from "lucide-react";

type Repo = {
  name: string;
  description: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  html_url: string;
};

type Profile = {
  avatar_url: string;
  name: string | null;
  bio: string | null;
  followers: number;
  following: number;
  location: string | null;
  public_repos: number;
};

const LANGUAGE_COLORS: Record<string, string> = {
  TypeScript: "#3178c6",
  JavaScript: "#f1e05a",
  Python: "#3572A5",
  HTML: "#e34c26",
  CSS: "#563d7c",
  Java: "#b07219",
  "C++": "#f34b7d",
  Go: "#00ADD8",
  Rust: "#dea584",
  Shell: "#89e051",
};

export function GithubContent({ username = "Mahesh-4017" }: { username?: string }) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [repos, setRepos] = useState<Repo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;

    Promise.all([
      fetch(`https://api.github.com/users/${username}`).then((res) => {
        if (!res.ok) throw new Error("GitHub API error");
        return res.json();
      }),
      fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=6`).then(
        (res) => {
          if (!res.ok) throw new Error("GitHub API error");
          return res.json();
        }
      ),
    ])
      .then(([userData, repoData]) => {
        if (!cancelled) {
          setProfile(userData);
          setRepos(repoData);
          setLoading(false);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setError(true);
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [username]);

  const openProfile = () => {
    window.open(`https://github.com/${username}`, "_blank", "noopener,noreferrer");
  };

  const openRepo = (url: string) => {
    window.open(url, "_blank", "noopener,noreferrer");
  };

  if (loading) {
    return (
      <div className="p-6 space-y-3 animate-pulse">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-full bg-neutral-200" />
          <div className="space-y-2">
            <div className="h-3 w-32 rounded bg-neutral-200" />
            <div className="h-2.5 w-24 rounded bg-neutral-200" />
          </div>
        </div>
        <div className="h-24 w-full rounded-md bg-neutral-200" />
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="p-6 text-sm text-neutral-500">
        Couldn&apos;t load live data.{" "}
        <a
          href={`https://github.com/${username}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 underline"
        >
          View profile on GitHub ↗
        </a>
      </div>
    );
  }

  return (
    <div
      className="bg-white"
      onContextMenu={(e) => {
        e.preventDefault();
        openProfile();
      }}
    >
      {/* Profile header */}
      <button
        onClick={openProfile}
        className="w-full flex items-center gap-4 p-5 text-left hover:bg-black/[0.02] transition-colors"
      >
        <img
          src={profile.avatar_url}
          alt={username}
          className="h-24 w-24 rounded-full ring-1 ring-black/10 shrink-0"
        />
        <div className="min-w-0 flex-1">
          <p className="font-semibold text-neutral-900 text-lg truncate">
            {profile.name ?? username}
          </p>
          <p className="text-xs text-neutral-400 truncate">@{username}</p>
          {profile.bio && (
            <p className="text-xs text-neutral-500 mt-1 line-clamp-2">{profile.bio}</p>
          )}
        </div>
      </button>

      <div className="flex items-center gap-4 px-5 pb-4 text-xs text-neutral-500">
        <span className="flex items-center gap-1">
          <Users className="h-3.5 w-3.5" />
          {profile.followers} followers
        </span>
        <span>{profile.public_repos} repos</span>
        {profile.location && (
          <span className="flex items-center gap-1">
            <MapPin className="h-3.5 w-3.5" />
            {profile.location}
          </span>
        )}
      </div>

      {/* Contribution graph, full width */}
      <div className="px-5 pb-4">
        <img
          src={`https://ghchart.rshah.org/${username}`}
          alt={`${username}'s contribution graph`}
          className="w-full rounded-md border border-black/5"
          loading="lazy"
        />
      </div>

      {/* Stat cards, side by side */}
      {/* <div className="grid grid-cols-2 gap-3 px-5 pb-5">
        <img
          src="/git.png"
          alt={`${username}'s GitHub stats`}
          className="w-full rounded-md border border-black/5"
          loading="lazy"
        />
        <img
          src="/languages.png"
          alt={`${username}'s most used languages`}
          className="w-full rounded-md border border-black/5"
          loading="lazy"
        />
      </div> */}

      {/* Repo list */}
      <p className="px-5 pb-2 text-xs font-semibold uppercase tracking-wide text-neutral-400">
        Recent repositories
      </p>
      <div className="border-t border-black/5">
        {repos.map((r) => (
          <a
            key={r.name}
            href={r.html_url}
            target="_blank"
            rel="noopener noreferrer"
            onContextMenu={(e) => {
              e.preventDefault();
              e.stopPropagation();
              openRepo(r.html_url);
            }}
            className="flex items-start justify-between gap-3 px-5 py-3 border-b border-black/5 hover:bg-black/[0.03] transition-colors"
          >
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-neutral-800 truncate">{r.name}</p>
              <p className="text-xs text-neutral-500 mt-0.5 line-clamp-1">
                {r.description ?? "No description"}
              </p>
              <div className="flex items-center gap-3 mt-1.5 text-[11px] text-neutral-400">
                {r.language && (
                  <span className="flex items-center gap-1">
                    <span
                      className="h-2 w-2 rounded-full"
                      style={{
                        backgroundColor: LANGUAGE_COLORS[r.language] ?? "#8b8b8b",
                      }}
                    />
                    {r.language}
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <Star className="h-3 w-3" /> {r.stargazers_count}
                </span>
                <span className="flex items-center gap-1">
                  <GitFork className="h-3 w-3" /> {r.forks_count}
                </span>
              </div>
            </div>
          </a>
        ))}
      </div>

      <a
        href={`https://github.com/${username}`}
        target="_blank"
        rel="noopener noreferrer"
        className="block text-center py-3 text-sm font-medium text-blue-600 hover:bg-black/[0.03] transition-colors"
      >
        View full profile on GitHub ↗
      </a>
    </div>
  );
}