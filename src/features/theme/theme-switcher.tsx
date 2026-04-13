"use client";

import { useTheme } from "next-themes";
import { Sun, Moon, Display } from "@gravity-ui/icons";
import { ButtonGroup, Button } from "@heroui/react";
import { useIsClient } from "@/lib/use-is-client";
import clsx from "clsx";

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  const isClient = useIsClient();
  const activeClass = isClient ? "bg-foreground/20" : "";

  return (
    <ButtonGroup variant="tertiary" size="sm">
      <Button
        isIconOnly
        aria-label="Light theme"
        onPress={() => setTheme("light")}
        className={clsx(theme === "light" && activeClass)}
      >
        <Sun />
      </Button>
      <Button
        isIconOnly
        aria-label="Dark theme"
        onPress={() => setTheme("dark")}
        className={clsx(theme === "dark" && activeClass)}
      >
        <ButtonGroup.Separator />
        <Moon />
      </Button>
      <Button
        isIconOnly
        aria-label="System theme"
        onPress={() => setTheme("system")}
        className={clsx(theme === "system" && activeClass)}
      >
        <ButtonGroup.Separator />
        <Display />
      </Button>
    </ButtonGroup>
  );
}
