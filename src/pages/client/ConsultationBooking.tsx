import { useForm } from 'react-hook-form';
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

type FormData = {
  name: string;
  email: string;
  consultationType: string;
  date: string;
  time: string;
  description: string;
  file?: FileList;
};

const consultationTypes = [
  'Tax Planning',
  'ITIN Application',
  'IRS Help',
  'Business Structuring',
  'Consulting Session',
];

export default function ConsultationBooking() {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
  } = useForm<FormData>({ mode: 'onChange' });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [bookings, setBookings] = useState<FormData[]>([]);

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      // Example: Replace with API/Supabase call
      console.log(data);

      await fetch('/.netlify/functions/sendConfirmationEmail', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: data.email,
          consultationType: data.consultationType,
          date: `${data.date} ${data.time}`
        })
      });
      toast.success('Your booking has been submitted. A confirmation email will be sent.');

      setBookings((prev) => [...prev, data]);
      setSubmitted(true);
      reset();
    } catch (err) {
      console.error('Booking failed:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-center">Book a Consultation</h2>

      {submitted ? (
        <div className="bg-green-50 border border-green-300 rounded p-4 text-center">
          <h3 className="text-green-700 font-semibold text-lg mb-2">Thank you!</h3>
          <p className="text-green-800">
            Your consultation request has been submitted successfully. A confirmation email will be sent to you shortly.
          </p>
          <button
            onClick={() => setSubmitted(false)}
            className="mt-4 inline-block bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
          >
            Book Another Consultation
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block font-medium">Full Name</label>
            <input type="text" {...register('name', { required: true })} className="w-full p-2 border rounded" placeholder="Enter your full name" />
            {errors.name && <span className="text-red-600">Required</span>}
          </div>
          <div>
            <label className="block font-medium">Email Address</label>
            <input type="email" {...register('email', { required: true })} className="w-full p-2 border rounded" placeholder="Enter your email" />
            {errors.email && <span className="text-red-600">Required</span>}
          </div>
          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="flex-1">
              <label className="block font-medium">Consultation Type</label>
              <select
                {...register('consultationType', { required: true })}
                className="w-full p-2 border rounded"
                aria-label="Select Consultation Type"
              >
                <option value="">Select a type</option>
                {consultationTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
              {errors.consultationType && <span className="text-red-600">This field is required</span>}
            </div>

            <div className="flex-1">
              <label className="block font-medium">Date</label>
              <input
                type="date"
                {...register('date', { required: true })}
                className="w-full p-2 border rounded"
                aria-label="Select Date"
              />
              {errors.date && <span className="text-red-600">Required</span>}
            </div>

            <div className="flex-1">
              <label className="block font-medium">Time</label>
              <input
                type="time"
                {...register('time', { required: true })}
                className="w-full p-2 border rounded"
                aria-label="Select Time"
              />
              {errors.time && <span className="text-red-600">Required</span>}
            </div>
          </div>

          <div>
            <label className="block font-medium">Description</label>
            <textarea
              {...register('description', { required: true })}
              className="w-full p-2 border rounded h-24"
              placeholder="Briefly describe your needs"
            />
            {errors.description && <span className="text-red-600">Required</span>}
          </div>

          <div>
            <label className="block font-medium">Upload Supporting Documents (optional)</label>
            <input type="file" {...register('file')} className="w-full" />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded disabled:opacity-50"
            disabled={loading || !isValid}
          >
            {loading ? 'Submitting...' : 'Confirm Appointment'}
          </button>
        </form>
      )}

      {bookings.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold">Your Bookings:</h3>
          <ul className="list-disc list-inside">
            {bookings.map((booking, index) => (
              <li key={index}>
                {booking.consultationType} on {booking.date} at {booking.time}
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}