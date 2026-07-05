import { STATUS_FLOW, STATUSES, type ItemStatus } from "@/lib/constants";

export default function StatusTimeline({ status }: { status: string }) {
  const currentIndex = STATUS_FLOW.indexOf(status as ItemStatus);

  return (
    <ol className="space-y-3">
      {STATUS_FLOW.map((step, index) => {
        const done = currentIndex >= index && status !== "HIDDEN";
        const current = STATUS_FLOW[currentIndex] === step;
        const info = STATUSES[step];

        return (
          <li key={step} className="flex items-center gap-3">
            <span
              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-semibold ${
                done
                  ? current
                    ? "bg-blue-600 text-white"
                    : "bg-green-100 text-green-700"
                  : "bg-slate-100 text-slate-400"
              }`}
            >
              {done && !current ? "✓" : index + 1}
            </span>
            <span
              className={
                current ? "font-semibold text-blue-700" : "text-slate-600"
              }
            >
              {info.label}
            </span>
          </li>
        );
      })}
    </ol>
  );
}
