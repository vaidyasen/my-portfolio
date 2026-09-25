import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";

const profiles = [
  { label: "GitHub", href: "https://github.com/vaidyasen" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/vaidyasen/" },
  { label: "LeetCode", href: "https://leetcode.com/u/theNoobKid/" },
];

const projects = [
  {
    title: "CardWise",
    description:
      "A credit card rewards product that tracks merchant offers and helps users choose the best card for each purchase.",
    stack: ["Next.js", "TypeScript", "PostgreSQL", "Prisma", "Firebase"],
    href: "https://github.com/vaidyasen/cardWise",
    mark: "01",
  },
  {
    title: "Resume Platform",
    description:
      "A full stack resume builder with authentication, versioned resumes, PDF export, and a containerized API.",
    stack: ["React", "FastAPI", "Redis", "Docker", "JWT"],
    href: "https://github.com/vaidyasen/resume-platform",
    mark: "02",
  },
  {
    title: "Business Card Scanner",
    description:
      "A mobile app for scanning, extracting, searching, and organizing business card information on device.",
    stack: ["React Native", "Expo", "OCR", "Local storage"],
    href: "https://github.com/vaidyasen/business-app-scanner",
    mark: "03",
  },
  {
    title: "Financial Data Extraction",
    description:
      "A Streamlit tool that turns finance news into structured company, revenue, and income data using an LLM.",
    stack: ["Python", "Streamlit", "OpenAI API"],
    href: "https://github.com/vaidyasen/financeExtractionTool",
    mark: "04",
  },
];

const skills = [
  "JavaScript / TypeScript",
  "React / Next.js",
  "Python / FastAPI",
  "Go",
  "PostgreSQL / Redis",
  "Docker / AWS",
];

function Arrow() {
  return <span aria-hidden="true">↗</span>;
}

function App() {
  return (
    <div className="site-shell">
      <header className="nav wrap">
        <a className="wordmark" href="#top" aria-label="Ritik Vaidyasen, home">
          RV<span>.</span>
        </a>
        <nav aria-label="Primary navigation">
          <a href="#work">Work</a>
          <a href="#about">About</a>
          <a href="mailto:ritikvaidyasen0@gmail.com">Contact</a>
        </nav>
      </header>

      <main id="top">
        <section className="hero wrap">
          <p className="eyebrow">Software Engineer · Cisco Systems</p>
          <h1>I build dependable software for real problems.</h1>
          <p className="hero-copy">
            I’m Ritik Vaidyasen, a full stack engineer working across web
            products, APIs, data systems, and applied AI.
          </p>
          <div className="hero-actions">
            <a className="button button-primary" href="#work">
              See selected work <Arrow />
            </a>
            <a className="button button-secondary" href="mailto:ritikvaidyasen0@gmail.com">
              Get in touch
            </a>
          </div>
          <div className="profile-links" aria-label="Profiles">
            {profiles.map((profile) => (
              <a key={profile.label} href={profile.href} target="_blank" rel="noreferrer">
                {profile.label} <Arrow />
              </a>
            ))}
          </div>
        </section>

        <section className="work wrap" id="work">
          <div className="section-heading">
            <p className="eyebrow">Selected work</p>
            <h2>A few things I’ve built.</h2>
          </div>
          <div className="project-list">
            {projects.map((project) => (
              <a
                className="project"
                href={project.href}
                target="_blank"
                rel="noreferrer"
                key={project.title}
              >
                <span className="project-number">{project.mark}</span>
                <div className="project-body">
                  <h3>{project.title}</h3>
                  <p>{project.description}</p>
                  <ul aria-label={`${project.title} technologies`}>
                    {project.stack.map((item) => <li key={item}>{item}</li>)}
                  </ul>
                </div>
                <span className="project-arrow"><Arrow /></span>
              </a>
            ))}
          </div>
          <a className="text-link" href="https://github.com/vaidyasen?tab=repositories" target="_blank" rel="noreferrer">
            View all repositories <Arrow />
          </a>
        </section>

        <section className="about wrap" id="about">
          <div className="section-heading">
            <p className="eyebrow">About</p>
            <h2>Engineer, learner, problem solver.</h2>
          </div>
          <div className="about-grid">
            <div className="about-copy">
              <p>
                I’m a software engineer at Cisco Systems. I enjoy taking a
                product from an unclear problem to a working, maintainable
                system, with equal care for the interface and the backend.
              </p>
              <p>
                I earned my B.Tech from MNNIT Allahabad in 2024. Outside work,
                I build practical tools and keep sharpening my data structures,
                system design, and cloud engineering skills.
              </p>
            </div>
            <div>
              <p className="list-label">Core toolkit</p>
              <ul className="skills">
                {skills.map((skill) => <li key={skill}>{skill}</li>)}
              </ul>
            </div>
          </div>
        </section>

        <section className="contact wrap" id="contact">
          <p className="eyebrow">Next opportunity</p>
          <h2>Let’s build something useful.</h2>
          <p>I’m open to software engineering roles and thoughtful collaborations.</p>
          <a className="button button-primary" href="mailto:ritikvaidyasen0@gmail.com">
            ritikvaidyasen0@gmail.com <Arrow />
          </a>
        </section>
      </main>

      <footer className="footer wrap">
        <span>© {new Date().getFullYear()} Ritik Vaidyasen</span>
        <span>Built with React. Hosted on GitHub Pages.</span>
      </footer>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
