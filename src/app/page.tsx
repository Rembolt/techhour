import ExploreCanvas from "@/components/explore/ExploreCanvas";
import projects from "@/data/projects";

export default function Explore() {
  return (
    <main className="flex-1">
      <ExploreCanvas projects={projects} />
    </main>
  );
}
