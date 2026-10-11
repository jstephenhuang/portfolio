import type { Item } from "@/lib/data";

export type ProjectMedia = {
  alt: string;
  src: string;
  fit?: "contain" | "cover";
};

export type ProjectSlide = {
  media: [ProjectMedia] | [ProjectMedia, ProjectMedia];
};

export type PresentationProject = {
  id: string;
  title: string;
  slides: ProjectSlide[];
  links?: Item["links"];
  paragraphs: string[];
};

const watonomousLogo: ProjectMedia = {
  alt: "WATonomous autonomous vehicle team",
  src: "/watonomous/logo.png",
  fit: "contain",
};

export const presentationProjects: PresentationProject[] = [
  {
    id: "world-cup-random-forest",
    title: "2026 World Cup prediction pipeline",
    slides: [
      {
        media: [
          {
            alt: "Random forest probability calibration results",
            src: "/2026-wc/rf-chart-result.png",
            fit: "contain",
          },
          {
            alt: "Predicted 2026 World Cup bracket",
            src: "/2026-wc/my-bracket.png",
            fit: "contain",
          },
        ],
      },
      {
        media: [
          {
            alt: "World Cup prediction pipeline diagram",
            src: "/2026-wc/excalidraw-dt.png",
            fit: "contain",
          },
        ],
      },
    ],
    links: { github: "https://github.com/jstephenhuang/2026-world-cup" },
    paragraphs: [
      "I engineered features from historical international soccer data and trained a Random Forest classifier with scikit-learn to predict match outcomes. The final model reached a Brier score of 0.082, so the output probabilities were useful for more than picking a single winner.",
      "I then ran 20,000 Monte Carlo simulations of the tournament to build a complete bracket. It predicted Spain as champion and Argentina as runner-up, helping me win a 25-person prediction pool and its $400 prize.",
    ],
  },
  {
    id: "watonomous-behaviour-tree",
    title: "Autonomous driving behaviour tree",
    slides: [{ media: [watonomousLogo] }],
    links: { general: [{ href: "https://watonomous.ca/", label: "WATonomous" }] },
    paragraphs: [
      "I designed and implemented a C++ behaviour tree with BehaviorTree.CPP and ROS 2. It translates the state produced by our world model into commands for the control stack, allowing the vehicle to navigate toward requested goals while respecting traffic rules.",
      "The work sits between perception and control, so the main challenge is making decisions predictable when the surrounding scene changes. I also lead six developers working across mapping, simulation, and decision-making for the autonomous vehicle.",
    ],
  },
  {
    id: "watonomous-world-modeling",
    title: "Context-rich world modeling",
    slides: [{ media: [watonomousLogo] }],
    links: { general: [{ href: "https://watonomous.ca/", label: "WATonomous" }] },
    paragraphs: [
      "I built C++ ROS 2 modules that ingest 3D object detections from perception and turn them into context-rich objects on the vehicle's HD map. The world model gives downstream planning systems a consistent view of lanes, obstacles, and nearby traffic.",
      "I worked across the boundaries between perception, mapping, and planning, using ROS 2 interfaces and visualization tools to inspect the data flowing through the stack and catch integration problems early.",
    ],
  },
  {
    id: "watonomous-simulation",
    title: "End-to-end simulation in CARLA",
    slides: [{ media: [watonomousLogo] }],
    links: { general: [{ href: "https://watonomous.ca/", label: "WATonomous" }] },
    paragraphs: [
      "I validated the world-modeling, behaviour-planning, and control pipeline end to end in CARLA with the planning team. The simulated environment let us find integration failures before vehicle testing and saved an estimated 20 or more hours of test-track time.",
      "I also created a Lanelet2-compatible OSM representation of our test track using Autoware tooling, giving the planning stack a realistic map for repeatable simulation runs.",
    ],
  },
  {
    id: "franka-panda",
    title: "Sim-to-real manipulation on a Franka Panda",
    slides: [{ media: [watonomousLogo] }],
    links: { general: [{ href: "https://watonomous.ca/", label: "WATonomous" }] },
    paragraphs: [
      "I am developing a sim-to-real HIL-SERL approach for USB pick-up and insertion on a Franka Panda robotic arm. The goal is to reduce the number of real-world demonstrations needed while improving task success.",
      "This is ongoing research. The work focuses on connecting simulation, learned manipulation, and hardware-in-the-loop validation without presenting intended outcomes as completed results.",
    ],
  },
  {
    id: "eidos",
    title: "Eidos: a plugin-based ROS package for SLAM",
    slides: [{ media: [watonomousLogo] }],
    links: { general: [{ href: "https://watonomous.ca/", label: "WATonomous" }] },
    paragraphs: [
      "Eidos is an in-house, plugin-based ROS package for SLAM. I integrated additional datasets into its factor-graph localization workflow, extending the package to support multiple autonomous vehicle platforms.",
      "The plugin architecture keeps sensor and dataset integrations modular, which makes it easier to evaluate the same localization system across different vehicles and data sources.",
    ],
  },
  {
    id: "genai-youtube-automation",
    title: "GenAI YouTube automation pipeline",
    slides: [
      {
        media: [
          {
            alt: "Generated video from the YouTube automation pipeline",
            src: "/yap/thumb.png",
            fit: "contain",
          },
        ],
      },
    ],
    links: {
      github: "https://github.com/jstephenhuang/yap",
      youtube: "https://www.youtube.com/@ADOXiDOCS/videos",
    },
    paragraphs: [
      "I built a Python pipeline that turns source material into narrated videos end to end. It generates the script, narration, and imagery, assembles the final video, and uploads it to YouTube.",
      "The workflow uses LangGraph checkpointing and human validation at intermediate stages. It removes the repetitive sourcing, recording, editing, and upload work, saving roughly ten hours per video while relying on open-source tools.",
    ],
  },
  {
    id: "crafting-interpreters",
    title: "Building a Lox interpreter in C++",
    slides: [
      {
        media: [
          {
            alt: "Crafting Interpreters book cover",
            src: "/lox.jpg",
            fit: "contain",
          },
          {
            alt: "Lox interpreter project artwork",
            src: "/crafting-interpreters/yak.png",
            fit: "contain",
          },
        ],
      },
    ],
    links: {
      github: "https://github.com/jstephenhuang/language-translators/tree/main/lox",
      general: [{ href: "/dumps/crafting-interpreters", label: "Notes" }],
    },
    paragraphs: [
      "I am working through Robert Nystrom's Crafting Interpreters while implementing the tree-walk Lox interpreter in C++ instead of Java. Rebuilding the examples in another language forces me to understand the scanner, parser, AST, and runtime rather than copy the reference implementation.",
      "I document the design decisions and the places where C++ changes the implementation, using the project to deepen my understanding of language tooling and systems programming.",
    ],
  },
];
