import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col justify-center items-center h-screen">
      <h2>Not Found</h2>
      <p>Could not find requested resource</p>
      <Link href="/" className="bg-gray-400 p-3 rounded-2xl text-white">
        Return Home
      </Link>
    </div>
  );
}
