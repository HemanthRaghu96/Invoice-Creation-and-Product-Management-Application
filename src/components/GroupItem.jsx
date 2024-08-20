export default function GroupItem({ title, children }) {
  return (
    <div style={{ width: "100%", marginBlock: "1rem" }}>
      <h1>{title}</h1>
      {children}
    </div>
  );
}
