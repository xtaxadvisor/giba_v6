export default function ThankYou() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12 text-center">
      <h1 className="text-3xl font-bold text-green-600 mb-4">Thank you!</h1>
      <p className="text-lg text-gray-700">
        Your message has been received. One of our team members will follow up with you shortly.
      </p>
      <a
        href="/"
        className="mt-6 inline-block bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
      >
        Back to Home
      </a>
    </div>
  );
}