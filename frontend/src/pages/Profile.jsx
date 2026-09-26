import { useEffect, useState } from "react";
import { auth } from "../firebase";
import { get, put, post } from "../services/api";

export default function Profile() {
  const currentUser = auth.currentUser;

  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [interests, setInterests] = useState("");

  const [profilePicture, setProfilePicture] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadProfile() {
      try {
        setLoading(true);
        setError("");

        const profile = await get("/api/profile");

        setName(profile.name || "");
        setUsername(profile.username || "");
        setBio(profile.bio || "");
        setInterests(
          Array.isArray(profile.interests) ? profile.interests.join(", ") : "",
        );
        setProfilePicture(profile.profile_picture || "");
      } catch (error) {
        console.error("Profile API error:", error);
        setError("Unable to load profile.");
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, []);

  async function handleSaveProfile(event) {
    event.preventDefault();

    try {
      setSaving(true);
      setError("");
      setSaved(false);

      await put("/api/profile", {
        name: name.trim(),
        username: username.trim(),
        bio: bio.trim(),
        interests: interests
          .split(",")
          .map((interest) => interest.trim())
          .filter(Boolean),
      });

      setSaved(true);

      setTimeout(() => {
        setSaved(false);
      }, 2000);
    } catch (error) {
      console.error("Save profile API error:", error);
      setError("Unable to save profile.");
    } finally {
      setSaving(false);
    }
  }

  async function handleProfilePictureChange(event) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    try {
      setUploading(true);
      setError("");

      const formData = new FormData();
      formData.append("file", file);

      const currentUser = auth.currentUser;

      if (!currentUser) {
        throw new Error("User is not logged in.");
      }

      const token = await currentUser.getIdToken();

      const API_BASE_URL =
  "https://cloud-hobby-skills-tracker.onrender.com";

      const response = await fetch(`${API_BASE_URL}/api/files/profile`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText);
      }

      const result = await response.json();

      setProfilePicture(result.url);
    } catch (error) {
      console.error("Profile picture upload error:", error);
      setError("Unable to upload profile picture.");
    } finally {
      setUploading(false);
    }
  }

  if (loading) {
    return (
      <div className="page">
        <h2>My Profile</h2>
        <p>Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="page">
      <h2>My Profile</h2>

      <div className="card">
        <h3>Profile Information</h3>

        <p>
          <strong>Email:</strong> {currentUser?.email || "Not available"}
        </p>

        {profilePicture && (
          <div style={{ marginBottom: "15px" }}>
            <img
              src={profilePicture}
              alt="Profile"
              style={{
                width: "120px",
                height: "120px",
                objectFit: "cover",
                borderRadius: "50%",
                border: "2px solid #ddd",
              }}
            />
          </div>
        )}

        <div style={{ marginBottom: "15px" }}>
          <label>
            <strong>Profile Picture</strong>
          </label>

          <br />

          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleProfilePictureChange}
            disabled={uploading}
          />

          {uploading && <p>Uploading picture...</p>}
        </div>

        <form onSubmit={handleSaveProfile}>
          <input
            type="text"
            placeholder="Your name"
            value={name}
            onChange={(event) => setName(event.target.value)}
          />

          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
          />

          <textarea
            placeholder="Tell the community about yourself..."
            rows="4"
            value={bio}
            onChange={(event) => setBio(event.target.value)}
          />

          <input
            type="text"
            placeholder="Interests (e.g. Python, Music, Cricket)"
            value={interests}
            onChange={(event) => setInterests(event.target.value)}
          />

          <button type="submit" disabled={saving}>
            {saving ? "Saving..." : "Save Profile"}
          </button>
        </form>

        {saved && (
          <p className="success-message">
            Profile information saved successfully.
          </p>
        )}

        {error && <p className="error-message">{error}</p>}
      </div>
    </div>
  );
}
