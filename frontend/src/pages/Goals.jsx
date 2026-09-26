import { useEffect, useState } from "react";
import { get, post } from "../services/api";

export default function Goals() {
  const [skills, setSkills] = useState([]);
  const [goals, setGoals] = useState([]);

  const [skillId, setSkillId] = useState("");
  const [goalTitle, setGoalTitle] = useState("");
  const [targetValue, setTargetValue] = useState("");
  const [unit, setUnit] = useState("hours");
  const [deadline, setDeadline] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        setError("");

        const [skillsResult, goalsResult] = await Promise.all([
          get("/api/skills"),
          get("/api/goals"),
        ]);

        setSkills(skillsResult);
        setGoals(goalsResult);

        if (skillsResult.length > 0) {
          setSkillId(skillsResult[0].id);
        }
      } catch (error) {
        console.error("Goals API error:", error);
        setError("Unable to load goals.");
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  async function handleAddGoal() {
    if (!skillId || !goalTitle.trim() || !targetValue) {
      setError("Please select a skill, enter a goal, and set a target.");
      return;
    }

    if (Number(targetValue) <= 0) {
      setError("Target value must be greater than 0.");
      return;
    }

    try {
      setSaving(true);
      setError("");

      const newGoal = await post("/api/goals", {
        skill_id: skillId,
        title: goalTitle.trim(),
        target_value: Number(targetValue),
        unit,
        deadline,
      });

      setGoals((currentGoals) => [
        {
          ...newGoal,
          current_value: 0,
          progress: 0,
          milestones: [],
        },
        ...currentGoals,
      ]);

      setGoalTitle("");
      setTargetValue("");
      setDeadline("");
    } catch (error) {
      console.error("Add goal API error:", error);
      setError("Unable to save the goal.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="page">
        <h2>Goals & Milestones</h2>
        <p>Loading goals...</p>
      </div>
    );
  }

  return (
    <div className="page">
      <h2>Goals & Milestones</h2>

      <div className="card">
        <h3>Create a Goal</h3>

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
              type="text"
              value={goalTitle}
              onChange={(event) => setGoalTitle(event.target.value)}
              placeholder="Enter your goal..."
            />

            <input
              type="number"
              min="1"
              value={targetValue}
              onChange={(event) => setTargetValue(event.target.value)}
              placeholder="Target value"
            />

            <select
              value={unit}
              onChange={(event) => setUnit(event.target.value)}
            >
              <option value="hours">Hours</option>
              <option value="minutes">Minutes</option>
              <option value="sessions">Sessions</option>
            </select>

            <input
              type="date"
              value={deadline}
              onChange={(event) => setDeadline(event.target.value)}
            />

            <button onClick={handleAddGoal} disabled={saving}>
              {saving ? "Saving..." : "Add Goal"}
            </button>
          </>
        )}

        {error && <p className="error-message">{error}</p>}
      </div>

      <div className="card">
        <h3>Your Goals</h3>

        {goals.length === 0 ? (
          <p>No goals created yet.</p>
        ) : (
          goals.map((goal) => (
            <div key={goal.id} className="post-card">
              <h4>{goal.title}</h4>

              <p>
                Skill: <strong>{goal.skill_name}</strong>
              </p>

              <p>
                Progress: {goal.current_value} / {goal.target_value}{" "}
                {goal.unit}
              </p>

              <div
                style={{
                  width: "100%",
                  height: "10px",
                  backgroundColor: "#e5e7eb",
                  borderRadius: "5px",
                  overflow: "hidden",
                  marginBottom: "10px",
                }}
              >
                <div
                  style={{
                    width: `${Math.min(goal.progress || 0, 100)}%`,
                    height: "100%",
                    backgroundColor: "#2563eb",
                  }}
                />
              </div>

              <p>
                Completion: {goal.progress || 0}%
              </p>

              {goal.deadline && (
                <p>
                  Deadline: {goal.deadline}
                </p>
              )}

              {goal.milestones && goal.milestones.length > 0 && (
                <div>
                  <h4>Milestones</h4>

                  {goal.milestones.map((milestone, index) => (
                    <p key={index}>
                      {milestone.achieved ? "✅" : "⬜"}{" "}
                      {milestone.title}
                    </p>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}