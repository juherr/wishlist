import { Head, Link } from '@inertiajs/react'
import { AppLayout } from '@/Layouts/AppLayout'
import { ProfileCard } from '@/Components/ProfileCard'
import { Button } from '@/Components/ui/button'
import { PageProps, ProfileSummary } from '@/types'

type HomeProps = PageProps<{
  profiles: ProfileSummary[]
}>

export default function Home({ profiles }: HomeProps) {
  return (
    <AppLayout title="Hello" bare>
      <Head title="Accueil" />
      <section className="kdo-blob kdo-home-blob flex min-h-svh flex-col justify-start py-[10vh] lg:flex-row lg:items-center lg:justify-between lg:gap-14">
        <div className="max-w-[620px] text-left lg:w-[36%] lg:shrink-0">
          <h1 className="kdo-title text-[clamp(4rem,12vw,11rem)]">Hello</h1>
          <p className="mt-4 text-3xl font-bold leading-tight text-foreground sm:text-4xl">
            Pas de compte ?
          </p>
          <div className="mt-12 inline-flex flex-col gap-4">
            <Button asChild size="lg">
              <Link href="/guest">Me connecter en invité</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/profiles/create">Ajouter un compte</Link>
            </Button>
          </div>
        </div>

        <div className="mt-16 flex min-w-0 flex-col gap-5 lg:mt-0 lg:w-[58%]">
          <div className="grid gap-5 md:grid-cols-2">
            {profiles.map((profile) => (
              <ProfileCard key={profile.id} profile={profile} home />
            ))}
          </div>
        </div>
      </section>
    </AppLayout>
  )
}
