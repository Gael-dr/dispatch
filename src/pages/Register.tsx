import { ChromeIcon, FacebookIcon, LinkedinIcon, LockIcon, MailIcon, UserIcon } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

type Provider = 'facebook' | 'linkedin' | 'google'
type RegisterLoading = Provider | 'email' | null

export default function Register() {
    const navigate = useNavigate()
    const [loading, setLoading] = useState<RegisterLoading>(null)

    const providers = useMemo(
        () =>
            [
                {
                    id: 'facebook' as const,
                    label: 'Continuer avec Facebook',
                    Icon: FacebookIcon,
                    iconClassName: 'text-blue-400',
                    hoverGlow: 'from-blue-500/20 to-cyan-500/20',
                },
                {
                    id: 'linkedin' as const,
                    label: 'Continuer avec LinkedIn',
                    Icon: LinkedinIcon,
                    iconClassName: 'text-sky-400',
                    hoverGlow: 'from-sky-500/20 to-blue-500/20',
                },
                {
                    id: 'google' as const,
                    label: 'Continuer avec Google',
                    Icon: ChromeIcon,
                    iconClassName: 'text-emerald-300',
                    hoverGlow: 'from-emerald-500/20 to-yellow-500/20',
                },
            ] as const,
        [],
    )

    const handleConnect = (p: Provider) => {
        setLoading(p)
        window.setTimeout(() => {
            navigate('/')
        }, 250)
    }

    const handleClassicRegister = (e: React.FormEvent) => {
        e.preventDefault()
        setLoading('email')
        window.setTimeout(() => {
            navigate('/')
        }, 250)
    }

    return (
        <main className="relative h-[100dvh] bg-background-secondary w-screen overflow-y-auto overflow-x-hidden px-5 pt-8 pb-28 flex items-start sm:items-center justify-center">


            {/* card */}
            <section className="relative w-full max-w-sm">
                <div className="rounded-3xl border border-white/10 bg-background-secondary/55 shadow-2xl  overflow-hidden">
                    {/* top bar */}
                    <div className="px-6 pt-6 pb-4 border-b border-white/10">
                        <div className="flex items-center gap-3">
                            <div className="w-11 h-11 rounded-2xl bg-slate-800/50 flex items-center justify-center border border-slate-700 shadow-2xl relative overflow-hidden group">
                                <div className="absolute inset-0 bg-linear-to-tr from-blue-500/20 to-purple-500/20 opacity-60 group-hover:opacity-100 transition-opacity" />
                                <UserIcon className="relative w-5 h-5 text-blue-400" />
                            </div>

                            <div className="min-w-0">
                                <h1 className="brand-text !text-3xl !mb-0 leading-none">DISPATCH</h1>
                                <p className="text-slate-400 text-xs font-bold tracking-wide opacity-80">
                                    DON&apos;T READ. DECIDE.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* content */}
                    <div className="px-6 py-5">
                        <h2 className="text-white font-extrabold tracking-tight text-xl mb-1">Inscription</h2>
                        <p className="text-slate-400 text-sm font-medium mb-5">
                            Crée ton compte avec un fournisseur ou ton email.
                        </p>

                        {/* provider buttons */}
                        <div className="space-y-3">
                            {providers.map(p => (
                                <button
                                    key={p.id}
                                    onClick={() => handleConnect(p.id)}
                                    disabled={loading !== null}
                                    className="group relative w-full rounded-2xl border border-white/10 bg-slate-900/30 hover:bg-slate-900/40 active:scale-[0.99] transition-all overflow-hidden disabled:opacity-60 disabled:cursor-not-allowed"
                                >
                                    <div
                                        className={[
                                            'absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity',
                                            `bg-linear-to-tr ${p.hoverGlow}`,
                                        ].join(' ')}
                                    />
                                    <div className="relative flex items-center gap-3 px-4 py-3.5">
                                        <div className="w-10 h-10 rounded-xl border border-white/10 bg-slate-800/35 flex items-center justify-center">
                                            <p.Icon className={`w-5 h-5 ${p.iconClassName}`} />
                                        </div>
                                        <div className="flex-1 text-left">
                                            <p className="text-white font-bold text-sm tracking-tight">{p.label}</p>
                                            <p className="text-slate-400 text-xs font-medium">Redirection simulée vers “/”</p>
                                        </div>
                                        <div className="text-slate-500 text-xs font-bold">{loading === p.id ? '...' : '→'}</div>
                                    </div>
                                </button>
                            ))}
                        </div>

                        {/* divider */}
                        <div className="flex items-center gap-3 my-5">
                            <div className="h-px flex-1 bg-white/10" />
                            <span className="text-slate-500 text-xs font-bold tracking-wide">OU</span>
                            <div className="h-px flex-1 bg-white/10" />
                        </div>

                        {/* email form (design only) */}
                        <form onSubmit={handleClassicRegister} className="space-y-3">
                            <label className="block">
                                <span className="text-slate-400 text-xs font-bold tracking-wide">NOM</span>
                                <div className="mt-2 flex items-center gap-2 rounded-2xl border border-white/10 bg-slate-900/25 px-4 py-3">
                                    <UserIcon className="w-4 h-4 text-slate-400" />
                                    <input
                                        type="text"
                                        placeholder="Ton nom"
                                        className="w-full bg-transparent outline-none text-white placeholder:text-slate-500 text-sm font-semibold"
                                    />
                                </div>
                            </label>

                            <label className="block">
                                <span className="text-slate-400 text-xs font-bold tracking-wide">EMAIL</span>
                                <div className="mt-2 flex items-center gap-2 rounded-2xl border border-white/10 bg-slate-900/25 px-4 py-3">
                                    <MailIcon className="w-4 h-4 text-slate-400" />
                                    <input
                                        type="email"
                                        placeholder="nom@domaine.com"
                                        className="w-full bg-transparent outline-none text-white placeholder:text-slate-500 text-sm font-semibold"
                                    />
                                </div>
                            </label>

                            <label className="block">
                                <span className="text-slate-400 text-xs font-bold tracking-wide">MOT DE PASSE</span>
                                <div className="mt-2 flex items-center gap-2 rounded-2xl border border-white/10 bg-slate-900/25 px-4 py-3">
                                    <LockIcon className="w-4 h-4 text-slate-400" />
                                    <input
                                        type="password"
                                        placeholder="••••••••"
                                        className="w-full bg-transparent outline-none text-white placeholder:text-slate-500 text-sm font-semibold"
                                    />
                                </div>
                            </label>

                            <label className="block">
                                <span className="text-slate-400 text-xs font-bold tracking-wide">CONFIRMER</span>
                                <div className="mt-2 flex items-center gap-2 rounded-2xl border border-white/10 bg-slate-900/25 px-4 py-3">
                                    <LockIcon className="w-4 h-4 text-slate-400" />
                                    <input
                                        type="password"
                                        placeholder="••••••••"
                                        className="w-full bg-transparent outline-none text-white placeholder:text-slate-500 text-sm font-semibold"
                                    />
                                </div>
                            </label>

                            <button
                                type="submit"
                                disabled={loading !== null}
                                className="relative w-full rounded-2xl bg-blue-500/90 hover:bg-blue-500 text-white font-extrabold tracking-tight py-3.5 shadow-xl shadow-blue-500/15 active:scale-[0.99] transition-all overflow-hidden disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                                <span className="absolute inset-0 bg-linear-to-tr from-white/0 via-white/10 to-white/0 opacity-0 hover:opacity-100 transition-opacity" />
                                <span className="relative">{loading ? 'Création…' : "S'inscrire"}</span>
                            </button>

                            <div className="flex items-center justify-between pt-1">
                                <button
                                    type="button"
                                    onClick={() => navigate('/login')}
                                    className="text-slate-400 hover:text-slate-300 text-xs font-bold tracking-wide"
                                >
                                    Déjà un compte ?
                                </button>
                                <button
                                    type="button"
                                    className="text-slate-400 hover:text-slate-300 text-xs font-bold tracking-wide"
                                >
                                    Conditions
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* footer */}
                    <div className="px-6 py-4 border-t border-white/10">
                        <p className="text-slate-500 text-xs font-medium">
                            En continuant, tu acceptes nos <span className="text-slate-300 font-bold">conditions</span> et notre{' '}
                            <span className="text-slate-300 font-bold">politique</span>.
                        </p>
                    </div>
                </div>
            </section>
        </main>
    )
}
