import type { ChatMessage, RollResult, SkillCheck } from "../lib/types";
import { DiceRoller } from "./DiceRoller";

interface Props {
  message: ChatMessage;
  onRoll?: (skillCheck: SkillCheck, result: RollResult) => void;
}

// Minimal markdown renderer: bold, italic, line breaks, bullet lists.
// Content comes from our local model only — no user-supplied HTML.
function renderMarkdown(text: string): string {
  return text
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/^[-•] (.+)$/gm, '<span class="suggestion-bullet">$1</span>')
    .replace(/\n{2,}/g, "</p><p>")
    .replace(/\n/g, "<br />");
}

export function Message({ message, onRoll }: Props) {
  // ── Roll result message ──────────────────────────────────────────────────
  if (message.isRollResult) {
    return (
      <div className="flex justify-center my-2">
        <span className="text-xs text-stone-500 italic px-3 py-1 rounded-full border border-stone-700/50 bg-stone-900/60">
          {message.content}
        </span>
      </div>
    );
  }

  // ── Player message ───────────────────────────────────────────────────────
  if (message.role === "user") {
    return (
      <div className="flex justify-end mb-4">
        <div className="max-w-[70%] px-4 py-2.5 rounded-lg bg-stone-700/60 border border-stone-600/40 text-stone-200 text-sm leading-relaxed">
          {message.content}
        </div>
      </div>
    );
  }

  // ── DM message ───────────────────────────────────────────────────────────
  const { narrative, suggestions, skillCheck } = parseDMMessage(message);

  return (
    <div className="mb-6">
      {/* Narrative */}
      <div
        className="dm-narrative text-amber-100/90 leading-7 text-[0.95rem]"
        dangerouslySetInnerHTML={{ __html: `<p>${renderMarkdown(narrative)}</p>` }}
      />

      {/* Skill check (replaces suggestions when present) */}
      {skillCheck && onRoll && (
        <DiceRoller
          skillCheck={skillCheck}
          onRoll={(result) => onRoll(skillCheck, result)}
        />
      )}

      {/* Suggestions */}
      {!skillCheck && suggestions.length > 0 && (
        <div className="mt-4 flex flex-col gap-2">
          {suggestions.map((s, i) => (
            <SuggestionChip key={i} text={s} />
          ))}
        </div>
      )}
    </div>
  );
}

// ── Suggestion chip ────────────────────────────────────────────────────────

interface SuggestionChipProps {
  text: string;
}

function SuggestionChip({ text }: SuggestionChipProps) {
  return (
    <div className="flex items-start gap-2 text-sm text-stone-300 leading-relaxed pl-1">
      <span className="mt-1 shrink-0 w-1.5 h-1.5 rounded-full bg-amber-600/70" />
      <span>{text}</span>
    </div>
  );
}

// ── Helpers ────────────────────────────────────────────────────────────────

function parseDMMessage(message: ChatMessage): {
  narrative: string;
  suggestions: string[];
  skillCheck: SkillCheck | null;
} {
  // The App already parsed these into the message object.
  // Message.content holds only the narrative; suggestions and skillCheck are separate fields.
  return {
    narrative: message.content,
    suggestions: message.suggestions ?? [],
    skillCheck: message.skillCheck ?? null,
  };
}
