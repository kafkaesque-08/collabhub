// app/page.js — fetches real projects from Supabase
import { supabase } from "../lib/supabase"
import ProjectCard from "../components/ProjectCard"
import ShareIdeaButton from "../components/ShareIdeaButton"

async function getProjects() {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) console.error(error)
  return data || []
}

export default async function Home() {
  const projects = await getProjects()

  return (
    <div>
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-purple-700 mb-2">CollabHub</h1>
        <p className="text-gray-500">Find your team. Build something great.</p>
      </div>

      <div className="max-w-2xl mx-auto mb-6">
        <ShareIdeaButton />
      </div>

      <div className="max-w-2xl mx-auto flex flex-col gap-6">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
        {projects.length === 0 && (
          <p className="text-center text-gray-400 py-12">
            No projects yet — be the first to share an idea!
          </p>
        )}
      </div>
    </div>
  )
}