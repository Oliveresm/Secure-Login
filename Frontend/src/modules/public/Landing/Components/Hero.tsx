import FlipText from "../../../../ui/Texts/FlipText";
import { ArrowRight, ArrowDown } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Hero() {
  const navigate = useNavigate();

  return (
    <section className="w-full h-screen text-center relative flex flex-col justify-between px-4">
      <div className="flex-1 flex flex-col items-center justify-center">
        <h1 className="text-7xl font-extrabold leading-tight text-white">
          A&nbsp;
          <FlipText
            text="LOGIN"
            stagger={0.12}
            timing={0.4}
            className="text-indigo-500"
          />
          &nbsp;with React
        </h1>

        <p className="mt-6 text-2xl text-gray-400">
          A blazing-fast WhatsApp-style chat built on Vite, WebSockets and
          MySQL.
        </p>

        <div className="mt-8 flex justify-center gap-4 flex-wrap">
          <button
            type="button"
            onClick={() => navigate("/login")}
            className="transition-transform transform hover:scale-105
          text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br
          focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 shadow-lg shadow-blue-500/50
          dark:shadow-lg dark:shadow-blue-800/80 font-medium rounded-lg text-base px-6 py-3 flex items-center gap-2"
          >
            Get Started
            <ArrowRight size={20} className="animate-wiggle-right" />
          </button>

          <a href="#features">
            <button
              type="button"
              className="transition-transform transform hover:scale-105
      text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100
      focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-base px-6 py-3
      dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700
      dark:hover:border-gray-600 dark:focus:ring-gray-700"
            >
              Learn More
            </button>
          </a>
        </div>
      </div>

      {/* Flecha animada abajo */}
      <a
        href="#features"
        className="absolute bottom-20 left-1/2 -translate-x-1/2 text-white hover:text-gray-300"
      >
        <ArrowDown size={32} className="animate-bounce" />
      </a>
    </section>
  );
}
