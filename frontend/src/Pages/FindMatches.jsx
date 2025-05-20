import React, { useState } from "react";

const FindMatches = () => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchMatches = async () => {
    setLoading(true);
    setError(null);
    setMatches([]);

    try {
      const response = await fetch(
        "https://ai-powered-job-match-platform-1.onrender.com/api/v1/recommend/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
          // No body needed as backend reads user from JWT
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      setMatches(data.matches || []);
    } catch (err) {
      setError("Failed to fetch matches. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        maxWidth: 700,
        margin: "40px auto",
        padding: 24,
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        backgroundColor: "#f9fafb",
        borderRadius: 12,
        boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
      }}
    >
      <button
        onClick={fetchMatches}
        disabled={loading}
        style={{
          width: "100%",
          backgroundColor: loading ? "#a1a1aa" : "#2563eb",
          color: "white",
          padding: "14px 0",
          fontSize: 18,
          fontWeight: "600",
          border: "none",
          borderRadius: 8,
          cursor: loading ? "not-allowed" : "pointer",
          boxShadow: "0 4px 6px rgba(37, 99, 235, 0.5)",
          transition: "background-color 0.3s ease",
        }}
        onMouseEnter={(e) =>
          !loading && (e.currentTarget.style.backgroundColor = "#1e40af")
        }
        onMouseLeave={(e) =>
          !loading && (e.currentTarget.style.backgroundColor = "#2563eb")
        }
      >
        {loading ? (
          <div
            style={{
              display: "inline-block",
              width: 20,
              height: 20,
              border: "3px solid rgba(255, 255, 255, 0.6)",
              borderTopColor: "white",
              borderRadius: "50%",
              animation: "spin 1s linear infinite",
            }}
          ></div>
        ) : (
          "Find My Matches"
        )}
      </button>

      {error && (
        <p
          style={{
            marginTop: 20,
            padding: 12,
            backgroundColor: "#fee2e2",
            color: "#b91c1c",
            borderRadius: 8,
            fontWeight: "600",
            boxShadow: "inset 0 0 6px rgba(185, 28, 28, 0.3)",
          }}
        >
          {error}
        </p>
      )}

      <div
        style={{
          marginTop: 30,
          display: "grid",
          gap: 24,
          gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
        }}
      >
        {!loading && matches.length === 0 && !error && (
          <p
            style={{
              gridColumn: "1 / -1",
              textAlign: "center",
              color: "#6b7280",
              fontSize: 16,
              fontStyle: "italic",
            }}
          >
            No matches found yet. Click the button above.
          </p>
        )}

        {matches.map(({ title, company, location, reason }, i) => (
          <div
            key={i}
            style={{
              backgroundColor: "white",
              borderRadius: 12,
              padding: 20,
              boxShadow: "0 2px 10px rgba(0,0,0,0.07)",
              transition: "transform 0.2s ease, box-shadow 0.2s ease",
              cursor: "default",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-4px)";
              e.currentTarget.style.boxShadow = "0 6px 20px rgba(0,0,0,0.12)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 2px 10px rgba(0,0,0,0.07)";
            }}
          >
            <h3
              style={{
                margin: "0 0 8px",
                fontWeight: "700",
                color: "#111827",
                fontSize: 20,
              }}
            >
              {title}
            </h3>
            <p style={{ margin: "4px 0", color: "#374151", fontSize: 15 }}>
              <strong>Company:</strong> {company}
            </p>
            <p style={{ margin: "4px 0", color: "#374151", fontSize: 15 }}>
              <strong>Location:</strong> {location}
            </p>
            <p
              style={{
                marginTop: 12,
                fontStyle: "italic",
                color: "#6b7280",
                fontSize: 14,
                lineHeight: 1.4,
                minHeight: 60,
              }}
            >
              {reason}
            </p>
          </div>
        ))}
      </div>

      {/* Spinner CSS */}
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default FindMatches;
