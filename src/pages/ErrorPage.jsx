const centerStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  whitespace: "pre-line",
  flexDirection: "column",
  marginTop: 300,
};
export default function ErrorPage(){
    return (
    <div style={centerStyle}>
        <h1 style={{ fontSize: 65 }}>An error occurred!</h1>
        <p style={{ fontSize: 50 }}>
            If you can replicate getting here, please send in a bug report.
        </p>
    </div>
    );
}
    
