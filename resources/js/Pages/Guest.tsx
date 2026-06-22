import { Head, useForm } from '@inertiajs/react'
import { FormEvent } from 'react'
import { AppLayout } from '@/Layouts/AppLayout'
import { Button } from '@/Components/ui/button'

export default function Guest() {
  const form = useForm({ guest_name: '' })

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    form.post('/session/guest')
  }

  return (
    <AppLayout title="Nom de l'invité" bare>
      <Head title="Nom de l'invité" />
      <section className="kdo-guest-page">
        <div className="kdo-guest-content">
          <h1 className="kdo-title kdo-guest-title">Ton prénom ?</h1>
          <form onSubmit={submit} className="kdo-guest-form">
            <input
              name="guest_name"
              autoFocus
              value={form.data.guest_name}
              onChange={(event) =>
                form.setData('guest_name', event.target.value)
              }
              aria-invalid={Boolean(form.errors.guest_name)}
              required
            />
            <Button type="submit" disabled={form.processing}>
              Valider
            </Button>
          </form>
          {form.errors.guest_name ? (
            <p className="kdo-guest-error">{form.errors.guest_name}</p>
          ) : null}
        </div>
      </section>
    </AppLayout>
  )
}
