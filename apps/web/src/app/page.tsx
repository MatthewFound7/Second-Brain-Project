export default async function Home() {
  const response = await fetch("http://localhost:3000/api/health", {
    cache: "no-store",
  });
  const data = await response.json();

  return (
    <main style={{ padding: 24 }}>
      <h1>Second Brain Project</h1>
      <p>API health check:</p>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </main>
  );
}