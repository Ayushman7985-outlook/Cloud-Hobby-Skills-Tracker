import { useEffect, useState } from "react";
import { get, post, del } from "../services/api";

export default function Skills() {
  const [skillName, setSkillName] = useState("");
  const [category, setCategory] = useState("");
  const [skills, setSkills] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadSkills() {
      try {
        setLoading(true);
        setError("");

        const result = await get("/api/skills");

        setSkills(result);
      } catch (error) {
        console.error("Skills API error:", error);
        setError("Unable to load your skills.");
      } finally {
        setLoading(false);
      }
    }

    loadSkills();
  }, []);

  async function handleAddSkill() {
    const name = skillName.trim();
    const categoryName = category.trim() || "General";

    if (!name) {
      return;
    }

    try {
      setSaving(true);
      setError("");

      const newSkill = await post("/api/skills", {
        skill_name: name,
        category: categoryName,
        current_level: "BEGINNER",
        target_level: "INTERMEDIATE",
        start_date: "",
        target_date: "",
        status: "ACTIVE",
        description: "",
      });

      setSkills((currentSkills) => [newSkill, ...currentSkills]);

      setSkillName("");
      setCategory("");
    } catch (error) {
      console.error("Add skill API error:", error);
      setError("Unable to save the skill.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteSkill(skillId) {
    try {
      setError("");

      await del(`/api/skills/${skillId}`);

      setSkills((currentSkills) =>
        currentSkills.filter((skill) => skill.id !== skillId)
      );
    } catch (error) {
      console.error("Delete skill API error:", error);
      setError("Unable to delete the skill.");
    }
  }

  return (
    <div className="page">
      <h2>Skills & Hobbies</h2>

      <div className="card">
        <h3>Add a Skill or Hobby</h3>

        <input
          type="text"
          value={skillName}
          onChange={(event) => setSkillName(event.target.value)}
          placeholder="Skill or hobby name"
        />

        <input
          type="text"
          value={category}
          onChange={(event) => setCategory(event.target.value)}
          placeholder="Category (e.g. Programming, Music, Sports)"
        />

        <button onClick={handleAddSkill} disabled={saving}>
          {saving ? "Saving..." : "Add Skill"}
        </button>

        {error && <p className="error-message">{error}</p>}
      </div>

      <div className="card">
        <h3>Your Skills & Hobbies</h3>

        {loading ? (
          <p>Loading skills...</p>
        ) : skills.length === 0 ? (
          <p>No skills or hobbies added yet.</p>
        ) : (
          skills.map((skill) => (
            <div key={skill.id} className="post-card">
              <h4>{skill.skill_name}</h4>

              <p>Category: {skill.category}</p>

              <p>
                Level: {skill.current_level}
              </p>

              <button onClick={() => handleDeleteSkill(skill.id)}>
                Delete
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}