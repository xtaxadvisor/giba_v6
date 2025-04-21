
interface AdminProtectedRouteProps {
  children: React.ReactNode;
}

// Temporarily disabled auth checks for development
export function AdminProtectedRoute({ children }: AdminProtectedRouteProps) {
  return <>{children}</>;
}