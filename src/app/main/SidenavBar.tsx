"use client";

import { useState } from "react";
import SideBarIcon from "../icons/sidebar";
import SideLeftBar from "./SideLeftBar";

export default function SidenavBar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="w-18 h-[calc(100vh-3.5rem)] flex justify-center items-start border-r border-input pt-4 px-4 bg-transparent">
        <button className="cursor-pointer" onClick={() => setOpen(true)}>
          <SideBarIcon />
        </button>
      </div>

      {open && <SideLeftBar onClose={() => setOpen(false)} />}
    </>
  );
}
