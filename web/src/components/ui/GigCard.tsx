import Link from "next/link";

export const GigCard: React.FC<{ gig: any }> = ({ gig }) => {
  return (
    <div className="bg-white p-6 rounded-xl border-2 border-[#1E3A8A] shadow-[0_6px_0_0_#1E3A8A] hover:shadow-[0_4px_0_0_#1E3A8A] hover:translate-y-[2px] transition-all">
      <h2 className="text-2xl font-bold text-[#1E3A8A] mb-2">{gig.gigName}</h2>
      <p className="text-[#FF5C00] mb-4">{gig.gigDescription}</p>
      <div className="flex flex-wrap gap-2 mb-4">
        {gig.tags.map((tag: any, index: number) => (
          <span
            key={index}
            className="bg-[#FFE1A1] text-[#1E3A8A] px-2 py-1 rounded-full text-sm"
          >
            {tag}
          </span>
        ))}
      </div>
      <p className="text-[#1E3A8A] mb-2">Budget: ${gig.budget}</p>
      <p className="text-[#1E3A8A] mb-4">
        Deadline: {new Date(gig.deadline).toLocaleDateString()}
      </p>
      <div className="flex justify-between items-center">
        <span
          className={`px-2 py-1 rounded-full text-sm ${
            gig.isAccepted
              ? "bg-green-200 text-green-800"
              : "bg-yellow-200 text-yellow-800"
          }`}
        >
          {gig.isAccepted ? "Accepted" : "Open"}
        </span>
        <Link
          href={`/gigs/${gig.uid}`}
          className="px-4 py-2 bg-[#FF5C00] rounded-full font-bold text-white border-2 border-[#1E3A8A] shadow-[0_4px_0_0_#1E3A8A] hover:shadow-[0_2px_0_0_#1E3A8A] hover:translate-y-[2px] transition-all"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};
