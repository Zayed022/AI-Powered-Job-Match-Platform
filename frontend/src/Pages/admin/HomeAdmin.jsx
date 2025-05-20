// src/pages/HomeAdmin.jsx
import { useNavigate } from "react-router-dom";

/* -------------------------------------------------------------------------- */
/*                               helper component                             */
/* -------------------------------------------------------------------------- */

function FeatureCard({ title, desc, path, hue }) {
  const navigate = useNavigate();
  return (
    <button
      onClick={() => navigate(path)}
      className={`
        relative flex flex-col justify-between overflow-hidden rounded-2xl
        border border-white/20 bg-white/60 p-6 shadow backdrop-blur
        transition-transform duration-200 ease-out
        hover:-translate-y-1 focus:-translate-y-1
        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-${hue}-600
        dark:bg-slate-800/60 dark:border-slate-700
      `}
    >
      {/* decorative gradient blob */}
      <span
        aria-hidden
        className={`
          pointer-events-none absolute -inset-1 rounded-3xl opacity-0
          transition-opacity duration-300
          bg-gradient-to-br from-${hue}-400/60 to-${hue}-600/60
          blur-2xl
          group-hover:opacity-100 group-focus-visible:opacity-100
        `}
      />

      <div className="relative z-10">
        <h3 className="mb-2 text-lg font-semibold tracking-tight">{title}</h3>
        <p className="text-sm text-slate-600 dark:text-slate-300">{desc}</p>
      </div>

      {/* chevron made with borders */}
      <span
        aria-hidden
        className="
          relative z-10 mt-4 inline-block h-3 w-3 self-end
          origin-bottom-right rotate-45 border-b-2 border-r-2
          border-current
        "
      />
    </button>
  );
}

/* -------------------------------------------------------------------------- */
/*                                    page                                    */
/* -------------------------------------------------------------------------- */

export default function HomeAdmin() {
  const features = [
    {
      title: "Create Job",
      desc: "Add a new job listing to the platform.",
      path: "/admin/jobs/create-job",
      hue: "emerald",
    },
    {
      title: "Update Job",
      desc: "Edit an existing listing’s details.",
      path: "/admin/jobs/update-job",
      hue: "sky",
    },
    {
      title: "Get Job by ID",
      desc: "Look up a specific job record.",
      path: "/admin/jobs/search",
      hue: "amber",
    },
    {
      title: "Delete Job",
      desc: "Remove a listing permanently.",
      path: "/admin/jobs/delete",
      hue: "rose",
    },
  ];

  return (
    <section className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="mb-10 text-3xl font-bold tracking-tight">
        Admin Dashboard
      </h1>

      <div
        className="
          grid gap-8
          sm:grid-cols-2 lg:grid-cols-4
        "
      >
        {features.map(({ hue, ...rest }) => (
          <FeatureCard key={rest.title} hue={hue} {...rest} />
        ))}
      </div>
    </section>
  );
}
