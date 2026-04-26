import { Delete, CornerDownLeft } from "lucide-react";
import { cn } from "@/lib/utils";

const rows = [
  ["Q","W","E","R","T","Y","U","I","O","P"],
  ["A","S","D","F","G","H","J","K","L"],
  ["ENTER","Z","X","C","V","B","N","M","BACK"],
];

const states: Record<string, "correct" | "present" | "absent" | undefined> = {
  P: "correct", L: "correct", A: "correct", T: "correct", E: "correct",
  S: "present", R: "present",
  C: "absent", N: "absent", D: "absent", I: "absent", U: "absent", O: "absent",
};

export function VirtualKeyboard() {
  return (
    <div className="surface-soft mx-auto w-full max-w-[560px] p-3 sm:p-4">
      <div className="flex flex-col gap-1.5">
        {rows.map((row, i) => (
          <div key={i} className="flex justify-center gap-1 sm:gap-1.5">
            {row.map((k) => {
              const s = states[k];
              const wide = k === "ENTER" || k === "BACK";
              return (
                <button
                  key={k}
                  type="button"
                  className={cn(
                    "kbd-key",
                    wide && "kbd-key-wide",
                    s === "correct" && "kbd-key-correct",
                    s === "present" && "kbd-key-present",
                    s === "absent" && "kbd-key-absent",
                  )}
                >
                  {k === "BACK" ? <Delete className="size-4" /> : k === "ENTER" ? <CornerDownLeft className="size-4" /> : k}
                </button>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
