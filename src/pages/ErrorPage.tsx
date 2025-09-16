const centerStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexDirection: "column",
  marginTop: 300,
};
export const ErrorPage = () => {
    return (
    <div style={centerStyle}>
        <h1 style={{ fontSize: 65 }}>An error occurred!</h1>
        <p style={{ fontSize: 50 }}>
            If you can replicate getting here, please send in a bug report.
        </p>
    </div>
    );
}
    
