import { useEffect } from 'react'
import { BrowserRouter, Navigate, Outlet, Route, Routes, useLocation } from 'react-router'
import { AppShell } from './layouts/AppShell'
import { BuildPage } from '@/features/build/BuildPage'
import { InterviewPage } from '@/features/interview/InterviewPage'
import { TrackPage } from '@/features/interview/TrackPage'
import { QuestionPage } from '@/features/interview/QuestionPage'
import { MockInterviewPage } from '@/features/interview/MockInterviewPage'
import { ProjectPage } from '@/features/build/ProjectPage'
import { RoadmapPage } from '@/features/roadmap/RoadmapPage'
import { ExplorePage } from '@/features/explore/ExplorePage'
import { CareerPathPage } from '@/features/explore/CareerPathPage'
import { CareerLabPage } from '@/features/explore/CareerLabPage'
import { ExperimentRunner } from '@/features/explore/ExperimentRunner'
import { ProgressPage } from '@/features/progress/ProgressPage'
import { TodayPage } from '@/features/today/TodayPage'
import { SettingsPage } from '@/features/settings/SettingsPage'
import { OnboardingFlow } from '@/features/onboarding/OnboardingFlow'
import { LoadingScreen } from '@/ui/States'
import { useAppStore } from '@/lib/store/useAppStore'
import { useHasOnboarded } from '@/lib/store/selectors'
import { useThemeEffect } from '@/lib/useTheme'

export function App() {
  const status = useAppStore((state) => state.status)
  const hydrate = useAppStore((state) => state.hydrate)
  useThemeEffect()

  useEffect(() => {
    void hydrate()
  }, [hydrate])

  if (status === 'loading') return <LoadingScreen />

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/welcome" element={<WelcomeGate />} />
        <Route element={<RequireOnboarding />}>
          <Route element={<AppShell />}>
            <Route index element={<TodayPage />} />
            <Route path="explore" element={<ExplorePage />} />
            {/* Lab routes precede :pathId so "lab" isn't read as a path id. */}
            <Route path="explore/lab" element={<CareerLabPage />} />
            <Route path="explore/lab/:experimentId" element={<ExperimentRunner />} />
            <Route path="explore/:pathId" element={<CareerPathPage />} />
            <Route path="roadmap" element={<RoadmapPage />} />
            <Route path="build" element={<BuildPage />} />
            {/* "library" precedes :projectId so it isn't read as an instance id. */}
            <Route path="build/library/:templateId" element={<ProjectPage />} />
            <Route path="build/:projectId" element={<ProjectPage />} />
            {/* "mock" precedes :trackId so it isn't read as a track id. */}
            <Route path="interview" element={<InterviewPage />} />
            <Route path="interview/mock" element={<MockInterviewPage />} />
            <Route path="interview/:trackId" element={<TrackPage />} />
            <Route path="interview/:trackId/:questionId" element={<QuestionPage />} />
            <Route path="progress" element={<ProgressPage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

/** Onboarding is a one-time gate, not a wall to walk back into. */
function WelcomeGate() {
  const hasOnboarded = useHasOnboarded()
  if (hasOnboarded) return <Navigate to="/" replace />
  return <OnboardingFlow />
}

function RequireOnboarding() {
  const hasOnboarded = useHasOnboarded()
  const location = useLocation()
  if (!hasOnboarded) return <Navigate to="/welcome" replace state={{ from: location.pathname }} />
  return <Outlet />
}
