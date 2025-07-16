export default function ResponseBox({ response }) {
  if (!response) return null;
  return (
    <div className="border p-4 rounded bg-gray-100 whitespace-pre-wrap">
      <h2 className="text-xl font-semibold mb-2">Response:</h2>
      <p>{response}</p>
    </div>
  );
}
