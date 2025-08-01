import { HoverEffect } from "../../../../ui/Cards/cardHoverEffect";

const featureCards = [
  {
    title: "TypeScript",
    description: "Static typing for safer and scalable code.",
    link: "#",
  },
  {
    title: "React",
    description: "Powerful UI rendering for fast, responsive views.",
    link: "#",
  },
  {
    title: "Docker",
    description: "Containerized development and production environments.",
    link: "#",
  },
  {
    title: "MySQL",
    description: "Relational database for structured chat and user data.",
    link: "#",
  },
  {
    title: "REST",
    description: "Stateless APIs for authentication and user management.",
    link: "#",
  },
  {
    title: "SOLID Principles",
    description: "Maintainable and modular code design in both frontend and backend.",
    link: "#",
  },
  {
    title: "Express",
    description: "Minimal and flexible backend routing and logic.",
    link: "#",
  },
  {
    title: "Tailwind CSS",
    description: "Utility-first styling for a clean, responsive UI.",
    link: "#",
  },
];


export default function FeaturesSection() {
  return (
    <section
      id="features"
      className="bg-gradient-to-t from-[#0d111a] via-[#151c29] to-[#1a2231] py-24"
    >
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-4xl font-bold text-center mb-4">Features</h2>
        <p className="text-xl text-center text-gray-400">Tecnologias</p>

        <HoverEffect
          items={featureCards}
          className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
        />
      </div>
    </section>
  );
}