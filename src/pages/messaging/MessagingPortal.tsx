import { MessagingCenter } from '../../components/messaging/MessagingCenter';

export default function MessagingPortal() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <MessagingCenter />
        </div>
      </div>
    </div>
  );
}