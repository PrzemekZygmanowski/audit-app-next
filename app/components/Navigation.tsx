import clsx from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

const navLinks = [
  { name: "Home", path: "/" },
  { name: "Desktop", path: "/desktop" },
  { name: "Manual", path: "/desktop/manual" },
  { name: "Desktop Execa", path: "/desktop/execa" },
  { name: "Browser", path: "/browser" },
];

export const Navigation: React.FC = () => {
  const pathname = usePathname();

  return (
    <nav className='bg-blue-500  p-4'>
      <ul className='flex justify-around'>
        {navLinks.map(link => (
          <li key={link.name}>
            <Link
              href={link.path}
              className={clsx(
                "flex h-[36px] grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3",
                {
                  "bg-sky-100 text-blue-600": pathname === link.path,
                }
              )}>
              {link.name}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};
