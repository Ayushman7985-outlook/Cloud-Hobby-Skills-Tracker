import { useEffect, useState } from "react";
import { get, post } from "../services/api";

export default function Practice() {
  const [skills, setSkills] = useState([]);
  const [skillId, setSkillId] = useState("");
  const [duration, setDuration] = useState("");
  const [activity, setActivity] = useState("");
  const [notes, setNotes] = useState("");

  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        setError("");

        const [skillsResult, sessionsResult] = await Promise.all([
          get("/api/skills"),
          get("/api/practice"),
        ]);

        setSkills(skillsResult);
        setSessions(sessionsResult);

        if (skillsResult.length > 0) {
          setSkillId(skillsResult[0].id);
        }
      } catch (error) {
        console.error("Practice page API error:", error);
        setError("Unable to load practice data.");
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  async function handleAddSession() {
    if (!skillId || !duration) {
      setError("Please select a skill and enter the duration.");
      return;
    }

    try {
      setSaving(true);
      setError("");

      const newSession = await post("/api/practice", {
        skill_id: skillId,
        duration_minutes: Number(duration),
        activity: activity.trim() || "Practice session",
        notes: notes.trim(),
        practiced_at: new Date().toISOString(),
      });

      const selectedSkill = skills.find(
  (skill) => skill.id === skillId
);

const sessionWithSkillName = {
  ...newSession,
  skill_name: selectedSkill?.skill_name || "Unknown Skill",
};

setSessions((currentSessions) => [
  sessionWithSkillName,
  ...currentSessions,
]);

      setDuration("");
      setActivity("");
      setNotes("");
    } catch (error) {
      console.error("Add practice API error:", error);
      setError("Unable to save practice session.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="page">
        <h2>Practice Sessions</h2>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="page">
      <h2>Practice Sessions</h2>

      <div className="card">
        <h3>Log Practice</h3>

        {skills.length === 0 ? (
          <p>
            No skills or hobbies found. Please add a skill first from the
            Skills page.
          </p>
        ) : (
          <>
            <select
              value={skillId}
              onChange={(event) => setSkillId(event.target.value)}
            >
              {skills.map((skill) => (
                <option key={skill.id} value={skill.id}>
                  {skill.skill_name}
                </option>
              ))}
            </select>

            <input
              type="number"
              min="1"
              value={duration}
              onChange={(event) => setDuration(event.target.value)}
              placeholder="Duration in minutes"
            />

            <input
              type="text"
              value={activity}
              onChange={(event) => setActivity(event.target.value)}
              placeholder="Activity"
            />

            <input
              type="text"
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              placeholder="Notes (optional)"
            />

            <button onClick={handleAddSession} disabled={saving}>
              {saving ? "Saving..." : "Log Session"}
            </button>
          </>
        )}

        {error && <p className="error-message">{error}</p>}
      </div>

      <div className="card">
        <h3>Practice History</h3>

        {sessions.length === 0 ? (
          <p>No practice sessions logged yet.</p>
        ) : (
          sessions.map((session) => (
            <div key={session.id} className="post-card">
              <h4>{session.skill_name || "Unknown Skill"}</h4>

              <p>
                Duration: {session.duration_minutes} minutes
              </p>

              <p>
                Activity: {session.activity}
              </p>

              {session.notes && (
                <p>Notes: {session.notes}</p>
              )}

              <p>
                Date:{" "}
                {session.practiced_at
                  ? new Date(
                      session.practiced_at
                    ).toLocaleDateString()
                  : "Unknown"}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}