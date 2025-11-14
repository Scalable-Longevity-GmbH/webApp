import React from "react";
import Image from "next/image";
import { Bell } from "lucide-react";
import Link from "next/link";

export default function Profile() {
  return (
    <div className="flex flex-row gap-2 items-center justify-center">
      <Link
        href="/dashboard"
        className="text-gray-600 hover:text-gray-800 w-12 h-12 flex justify-center items-center rounded-full hover:bg-gray-200 transition"
      >
        <Bell />
      </Link>
      <Image
        src="/doctor.jpg"
        alt="Profile"
        width={100}
        height={100}
        className="rounded-full w-12 h-12 object-cover"
      />
    </div>
  );
}
