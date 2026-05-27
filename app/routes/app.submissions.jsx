import { useLoaderData, useFetcher, Link } from "react-router";
import { useEffect } from "react";
import { useAppBridge } from "@shopify/app-bridge-react";
import "../styles/submissions.css";

export const loader = async () => {
  return { submissions: [], shop: "demo.myshopify.com" };
};

export const action = async () => {
  return { success: true };
};

export default function SubmissionsPage() {
  const { submissions } = useLoaderData();
  const fetcher = useFetcher();
  const shopify = useAppBridge();

  useEffect(() => {
    if (fetcher.data?.success) {
      shopify.toast.show("Lead deleted.");
    }
  }, [fetcher.data, shopify]);

  const handleDelete = (id) => {
    if (confirm("Are you sure you want to delete this customer lead?")) {
      fetcher.submit({ id, action: "delete" }, { method: "POST" });
    }
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  // Helper to safely parse and display JSON fields
  const renderCustomData = (formDataJsonString) => {
    try {
      const data = JSON.parse(formDataJsonString);
      const keys = Object.keys(data);
      if (keys.length === 0) return "-";
      return keys.map(key => (
        <span key={key} className="custom-data-tag">
          <strong>{key}:</strong> {data[key]}
        </span>
      ));
    } catch (e) {
      return "-";
    }
  };

  return (
    <div>
      <div className="submissions-container">

        <div className="submissions-header">
          <div>
            <h1>Customer Data</h1>
            <p>View leads collected across all pre-built hero template forms.</p>
          </div>
        </div>

        {submissions.length === 0 ? (
          <div className="empty-state">
            <svg width="60" height="60" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ color: "#94a3b8" }}>
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <h3>No Customer Submissions Yet</h3>
            <p>Preview your hero designs, complete the signup forms, and they'll instantly populate here.</p>
            <a href="/app" className="btn-preview">
              Browse Design Templates
            </a>
          </div>
        ) : (
          <div className="table-wrapper">
            <table className="leads-table">
              <thead>
                <tr>
                  <th>Customer Name</th>
                  <th>Email</th>
                  <th>Brand Template</th>
                  <th>Collected Data</th>
                  <th>Submitted At</th>
                  <th style={{ textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {submissions.map((sub) => (
                  <tr key={sub.id}>
                    <td>
                      <strong style={{ color: "#0f172a" }}>{sub.name}</strong>
                    </td>
                    <td>{sub.email}</td>
                    <td>
                      <span className="brand-badge">{sub.brand}</span>
                      <span style={{ fontSize: "0.75rem", color: "#64748b", marginLeft: "0.5rem" }}>
                        ({sub.templateId.split("-")[1]})
                      </span>
                    </td>
                    <td style={{ maxWidth: "300px" }}>{renderCustomData(sub.formData)}</td>
                    <td style={{ color: "#64748b", fontSize: "0.85rem" }}>{formatDate(sub.createdAt)}</td>
                    <td style={{ textAlign: "right" }}>
                      <button
                      onClick={() => handleDelete(sub.id)}
                      className="btn-delete"
                     disabled={fetcher.state === "submitting"}
                    >
                      {fetcher.state === "submitting" ? "Deleting..." : "Delete"}
                     </button>
                      
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

      </div>
    </div>
  );
}
