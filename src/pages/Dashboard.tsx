import { Link } from 'react-router-dom';

export function ClientDashboard() {
  return (
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white shadow rounded-lg p-4">
          <h3 className="text-sm font-semibold text-gray-500">Active Consultations</h3>
          <p className="text-2xl font-bold text-gray-900">3</p>
        </div>
        <div className="bg-white shadow rounded-lg p-4">
          <h3 className="text-sm font-semibold text-gray-500">Pending Documents</h3>
          <p className="text-2xl font-bold text-gray-900">5</p>
        </div>
        <div className="bg-white shadow rounded-lg p-4">
          <h3 className="text-sm font-semibold text-gray-500">Unread Messages</h3>
          <p className="text-2xl font-bold text-gray-900">2</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-4">
        <Link to="/dashboard/messages" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">Go to Messages</Link>
        <Link to="/dashboard/documents" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">Upload Documents</Link>
        <Link to="/dashboard/calendar" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">View Calendar</Link>
      </div>

      <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded">
        <p className="font-semibold">Announcement:</p>
        <p>Your next tax consultation is scheduled for Monday at 3:00 PM. Please upload your documents before then.</p>
      </div>
    </div>
  );
}

export function InvestorDashboard() {
  return (
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white shadow rounded-lg p-4">
          <h3 className="text-sm font-semibold text-gray-500">Active Consultations</h3>
          <p className="text-2xl font-bold text-gray-900">3</p>
        </div>
        <div className="bg-white shadow rounded-lg p-4">
          <h3 className="text-sm font-semibold text-gray-500">Pending Documents</h3>
          <p className="text-2xl font-bold text-gray-900">5</p>
        </div>
        <div className="bg-white shadow rounded-lg p-4">
          <h3 className="text-sm font-semibold text-gray-500">Unread Messages</h3>
          <p className="text-2xl font-bold text-gray-900">2</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-4">
        <Link to="/dashboard/messages" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">Go to Messages</Link>
        <Link to="/dashboard/documents" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">Upload Documents</Link>
        <Link to="/dashboard/calendar" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">View Calendar</Link>
      </div>

      <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded">
        <p className="font-semibold">Announcement:</p>
        <p>Your next tax consultation is scheduled for Monday at 3:00 PM. Please upload your documents before then.</p>
      </div>
    </div>
  );
}

export function StudentDashboard() {
  return (
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white shadow rounded-lg p-4">
          <h3 className="text-sm font-semibold text-gray-500">Active Consultations</h3>
          <p className="text-2xl font-bold text-gray-900">3</p>
        </div>
        <div className="bg-white shadow rounded-lg p-4">
          <h3 className="text-sm font-semibold text-gray-500">Pending Documents</h3>
          <p className="text-2xl font-bold text-gray-900">5</p>
        </div>
        <div className="bg-white shadow rounded-lg p-4">
          <h3 className="text-sm font-semibold text-gray-500">Unread Messages</h3>
          <p className="text-2xl font-bold text-gray-900">2</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-4">
        <Link to="/dashboard/messages" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">Go to Messages</Link>
        <Link to="/dashboard/documents" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">Upload Documents</Link>
        <Link to="/dashboard/calendar" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">View Calendar</Link>
      </div>

      <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded">
        <p className="font-semibold">Announcement:</p>
        <p>Your next tax consultation is scheduled for Monday at 3:00 PM. Please upload your documents before then.</p>
      </div>
    </div>
  );
}

export function ProfessionalDashboard() {
  return (
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white shadow rounded-lg p-4">
          <h3 className="text-sm font-semibold text-gray-500">Active Consultations</h3>
          <p className="text-2xl font-bold text-gray-900">3</p>
        </div>
        <div className="bg-white shadow rounded-lg p-4">
          <h3 className="text-sm font-semibold text-gray-500">Pending Documents</h3>
          <p className="text-2xl font-bold text-gray-900">5</p>
        </div>
        <div className="bg-white shadow rounded-lg p-4">
          <h3 className="text-sm font-semibold text-gray-500">Unread Messages</h3>
          <p className="text-2xl font-bold text-gray-900">2</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-4">
        <Link to="/dashboard/messages" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">Go to Messages</Link>
        <Link to="/dashboard/documents" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">Upload Documents</Link>
        <Link to="/dashboard/calendar" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">View Calendar</Link>
      </div>

      <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded">
        <p className="font-semibold">Announcement:</p>
        <p>Your next tax consultation is scheduled for Monday at 3:00 PM. Please upload your documents before then.</p>
      </div>
    </div>
  );
}

export function AdminDashboard() {
  return (
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white shadow rounded-lg p-4">
          <h3 className="text-sm font-semibold text-gray-500">User Accounts</h3>
          <p className="text-2xl font-bold text-gray-900">24</p>
        </div>
        <div className="bg-white shadow rounded-lg p-4">
          <h3 className="text-sm font-semibold text-gray-500">Pending Approvals</h3>
          <p className="text-2xl font-bold text-gray-900">5</p>
        </div>
        <div className="bg-white shadow rounded-lg p-4">
          <h3 className="text-sm font-semibold text-gray-500">Support Tickets</h3>
          <p className="text-2xl font-bold text-gray-900">3</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-4">
        <Link to="/admin/messages" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">View Messages</Link>
        <Link to="/admin/team" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">Manage Team</Link>
        <Link to="/admin/settings" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">Settings</Link>
      </div>

      <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded">
        <p className="font-semibold">Admin Notice:</p>
        <p>System maintenance is scheduled for Friday at 2:00 AM. Please ensure all changes are saved before then.</p>
      </div>
    </div>
  );
}
export default ClientDashboard;