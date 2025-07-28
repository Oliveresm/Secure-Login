import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 text-white py-4 px-[25px] backdrop-blur-md transition-colors duration-300 ${
        scrolled ? "bg-black/40" : "bg-transparent"
      }`}
    >
      <div className="max-w-[1480px] mx-auto w-full flex items-center justify-between">
        <a href="/" className="flex items-center space-x-3 overflow-visible">
          <img
            src="/Icon_white_without_Background.webp"
            alt="Logo"
            className="h-12 w-auto object-contain transition-transform duration-300 hover:scale-105"
          />
          <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white transition-transform duration-300 hover:scale-105">
            Voxtar
          </span>
        </a>


        <div className="flex space-x-4">

          <button
            type="button"
            onClick={() => navigate("/register")}
            className="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-semibold tracking-wider rounded-lg text-sm px-8 py-2.5 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700 transform transition duration-300 hover:scale-105"
          >
            Register
          </button>

          <button
            type="button"
            onClick={() => navigate("/login")}
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-semibold tracking-wider rounded-lg text-sm px-8 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800 transform transition duration-300 hover:scale-105"
          >
            Login
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
