'use client'

import { useState } from 'react'
import Link from 'next/link'
import LogoutButton from './auth/LogoutButton'

export default function BurgerMenu() {
  const [open, setOpen] = useState(false)

  const toggleMenu = () => setOpen(!open)


  return (
    <div className="relative">
      {/* Button */}
      <button
        onClick={toggleMenu}
        className="flex flex-col items-center justify-center w-8 h-8 space-y-1 focus:outline-none"
      >
        <span className="w-6 h-0.5 bg-black"></span>
        <span className="w-6 h-0.5 bg-black"></span>
        <span className="w-6 h-0.5 bg-black"></span>
      </button>

      {/* Dropdown menu */}
      {open && (
        <div className="absolute right-0 z-10 w-48 mt-2 bg-white border rounded-md shadow-md">
          <ul className="p-2 space-y-1">
            <li>
              <Link href="/" className="block px-4 py-2 hover:bg-gray-100">
                Home
              </Link>
            </li>
            <li>
              <Link href="/trackers" className="block px-4 py-2 hover:bg-gray-100">
                Trackers
              </Link>
            </li>
            <li>
              <LogoutButton className='block px-4 py-2 hover:bg-gray-100' />
            </li>
          </ul>
        </div>
      )}
    </div>
  )
}
