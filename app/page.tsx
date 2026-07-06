// Placeholder home — Stage 3 replaces this with the real section components.
// For now it just exercises the Stage 1 design tokens (palette + fonts).
export default function Home() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-4 bg-paper px-6 text-center text-ink">
      <span className="font-script text-4xl text-ink">Charlie Ramus</span>
      <h1 className="font-serif text-3xl tracking-tight text-ink sm:text-5xl">
        Design system online.
      </h1>
      <p className="max-w-md font-sans text-ink-soft">
        Foundation stage — palette and fonts wired up. The homepage lands in
        Stage 3.
      </p>
      <div className="mt-2 flex gap-3">
        <span className="size-6 rounded-full bg-red" />
        <span className="size-6 rounded-full bg-blue" />
        <span className="size-6 rounded-full bg-yellow" />
        <span className="size-6 rounded-full bg-pink" />
        <span className="size-6 rounded-full bg-cyan" />
      </div>
    </main>
  );
}
