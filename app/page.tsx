"use client";
import { type CSSProperties, type ReactNode, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";

const TITLES = [
  "Software Developer",
  "Problem Solver",
  "Transitioning to Backend Development",
];

function ThemeIcon({ isLight }: { isLight: boolean }) {
  return isLight ? (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="4.2" />
      <path d="M12 2v2.2" />
      <path d="M12 19.8V22" />
      <path d="M4.93 4.93l1.56 1.56" />
      <path d="M17.51 17.51l1.56 1.56" />
      <path d="M2 12h2.2" />
      <path d="M19.8 12H22" />
      <path d="M4.93 19.07l1.56-1.56" />
      <path d="M17.51 6.49l1.56-1.56" />
    </svg>
  ) : (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 12.7A8.8 8.8 0 1 1 11.3 3a7 7 0 0 0 9.7 9.7Z" />
    </svg>
  );
}

function MagneticButton({
  href,
  variant = "primary",
  children,
  onClick,
  target,
}: {
  href: string;
  variant?: "primary" | "secondary";
  children: ReactNode;
  onClick?: () => void;
  target?: string;
}) {
  const ref = useRef<HTMLAnchorElement | null>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const reset = () => setOffset({ x: 0, y: 0 });

  return (
    <a
      ref={ref}
      href={href}
      onClick={onClick}
      target={target}
      rel={target === "_blank" ? "noopener noreferrer" : undefined}
      onMouseMove={(event) => {
        const rect = ref.current?.getBoundingClientRect();
        if (!rect) return;
        const x = event.clientX - rect.left - rect.width / 2;
        const y = event.clientY - rect.top - rect.height / 2;
        setOffset({ x: x * 0.18, y: y * 0.18 });
      }}
      onMouseLeave={reset}
      style={{
        "--tx": `${offset.x}px`,
        "--ty": `${offset.y}px`,
      } as CSSProperties}
      className={`magnetic-button magnetic-button--${variant}`}
    >
      {children}
    </a>
  );
}

export default function App() {
  const [isLight, setIsLight] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      const saved = window.localStorage.getItem("theme");
      if (saved) {
        setIsLight(saved === "light");
      } else {
        setIsLight(window.matchMedia("(prefers-color-scheme: light)").matches);
      }
      setMounted(true);
    }, 0);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const root = document.documentElement;
    root.classList.toggle("light", isLight);
    root.classList.toggle("dark", !isLight);
    window.localStorage.setItem("theme", isLight ? "light" : "dark");
  }, [isLight, mounted]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  // IntersectionObserver for scroll reveal animations
  const [activeSection, setActiveSection] = useState("home");
  const [titleIndex, setTitleIndex] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setTitleIndex((prev) => (prev + 1) % TITLES.length);
    }, 3000);
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px",
      }
    );

    // Observe all fade-up elements
    const fadeElements = document.querySelectorAll(".fade-up");
    fadeElements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  // Track active section for navigation
  useEffect(() => {
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      {
        rootMargin: "-20% 0px -70% 0px",
      }
    );

    const sections = document.querySelectorAll("section[id]");
    sections.forEach((section) => sectionObserver.observe(section));

    return () => sectionObserver.disconnect();
  }, []);

  // Close mobile menu on link click
  useEffect(() => {
    if (!mobileOpen) return;

    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest("nav") && target.tagName !== "BUTTON") {
        setMobileOpen(false);
      }
    };

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, [mobileOpen]);

  const navLinks = [
    { label: "Home", href: "#home" },
    { label: "About", href: "#about" },
    { label: "Experience", href: "#experience" },
    { label: "Projects", href: "#projects" },
    { label: "Contact", href: "#contact" },
  ];

  const skillGroups = [
    {
      title: "Languages",
      items: ["C++", "Python", "SQL"],
    },
    {
      title: "Backend",
      items: ["FastAPI", "REST APIs", "JWT Authentication", "Async Programming"],
    },
    {
      title: "Databases",
      items: ["PostgreSQL", "Redis", "Query Optimization", "Indexing"],
    },
    {
      title: "DevOps",
      items: ["Docker", "Render", "Git", "GitHub", "CI/CD Basics"],
    },
    {
      title: "CS Fundamentals",
      items: ["DSA", "OS", "DBMS", "CN", "OOP"],
    },
  ];

  return (
    <div className="app-shell">
      <div className="page-grid" aria-hidden="true" />
      <div className="page-noise" aria-hidden="true" />

      <header className="glass-nav fade-up">
        <div className="glass-nav__inner">
          <a href="#home" className="brand-mark" aria-label="Rajneesh Sharma home">
            <span className="brand-mark__icon">RS</span>
            <span className="brand-mark__text">
              <span className="brand-mark__name">Rajneesh Sharma</span>
              <span className="brand-mark__role">SDE, Ex-Adobe, C++ & DSA</span>
            </span>
          </a>

          <nav className="nav-links" aria-label="Primary">
            {navLinks.map((link) => {
              const isActive = activeSection === link.href.replace("#", "");
              return (
                <a 
                  key={link.label} 
                  href={link.href}
                  className={isActive ? "active" : ""}
                  onClick={(e) => {
                    e.preventDefault();
                    document.querySelector(link.href)?.scrollIntoView({ behavior: "smooth" });
                  }}
                >
                  {link.label}
                </a>
              );
            })}
          </nav>

          <div className="nav-tools">
            <button
              type="button"
              className="icon-button"
              onClick={() => setIsLight((current) => !current)}
              aria-label={mounted ? `Switch to ${isLight ? "dark" : "light"} mode` : "Switch theme"}
            >
              {mounted ? <ThemeIcon isLight={isLight} /> : <div style={{ width: 24, height: 24 }} />}
            </button>

            <button
              type="button"
              className="icon-button mobile-toggle"
              onClick={() => setMobileOpen((current) => !current)}
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
              aria-controls="mobile-menu"
            >
              {mobileOpen ? (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M6 6l12 12" />
                  <path d="M18 6L6 18" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M4 7h16" />
                  <path d="M4 12h16" />
                  <path d="M4 17h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {mobileOpen ? (
          <div id="mobile-menu" className="mobile-menu container">
            <div className="mobile-menu__links">
              {navLinks.map((link) => {
                const isActive = activeSection === link.href.replace("#", "");
                return (
                  <a 
                    key={link.label} 
                    href={link.href} 
                    className={isActive ? "active" : ""}
                    onClick={(e) => {
                      e.preventDefault();
                      setMobileOpen(false);
                      document.querySelector(link.href)?.scrollIntoView({ behavior: "smooth" });
                    }}
                  >
                    {link.label}
                  </a>
                );
              })}
              <button
                type="button"
                className="icon-button"
                onClick={() => setIsLight((current) => !current)}
                aria-label={mounted ? `Switch to ${isLight ? "dark" : "light"} mode` : "Switch theme"}
              >
                {mounted ? <ThemeIcon isLight={isLight} /> : <div style={{ width: 24, height: 24 }} />}
              </button>
            </div>
          </div>
        ) : null}
      </header>

      <main>
        <section id="home" className="hero">
          <div className="hero__backdrop" aria-hidden="true">
            <span className="hero__orb hero__orb--one" />
            <span className="hero__orb hero__orb--two" />
            <span className="hero__orb hero__orb--three" />
            <span className="hero__grid" />
          </div>

          <div className="hero__inner">
            <div className="hero__copy">
              <h1 className="hero__title fade-up delay-2">
                <span className="hero__title-line">Rajneesh</span>
                <span className="hero__title-line hero__title-accent">Sharma</span>
              </h1>

              <div className="hero__typing fade-up delay-3" style={{ minHeight: "1.5rem", position: "relative", overflow: "hidden" }}>
                <AnimatePresence mode="wait">
                  <motion.span
                    key={titleIndex}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="hero__typing-text"
                    style={{ position: "absolute", left: 0, top: 0, whiteSpace: "nowrap" }}
                  >
                    {TITLES[titleIndex]}
                  </motion.span>
                </AnimatePresence>
              </div>

              <p className="hero__copy-text fade-up delay-4">
                From strong DSA fundamentals to production-ready systems. My work sits at the intersection of clean user experience and solid engineering. I enjoy designing interfaces that feel premium while also solving backend and systems problems with precision, performance, and maintainability in mind.
              </p>

              <div className="hero__actions fade-up delay-4">
                {/* <!-- Resume Download Button --> */}
                <MagneticButton href="https://drive.google.com/file/d/1vdYJq5Ug3F-1vAOrJPUScD2AhaT4TTz2/view?usp=drivesdk" variant="primary" target="_blank">
                  Download Resume
                </MagneticButton>
                <MagneticButton href="#contact" variant="secondary">
                  Let&apos;s Talk
                </MagneticButton>
              </div>

              <div className="hero__socials fade-up delay-5" style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                <a href="https://github.com/RajneeshSharma12" target="_blank" rel="noopener noreferrer" className="social-link" aria-label="GitHub">
                  <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                  </svg>
                </a>
                <a href="https://www.linkedin.com/in/rajneeshsharma2512" target="_blank" rel="noopener noreferrer" className="social-link" aria-label="LinkedIn">
                  <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                </a>
                <a href="https://leetcode.com/u/RajneeshSharma12/" target="_blank" rel="noopener noreferrer" className="social-link" aria-label="LeetCode">
                  <img src="https://media.licdn.com/dms/image/v2/D4D22AQH1paanvzmKVA/feedshare-shrink_2048_1536/feedshare-shrink_2048_1536/0/1716222394365?e=2147483647&v=beta&t=pqZAb1efgTEpWzVns3OhrI88vEKvEEtp5lZbofiKcjM" alt="LeetCode" width="24" height="24" style={{ borderRadius: '50%', objectFit: 'cover' }} />
                </a>
              </div>
            </div>
          </div>
        </section>

        <section id="about" className="section-shell section-shell--compact">
          <div className="container">
            <div className="section-heading fade-up delay-1">
              <p className="hero__eyebrow">About Me</p>
              <h2 className="section-title">Building polished products with algorithmic depth.</h2>
              <p className="section-copy">
                I&apos;m Rajneesh Sharma, a GATE 2026 qualified candidate and former Adobe Product Intern
                focused on creating fast, scalable, and thoughtfully engineered digital experiences.
              </p>
            </div>

            <div className="bento-grid">
              <article className="surface-card about-card--bio fade-up delay-2">
                <span className="surface-card__label">Bio</span>
                <h3 className="surface-card__title">From strong DSA fundamentals to production-ready systems.</h3>
                <p className="surface-card__copy">
                  My work sits at the intersection of clean user experience and solid engineering. I
                  enjoy designing interfaces that feel premium while also solving backend and systems
                  problems with precision, performance, and maintainability in mind.
                </p>
                <div className="about-card__intro">
                  <span className="about-chip">Ex-Adobe Product Intern</span>
                  <span className="about-chip">GATE 2026 Qualified Candidate</span>
                  <span className="about-chip">Problem Solver</span>
                </div>
              </article>

              <article className="surface-card about-card--focus fade-up delay-3">
                <span className="surface-card__label">Focus</span>
                <h3 className="surface-card__title">High-performance systems and algorithmic thinking.</h3>
                <div className="focus-list">
                  <div className="focus-list__item">
                    <span className="focus-list__dot" aria-hidden="true" />
                    <div className="focus-list__text">
                      <strong>Performance-first engineering</strong>
                      <span>Optimizing logic, memory usage, and runtime for reliable execution.</span>
                    </div>
                  </div>
                  <div className="focus-list__item">
                    <span className="focus-list__dot" aria-hidden="true" />
                    <div className="focus-list__text">
                      <strong>Data structures & algorithms</strong>
                      <span>Strong problem-solving foundation built around efficient computation.</span>
                    </div>
                  </div>
                  <div className="focus-list__item">
                    <span className="focus-list__dot" aria-hidden="true" />
                    <div className="focus-list__text">
                      <strong>Scalable product mindset</strong>
                      <span>Balancing user impact, code quality, and long-term maintainability.</span>
                    </div>
                  </div>
                </div>
              </article>

              <article className="surface-card about-card--stats fade-up delay-4">
                <span className="surface-card__label">Quick Stats</span>
                <div className="stats-grid">
                  <div className="stat-tile">
                    <div className="stat-tile__value">400+</div>
                    <div className="stat-tile__label">Questions solved (across platforms)</div>
                  </div>
                  <div className="stat-tile">
                    <div className="stat-tile__value">Adobe</div>
                    <div className="stat-tile__label">Product Intern</div>
                  </div>
                  <div className="stat-tile">
                    <div className="stat-tile__value">10K+ req/sec</div>
                    <div className="stat-tile__label">High-performance system</div>
                  </div>
                  <div className="stat-tile">
                    <div className="stat-tile__value">1.5K RPS</div>
                    <div className="stat-tile__label">Distributed backend</div>
                  </div>
                </div>
              </article>
            </div>
          </div>
        </section>

        <section id="skills" className="section-shell">
          <div className="container">
            <div className="section-heading fade-up delay-1">
              <p className="hero__eyebrow">Skills</p>
              <h2 className="section-title">The stack behind my engineering workflow.</h2>
              <p className="section-copy">
                A curated toolkit spanning languages, frameworks, and developer tools that helps me
                build performant applications and polished product experiences.
              </p>
            </div>

            <div className="skills-grid">
              {skillGroups.map((group, index) => (
                <article key={group.title} className={`surface-card fade-up delay-${Math.min(index + 2, 4)}`}>
                  <div className="skills-card__header">
                    <div>
                      <span className="surface-card__label">Category</span>
                      <h3 className="surface-card__title">{group.title}</h3>
                    </div>
                    <span className="skills-card__count">{group.items.length}</span>
                  </div>

                  <div className="skills-pill-list">
                    {group.items.map((item) => (
                      <span key={item} className="skill-pill">
                        {item}
                      </span>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="experience" className="section-shell">
          <div className="container">
            <div className="section-heading fade-up delay-1">
              <p className="hero__eyebrow">Experience</p>
              <h2 className="section-title">A journey through impactful engineering roles.</h2>
              <p className="section-copy">
                From building production features at Adobe to crafting high-performance systems,
                each role has sharpened my engineering perspective.
              </p>
            </div>

            <Timeline>
              <TimelineItem
                company="Adobe Inc."
                role="Product Intern"
                date="June 2025 – Aug 2025"
                type="Noida, India"
                logo={<svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24"><path d="M14.43 22.5h8.35L14.7 2.14h-5.4L1.28 22.5h8.35l2.44-6.05h5.92l-3.56-8.82z"/></svg>}
                description="Collaborated directly with cross-functional engineering and QA teams using Agile Scrum methodology to conceptualize and prioritize backend feature enhancements for Adobe Express. Engineered and optimized complex SQL-based dashboards to track feature adoption, user interaction patterns, and engagement metrics post-deployment. Partnered with technical teams to translate user research into actionable architectural improvements, addressing system usability gaps."
                highlights={["Python", "C++", "JavaScript", "React", "DBMS", "Agile", "UI/UX Research", "Product Strategy"]}
              />

              <TimelineItem
                company="Samsung Electronics"
                role="Technical Program Lead"
                date="Aug 2024 – Sept 2024"
                type="Lucknow, India"
                logo={<img src="https://www.shutterstock.com/image-vector/samsung-company-logo-south-korean-260nw-2394493913.jpg" alt="Samsung" width="24" height="24" style={{ borderRadius: '50%', objectFit: 'cover' }} />}
                description="Architected a multi-domain curriculum across AI/ML, IoT, Big Data, and full-stack programming with dependency mapping and assessment pipelines — achieving 100% completion and 95% satisfaction. Engineered a learner data management portal with real-time progress tracking, automated certifications, and performance analytics to optimize curriculum delivery at scale. Spearheaded a 3-day end-to-end Hackathon spanning full-stack web development, AI, and Big Data — guiding teams from ideation to deployment-ready products with a final presentation round evaluating technical execution and solution design."
                highlights={["Program Management", "Agile", "Cross-functional Leadership", "Curriculum Rollout"]}
              />
            </Timeline>
          </div>
        </section>

        <section id="projects" className="section-shell">
          <div className="container">
            <div className="section-heading fade-up delay-1">
              <p className="hero__eyebrow">Projects</p>
              <h2 className="section-title">Crafted with precision. Built for impact.</h2>
              <p className="section-copy">
                A collection of projects showcasing my expertise in high-performance systems,
                distributed architectures, and polished user experiences.
              </p>
            </div>

            <div className="projects-grid">
              <ProjectCard
                title="AtomicKV — High-Performance In-Memory Key-Value Store"
                description="Built a high-performance in-memory key-value store in C++ using Linux epoll event loop and non-blocking POSIX sockets, achieving ~10,000 req/sec throughput across 200 concurrent clients with 32ms average latency. Implemented O(1) LRU eviction using HashMap + Doubly Linked List, TTL-based key expiry, and AOF persistence for crash recovery."
                techStack={["C++", "Linux epoll", "POSIX Sockets", "Docker", "AWS EC2"]}
                githubUrl="https://github.com/Rajneeshsharma125/atomickv"
                featured
              />

              <ProjectCard
                title="SnapLink — Distributed URL Shortener"
                description="Built a distributed URL shortener sustaining 1,497 RPS with P99 latency under 228ms — PostgreSQL sharding across 3 nodes via consistent hashing, Redis caching with 100% hit rate, Kafka event streaming for async analytics. Monitored via Prometheus and Grafana with 10+ custom dashboards tracking RPS, latency percentiles, and cache hit rates."
                techStack={["Python", "FastAPI", "PostgreSQL", "Redis", "Kafka", "Docker"]}
                githubUrl="https://github.com/Rajneeshsharma125/snaplink"
                liveUrl="https://snaplink-4q00.onrender.com/"
              />
            </div>
          </div>
        </section>

        {/* ── CONTACT ── */}
        <ContactSection />

        {/* ── FOOTER ── */}
        <Footer />

        {/* ── SCROLL TO TOP ── */}
        <ScrollToTop />
      </main>
    </div>
  );
}

function Timeline({ children }: { children: ReactNode }) {
  const timelineRef = useRef<HTMLDivElement | null>(null);
  const progressRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!timelineRef.current || !progressRef.current) return;
      
      const timeline = timelineRef.current;
      const rect = timeline.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      
      // Calculate how far through the timeline we've scrolled
      const timelineTop = rect.top;
      const timelineHeight = rect.height;
      
      // Progress starts when timeline enters viewport and ends when it leaves
      const scrollProgress = Math.max(0, Math.min(1, 
        (viewportHeight - timelineTop) / (viewportHeight + timelineHeight)
      ));
      
      progressRef.current.style.height = `${scrollProgress * 100}%`;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Initial call
    
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div ref={timelineRef} className="timeline">
      <div ref={progressRef} className="timeline__line-progress" />
      {children}
    </div>
  );
}

function TimelineItem({
  company,
  role,
  date,
  type,
  logo,
  description,
  highlights,
}: {
  company: string;
  role: string;
  date: string;
  type: string;
  logo: ReactNode;
  description: string;
  highlights: string[];
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2, rootMargin: "-50px" }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={`timeline__item ${isVisible ? "is-visible" : ""}`}>
      <div className="timeline__dot" />
      <div className="timeline__card">
        <div className="timeline__header">
          <div className="timeline__company-logo">{logo}</div>
          <div className="timeline__info">
            <h3 className="timeline__role">{role}</h3>
            <p className="timeline__company">{company}</p>
            <div className="timeline__meta">
              <span className="timeline__date">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="14" height="14">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
                {date}
              </span>
              <span className="timeline__type">{type}</span>
            </div>
          </div>
        </div>
        <p className="timeline__description">{description}</p>
        <div className="timeline__highlights">
          {highlights.map((highlight) => (
            <span key={highlight} className="timeline__highlight">
              {highlight}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function ProjectCard({
  title,
  description,
  techStack,
  githubUrl,
  liveUrl,
  featured = false,
  status,
}: {
  title: string;
  description: string;
  techStack: string[];
  githubUrl: string;
  liveUrl?: string;
  featured?: boolean;
  status?: string;
}) {
  const cardRef = useRef<HTMLElement | null>(null);
  const [magnetOffset, setMagnetOffset] = useState({ x: 0, y: 0 });
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const x = e.clientX - centerX;
    const y = e.clientY - centerY;
    setMagnetOffset({ x: x * 0.05, y: y * 0.05 });
    setMousePos({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
  };

  const handleMouseLeave = () => {
    setMagnetOffset({ x: 0, y: 0 });
  };

  return (
    <article
      ref={cardRef}
      className={`project-card fade-up ${featured ? "project-card--featured" : ""}`}
      style={
        {
          "--magnet-x": `${magnetOffset.x}px`,
          "--magnet-y": `${magnetOffset.y}px`,
          "--mouse-x": `${mousePos.x}%`,
          "--mouse-y": `${mousePos.y}%`,
        } as CSSProperties
      }
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div className="project-card__header">
        <div className="project-card__icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
            <line x1="12" y1="11" x2="12" y2="17" />
            <line x1="9" y1="14" x2="15" y2="14" />
          </svg>
        </div>
        {status && <span className="project-card__badge">{status}</span>}
      </div>

      <div className="project-card__content">
        <h3 className="project-card__title">{title}</h3>
        <p className="project-card__description">{description}</p>
      </div>

      <div className="project-card__tech">
        {techStack.map((tech) => (
          <span key={tech} className="project-tech-tag">
            {tech}
          </span>
        ))}
      </div>

      <div className="project-card__actions">
        <a href={githubUrl} target="_blank" rel="noopener noreferrer" className="project-link">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
          </svg>
          GitHub
        </a>
        {liveUrl && (
          <a href={liveUrl} target="_blank" rel="noopener noreferrer" className="project-link project-link--primary">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
              <polyline points="15 3 21 3 21 9" />
              <line x1="10" y1="14" x2="21" y2="3" />
            </svg>
            Live Demo
          </a>
        )}
      </div>
    </article>
  );
}

function ContactSection() {
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [statusMessage, setStatusMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const btn = document.getElementById("submit-btn") as HTMLButtonElement;

    if (!btn) return;

    btn.disabled = true;
    btn.querySelector("span")!.textContent = "Sending...";

    try {
      const formData = new FormData(form);
      
      const response = await fetch("https://formsubmit.co/ajax/sharmarajneesh45681@gmail.com", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          name: formData.get("name"),
          email: formData.get("email"),
          subject: formData.get("subject"),
          message: formData.get("message"),
          _subject: `New Portfolio Message: ${formData.get("subject")}`,
          _template: "box",
          _captcha: "false"
        }),
      });

      const data = await response.json();

      if (data.success === "true" || response.ok) {
        setStatus("success");
        setStatusMessage("Message sent successfully! I'll get back to you within 24 hours.");
        form.reset();
      } else {
        throw new Error(data.message || "Something went wrong");
      }
    } catch (error) {
      setStatus("error");
      setStatusMessage("Something went wrong. Please try again or email me directly.");
    } finally {
      btn.disabled = false;
      btn.querySelector("span")!.textContent = "Send Message";
      
      // Clear status message after 5 seconds
      setTimeout(() => {
        setStatus("idle");
        setStatusMessage("");
      }, 5000);
    }
  };

  return (
    <section id="contact" className="contact-shell">
      <div className="container">
        <div className="section-heading fade-up">
          <p className="section-label">Get in Touch</p>
          <h2 className="section-title">Let&apos;s Work Together</h2>
          <p className="section-copy">
            Have a project in mind or want to discuss opportunities? I&apos;m always open to connecting with ambitious teams and builders.
          </p>
        </div>

        <div className="contact-grid" style={{ marginTop: "3rem" }}>
          {/* Left: Contact Info */}
          <div className="contact-info">
            <div className="contact-detail fade-up">
              <div className="contact-detail__icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
              </div>
              <div className="contact-detail__text">
                <span className="contact-detail__label">Email</span>
                <span className="contact-detail__value">rajneeshsharma2512@gmail.com</span>
              </div>
            </div>

            <div className="contact-detail fade-up delay-1">
              <div className="contact-detail__icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
              </div>
              <div className="contact-detail__text">
                <span className="contact-detail__label">Location</span>
                <span className="contact-detail__value">India (Open to Relocate)</span>
              </div>
            </div>

            <div className="contact-detail fade-up delay-2">
              <div className="contact-detail__icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
              </div>
              <div className="contact-detail__text">
                <span className="contact-detail__label">Response Time</span>
                <span className="contact-detail__value">Within 24 Hours</span>
              </div>
            </div>
          </div>

          {/* Right: Contact Form */}
          <div className="contact-form-wrapper fade-up delay-1">
            <div className="contact-form-card">
              <div className="contact-form-header">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="contact-form-icon">
                  <line x1="22" y1="2" x2="11" y2="13" />
                  <polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
                <h3>Send Me a Message</h3>
              </div>
              <p className="contact-form-subtitle">Fill out the form below and I&apos;ll get back to you as soon as possible.</p>
              
              <form id="contact-form" noValidate onSubmit={handleSubmit}>
                <div className="form-row">
                  <div className="form-group-standard">
                    <label htmlFor="name">Name</label>
                    <input type="text" id="name" name="name" placeholder="Your name" required />
                  </div>
                  <div className="form-group-standard">
                    <label htmlFor="email">Email</label>
                    <input type="email" id="email" name="email" placeholder="your@email.com" required />
                  </div>
                </div>
                <div className="form-group-standard">
                  <label htmlFor="subject">Subject</label>
                  <input type="text" id="subject" name="subject" placeholder="What's this about?" required />
                </div>
                <div className="form-group-standard">
                  <label htmlFor="message">Message</label>
                  <textarea id="message" name="message" placeholder="Tell me about your project, opportunity, or just say hello!" required rows={4} />
                </div>
                <button type="submit" className="submit-btn-full" id="submit-btn">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="22" y1="2" x2="11" y2="13" />
                    <polygon points="22 2 15 22 11 13 2 9 22 2" />
                  </svg>
                  <span>Send Message</span>
                </button>
                <div className={`form-status form-status--${status} ${status !== "idle" ? "visible" : ""}`} id="form-status" role="alert" aria-live="polite">
                  {status === "success" && (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                  {status === "error" && (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10" />
                      <line x1="15" y1="9" x2="9" y2="15" />
                      <line x1="9" y1="9" x2="15" y2="15" />
                    </svg>
                  )}
                  {statusMessage}
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  const [time, setTime] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {/* Footer CTA */}
      <div className="footer-cta">
        <a 
          href="#contact" 
          className="footer-cta__text" 
          style={{ display: "block" }}
          onClick={(e) => {
            e.preventDefault();
            document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" });
          }}
        >
          Let&apos;s work together
        </a>
        <p className="footer-cta__sub">
          or reach out directly at <a href="mailto:rajneeshsharma2512@gmail.com">rajneeshsharma2512@gmail.com</a>
        </p>
      </div>

      {/* Site Footer */}
      <footer className="site-footer">
        <div className="container">
          <div className="footer-grid">
            <div className="footer-copy">
              © {new Date().getFullYear()} <strong>Rajneesh Sharma</strong>. Built with passion &amp; precision.
            </div>
            <div className="footer-time">
              <span className="footer-time__label">Local Time</span>
              <span className="footer-time__value">{time}</span>
            </div>
            <div className="footer-social">
              <a href="https://github.com/RajneeshSharma12" target="_blank" rel="noopener noreferrer" className="social-link" aria-label="GitHub">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
              </a>
              <a href="https://www.linkedin.com/in/rajneeshsharma2512" target="_blank" rel="noopener noreferrer" className="social-link" aria-label="LinkedIn">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </a>
              <a href="https://leetcode.com/u/RajneeshSharma12/" target="_blank" rel="noopener noreferrer" className="social-link" aria-label="LeetCode">
                <img src="https://media.licdn.com/dms/image/v2/D4D22AQH1paanvzmKVA/feedshare-shrink_2048_1536/feedshare-shrink_2048_1536/0/1716222394365?e=2147483647&v=beta&t=pqZAb1efgTEpWzVns3OhrI88vEKvEEtp5lZbofiKcjM" alt="LeetCode" width="24" height="24" style={{ borderRadius: '50%', objectFit: 'cover' }} />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}

function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      setVisible(window.scrollY > 500);
    };
    window.addEventListener("scroll", toggleVisibility, { passive: true });
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <button className={`scroll-top ${visible ? "visible" : ""}`} id="scroll-top" onClick={scrollToTop} aria-label="Scroll to top">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="18 15 12 9 6 15" />
      </svg>
    </button>
  );
}
