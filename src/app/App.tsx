import { lazy, Suspense, useEffect } from 'react'
import { BrowserRouter, Navigate, Outlet, Route, Routes, useLocation } from 'react-router'
import { AppShell } from './layouts/AppShell'
import { NotFoundPage } from './NotFoundPage'
import { TodayPage } from '@/features/today/TodayPage'
import { OnboardingFlow } from '@/features/onboarding/OnboardingFlow'
import { LoadingScreen, RouteFallback } from '@/ui/States'
import { useAppStore } from '@/lib/store/useAppStore'
import { useHasOnboarded } from '@/lib/store/selectors'
import { useThemeEffect } from '@/lib/useTheme'

/**
 * Today and onboarding are imported eagerly — they are the first thing almost
 * everyone sees, and making them wait on a second request would be a downgrade.
 *
 * Everything else is split out. Measured on the production build rather than
 * estimated: first load went from 202KB to 171KB transferred (index + shared
 * chunk + CSS), with the remaining routes arriving as 1–5KB chunks on demand.
 * Resources is one of them — the whole library page is a 4KB chunk, because the
 * data it renders already lives in the shared chunk.
 *
 * The shared chunk stays large because Today itself needs the resource library
 * to pick the day's quest resources. Deferring that would trade a smaller
 * download for a slower first screen, which is the wrong way round.
 */
const ExplorePage = lazy(() =>
  import('@/features/explore/ExplorePage').then((m) => ({ default: m.ExplorePage })),
)
const CareerPathPage = lazy(() =>
  import('@/features/explore/CareerPathPage').then((m) => ({ default: m.CareerPathPage })),
)
const CareerLabPage = lazy(() =>
  import('@/features/explore/CareerLabPage').then((m) => ({ default: m.CareerLabPage })),
)
const ExperimentRunner = lazy(() =>
  import('@/features/explore/ExperimentRunner').then((m) => ({ default: m.ExperimentRunner })),
)
const RoadmapPage = lazy(() =>
  import('@/features/roadmap/RoadmapPage').then((m) => ({ default: m.RoadmapPage })),
)
const BuildPage = lazy(() =>
  import('@/features/build/BuildPage').then((m) => ({ default: m.BuildPage })),
)
const ProjectPage = lazy(() =>
  import('@/features/build/ProjectPage').then((m) => ({ default: m.ProjectPage })),
)
const InterviewPage = lazy(() =>
  import('@/features/interview/InterviewPage').then((m) => ({ default: m.InterviewPage })),
)
const TrackPage = lazy(() =>
  import('@/features/interview/TrackPage').then((m) => ({ default: m.TrackPage })),
)
const QuestionPage = lazy(() =>
  import('@/features/interview/QuestionPage').then((m) => ({ default: m.QuestionPage })),
)
const MockInterviewPage = lazy(() =>
  import('@/features/interview/MockInterviewPage').then((m) => ({ default: m.MockInterviewPage })),
)
const ProgressPage = lazy(() =>
  import('@/features/progress/ProgressPage').then((m) => ({ default: m.ProgressPage })),
)
const ResourcesPage = lazy(() =>
  import('@/features/resources/ResourcesPage').then((m) => ({ default: m.ResourcesPage })),
)
const SettingsPage = lazy(() =>
  import('@/features/settings/SettingsPage').then((m) => ({ default: m.SettingsPage })),
)

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
            <Route path="explore" element={<Lazy><ExplorePage /></Lazy>} />
            {/* Lab routes precede :pathId so "lab" isn't read as a path id. */}
            <Route path="explore/lab" element={<Lazy><CareerLabPage /></Lazy>} />
            <Route path="explore/lab/:experimentId" element={<Lazy><ExperimentRunner /></Lazy>} />
            <Route path="explore/:pathId" element={<Lazy><CareerPathPage /></Lazy>} />
            <Route path="roadmap" element={<Lazy><RoadmapPage /></Lazy>} />
            <Route path="build" element={<Lazy><BuildPage /></Lazy>} />
            {/* "library" precedes :projectId so it isn't read as an instance id. */}
            <Route path="build/library/:templateId" element={<Lazy><ProjectPage /></Lazy>} />
            <Route path="build/:projectId" element={<Lazy><ProjectPage /></Lazy>} />
            {/* "mock" precedes :trackId so it isn't read as a track id. */}
            <Route path="interview" element={<Lazy><InterviewPage /></Lazy>} />
            <Route path="interview/mock" element={<Lazy><MockInterviewPage /></Lazy>} />
            <Route path="interview/:trackId" element={<Lazy><TrackPage /></Lazy>} />
            <Route
              path="interview/:trackId/:questionId"
              element={<Lazy><QuestionPage /></Lazy>}
            />
            <Route path="progress" element={<Lazy><ProgressPage /></Lazy>} />
            <Route path="resources" element={<Lazy><ResourcesPage /></Lazy>} />
            <Route path="settings" element={<Lazy><SettingsPage /></Lazy>} />
            {/* Unknown routes land here inside the shell, so the nav stays. */}
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

/**
 * The fallback is deliberately quiet — a spinner that flashes for 40ms is worse
 * than nothing, so it fades in only if the chunk is genuinely slow to arrive.
 */
function Lazy({ children }: { children: React.ReactNode }) {
  return <Suspense fallback={<RouteFallback />}>{children}</Suspense>
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
