import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col justify-center items-center h-screen gap-6">
      <Link
        href="./user"
        className="bg-slate-300 rounded-4xl text-2xl w-72 text-center py-3"
      >
        Booking Course
      </Link>
      <Link
        href="./admin/login"
        className="bg-gray-300 rounded-4xl text-2xl w-72 text-center py-3"
      >
        Admin DashBoard
      </Link>
    </div>
  );
}
