import React from "react";
import Logo from "./HeaderNav/Logo";
import NavLinks from "./HeaderNav/NavLinks";
import Profile from "./HeaderNav/Profile";

export default function HeaderNav() {
  return (
    <div className="flex flex-row justify-between items-center w-full px-6 py-2 h-[10vh]">
      <Logo />
      <NavLinks />
      <Profile />
    </div>
  );
}
