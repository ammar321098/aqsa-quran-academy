import { useEffect, useRef } from "react";

interface Props {
  isDirty: boolean;
}

export function useUnsavedChangesGuard({ isDirty }: Props) {
  const allowNavigationRef = useRef(false);

  useEffect(() => {
    // Refresh / Close tab protection
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (!isDirty) return;

      e.preventDefault();
      e.returnValue = "";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    // Internal <a> navigation protection
    const handleClick = (e: MouseEvent) => {
      if (!isDirty) return;
      if (allowNavigationRef.current) return;

      const anchor = (e.target as HTMLElement).closest("a");
      if (!anchor) return;

      if (anchor.target === "_blank" || anchor.hasAttribute("download")) {
        return;
      }

      const url = new URL(anchor.href, window.location.href);

      if (url.origin !== window.location.origin) return;

      const confirmLeave = window.confirm(
        "You have unsaved changes. Are you sure you want to leave?",
      );

      if (!confirmLeave) {
        e.preventDefault();
      } else {
        allowNavigationRef.current = true;
      }
    };

    document.addEventListener("click", handleClick, true);

    // Back button protection
    window.history.pushState(null, "", window.location.href);

    const handlePopState = () => {
      if (!isDirty) return;

      if (allowNavigationRef.current) {
        allowNavigationRef.current = false;
        return;
      }

      const confirmLeave = window.confirm(
        "You have unsaved changes. Are you sure you want to leave?",
      );

      if (!confirmLeave) {
        window.history.pushState(null, "", window.location.href);
      } else {
        allowNavigationRef.current = true;
        window.history.go(-3);
      }
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      document.removeEventListener("click", handleClick, true);
      window.removeEventListener("popstate", handlePopState);
    };
  }, [isDirty]);
}
