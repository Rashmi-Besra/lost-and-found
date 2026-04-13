const Loading = ({ isDarkMode }) => {
  return (
    <div
      className={`flex items-center justify-center h-screen w-full transition-all duration-500 ${
        isDarkMode
          ? "bg-black text-emerald-400"
          : "bg-white text-emerald-600"
      }`}
    >
      <h1 className="text-4xl md:text-5xl font-bold tracking-wide animate-pulse">
        Re<span className="animate-bounce inline-block">claim</span>
      </h1>
    </div>
  );
};

export default Loading;