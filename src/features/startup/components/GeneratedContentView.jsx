// turns camelCase keys like "valueProposition" into "Value Proposition"
function humanizeKey(key) {
  const withSpaces = key.replace(/([a-z])([A-Z])/g, '$1 $2')
  return withSpaces.charAt(0).toUpperCase() + withSpaces.slice(1)
}

const CODE_KEYS = ['html', 'css']

export default function GeneratedContentView({ data }) {
  const entries = Object.entries(data || {}).filter(([, value]) => {
    if (Array.isArray(value)) return value.length > 0
    return !!value
  })

  if (entries.length === 0) {
    return (
      <p className="text-sm text-zinc-500 dark:text-zinc-400">
        This section generated, but came back empty. Try regenerating it.
      </p>
    )
  }

  return (
    <div className="space-y-6">
      {entries.map(([key, value]) => (
        <div key={key}>
          <h3 className="font-display text-sm font-semibold text-zinc-900 dark:text-white">
            {humanizeKey(key)}
          </h3>

          {CODE_KEYS.includes(key) ? (
            <pre className="mt-2 overflow-x-auto rounded-xl border border-zinc-200 dark:border-white/10 bg-zinc-50 dark:bg-white/[0.03] p-4 text-xs text-zinc-700 dark:text-zinc-300">
              <code>{value}</code>
            </pre>
          ) : Array.isArray(value) ? (
            <ul className="mt-2 space-y-1.5">
              {value.map((item, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2 text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed"
                >
                  <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-indigo-500" />
                  {item}
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">{value}</p>
          )}
        </div>
      ))}
    </div>
  )
}
