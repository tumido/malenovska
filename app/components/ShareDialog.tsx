
import { useEffect } from "react";
import {
  FacebookShareButton,
  FacebookIcon,
  RedditShareButton,
  RedditIcon,
  TwitterShareButton,
  TwitterIcon,
  WhatsappShareButton,
  WhatsappIcon,
} from "react-share";
import { Copy } from "lucide-react";
import clipboardCopy from "clipboard-copy";

interface ShareDialogProps {
  title: string;
  eventName: string;
  open: boolean;
  onClose: () => void;
}

const ShareDialog = ({ title: shareTitle, eventName, open, onClose }: ShareDialogProps) => {
  const title = `${eventName}: ${shareTitle}`;

  useEffect(() => {
    if (open && typeof navigator !== "undefined" && navigator.share) {
      navigator.share({ title, url: window.location.href }).finally(onClose);
    }
  }, [open, title, onClose]);

  if (!open || (typeof navigator !== "undefined" && typeof navigator.share === "function")) return null;

  const url = typeof window !== "undefined" ? window.location.href : "";

  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/50" onClick={onClose} />
      <div className="fixed left-1/2 top-1/2 z-50 w-full max-w-sm -translate-x-1/2 -translate-y-1/2 rounded-lg bg-primary p-6 shadow-2xl">
        <h3 className="mb-4 text-lg font-bold text-primary-light">
          Sdílet &ldquo;{title}&rdquo;
        </h3>
        <ul className="space-y-2">
          <li>
            <FacebookShareButton url={url} className="flex w-full items-center gap-3 rounded p-2 hover:bg-white/10">
              <FacebookIcon size={32} round />
              <span>Sdílet na Facebooku</span>
            </FacebookShareButton>
          </li>
          <li>
            <button
              onClick={() => clipboardCopy(url)}
              className="flex w-full items-center gap-3 rounded p-2 hover:bg-white/10"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-grey-500">
                <Copy size={16} />
              </span>
              <span>Kopírovat odkaz do schránky</span>
            </button>
          </li>
          <li>
            <WhatsappShareButton url={url} title={title} className="flex w-full items-center gap-3 rounded p-2 hover:bg-white/10">
              <WhatsappIcon size={32} round />
              <span>Poslat přes WhatsApp</span>
            </WhatsappShareButton>
          </li>
          <li>
            <TwitterShareButton url={url} title={title} className="flex w-full items-center gap-3 rounded p-2 hover:bg-white/10">
              <TwitterIcon size={32} round />
              <span>Sdílet na Twitter</span>
            </TwitterShareButton>
          </li>
          <li>
            <RedditShareButton url={url} title={title} className="flex w-full items-center gap-3 rounded p-2 hover:bg-white/10">
              <RedditIcon size={32} round />
              <span>Sdílet na Reddit</span>
            </RedditShareButton>
          </li>
        </ul>
      </div>
    </>
  );
};

export default ShareDialog;
