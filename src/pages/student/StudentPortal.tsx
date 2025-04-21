import { Routes, Route, Outlet } from 'react-router-dom';
import { StudentDashboard } from '../../components/student/StudentDashboard';
import { StudentLayout } from '../../components/student/StudentLayout';
import { LearningResources } from '../../components/student/LearningResources';
import { PracticeExercises } from '../../components/student/PracticeExercises/PracticeExercises';
import { ProgressTracking } from '../../components/student/ProgressTracking/ProgressTracking';

export default function StudentPortal() {
 return (
   <StudentLayout>
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