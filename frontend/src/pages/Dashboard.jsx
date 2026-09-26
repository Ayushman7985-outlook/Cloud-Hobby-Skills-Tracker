import { useEffect, useState } from "react";
import { get } from "../services/api";
import StatCard from "../components/StatCard";

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadDashboard() {
      try {
        const result = await get("/api/analytics/dashboard");

        if (isMounted) {
          setData(result);
        }
      } catch (error) {
        console.error("Dashboard API error:", error);

        if (isMounted) {
          setData(null);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadDashboard();

    return () => {
      isMounted = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="page">
        <h2>Dashboard</h2>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="page">
        <h2>Dashboard</h2>
        <p>Dashboard data is currently unavailable.</p>
        <p>
          Make sure the backend server is running and your account is
          authenticated.
        </p>
      </div>
    );
  }

  return (
    <div className="page">
      <h2>Dashboard</h2>

      <p className="dashboard-subtitle">
        Your hobby, skill and community progress overview.
      </p>

      {/* Main Analytics */}
      <div className="stats-grid">
        <StatCard
          title="Total Practice Hours"
          value={data.totalPracticeHours ?? 0}
        />

        <StatCard
          title="Weekly Practice Hours"
          value={data.weeklyPracticeHours ?? 0}
        />

        <StatCard
          title="Monthly Practice Hours"
          value={data.monthlyPracticeHours ?? 0}
        />

        <StatCard
          title="Current Streak"
          value={`${data.currentStreak ?? 0} days`}
        />

        <StatCard
          title="Longest Streak"
          value={`${data.longestStreak ?? 0} days`}
        />

        <StatCard
          title="Active Skills"
          value={data.activeSkills ?? 0}
        />

        <StatCard
          title="Goals Completed"
          value={data.goalsCompleted ?? 0}
        />

        <StatCard
          title="Active Goals"
          value={data.activeGoals ?? 0}
        />

        <StatCard
          title="Milestones Achieved"
          value={data.milestonesAchieved ?? 0}
        />

        <StatCard
          title="Community Posts"
          value={data.postsCount ?? 0}
        />

        <StatCard
          title="Likes Received"
          value={data.likesReceived ?? 0}
        />

        <StatCard
          title="Comments Received"
          value={data.commentsReceived ?? 0}
        />
      </div>

      {/* Most Practiced Skill */}
      <div className="dashboard-section">
        <h3>Most Practiced Skill</h3>

        <div className="dashboard-highlight">
          <strong>
            {data.mostPracticedSkill || "No practice data yet"}
          </strong>
        </div>
      </div>

      {/* Practice by Skill */}
      <div className="dashboard-section">
        <h3>Practice Hours by Skill</h3>

        {data.practiceBySkill &&
        data.practiceBySkill.length > 0 ? (
          <div className="practice-skill-list">
            {data.practiceBySkill
              .slice()
              .sort(
                (a, b) =>
                  b.minutes - a.minutes
              )
              .map((item) => (
                <div
                  className="practice-skill-row"
                  key={item.skill}
                >
                  <span>{item.skill}</span>

                  <strong>
                    {(item.minutes / 60).toFixed(1)} hours
                  </strong>
                </div>
              ))}
          </div>
        ) : (
          <p>No practice sessions recorded yet.</p>
        )}
      </div>

      {/* Community Engagement */}
      <div className="dashboard-section">
        <h3>Community Engagement</h3>

        <div className="dashboard-engagement">
          <div>
            <span>Posts</span>
            <strong>{data.postsCount ?? 0}</strong>
          </div>

          <div>
            <span>Likes</span>
            <strong>{data.likesReceived ?? 0}</strong>
          </div>

          <div>
            <span>Comments</span>
            <strong>{data.commentsReceived ?? 0}</strong>
          </div>
        </div>
      </div>
    </div>
  );
}