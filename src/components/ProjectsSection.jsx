import { useEffect, useState } from "react";
import { ArrowRight, ExternalLink, Github } from "lucide-react";

export const ProjectsSection = () => {
  const [projects, setProjects] = useState([]);
  const githubUsername = "bri4nh0"; // Your GitHub username

  // 1. List your EXACT pinned repository names here
  const PINNED_REPO_NAMES = [
    "portfolio-main", "todolist-v1"
    // Add 5 more repository names exactly as they appear on GitHub
    // Example: "project-2", "awesome-app", "data-visualization-tool"
  ];

  useEffect(() => {
    const fetchRepos = async () => {
      try {
        // 2. Fetch more repos to ensure we get all pinned ones
        const res = await fetch(`https://api.github.com/users/${githubUsername}/repos?sort=updated&per_page=30`);
        const data = await res.json();

        // 3. Filter to ONLY show pinned repos
        const pinnedRepos = data.filter(repo => 
          PINNED_REPO_NAMES.includes(repo.name)
        );

        // 4. Map GitHub data into our component structure
        const mappedProjects = pinnedRepos.map((repo) => ({
          id: repo.id,
          title: repo.name,
          description: repo.description || "No description provided.",
          image: "/projects/default.png", // fallback image
          tags: repo.topics || [], // Use GitHub topics if available
          demoUrl: repo.homepage || "#",
          githubUrl: repo.html_url,
          // Bonus: Add extra GitHub metadata
          stars: repo.stargazers_count,
          forks: repo.forks_count,
          language: repo.language,
          updated: repo.updated_at,
        }));

        setProjects(mappedProjects);
      } catch (err) {
        console.error("Error fetching GitHub repos:", err);
      }
    };

    fetchRepos();
  }, []);

  return (
    <section id="projects" className="py-24 px-4 relative">
      <div className="container mx-auto max-w-5xl">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center">
          Featured <span className="text-primary">Projects</span>
        </h2>

        <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
          Here are some of my recent projects. Each project was carefully crafted with attention
          to detail, performance, and user experience.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, key) => (
            <div
              key={key}
              className="group bg-card rounded-lg overflow-hidden shadow-xs card-hover"
            >
              <div className="h-48 overflow-hidden">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>

              <div className="p-6">
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 text-xs font-medium border rounded-full bg-secondary text-secondary-foreground"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <h3 className="text-xl font-semibold mb-1">{project.title}</h3>
                <p className="text-muted-foreground text-sm mb-4">
                  {project.description}
                </p>
                <div className="flex justify-between items-center">
                  <div className="flex space-x-3">
                    <a
                      href={project.demoUrl}
                      target="_blank"
                      className="text-foreground/80 hover:text-primary transition-colors duration-300"
                    >
                      <ExternalLink size={20} />
                    </a>
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      className="text-foreground/80 hover:text-primary transition-colors duration-300"
                    >
                      <Github size={20} />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <a
            className="cosmic-button w-fit flex items-center mx-auto gap-2"
            target="_blank"
            href={`https://github.com/${githubUsername}`}
          >
            Check My Github <ArrowRight size={16} />
          </a>
        </div>
      </div>
    </section>
  );
};
