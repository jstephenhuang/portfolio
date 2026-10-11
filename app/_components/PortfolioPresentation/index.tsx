import ItemLinks from "@/app/_components/ItemLinks";

import MediaCarousel from "./MediaCarousel";
import { presentationProjects } from "./projects";
import styles from "./styles.module.scss";

const PortfolioPresentation: React.FC = () => {
  return (
    <main className={styles.page}>
      <div className={styles.projectList}>
        {presentationProjects.map((project, projectIndex) => (
          <article className={styles.project} id={project.id} key={project.id}>
            <MediaCarousel priority={projectIndex === 0} projectTitle={project.title} slides={project.slides} />

            <div className={styles.projectDetails}>
              <h1>{project.title}</h1>

              {project.links && (
                <div className={styles.projectLinks}>
                  <ItemLinks links={project.links} />
                </div>
              )}

              <div className={styles.projectCopy}>
                {project.paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </div>
          </article>
        ))}
      </div>
    </main>
  );
};

export default PortfolioPresentation;
