import { useState } from "react";
import type { SkillCheck, RollResult } from "../lib/types";

interface Props {
  skillCheck: SkillCheck;
  onRoll: (result: RollResult) => void;
}

export function DiceRoller({ skillCheck, onRoll }: Props) {
  const [displayNum, setDisplayNum] = useState<number | null>(null);
  const [rolling, setRolling] = useState(false);
  const [result, setResult] = useState<RollResult | null>(null);

  const handleRoll = () => {
    if (rolling || result) return;

    const finalRoll = Math.floor(Math.random() * 20) + 1;
    setRolling(true);

    let iterations = 0;
    const TOTAL_ITERATIONS = 18;

    const interval = setInterval(() => {
      setDisplayNum(Math.floor(Math.random() * 20) + 1);
      iterations++;

      if (iterations >= TOTAL_ITERATIONS) {
        clearInterval(interval);
        setDisplayNum(finalRoll);
        setRolling(false);

        const rollResult: RollResult = {
          roll: finalRoll,
          success: finalRoll >= skillCheck.dc,
        };
        setResult(rollResult);

        // Brief pause so the player can see the result before the DM continues
        setTimeout(() => onRoll(rollResult), 1800);
      }
    }, 80);
  };

  const dieColor = () => {
    if (!result) return "border-amber-500 text-amber-300";
    if (result.roll === 20) return "border-yellow-300 text-yellow-200 shadow-yellow-400/50";
    if (result.roll === 1) return "border-red-600 text-red-400 shadow-red-600/50";
    if (result.success) return "border-green-500 text-green-300 shadow-green-500/40";
    return "border-red-500 text-red-400 shadow-red-500/40";
  };

  return (
    <div className="mt-4 rounded-lg border border-amber-800/40 bg-stone-900/80 p-4 flex flex-col gap-4">
      {/* Check info */}
      <div className="flex items-center gap-3">
        <div className="flex flex-col">
          <span className="text-amber-200 font-semibold text-base tracking-wide">
            {skillCheck.type} Check
          </span>
          <span className="text-stone-400 text-sm">
            DC {skillCheck.dc} &middot; {skillCheck.ability}
          </span>
        </div>
      </div>

      {/* Die + button row */}
      <div className="flex items-center gap-5">
        {/* d20 shape */}
        <div
          className={`
            w-16 h-16 flex items-center justify-center
            border-2 rounded-sm shadow-lg transition-all duration-150
            font-bold text-2xl select-none
            ${dieColor()}
            ${rolling ? "animate-pulse" : ""}
          `}
          style={{ clipPath: "polygon(50% 0%, 95% 25%, 95% 75%, 50% 100%, 5% 75%, 5% 25%)" }}
        >
          {displayNum ?? "?"}
        </div>

        {/* Roll button or result label */}
        {!result ? (
          <button
            onClick={handleRoll}
            disabled={rolling}
            className="
              px-5 py-2.5 rounded-md font-semibold text-sm tracking-wide
              bg-amber-700 hover:bg-amber-600 active:bg-amber-800
              text-amber-100 border border-amber-600
              disabled:opacity-50 disabled:cursor-not-allowed
              transition-colors duration-100
            "
          >
            {rolling ? "Rolling…" : "Roll d20"}
          </button>
        ) : (
          <div className="flex flex-col gap-0.5">
            <span className={`font-bold text-base ${result.success ? "text-green-400" : "text-red-400"}`}>
              {result.roll === 20
                ? "Natural 20!"
                : result.roll === 1
                ? "Natural 1!"
                : result.success
                ? "Success"
                : "Failed"}
            </span>
            <span className="text-stone-400 text-sm">
              Rolled {result.roll} vs DC {skillCheck.dc}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
