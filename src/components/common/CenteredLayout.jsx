import React from "react";

function CenteredLayout({ children, maxWidth = "400px", bg = "light" }) {
  return (
    <main
      className={`d-flex justify-content-center align-items-center min-vh-100 bg-${bg}`}
    >
      <div
        className="p-4 w-100 shadow-sm"
        style={{
          maxWidth,
          borderRadius: "10px",
        }}
      >
        {children}
      </div>
    </main>
  );
}

export default CenteredLayout;
