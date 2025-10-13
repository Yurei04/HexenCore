export default function ComputerScreen() {
  return (
    <div className="relative w-[31.25rem] h-[31.25rem] flex items-center justify-center">
      {/* The inner content box (inside the screen) */}
      <div className="w-[80%] h-[60%] bg-neutral-900 rounded-md z-10 shadow-inner border border-neutral-700" />

      {/* The TV/screen image — on top */}
      <div
        className="absolute inset-0 bg-[url('/images/screen.png')] bg-cover bg-center pointer-events-none z-20"
        aria-hidden="true"
      />
    </div>
  );
}
