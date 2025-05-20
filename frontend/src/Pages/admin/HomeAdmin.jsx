import { useNavigate } from "react-router-dom";
import {
  Briefcase,
  Pencil,
  Search,
  Trash2,
} from "lucide-react"; 


const iconMap = {
  "Create Job": <Briefcase className="h-6 w-6 text-white" />,
  "Update Job": <Pencil className="h-6 w-6 text-white" />,
  "Get Job by ID": <Search className="h-6 w-6 text-white" />,
  "Delete Job": <Trash2 className="h-6 w-6 text-white" />,
};


function FeatureCard({ title, desc, path, hue }) {
  const navigate = useNavigate();
  return (
    <button
      onClick={() => navigate(path)}
      className={`
        group relative flex flex-col justify-between overflow-hidden rounded-2xl
        border border-slate-200 bg-white p-6 shadow-md transition-all
        duration-300 ease-out hover:-translate-y-1 hover:shadow-lg
        focus:outline-none focus:ring-2 focus:ring-${hue}-500 focus:ring-offset-2
        dark:border-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700
      `}
    >
      
      <span
        aria-hidden
        className={`
          pointer-events-none absolute inset-0 z-0 scale-125 opacity-0 blur-2xl
          transition-all duration-300 ease-in-out group-hover:opacity-30
          bg-gradient-to-br from-${hue}-400 via-${hue}-500 to-${hue}-600
        `}
      />

      <div className="relative z-10 flex flex-col gap-4">
        <div className={`flex items-center justify-center h-12 w-12 rounded-full bg-${hue}-500`}>
          {iconMap[title]}
        </div>
        <div>
          <h3 className="mb-1 text-lg font-semibold text-slate-900 dark:text-white">
            {title}
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-300">{desc}</p>
        </div>
      </div>

     
      <span
        aria-hidden
        className="relative z-10 mt-6 self-end inline-block h-3 w-3 rotate-45 border-b-2 border-r-2 border-slate-500 dark:border-slate-300"
      />
    </button>
  );
}



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
      <h1 className="mb-10 text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
        Admin Dashboard
      </h1>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {features.map(({ hue, ...rest }) => (
          <FeatureCard key={rest.title} hue={hue} {...rest} />
        ))}
      </div>
    </section>
  );
}
