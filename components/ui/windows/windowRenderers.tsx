import type { AppId } from "@/data/Data";
import { NotesContent } from "./NotesContent";
import { CameraAlbumContent } from "./CameraAlbumContent";
import { GithubContent } from "./GithubContent";
import { NotebookContent } from "./NotebookContent";
import { LinkedinContent } from "./LinkedinContent";
import { PlayerContent } from "./PlayerContent";
import { PortfolioContent } from "./PortfolioContent";
import { PixelmatorContent } from "./PixelmatorContent";

export function getWindowRenderer(appId: AppId) {
    const renderers: Record<AppId, () => React.ReactNode> = {
    note: () => <NotesContent />,
    camera: () => <CameraAlbumContent />,
    github: () => <GithubContent username="Mahesh-4017" />,
    notebook: () => <NotebookContent />,
    linkedin: () => <LinkedinContent />,
    music: () => <PlayerContent />,
    portfolio: () => <PortfolioContent />,
    pixelmator: () => <PixelmatorContent />,
  };
  return renderers[appId];
}