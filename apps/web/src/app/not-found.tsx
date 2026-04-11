export default function NotFound(): React.ReactElement {
  return (
    <main className="flex min-h-screen items-center justify-center bg-white px-6">
      <div className="max-w-lg text-center">
        <h1 className="mb-4 text-3xl font-bold">Page not found</h1>
        <p className="text-gray-600">
          The public page you tried to open does not exist, or it is not published.
        </p>
      </div>
    </main>
  );
}