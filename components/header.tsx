"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import React from "react";
import { cn } from "@/lib/utils";
import { authClient } from "@/lib/auth/client";
import { Logo } from "./logo";
import ButtonUser from "./button-user";

export const HeroHeader = () => {
  const [isScrolled, setIsScrolled] = React.useState(false);

  const { data: session } = authClient.useSession();

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  return (
    <header>
      <nav className="fixed z-20 w-full px-2 top-0 left-0">
        <div
          className={cn(
            "mx-auto mt-2 max-w-6xl px-4 transition-all duration-300 lg:px-12",
            isScrolled &&
              "max-w-4xl rounded-2xl border border-border/70 bg-background/80 backdrop-blur-md shadow-sm lg:px-5",
          )}
        >
          <div className="relative flex flex-wrap items-center justify-between gap-6 py-3 lg:gap-0 lg:py-4">
            <div className="flex w-full justify-between lg:w-auto">
              <Link
                href="/"
                aria-label="home"
                className="flex items-center space-x-2"
              >
                <Logo />
              </Link>
              <div className="block lg:hidden">
                <ButtonUser />
              </div>
            </div>

            <div className="bg-background in-data-[state=active]:block lg:in-data-[state=active]:flex mb-6 hidden w-full flex-wrap items-center justify-end space-y-8 rounded-3xl border border-border/70 p-6 shadow-sm md:flex-nowrap lg:m-0 lg:flex lg:w-fit lg:gap-6 lg:space-y-0 lg:border-transparent lg:bg-transparent lg:p-0 lg:shadow-none">
              {session ? (
                <ButtonUser />
              ) : (
                <div className="flex w-full flex-col space-y-3 sm:flex-row sm:gap-3 sm:space-y-0 md:w-fit">
                  <Button
                    variant="outline"
                    size="sm"
                    className={cn(isScrolled && "lg:hidden")}
                  >
                    <Link href="#">
                      <span>Login</span>
                    </Link>
                  </Button>
                  <Button size="sm" className={cn(isScrolled && "lg:hidden")}>
                    <Link href="#">
                      <span>Sign Up</span>
                    </Link>
                  </Button>
                  <Button
                    size="sm"
                    className={cn(isScrolled ? "lg:inline-flex" : "hidden")}
                  >
                    <Link href="#">
                      <span>Get Started</span>
                    </Link>
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};
