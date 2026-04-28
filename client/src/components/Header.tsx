interface HeaderProps {
  totalCount: number;
  recommendedCount: number;
  matchCount: number;
}

export function Header({ totalCount, recommendedCount, matchCount }: HeaderProps) {
  return (
    <header className="border border-[var(--line)] rounded-2xl bg-white shadow-sm mb-3.5 p-4 px-[18px]">
      <div className="flex items-end justify-between gap-3.5 flex-wrap">
        <div className="grid gap-1">
          <p className="m-0 mb-2 text-[var(--muted)] uppercase tracking-[0.12em] text-[0.69rem] font-[Scto_Grotesk_A,Avenir_Next,Hiragino_Sans,sans-serif] font-bold">
            Brand Asset Portal
          </p>
          <h1 className="m-0 flex items-baseline gap-[0.45rem] text-[clamp(1.1rem,1.55vw,1.42rem)] leading-[1.08] tracking-tight whitespace-nowrap font-[Scto_Grotesk_A,Avenir_Next,Hiragino_Sans,sans-serif] font-semibold text-[#1b002d]">
            <img
              className="block w-[clamp(5.9rem,9vw,8.1rem)] h-auto flex-shrink-0"
              src="/assets/legalon-logo-color.svg"
              alt="LegalOn"
            />
            <span>Brand Asset Portal</span>
          </h1>
        </div>

        <div className="flex gap-2 flex-wrap">
          <StatCard label="assets" value={totalCount} />
          <StatCard label="recommended" value={recommendedCount} />
          <StatCard label="matches" value={matchCount} />
        </div>
      </div>
    </header>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="min-w-[108px] py-2.5 px-3 rounded-lg bg-white border border-[var(--line)]">
      <span className="block text-[var(--muted)] text-[0.64rem] uppercase tracking-[0.1em]">
        {label}
      </span>
      <strong className="block mt-1 text-lg leading-none">{value}</strong>
    </div>
  );
}
