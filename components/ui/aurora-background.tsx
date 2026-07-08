"use client";

import { cn } from "@/lib/utils";
import React, { ReactNode, useEffect, useMemo, useRef, useState } from "react";

type AuroraVideoSource = {
  src: string;
  type: string;
};

type AuroraMedia = {
  enabled?: boolean;
  poster?: string;
  sources?: AuroraVideoSource[];
};

interface AuroraBackgroundProps extends React.HTMLProps<HTMLDivElement> {
  children: ReactNode;
  intensity?: "quiet" | "hero";
  backgroundMedia?: AuroraMedia;
}

export const AuroraBackground = ({
  className,
  children,
  intensity = "hero",
  backgroundMedia,
  ...props
}: AuroraBackgroundProps) => {
  const [videoReady, setVideoReady] = useState(false);
  const [videoFailed, setVideoFailed] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [compactViewport, setCompactViewport] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const resumeVideoTimeout = useRef<number | null>(null);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => setReduceMotion(query.matches);

    updatePreference();
    query.addEventListener("change", updatePreference);
    return () => query.removeEventListener("change", updatePreference);
  }, []);

  useEffect(() => {
    const query = window.matchMedia("(max-width: 900px)");
    const updateViewport = () => setCompactViewport(query.matches);

    updateViewport();
    query.addEventListener("change", updateViewport);
    return () => query.removeEventListener("change", updateViewport);
  }, []);

  const sources = useMemo(
    () => backgroundMedia?.sources?.filter((source) => source.src && source.type) ?? [],
    [backgroundMedia?.sources]
  );
  const mediaSignature = useMemo(
    () =>
      [
        backgroundMedia?.poster ?? "",
        ...sources.map((source) => `${source.type}:${source.src}`),
      ].join("|"),
    [backgroundMedia?.poster, sources]
  );

  const shouldUseVideo =
    backgroundMedia?.enabled === true &&
    sources.length > 0 &&
    !reduceMotion &&
    !compactViewport;

  useEffect(() => {
    setVideoReady(false);
    setVideoFailed(false);
  }, [mediaSignature, shouldUseVideo]);

  useEffect(() => {
    if (!shouldUseVideo) {
      return;
    }

    const resumeVideo = () => {
      resumeVideoTimeout.current = null;

      videoRef.current?.play().catch(() => undefined);
    };

    const pauseVideoDuringScroll = () => {
      if (resumeVideoTimeout.current !== null) {
        window.clearTimeout(resumeVideoTimeout.current);
      }

      videoRef.current?.pause();
      resumeVideoTimeout.current = window.setTimeout(resumeVideo, 180);
    };

    window.addEventListener("scroll", pauseVideoDuringScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", pauseVideoDuringScroll);

      if (resumeVideoTimeout.current !== null) {
        window.clearTimeout(resumeVideoTimeout.current);
        resumeVideoTimeout.current = null;
      }
    };
  }, [shouldUseVideo]);

  return (
    <div
      className={cn(
        "aurora-background",
        intensity === "quiet" && "aurora-background-quiet",
        className
      )}
      {...props}
    >
      <div
        className="aurora-field"
        aria-hidden="true"
      >
        {shouldUseVideo && (
          <video
            ref={videoRef}
            key={mediaSignature}
            className={cn("aurora-video", videoReady && !videoFailed && "is-ready")}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            poster={backgroundMedia?.poster}
            onCanPlay={() => setVideoReady(true)}
            onError={() => {
              setVideoReady(false);
              setVideoFailed(true);
            }}
          >
            {sources.map((source) => (
              <source key={`${source.type}:${source.src}`} src={source.src} type={source.type} />
            ))}
          </video>
        )}
      </div>
      <div className="aurora-content">{children}</div>
    </div>
  );
};
