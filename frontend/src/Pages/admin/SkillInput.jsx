import { useState } from "react";
import { toast } from "react-hot-toast";

export function SkillInput({ skills, setSkills }) {
  const [draft, setDraft] = useState("");

 const addSkill = () => {
  const s = draft.trim();
  if (!s) return;
  if (skills.includes(s)) {
    toast.error("Skill already added");
  } else {
    setSkills([...skills, s]);  // ✅ FIXED HERE
  }
  setDraft("");
};

const removeSkill = (s) => setSkills(skills.filter((x) => x !== s));  

  return (
    <div>
      <label className="mb-1 block text-sm font-medium">Skills</label>

      {/* chips */}
      {Array.isArray(skills) && skills.length > 0 && (
        <div className="mb-2 flex flex-wrap gap-2">
          {skills.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => removeSkill(s)}
              className="
                flex items-center gap-1 rounded-full bg-blue-100 px-3 py-1 text-sm
                text-blue-800 transition hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-300
              "
            >
              {s}
              <span aria-hidden className="font-bold leading-none">×</span>
            </button>
          ))}
        </div>
      )}

      
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="e.g. React"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addSkill()}
          className="
            flex-1 rounded-md border px-3 py-2 outline-none
            focus:ring-2 focus:ring-blue-500
          "
        />
        <button
          type="button"
          onClick={addSkill}
          className="
            rounded-md bg-blue-600 px-4 py-2 text-white font-semibold
            hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60
          "
          disabled={!draft.trim()}
        >
          Add
        </button>
      </div>
    </div>
  );
}
