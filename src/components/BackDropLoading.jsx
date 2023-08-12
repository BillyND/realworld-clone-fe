import React from "react";
const BackdropLoading = () => {
  const backdropStyle = {
    position: "fixed",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: "rgb(0 0 0 / 33%)",
    backdropFilter: "blur(3px)",
    zIndex: 8888,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    filter: "50px",
  };

  const spinnerStyle = {
    width: "50px",
    height: "50px",
    borderTop: "5px solid black",
    borderRight: "5px solid transparent",
    borderRadius: "50%",
    animation: "spin 0.3s linear infinite",
    filter: "blur(0px)",
    zIndex: 9999,
  };

  const keyframeStyle = `
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
  `;

  return (
    <>
      <style>{keyframeStyle}</style>
      <div style={backdropStyle} className="backdrop-loading">
        <div style={spinnerStyle}></div>
      </div>
    </>
  );
};

export default BackdropLoading;
