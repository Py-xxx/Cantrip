export interface SkillCheck {
  type: string;    // e.g. "Persuasion"
  dc: number;      // Difficulty Class
  ability: string; // e.g. "CHA"
}

export interface RollResult {
  roll: number;
  success: boolean;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  isHidden?: boolean;       // sent to the AI but never shown in the chat (e.g. opening scene prompt)
  isRollResult?: boolean;   // roll result messages are role "user" but displayed differently
  skillCheck?: SkillCheck;  // present when the DM is waiting for a roll
  rollResult?: RollResult;  // filled in after the player rolls
  suggestions?: string[];   // clickable suggestion chips shown under DM messages
}

export interface OllamaMessage {
  role: "system" | "user" | "assistant";
  content: string;
}
