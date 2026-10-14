import { Button } from "@/components/ui/button";
import ProjectCard from "@/components/projects/ProjectCard";
import { ProjectTag, type ProjectTagColor } from "@/components/projects/ProjectTag";
import projects from "@/data/projects";

const tagColors: ProjectTagColor[] = ["zinc", "blue", "green", "amber", "purple"];

export default function Home() {
  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-8 px-4 py-10 sm:px-6">
      <section className="flex flex-col gap-3">
        <h2 className="text-lg font-semibold">Tags</h2>
        <div className="flex flex-wrap gap-2">
          {tagColors.map((color) => (
            <ProjectTag key={color} label={color} color={color} />
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-lg font-semibold">Button</h2>
        <div className="flex flex-wrap gap-2">
          <Button>Default</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-lg font-semibold">Project card</h2>
        <ProjectCard project={projects[1]} />
      </section>
    </main>
  );
}
