import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ContactIcon from "../components/common/ContactIcon";
import SocialLinks from "../components/common/SocialLinks";
import { getContactFormData, getEmailHref } from "../utils/contactActions";
import { getPortfolio, sendPortfolioMessage } from "../utils/portfolioApi";
import { getImageSrc } from "../utils/imageUrl";
import { openResume } from "../utils/resumeDownload";
import { getExternalHref } from "../utils/socialLinks";

export default function Portfolio() {
  const { slug } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);
  const [resumeMessage, setResumeMessage] = useState("");
  const [contactMessage, setContactMessage] = useState("");
  const [contactSending, setContactSending] = useState(false);

  useEffect(() => {
    setLoading(true);
    setErrorMsg(null);

    getPortfolio(slug)
      .then((portfolio) => {
        setData(portfolio);
        setLoading(false);
      })
      .catch((error) => {
        setData(null);
        setErrorMsg(
          error.message ||
            "Portfolio not found. Make sure the custom URL slug is correct and has been saved.",
        );
        setLoading(false);
      });
  }, [slug]);

  const handleDownloadResume = () => {
    if (!openResume(data)) {
      setResumeMessage("Resume link is not available.");
      window.setTimeout(() => setResumeMessage(""), 3000);
      return;
    }

    setResumeMessage("Resume opened in a new tab.");
    window.setTimeout(() => setResumeMessage(""), 3000);
  };

  const handleContactSubmit = async (event) => {
    event.preventDefault();

    if (contactSending) {
      return;
    }

    const form = event.currentTarget;
    const messageData = getContactFormData(form);

    if (!data.contactEmail) {
      setContactMessage("Contact email is not available.");
      window.setTimeout(() => setContactMessage(""), 3000);
      return;
    }

    try {
      setContactSending(true);
      await sendPortfolioMessage(slug, messageData);
      form.reset();
      setContactMessage("Message sent successfully.");
    } catch (error) {
      setContactMessage(error.message || "Unable to send message. Please try again.");
    } finally {
      setContactSending(false);
    }

    window.setTimeout(() => setContactMessage(""), 3000);
  };

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          height: "100vh",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#0d1321",
          color: "#94a3b8",
          fontFamily: "Inter, sans-serif",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              width: 40,
              height: 40,
              border: "3px solid rgba(255,255,255,0.1)",
              borderTopColor: "#a855f7",
              borderRadius: "50%",
              animation: "spin 1s linear infinite",
              margin: "0 auto 16px",
            }}
          ></div>
          <h2>Fetching Portfolio...</h2>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      </div>
    );
  }

  if (errorMsg || !data) {
    return (
      <div
        style={{
          display: "flex",
          height: "100vh",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#0d1321",
          color: "#cbd5e1",
          fontFamily: "Inter, sans-serif",
          padding: 20,
        }}
      >
        <div
          style={{
            textAlign: "center",
            maxWidth: 450,
            background: "rgba(255,255,255,0.02)",
            border: "1px solid rgba(255,255,255,0.08)",
            padding: 40,
            borderRadius: 16,
          }}
        >
          <span style={{ fontSize: "3rem" }}>!</span>
          <h2 style={{ marginTop: 16, marginBottom: 8, color: "white" }}>
            Portfolio Not Found
          </h2>
          <p
            style={{
              fontSize: "0.85rem",
              color: "#64748b",
              marginBottom: 24,
              lineHeight: 1.5,
            }}
          >
            {errorMsg ||
              "We couldn't retrieve this portfolio from our records or offline backup storage."}
          </p>
          <a
            href="/"
            style={{
              background: "linear-gradient(135deg, #a855f7, #6366f1)",
              color: "white",
              textDecoration: "none",
              padding: "10px 24px",
              borderRadius: 8,
              fontSize: "0.85rem",
              fontWeight: 600,
              display: "inline-block",
            }}
          >
            Create A Portfolio Now
          </a>
        </div>
      </div>
    );
  }

  // Common dynamic template navbar helper
  const renderTemplateNavbar = () => {
    return (
      <nav className="pt-navbar">
        <details className="pt-nav-menu">
          <summary
            className="pt-nav-menu-button"
            aria-label="Open portfolio navigation"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M4 6h16" />
              <path d="M4 12h16" />
              <path d="M4 18h16" />
            </svg>
          </summary>
          <ul className="pt-navbar-links">
            <li>
              <a href="#home">Home</a>
            </li>
            {data.about && (
              <li>
                <a href="#about">About</a>
              </li>
            )}
            {data.experience && data.experience.length > 0 && (
              <li>
                <a href="#experience">Experience</a>
              </li>
            )}
            {data.education && data.education.length > 0 && (
              <li>
                <a href="#education">Education</a>
              </li>
            )}
            {data.projects && data.projects.length > 0 && (
              <li>
                <a href="#projects">Projects</a>
              </li>
            )}
            <li>
              <a href="#contact">Contact</a>
            </li>
            <li>
              <button
                type="button"
                onClick={handleDownloadResume}
                className="pt-nav-download-btn"
              >
                Download Resume
              </button>
            </li>
          </ul>
        </details>
        <a href="#home" className="pt-navbar-brand">
          {data.name || "Portfolio"}
        </a>
        <ul className="pt-navbar-links">
          <li>
            <a href="#home">Home</a>
          </li>
          {data.about && (
            <li>
              <a href="#about">About</a>
            </li>
          )}
          {data.experience && data.experience.length > 0 && (
            <li>
              <a href="#experience">Experience</a>
            </li>
          )}
          {data.education && data.education.length > 0 && (
            <li>
              <a href="#education">Education</a>
            </li>
          )}
          {data.projects && data.projects.length > 0 && (
            <li>
              <a href="#projects">Projects</a>
            </li>
          )}
          <li>
            <a href="#contact">Contact</a>
          </li>
          <li>
            <button
              type="button"
              onClick={handleDownloadResume}
              className="pt-nav-download-btn"
            >
              Download Resume
            </button>
          </li>
        </ul>
      </nav>
    );
  };

  // Helper: Renders templates outside preview box taking 100% viewport width
  const renderTemplateLayout = () => {
    if (data.template === "minimal") {
      return (
        <div className="pt-container pt-minimal" style={{ minHeight: "100vh" }}>
          {renderTemplateNavbar()}

          <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 20px" }}>
            <div className="hero-section" id="home">
              {data.profileImage && (
                <div className="avatar-container">
                  <img
                    src={getImageSrc(data.profileImage)}
                    alt={data.name}
                    className="avatar-img"
                  />
                </div>
              )}
              <h1>{data.name || "Your Name"}</h1>
              <p className="hero-title">
                {data.title || "Your Professional Title"}
              </p>
              <p className="hero-subtitle">
                {data.homeSubtitle || "Bio Subtitle"}
              </p>

              <SocialLinks links={data.socialLinks} />
            </div>

            <hr className="section-divider" />

            {data.about && (
              <div style={{ marginBottom: 60 }} id="about">
                <h2>About</h2>
                <p
                  style={{
                    fontSize: "1rem",
                    lineHeight: 1.7,
                    color: "#2d3748",
                    maxWidth: 700,
                  }}
                >
                  {data.about}
                </p>
              </div>
            )}

            {data.skills && data.skills.length > 0 && (
              <div style={{ marginBottom: 60 }}>
                <h2>Core Skills</h2>
                <div className="skills-badges">
                  {data.skills.map((skill, i) => (
                    <span key={i} className="skill-pill">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {data.experience && data.experience.length > 0 && (
              <div style={{ marginBottom: 60 }} id="experience">
                <h2>Experience</h2>
                <div className="minimal-list">
                  {data.experience.map((exp, idx) => (
                    <div key={idx} className="minimal-item">
                      <div className="minimal-left">
                        <span className="minimal-date">{exp.duration}</span>
                      </div>
                      <div className="minimal-right">
                        <h4 className="card-title">{exp.role}</h4>
                        <p className="card-subtitle">{exp.company}</p>
                        <p className="card-desc">{exp.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {data.education && data.education.length > 0 && (
              <div style={{ marginBottom: 60 }} id="education">
                <h2>Education</h2>
                <div className="minimal-list">
                  {data.education.map((edu, idx) => (
                    <div key={idx} className="minimal-item">
                      <div className="minimal-left">
                        <span className="minimal-date">{edu.year}</span>
                      </div>
                      <div className="minimal-right">
                        <h4 className="card-title">{edu.degree}</h4>
                        <p className="card-subtitle">{edu.institution}</p>
                        <p className="card-desc">{edu.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {data.projects && data.projects.length > 0 && (
              <div style={{ marginBottom: 60 }} id="projects">
                <h2>Selected Projects</h2>
                <div className="minimal-list">
                  {data.projects.map((proj, idx) => (
                    <div
                      key={idx}
                      className="minimal-item"
                      style={{ alignItems: "flex-start" }}
                    >
                      <div className="minimal-left" style={{ width: 140 }}>
                        {proj.image && (
                          <img
                            src={getImageSrc(proj.image)}
                            alt={proj.title}
                            style={{
                              width: "100%",
                              borderRadius: 0,
                              border: "1px solid #1e1e1e",
                            }}
                          />
                        )}
                      </div>
                      <div className="minimal-right">
                        <h4 className="card-title">{proj.title}</h4>
                        <p className="card-desc">{proj.description}</p>
                        {proj.tags && proj.tags.length > 0 && (
                          <p
                            style={{
                              fontSize: "0.8rem",
                              color: "#666",
                              marginTop: 6,
                            }}
                          >
                            Technologies: {proj.tags.join(", ")}
                          </p>
                        )}
                        {proj.link && (
                          <a
                            href={getExternalHref(proj.link)}
                            target="_blank"
                            rel="noreferrer"
                            className="btn-project"
                          >
                            View Project
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <hr className="section-divider" />

            <div style={{ paddingBottom: 60 }} id="contact">
              <h2>Contact</h2>
              <div className="contact-grid">
                <div>
                  <div className="contact-info-item">
                    <div className="contact-info-text">
                      <h4>Direct Email</h4>
                      {data.contactEmail ? (
                        <a href={getEmailHref(data.contactEmail)}>{data.contactEmail}</a>
                      ) : (
                        <p>your.email@example.com</p>
                      )}
                    </div>
                  </div>
                  {data.contactPhone && (
                    <div className="contact-info-item">
                      <div className="contact-info-text">
                        <h4>Phone Number</h4>
                        <p>{data.contactPhone}</p>
                      </div>
                    </div>
                  )}
                  {data.contactAddress && (
                    <div className="contact-info-item">
                      <div className="contact-info-text">
                        <h4>Location Address</h4>
                        <p>{data.contactAddress}</p>
                      </div>
                    </div>
                  )}
                </div>
                <div className="contact-form">
                  <h4
                    style={{
                      fontSize: "0.9rem",
                      textTransform: "uppercase",
                      marginBottom: 16,
                      fontWeight: 700,
                    }}
                  >
                    Send Private Message
                  </h4>
                  <form className="template-contact-form-inner" onSubmit={handleContactSubmit}>
                    <input name="name" type="text" placeholder="Your Name" required />
                    <input name="email" type="email" placeholder="Your Email" required />
                    <textarea name="message" placeholder="Write message details..." required></textarea>
                    <button type="submit" className="template-form-btn" disabled={contactSending}>
                      {contactSending ? "Sending..." : "Send Message"}
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (data.template === "creative") {
      return (
        <div
          className="pt-container pt-creative"
          style={{ minHeight: "100vh" }}
        >
          {renderTemplateNavbar()}

          <div style={{ maxWidth: 1000, margin: "0 auto" }}>
            <div className="hero-section" id="home">
              {data.profileImage && (
                <div className="avatar-container">
                  <img
                    src={getImageSrc(data.profileImage)}
                    alt={data.name}
                    className="avatar-img"
                  />
                </div>
              )}
              <h1>{data.name || "Your Name"}</h1>
              <p className="hero-title">
                {data.title || "Your Professional Title"}
              </p>
              <p className="hero-subtitle">
                {data.homeSubtitle || "Bio Subtitle"}
              </p>

              <SocialLinks links={data.socialLinks} />
            </div>

            <div className="section-divider" />

            {data.about && (
              <div style={{ marginBottom: 50 }} id="about">
                <h2>About Me</h2>
                <div
                  className="card"
                  style={{
                    fontSize: "0.95rem",
                    color: "#4b5563",
                    lineHeight: 1.7,
                  }}
                >
                  {data.about}
                </div>
              </div>
            )}

            {data.skills && data.skills.length > 0 && (
              <div style={{ marginBottom: 50 }}>
                <h2>My Superpowers</h2>
                <div className="skills-badges">
                  {data.skills.map((skill, i) => (
                    <span key={i} className="skill-pill">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {data.experience && data.experience.length > 0 && (
              <div style={{ marginBottom: 50 }} id="experience">
                <h2>Work Journey</h2>
                <div className="card-grid">
                  {data.experience.map((exp, idx) => (
                    <div key={idx} className="card">
                      <span className="card-subtitle">{exp.duration}</span>
                      <h4 className="card-title">{exp.role}</h4>
                      <p
                        style={{
                          fontSize: "0.85rem",
                          color: "#fb923c",
                          fontWeight: 700,
                          marginBottom: 10,
                        }}
                      >
                        {exp.company}
                      </p>
                      <p className="card-desc">{exp.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {data.education && data.education.length > 0 && (
              <div style={{ marginBottom: 50 }} id="education">
                <h2>Education</h2>
                <div className="card-grid">
                  {data.education.map((edu, idx) => (
                    <div key={idx} className="card">
                      <span className="card-subtitle">{edu.year}</span>
                      <h4 className="card-title">{edu.degree}</h4>
                      <p
                        style={{
                          fontSize: "0.85rem",
                          color: "#f43f5e",
                          fontWeight: 700,
                          marginBottom: 10,
                        }}
                      >
                        {edu.institution}
                      </p>
                      <p className="card-desc">{edu.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {data.projects && data.projects.length > 0 && (
              <div style={{ marginBottom: 50 }} id="projects">
                <h2>Cool Stuff I've Built</h2>
                <div className="card-grid">
                  {data.projects.map((proj, idx) => (
                    <div
                      key={idx}
                      className="card"
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 12,
                      }}
                    >
                      {proj.image && (
                        <img
                          src={getImageSrc(proj.image)}
                          alt={proj.title}
                          style={{
                            width: "100%",
                            height: 180,
                            objectFit: "cover",
                            borderRadius: 16,
                          }}
                        />
                      )}
                      <h4 className="card-title" style={{ marginTop: 8 }}>
                        {proj.title}
                      </h4>
                      <p className="card-desc" style={{ flex: 1 }}>
                        {proj.description}
                      </p>
                      {proj.tags && proj.tags.length > 0 && (
                        <div
                          style={{ display: "flex", gap: 6, flexWrap: "wrap" }}
                        >
                          {proj.tags.map((t, i) => (
                            <span
                              key={i}
                              style={{
                                fontSize: "0.7rem",
                                background: "#f3f4f6",
                                padding: "2px 8px",
                                borderRadius: 8,
                              }}
                            >
                              #{t}
                            </span>
                          ))}
                        </div>
                      )}
                      {proj.link && (
                        <a
                          href={getExternalHref(proj.link)}
                          target="_blank"
                          rel="noreferrer"
                          className="btn-project"
                          style={{ alignSelf: "flex-start" }}
                        >
                          Explore
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="section-divider" />

            <div style={{ paddingBottom: 60 }} id="contact">
              <h2>Say Hello!</h2>
              <div className="contact-grid">
                <div>
                  <div className="contact-info-item">
                    <ContactIcon type="email" />
                    <div className="contact-info-text">
                      <h4>Email Address</h4>
                      {data.contactEmail ? (
                        <a href={getEmailHref(data.contactEmail)}>{data.contactEmail}</a>
                      ) : (
                        <p>your.email@example.com</p>
                      )}
                    </div>
                  </div>
                  {data.contactPhone && (
                    <div className="contact-info-item">
                      <ContactIcon type="phone" />
                      <div className="contact-info-text">
                        <h4>Phone Number</h4>
                        <p>{data.contactPhone}</p>
                      </div>
                    </div>
                  )}
                  {data.contactAddress && (
                    <div className="contact-info-item">
                      <ContactIcon type="location" />
                      <div className="contact-info-text">
                        <h4>Home Base</h4>
                        <p>{data.contactAddress}</p>
                      </div>
                    </div>
                  )}
                </div>
                <div className="contact-form">
                  <form className="template-contact-form-inner" onSubmit={handleContactSubmit}>
                    <input name="name" type="text" placeholder="Your Name" required />
                    <input name="email" type="email" placeholder="Your Email" required />
                    <textarea name="message" placeholder="Tell me anything..." required></textarea>
                    <button type="submit" className="template-form-btn" disabled={contactSending}>
                      {contactSending ? "Sending..." : "Send Message"}
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // Default template layout: "modern"
    return (
      <div className="pt-container pt-modern" style={{ minHeight: "100vh" }}>
        {renderTemplateNavbar()}

        <div style={{ maxWidth: 1000, margin: "0 auto", padding: "0 20px" }}>
          <div className="hero-section" id="home">
            {data.profileImage && (
              <div className="avatar-container">
                <img
                  src={getImageSrc(data.profileImage)}
                  alt={data.name}
                  className="avatar-img"
                />
              </div>
            )}
            <h1>{data.name || "Your Name"}</h1>
            <p className="hero-title">
              {data.title || "Your Professional Title"}
            </p>
            <p className="hero-subtitle">
              {data.homeSubtitle || "Bio Subtitle"}
            </p>

            <SocialLinks links={data.socialLinks} />
          </div>

          <hr className="section-divider" />

          {data.about && (
            <div style={{ marginBottom: 50 }} id="about">
              <h2>About Me</h2>
              <div
                className="card"
                style={{
                  fontSize: "0.95rem",
                  color: "#94a3b8",
                  lineHeight: 1.7,
                }}
              >
                {data.about}
              </div>
            </div>
          )}

          {data.skills && data.skills.length > 0 && (
            <div style={{ marginBottom: 50 }}>
              <h2>Skills & Technologies</h2>
              <div className="skills-badges">
                {data.skills.map((skill, i) => (
                  <span key={i} className="skill-pill">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {data.experience && data.experience.length > 0 && (
            <div style={{ marginBottom: 50 }} id="experience">
              <h2>Experience</h2>
              <div className="card-grid">
                {data.experience.map((exp, idx) => (
                  <div key={idx} className="card">
                    <span className="card-subtitle">{exp.duration}</span>
                    <h4 className="card-title">{exp.role}</h4>
                    <p
                      style={{
                        fontSize: "0.85rem",
                        color: "#6366f1",
                        fontWeight: 600,
                        marginBottom: 10,
                      }}
                    >
                      {exp.company}
                    </p>
                    <p className="card-desc">{exp.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {data.education && data.education.length > 0 && (
            <div style={{ marginBottom: 50 }} id="education">
              <h2>Education</h2>
              <div className="card-grid">
                {data.education.map((edu, idx) => (
                  <div key={idx} className="card">
                    <span className="card-subtitle">{edu.year}</span>
                    <h4 className="card-title">{edu.degree}</h4>
                    <p
                      style={{
                        fontSize: "0.85rem",
                        color: "#8b5cf6",
                        fontWeight: 600,
                        marginBottom: 10,
                      }}
                    >
                      {edu.institution}
                    </p>
                    <p className="card-desc">{edu.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {data.projects && data.projects.length > 0 && (
            <div style={{ marginBottom: 50 }} id="projects">
              <h2>Featured Projects</h2>
              <div className="card-grid">
                {data.projects.map((proj, idx) => (
                  <div
                    key={idx}
                    className="card"
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 14,
                    }}
                  >
                    {proj.image && (
                      <img
                        src={getImageSrc(proj.image)}
                        alt={proj.title}
                        style={{
                          width: "100%",
                          height: 180,
                          objectFit: "cover",
                          borderRadius: 8,
                        }}
                      />
                    )}
                    <h4 className="card-title">{proj.title}</h4>
                    <p className="card-desc" style={{ flex: 1 }}>
                      {proj.description}
                    </p>
                    {proj.tags && proj.tags.length > 0 && (
                      <div
                        style={{ display: "flex", gap: 6, flexWrap: "wrap" }}
                      >
                        {proj.tags.map((t, i) => (
                          <span key={i} className="project-badge">
                            {t}
                          </span>
                        ))}
                      </div>
                    )}
                    {proj.link && (
                      <a
                        href={getExternalHref(proj.link)}
                        target="_blank"
                        rel="noreferrer"
                        className="btn-project"
                        style={{ alignSelf: "flex-start" }}
                      >
                        Launch
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          <hr className="section-divider" />

          <div style={{ paddingBottom: 60 }} id="contact">
            <h2>Get In Touch</h2>
            <div className="contact-grid">
              <div>
                <div className="contact-info-item">
                  <ContactIcon type="email" />
                  <div className="contact-info-text">
                    <h4>Email Address</h4>
                    {data.contactEmail ? (
                      <a href={getEmailHref(data.contactEmail)}>{data.contactEmail}</a>
                    ) : (
                      <p>your.email@example.com</p>
                    )}
                  </div>
                </div>
                {data.contactPhone && (
                  <div className="contact-info-item">
                    <ContactIcon type="phone" />
                    <div className="contact-info-text">
                      <h4>Phone Number</h4>
                      <p>{data.contactPhone}</p>
                    </div>
                  </div>
                )}
                {data.contactAddress && (
                  <div className="contact-info-item">
                    <ContactIcon type="location" />
                    <div className="contact-info-text">
                      <h4>Location</h4>
                      <p>{data.contactAddress}</p>
                    </div>
                  </div>
                )}
              </div>
              <div className="contact-form">
                <form className="template-contact-form-inner" onSubmit={handleContactSubmit}>
                  <input name="name" type="text" placeholder="Name" required />
                  <input name="email" type="email" placeholder="Email Address" required />
                  <textarea name="message" placeholder="Message details..." required></textarea>
                  <button type="submit" className="template-form-btn" disabled={contactSending}>
                    {contactSending ? "Sending..." : "Send Message"}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div style={{ minHeight: "100vh", position: "relative" }}>
      {renderTemplateLayout()}

      {resumeMessage && (
        <div className="toast-notification">
          <div className="toast-success-icon">i</div>
          <div>{resumeMessage}</div>
        </div>
      )}

      {contactMessage && (
        <div className="toast-notification">
          <div className="toast-success-icon">i</div>
          <div>{contactMessage}</div>
        </div>
      )}
    </div>
  );
}
