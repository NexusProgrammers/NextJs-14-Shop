"use client";

import { useCallback, useState } from "react";
import Avatar from "../Avatar";
import { AiFillCaretDown } from "react-icons/ai";
import Link from "next/link";
import MenuItem from "./MenuItem";
import { signOut } from "next-auth/react";
import BackDrop from "./BackDrop";
import { SafeUser } from "@/types";
import { useRouter } from "next/navigation";

interface UserMenuProps {
  currentUser: SafeUser | null;
}

const UserMenu: React.FC<UserMenuProps> = ({ currentUser }) => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter()

  const toggleOpen = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  return (
    <>
      <div className="relative z-30">
        <div
          onClick={toggleOpen}
          className="p-2 border-[1px] border-slate-400 flex flex-row items-center rounded-full cursor-pointer hover:shadow-md transition text-slate-700"
        >
          <Avatar src={currentUser?.image}  />
          <AiFillCaretDown />
        </div>
        {isOpen && (
          <div className="absolute rounded-md shadow-md w-[170px] bg-white overflow-hidden right-0 top-12 text-sm flex flex-col cursor-pointer">
            {currentUser ? (
              <div>
                <Link href={"/orders"}>
                  <MenuItem onClick={toggleOpen}>Your Orders</MenuItem>
                </Link>
                <Link href={"/admin"}>
                  <MenuItem onClick={toggleOpen}>Admin Dashbaord</MenuItem>
                </Link>
                <hr />
                <MenuItem
                  onClick={() => {
                    signOut();
                    router.push("/")
                    toggleOpen();
                  }}
                >
                  Sign out
                </MenuItem>
              </div>
            ) : (
              <div>
                <Link href={"/signin"}>
                  <MenuItem onClick={toggleOpen}>Sign In</MenuItem>
                </Link>
                <Link href={"/signup"}>
                  <MenuItem onClick={toggleOpen}>Sign Up</MenuItem>
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
      {isOpen && <BackDrop onClick={toggleOpen} />}
    </>
  );
};

export default UserMenu;
