"use client"

import { useState } from "react"
import SideBarIcon from "../icons/sidebar"
import SideLeftBar from "./SideLeftBar"

export default function SidenavBar() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <div className="w-[72px] h-screen flex justify-center border-r border-input pt-4 px-4 bg-transparent">
        <button onClick={() => setOpen(true)}>
          <SideBarIcon />
        </button>
      </div>

      {open && <SideLeftBar onClose={() => setOpen(false)} />}
    </>
  )
}
