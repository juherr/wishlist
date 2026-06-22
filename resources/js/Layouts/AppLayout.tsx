import { Link, router, usePage } from '@inertiajs/react'
import { LogOut, Plus, Users } from 'lucide-react'
import { PropsWithChildren, useEffect } from 'react'
import type React from 'react'
import { toast } from 'sonner'
import { Button } from '@/Components/ui/button'
import { PageProps } from '@/types'

type AppLayoutProps = PropsWithChildren<{
  title: string
  actions?: React.ReactNode
  bare?: boolean
}>

export function AppLayout({
  title,
  actions,
  bare = false,
  children,
}: AppLayoutProps) {
  const { flash, session } = usePage<PageProps>().props

  useEffect(() => {
    if (flash.success) toast.success(flash.success)
    if (flash.error) toast.error(flash.error)
  }, [flash.error, flash.success])

  return (
    <div className="min-h-svh">
      {!bare ? (
        <header className="fixed left-0 right-0 top-0 z-20 rounded-bl-[100px] bg-primary px-5 py-3 text-primary-foreground shadow-[0_0_24px_rgba(32,40,89,0.22)]">
          <div className="mx-auto flex max-w-6xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <Link
                href="/"
                className="flex size-11 items-center justify-center rounded-full border-2 border-primary-foreground text-primary-foreground no-underline"
              >
                <Users />
              </Link>
              <div>
                <p className="text-sm text-primary-foreground/70">KDO</p>
                <h1 className="font-mono text-2xl font-medium tracking-[-0.08em]">
                  {title}
                </h1>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {session.activeProfile ? (
                <span className="rounded-full border-2 border-primary-foreground/50 px-4 py-2 text-sm">
                  {session.activeProfile.name}
                </span>
              ) : null}
              {session.guestName ? (
                <span className="rounded-full border-2 border-primary-foreground/50 px-4 py-2 text-sm">
                  {session.guestName}
                </span>
              ) : null}
              {actions}
              <Button asChild variant="secondary" size="sm">
                <Link href="/profiles/create">
                  <Plus data-icon="inline-start" />
                  Profil
                </Link>
              </Button>
              {(session.activeProfile || session.guestName) && (
                <Button
                  variant="outline"
                  size="sm"
                  className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary"
                  onClick={() => router.delete('/session')}
                >
                  <LogOut data-icon="inline-start" />
                  Quitter
                </Button>
              )}
            </div>
          </div>
        </header>
      ) : null}
      <main
        className={`mx-auto flex max-w-[1300px] flex-col gap-8 px-4 py-8 sm:px-8 ${bare ? '' : 'pt-32'}`}
      >
        {children}
      </main>
    </div>
  )
}
