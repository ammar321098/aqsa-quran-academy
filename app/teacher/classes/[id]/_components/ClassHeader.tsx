import Image from "next/image";

export function ClassHeader({ classroom }: { classroom: any }) {
  return (
    <div className="relative h-52 rounded-xl overflow-hidden mx-6 bg-linear-to-r from-green-500 to-emerald-700 text-white">
      <Image
        src="/coverpage.jpg"
        alt="Class cover"
        fill
        className="object-cover"
      />
      <div className="relative p-6 flex justify-between h-full">
        <div>
          <h1 className="text-3xl font-bold">{classroom.title}</h1>

          <p className="text-sm opacity-90">
            Department: {classroom.department?.name || "N/A"}
          </p>
        </div>
      </div>
    </div>
  );
}
