"use client";

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { SplineScene } from '@/components/ui/splite';

export function SplineSceneWrapper() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [currentScene, setCurrentScene] = useState<string>("");

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      setCurrentScene(
        resolvedTheme === 'dark'
          ? "https://prod.spline.design/vsaphMWTFpDw8RsO/scene.splinecode"
          : "https://prod.spline.design/a-X-XpK4S2NGpwdR/scene.splinecode"
      );
    }
  }, [resolvedTheme, mounted]);

  if (!mounted || !currentScene) {
    return null;
  }

  return (
    <SplineScene
      scene={currentScene}
      className="w-full h-full"
    />
  );
}