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
          The backend server needs to be running on port 8000.
        </p>
      </div>
    );
  }

  return (
    <div className="page">
      <h2>Dashboard</h2>

      <div className="stats-grid">
        <StatCard
          title="Practice Hours"
          value={data.totalPracticeHours ?? 0}
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
          title="Community Posts"
          value={data.postsCount ?? 0}
        />
      </div>
    </div>
  );
}