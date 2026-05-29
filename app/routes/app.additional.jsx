export default function AdditionalPage() {
  return (
    <div style={{ padding: "40px" }}>
      <div>
        <h2>Multiple pages</h2>
        <p>
          The app template comes with an additional page which demonstrates how
          to create multiple pages within app navigation using{" "}
          <a
            href="https://shopify.dev/docs/apps/tools/app-bridge"
            target="_blank"
            rel="noopener noreferrer"
          >
            App Bridge
          </a>
          .
        </p>
        <p>
          To create your own page and have it show up in the app navigation, add
          a page inside <code>app/routes</code>, and a link to it in the{" "}
          <code>&lt;ui-nav-menu&gt;</code> component found in{" "}
          <code>app/routes/app.jsx</code>.
        </p>
      </div>

    </div>
  );
}
