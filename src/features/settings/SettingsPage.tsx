import { useRef, useState } from 'react'
import { Download, RotateCcw, Upload } from 'lucide-react'
import { Card, SectionHeading } from '@/ui/Card'
import { Button } from '@/ui/Button'
import { ErrorNotice } from '@/ui/States'
import { TextInput } from '@/ui/Field'
import { useAppStore } from '@/lib/store/useAppStore'
import { useProfile } from '@/lib/store/selectors'
import { exportFilename, serializeForExport } from '@/lib/storage'
import { pathById } from '@/data/careerPaths'
import { authorizationDisclaimer } from '@/features/onboarding/content'
import { cn, formatDate } from '@/lib/utils'

export function SettingsPage() {
  const profile = useProfile()
  const preferences = useAppStore((state) => state.preferences)
  const updatePreferences = useAppStore((state) => state.updatePreferences)
  const updateProfile = useAppStore((state) => state.updateProfile)
  const exportState = useAppStore((state) => state.exportState)
  const importState = useAppStore((state) => state.importState)
  const resetState = useAppStore((state) => state.resetState)
  const updatedAt = useAppStore((state) => state.updatedAt)

  const fileInput = useRef<HTMLInputElement>(null)
  const [message, setMessage] = useState<{ tone: 'ok' | 'error'; text: string } | null>(null)
  const [resetConfirm, setResetConfirm] = useState('')
  const [resetting, setResetting] = useState(false)

  const download = () => {
    const blob = new Blob([serializeForExport(exportState())], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = exportFilename()
    link.click()
    URL.revokeObjectURL(url)
    setMessage({ tone: 'ok', text: 'Exported. That file is the whole of your PathFinder data.' })
  }

  const handleImport = async (file: File) => {
    const raw = await file.text()
    const result = importState(raw)
    if (!result.ok) {
      setMessage({ tone: 'error', text: result.error })
      return
    }
    setMessage({
      tone: 'ok',
      text: result.warning ?? 'Imported. Everything from that file is now loaded.',
    })
  }

  return (
    <div className="mx-auto w-full max-w-3xl space-y-9 pt-2">
      <header>
        <h1 className="font-display text-2xl leading-tight text-ink">Settings</h1>
        <p className="mt-2 text-sm text-ink-soft">
          Everything PathFinder knows lives in this browser. There is no account and no server.
        </p>
      </header>

      {message ? (
        <ErrorNotice
          message={message.text}
          tone={message.tone === 'error' ? 'critical' : 'caution'}
          onDismiss={() => setMessage(null)}
        />
      ) : null}

      {/* ── You ─────────────────────────────────────────────────────────────── */}
      <section>
        <SectionHeading title="You" />
        <Card className="space-y-5 p-5">
          <TextInput
            label="Name"
            value={profile?.name ?? ''}
            onChange={(event) => updateProfile({ name: event.target.value })}
          />

          <div>
            <p className="text-sm font-medium text-ink">Time you have on a weekday</p>
            <p className="mt-0.5 text-xs text-ink-soft">
              PathFinder sizes each day to this, and asks for less on low-energy days.
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              {[25, 45, 90, 150].map((minutes) => (
                <button
                  key={minutes}
                  type="button"
                  onClick={() => updateProfile({ weekdayMinutes: minutes })}
                  aria-pressed={profile?.weekdayMinutes === minutes}
                  className={cn(
                    'rounded-full border px-4 py-1.5 text-sm transition-colors',
                    profile?.weekdayMinutes === minutes
                      ? 'border-accent bg-accent-soft font-medium text-accent-ink'
                      : 'border-line bg-surface text-ink-soft hover:border-line-strong',
                  )}
                >
                  {minutes >= 150 ? '2 hr+' : `${minutes} min`}
                </button>
              ))}
            </div>
          </div>

          {profile?.activePathIds.length ? (
            <div>
              <p className="text-sm font-medium text-ink">Directions you&rsquo;re exploring</p>
              <p className="mt-1 text-sm text-ink-soft">
                {profile.activePathIds
                  .map((id) => pathById(id)?.title ?? id)
                  .join(' · ')}
              </p>
              <p className="mt-1.5 text-xs text-ink-faint">
                These become editable from Explore once career path pages are built.
              </p>
            </div>
          ) : null}

          {profile?.workAuthorization ? (
            <div>
              <p className="text-sm font-medium text-ink">Work authorisation note</p>
              <p className="mt-1 text-sm text-ink-soft">{profile.workAuthorization.status}</p>
              <p className="mt-2 text-xs leading-relaxed text-ink-faint">
                {authorizationDisclaimer}
              </p>
            </div>
          ) : null}
        </Card>
      </section>

      {/* ── Preferences ─────────────────────────────────────────────────────── */}
      <section>
        <SectionHeading title="Preferences" />
        <Card className="divide-y divide-line p-0">
          <div className="p-4">
            <p className="text-sm font-medium text-ink">Appearance</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {(['system', 'light', 'dark'] as const).map((theme) => (
                <button
                  key={theme}
                  type="button"
                  onClick={() => updatePreferences({ theme })}
                  aria-pressed={preferences.theme === theme}
                  className={cn(
                    'rounded-full border px-4 py-1.5 text-sm capitalize transition-colors',
                    preferences.theme === theme
                      ? 'border-accent bg-accent-soft font-medium text-accent-ink'
                      : 'border-line bg-surface text-ink-soft hover:border-line-strong',
                  )}
                >
                  {theme}
                </button>
              ))}
            </div>
          </div>

          <Toggle
            label="Show how many days you've shown up"
            hint="A count of active days this week. It never resets anything and it can't be lost — turn it off if any number like this feels like pressure."
            checked={preferences.showShowUpCount}
            onChange={(showShowUpCount) => updatePreferences({ showShowUpCount })}
          />

          <Toggle
            label="Quieter celebrations"
            hint="Turns off the XP pop-ups. Progress is still recorded."
            checked={preferences.reducedCelebration}
            onChange={(reducedCelebration) => updatePreferences({ reducedCelebration })}
          />
        </Card>
      </section>

      {/* ── Your data ───────────────────────────────────────────────────────── */}
      <section>
        <SectionHeading
          title="Your data"
          hint={`Last saved ${formatDate(updatedAt)}. Nothing is ever sent anywhere.`}
        />
        <Card className="space-y-4 p-5">
          <div className="flex flex-wrap gap-2">
            <Button variant="secondary" onClick={download}>
              <Download className="size-4" aria-hidden />
              Export data
            </Button>
            <Button variant="secondary" onClick={() => fileInput.current?.click()}>
              <Upload className="size-4" aria-hidden />
              Import data
            </Button>
            <input
              ref={fileInput}
              type="file"
              accept="application/json,.json"
              className="hidden"
              onChange={(event) => {
                const file = event.target.files?.[0]
                if (file) void handleImport(file)
                event.target.value = ''
              }}
            />
          </div>
          <p className="text-xs leading-relaxed text-ink-soft">
            Importing replaces what&rsquo;s currently here. Export first if you want to keep it.
          </p>

          <div className="border-t border-line pt-4">
            <p className="text-sm font-medium text-ink">Reset everything</p>
            <p className="mt-1 text-sm text-ink-soft">
              Deletes all of it — progress, reflections, applications. This cannot be undone.
            </p>
            <div className="mt-3 flex flex-wrap items-end gap-2">
              <TextInput
                label="Type RESET to confirm"
                value={resetConfirm}
                onChange={(event) => setResetConfirm(event.target.value)}
                className="max-w-56"
                placeholder="RESET"
              />
              <Button
                variant="danger"
                disabled={resetConfirm !== 'RESET' || resetting}
                onClick={async () => {
                  setResetting(true)
                  await resetState()
                  setResetConfirm('')
                  setResetting(false)
                }}
              >
                <RotateCcw className="size-4" aria-hidden />
                Reset
              </Button>
            </div>
          </div>
        </Card>
      </section>
    </div>
  )
}

function Toggle({
  label,
  hint,
  checked,
  onChange,
}: {
  label: string
  hint: string
  checked: boolean
  onChange: (value: boolean) => void
}) {
  return (
    <div className="flex items-start justify-between gap-4 p-4">
      <div className="min-w-0">
        <p className="text-sm font-medium text-ink">{label}</p>
        <p className="mt-0.5 text-xs leading-relaxed text-ink-soft">{hint}</p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        onClick={() => onChange(!checked)}
        className={cn(
          'relative mt-0.5 h-6 w-10 shrink-0 rounded-full transition-colors duration-200',
          checked ? 'bg-accent' : 'bg-line-strong',
        )}
      >
        <span
          className={cn(
            'absolute top-0.5 size-5 rounded-full bg-white shadow-xs transition-[left] duration-200',
            checked ? 'left-[1.125rem]' : 'left-0.5',
          )}
          style={{ transitionTimingFunction: 'var(--ease-out-soft)' }}
        />
      </button>
    </div>
  )
}
