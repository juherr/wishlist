import { Head, useForm } from '@inertiajs/react'
import { Save, Trash2 } from 'lucide-react'
import { FormEvent, ReactNode } from 'react'
import { AppLayout } from '@/Layouts/AppLayout'
import { Button } from '@/Components/ui/button'
import { PageProps, ProfileSummary } from '@/types'

type ParentOption = {
  id: number
  name: string
  avatarUrl: string
}

type ProfileFormProps = PageProps<{
  profile: ProfileSummary | null
  parents: ParentOption[]
}>

type ProfileFormData = {
  name: string
  is_child: boolean
  avatar: number
  birthday: string
  size_top: string
  size_bottom: string
  size_feet: string
  parent_ids: number[]
}

const avatarChoices = Array.from({ length: 15 }, (_, index) => index + 1)

export default function ProfileForm({ profile, parents }: ProfileFormProps) {
  const isEditing = Boolean(profile)
  const {
    data,
    setData,
    post,
    put,
    delete: destroy,
    processing,
    errors,
  } = useForm<ProfileFormData>({
    name: profile?.name ?? '',
    is_child: profile?.isChild ?? false,
    avatar: profile?.avatar ?? 1,
    birthday: profile?.birthday ?? '',
    size_top: profile?.sizeTop ?? '',
    size_bottom: profile?.sizeBottom ?? '',
    size_feet: profile?.sizeFeet ?? '',
    parent_ids: profile?.parentIds ?? [],
  })

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (profile) {
      put(`/profiles/${profile.id}`)
      return
    }
    post('/profiles')
  }

  function toggleParent(parentId: number, checked: boolean) {
    setData(
      'parent_ids',
      checked
        ? [...data.parent_ids, parentId]
        : data.parent_ids.filter((id) => id !== parentId),
    )
  }

  return (
    <AppLayout title={isEditing ? 'Modifier un profil' : 'Nouveau profil'} bare>
      <Head title={isEditing ? 'Modifier un profil' : 'Nouveau profil'} />
      <section className="kdo-account-page">
        <div className="kdo-account-content">
          <div className="kdo-account-title">
            <h1 className="kdo-title">Compte</h1>
            <h2>{isEditing ? 'Modifier ce compte' : 'Ajouter un compte'}</h2>
          </div>

          <form onSubmit={submit} className="kdo-account-form">
            <LegacyField label="Prénom" htmlFor="name" error={errors.name}>
              <input
                id="name"
                className="kdo-input-plain"
                required
                value={data.name}
                onChange={(event) => setData('name', event.target.value)}
                aria-invalid={Boolean(errors.name)}
              />
            </LegacyField>

            <LegacyField
              label="Date de naissance"
              helper="JJ/MM/AAAA"
              htmlFor="birthday"
            >
              <input
                id="birthday"
                className="kdo-input-plain"
                type="date"
                min="1930-01-01"
                value={data.birthday}
                onChange={(event) => setData('birthday', event.target.value)}
              />
            </LegacyField>

            <fieldset className="kdo-wrap-form kdo-wrap-form-group">
              <legend className="kdo-label-wrap">
                <span>Tailles</span>
                <small>Facultatif</small>
              </legend>
              <div className="kdo-size-grid">
                <MiniField label="Haut" htmlFor="size_top">
                  <input
                    id="size_top"
                    value={data.size_top}
                    onChange={(event) =>
                      setData('size_top', event.target.value)
                    }
                  />
                </MiniField>
                <MiniField label="Bas" htmlFor="size_bottom">
                  <input
                    id="size_bottom"
                    value={data.size_bottom}
                    onChange={(event) =>
                      setData('size_bottom', event.target.value)
                    }
                  />
                </MiniField>
                <MiniField label="Pied" htmlFor="size_feet">
                  <input
                    id="size_feet"
                    value={data.size_feet}
                    onChange={(event) =>
                      setData('size_feet', event.target.value)
                    }
                  />
                </MiniField>
              </div>
            </fieldset>

            <fieldset className="kdo-wrap-form kdo-wrap-form-group">
              <legend className="kdo-label-wrap">
                <span>Illustration</span>
              </legend>
              <div className="kdo-avatar-grid">
                {avatarChoices.map((avatar) => (
                  <label
                    key={avatar}
                    className="kdo-avatar-choice"
                    data-selected={data.avatar === avatar}
                  >
                    <input
                      type="radio"
                      name="avatar"
                      value={avatar}
                      checked={data.avatar === avatar}
                      onChange={() => setData('avatar', avatar)}
                    />
                    <span
                      className="kdo-avatar-choice-blob"
                      aria-hidden="true"
                    />
                    <img src={`/images/avatar/avatar${avatar}.png`} alt="" />
                  </label>
                ))}
              </div>
              {errors.avatar ? (
                <p className="kdo-field-error">{errors.avatar}</p>
              ) : null}
            </fieldset>

            <fieldset className="kdo-child-field">
              <legend className="kdo-label-wrap">
                <span>Compte enfant ?</span>
              </legend>
              <div className="kdo-child-switch" aria-label="Compte enfant">
                <button
                  type="button"
                  className={data.is_child ? 'is-active' : ''}
                  onClick={() => setData('is_child', true)}
                >
                  Oui
                </button>
                <button
                  type="button"
                  className={!data.is_child ? 'is-active' : ''}
                  onClick={() => setData('is_child', false)}
                >
                  Non
                </button>
              </div>
            </fieldset>

            {data.is_child ? (
              <fieldset className="kdo-wrap-form kdo-wrap-form-group">
                <legend className="kdo-label-wrap">
                  <span>Qui peut modifier cette liste ?</span>
                </legend>
                <div className="kdo-parent-grid">
                  {parents.map((parent) => (
                    <label
                      key={parent.id}
                      className="kdo-parent-choice"
                      data-selected={data.parent_ids.includes(parent.id)}
                    >
                      <input
                        type="checkbox"
                        checked={data.parent_ids.includes(parent.id)}
                        onChange={(event) =>
                          toggleParent(parent.id, event.target.checked)
                        }
                      />
                      <span className="kdo-parent-avatar">
                        <span
                          className="kdo-avatar-choice-blob"
                          aria-hidden="true"
                        />
                        <img src={parent.avatarUrl} alt="" />
                      </span>
                      <span>{parent.name}</span>
                    </label>
                  ))}
                </div>
              </fieldset>
            ) : null}

            <div className="kdo-form-actions">
              <Button type="submit" disabled={processing}>
                <Save data-icon="inline-start" />
                {isEditing ? 'Enregistrer' : 'Ajouter ce compte'}
              </Button>
              {profile ? (
                <Button
                  type="button"
                  variant="destructive"
                  disabled={processing}
                  onClick={() => destroy(`/profiles/${profile.id}`)}
                >
                  <Trash2 data-icon="inline-start" />
                  Supprimer ce compte
                </Button>
              ) : null}
            </div>
          </form>
        </div>
      </section>
    </AppLayout>
  )
}

function LegacyField({
  label,
  helper,
  htmlFor,
  error,
  children,
}: {
  label: string
  helper?: string
  htmlFor: string
  error?: string
  children: ReactNode
}) {
  return (
    <div className="kdo-wrap-form">
      <div className="kdo-label-wrap">
        <label htmlFor={htmlFor}>{label}</label>
        {helper ? <small>{helper}</small> : null}
      </div>
      {children}
      {error ? <p className="kdo-field-error">{error}</p> : null}
    </div>
  )
}

function MiniField({
  label,
  htmlFor,
  children,
}: {
  label: string
  htmlFor: string
  children: ReactNode
}) {
  return (
    <div className="kdo-mini-form">
      <div className="kdo-label-wrap">
        <label htmlFor={htmlFor}>{label}</label>
      </div>
      {children}
    </div>
  )
}
