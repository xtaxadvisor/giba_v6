import { Routes, Route, Outlet } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { StudentDashboard } from '../../components/student/StudentDashboard';
import { StudentLayout } from '../../components/student/StudentLayout';
import { LearningResources } from '../../components/student/LearningResources';
import { PracticeExercises } from '../../components/student/PracticeExercises/PracticeExercises';
import { ProgressTracking } from '../../components/student/ProgressTracking/ProgressTracking';

export default function StudentPortal() {
  const { logout } = useAuth();
  return (
    <StudentLayout>
      <button
        onClick={logout}
        className="mb-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
      >
        Logout
      </button>
      <Routes>
        <Route index element={<StudentDashboard />} />
        <Route path="/learning-resources" element={<LearningResources />} />
        <Route path="/practice-exercises" element={<PracticeExercises />} />
        <Route path="/progress-tracking" element={<ProgressTracking />} />
        {/* Add more routes as needed */}
      </Routes>
      <Outlet />
    </StudentLayout>
  );
}