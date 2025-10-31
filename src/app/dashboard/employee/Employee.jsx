"use client";
import Link from "next/link";

export default function EmployeeDashboard() {
  const cards = [
    {
      title: "Browse Jobs",
      description: "Explore all published jobs and apply easily.",
      href: "/dashboard/employee/jobs",
      icon: "🔍",
      color: "from-indigo-400 to-indigo-600",
    },
    {
      title: "My Applications",
      description: "Track jobs you’ve applied for.",
      href: "/dashboard/employee/applications",
      icon: "📄",
      color: "from-purple-400 to-purple-600",
    },
    // Add more cards here if needed
  ];

  return (
    <div className="p-8 min-h-screen bg-gradient-to-br from-indigo-100 via-white to-indigo-50">
      
      <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((card, idx) => (
          <Link key={idx} href={card.href}>
            <div className="group relative p-6 rounded-2xl shadow-lg bg-white hover:shadow-2xl transition-transform transform hover:-translate-y-1 cursor-pointer">
              {/* Gradient icon circle */}
              <div
                className={`w-12 h-12 flex items-center justify-center rounded-full bg-gradient-to-br ${card.color} text-white text-xl mb-4`}
              >
                {card.icon}
              </div>

              <h2 className="text-xl font-semibold text-gray-800 group-hover:text-indigo-700 transition">
                {card.title}
              </h2>
              <p className="text-gray-600 mt-2">{card.description}</p>

              {/* Hover underline */}
              <div className="absolute bottom-4 left-6 w-0 h-1 bg-indigo-500 transition-all group-hover:w-10"></div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
