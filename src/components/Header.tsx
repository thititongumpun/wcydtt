"use client";

import * as React from "react";
import Link from "next/link";
import { Rocket, Star, Menu } from "lucide-react";
import { cn } from "@/lib/utils";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ModeToggle } from "./mode-toggle";

const SpaceNavbar: React.FC = () => {
  return (
    <div className="w-full bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          <Link href="/" className="flex items-center space-x-2">
            <Rocket className="h-6 w-6 text-purple-400" />
            <span className="text-xl font-bold text-white">WCYDTT</span>
          </Link>
          <NavigationMenu className="hidden md:flex">
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger className="bg-transparent text-white hover:bg-purple-800 hover:text-purple-200">
                  Explore
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                    <li className="row-span-3">
                      <NavigationMenuLink asChild>
                        <Link
                          className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-purple-500 to-purple-900 p-6 no-underline outline-none focus:shadow-md"
                          href="/"
                        >
                          <Star className="h-6 w-6 text-white" />
                          <div className="mt-4 mb-2 text-lg font-medium text-white">
                            Celestial Bodies
                          </div>
                          <p className="text-sm leading-tight text-purple-100">
                            Explore the wonders of our universe
                          </p>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                    <ListItem href="/planets" title="Planets">
                      Discover the planets in our solar system
                    </ListItem>
                    <ListItem href="/stars" title="Stars">
                      Learn about different types of stars
                    </ListItem>
                    <ListItem href="/galaxies" title="Galaxies">
                      Explore the vast galaxies beyond our own
                    </ListItem>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link href="/evmap" legacyBehavior passHref>
                  <NavigationMenuLink
                    className={cn(
                      navigationMenuTriggerStyle(),
                      "bg-transparent text-white hover:bg-purple-800 hover:text-purple-200"
                    )}
                  >
                    EV Map
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link href="/about" legacyBehavior passHref>
                  <NavigationMenuLink
                    className={cn(
                      navigationMenuTriggerStyle(),
                      "bg-transparent text-white hover:bg-purple-800 hover:text-purple-200"
                    )}
                  >
                    About
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
          <div className="flex items-center space-x-4">
            <ModeToggle />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden text-white hover:bg-purple-800 hover:text-purple-200"
                >
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-[200px] bg-slate-900 text-white"
              >
                <DropdownMenuItem>
                  <Link href="/" className="flex w-full">
                    Meme
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link href="/evmap" className="flex w-full">
                    EV map
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link href="/ev" className="flex w-full">
                    EV map
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </div>
  );
};

const ListItem = React.forwardRef<
  React.ComponentRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-purple-800 hover:text-purple-200",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none text-white">
            {title}
          </div>
          <p className="line-clamp-2 text-sm leading-snug text-purple-300">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";

export default SpaceNavbar;
