const Footer = () => {
  return (
    <footer className="w-full py-6 text-center text-sm text-zinc-400 bg-[#0f172a]">
      <p>
        © {new Date().getFullYear()} Oliver Enrique Sures Mora, GitHub:{" "}
        <a
          href="https://github.com/Oliveresm"
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-white transition-colors"
        >
          github.com/Oliveresm
        </a>
      </p>
    </footer>
  );
};

export default Footer;
