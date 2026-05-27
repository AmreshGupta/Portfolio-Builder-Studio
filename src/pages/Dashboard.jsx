import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ContactIcon from "../components/common/ContactIcon";
import ImageUploadField from "../components/common/ImageUploadField";
import SocialLinks from "../components/common/SocialLinks";
import DashboardHeader from "../components/dashboard/DashboardHeader";
import { DEMO_PROFILES } from "../data/demoProfiles";
import { clearAuthUser } from "../utils/authStorage";
import { getSocialLinkItems } from "../utils/socialLinks";

const DEFAULT_PROFILE = {
  ...DEMO_PROFILES.developer,
  slug: "aarav-sharma"
};

function makeSlug(name) {
  return name.toLowerCase().replace(/[^a-zA-Z0-9 ]/g, "").trim().replace(/\s+/g, "-");
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [form, setForm] = useState(DEFAULT_PROFILE);
  const [activeTab, setActiveTab] = useState("presets");
  const [previewDevice, setPreviewDevice] = useState("desktop");
  const [fullscreenMode, setFullscreenMode] = useState(false);
  const [toast, setToast] = useState(null);
  const [newSkill, setNewSkill] = useState("");
  const [experienceInput, setExperienceInput] = useState({ company: "", role: "", duration: "", description: "" });
  const [educationInput, setEducationInput] = useState({ institution: "", degree: "", year: "", description: "" });
  const [projectInput, setProjectInput] = useState({ title: "", description: "", tags: "", link: "", image: "" });
  const [socialInput, setSocialInput] = useState({ label: "", url: "" });

  useEffect(() => {
    if (form.name && !form.slug) {
      setForm((prev) => ({ ...prev, slug: makeSlug(prev.name) }));
    }
  }, [form.name, form.slug]);

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(null), 3500);
  };

  const updateForm = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleLoadPreset = (key) => {
    const preset = DEMO_PROFILES[key];
    setForm({ ...preset, slug: makeSlug(preset.name) });
    showToast(`Loaded ${preset.name} preset`);
  };

  const handleSubmit = async () => {
    try {
      await axios.post("http://localhost:5000/api/portfolio/create", form);
      localStorage.setItem(`portfolio_${form.slug}`, JSON.stringify(form));
      showToast("Portfolio published successfully");
    } catch (error) {
      console.warn("Backend server not responding. Saving locally.", error);
      localStorage.setItem(`portfolio_${form.slug}`, JSON.stringify(form));
      showToast("Saved locally");
    }
  };

  const handleImageUpload = (event, onLoad) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      showToast("Please upload a valid image file");
      event.target.value = "";
      return;
    }

    const reader = new FileReader();
    reader.onload = () => onLoad(reader.result);
    reader.readAsDataURL(file);
    event.target.value = "";
  };

  const handleAddSkill = (event) => {
    event.preventDefault();
    const skill = newSkill.trim();
    if (!skill || form.skills.includes(skill)) return;
    updateForm("skills", [...form.skills, skill]);
    setNewSkill("");
  };

  const handleRemoveSkill = (skill) => {
    updateForm("skills", form.skills.filter((item) => item !== skill));
  };

  const handleAddExperience = (event) => {
    event.preventDefault();
    if (!experienceInput.company.trim() || !experienceInput.role.trim()) {
      showToast("Please add company and role");
      return;
    }

    updateForm("experience", [...(form.experience || []), experienceInput]);
    setExperienceInput({ company: "", role: "", duration: "", description: "" });
  };

  const handleRemoveExperience = (indexToRemove) => {
    updateForm("experience", (form.experience || []).filter((_, index) => index !== indexToRemove));
  };

  const handleAddEducation = (event) => {
    event.preventDefault();
    if (!educationInput.institution.trim() || !educationInput.degree.trim()) {
      showToast("Please add institution and degree");
      return;
    }

    updateForm("education", [...(form.education || []), educationInput]);
    setEducationInput({ institution: "", degree: "", year: "", description: "" });
  };

  const handleRemoveEducation = (indexToRemove) => {
    updateForm("education", (form.education || []).filter((_, index) => index !== indexToRemove));
  };

  const handleAddProject = (event) => {
    event.preventDefault();
    if (!projectInput.title.trim()) {
      showToast("Please add project title");
      return;
    }

    updateForm("projects", [
      ...form.projects,
      {
        ...projectInput,
        title: projectInput.title.trim(),
        tags: projectInput.tags ? projectInput.tags.split(",").map((tag) => tag.trim()).filter(Boolean) : []
      }
    ]);
    setProjectInput({ title: "", description: "", tags: "", link: "", image: "" });
  };

  const handleRemoveProject = (indexToRemove) => {
    updateForm("projects", form.projects.filter((_, index) => index !== indexToRemove));
  };

  const handleAddSocialLink = (event) => {
    event.preventDefault();
    if (!socialInput.label.trim() || !socialInput.url.trim()) {
      showToast("Please add link name and URL");
      return;
    }

    updateForm("socialLinks", [
      ...getSocialLinkItems(form.socialLinks),
      { id: `${Date.now()}`, label: socialInput.label.trim(), url: socialInput.url.trim() }
    ]);
    setSocialInput({ label: "", url: "" });
  };

  const handleRemoveSocialLink = (indexToRemove) => {
    updateForm("socialLinks", getSocialLinkItems(form.socialLinks).filter((_, index) => index !== indexToRemove));
  };

  const handleSlugChange = (value) => {
    updateForm("slug", value.toLowerCase().replace(/[^a-zA-Z0-9-]/g, ""));
  };

  const handleLogout = () => {
    clearAuthUser();
    navigate("/auth", { replace: true });
  };

  const renderTemplateNavbar = (data) => (
    <nav className="pt-navbar">
      <details className="pt-nav-menu">
        <summary className="pt-nav-menu-button" aria-label="Open portfolio navigation">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M4 6h16" />
            <path d="M4 12h16" />
            <path d="M4 18h16" />
          </svg>
        </summary>
        <ul className="pt-navbar-links">
          <li><a href="#home">Home</a></li>
          <li><a href="#about">About</a></li>
          {data.experience?.length > 0 && <li><a href="#experience">Experience</a></li>}
          {data.education?.length > 0 && <li><a href="#education">Education</a></li>}
          <li><a href="#projects">Projects</a></li>
          <li><a href="#contact">Contact</a></li>
        </ul>
      </details>
      <a href="#home" className="pt-navbar-brand">{data.name || "Portfolio"}</a>
      <ul className="pt-navbar-links">
        <li><a href="#home">Home</a></li>
        <li><a href="#about">About</a></li>
        {data.experience?.length > 0 && <li><a href="#experience">Experience</a></li>}
        {data.education?.length > 0 && <li><a href="#education">Education</a></li>}
        <li><a href="#projects">Projects</a></li>
        <li><a href="#contact">Contact</a></li>
      </ul>
    </nav>
  );

  const renderContact = (data) => (
    <div id="contact" style={{ paddingBottom: 50 }}>
      <h2>Get In Touch</h2>
      <div className="contact-grid">
        <div>
          <div className="contact-info-item">
            <ContactIcon type="email" />
            <div className="contact-info-text">
              <h4>Email Address</h4>
              <p>{data.contactEmail || "your.email@example.com"}</p>
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
          <div className="template-contact-form-inner">
            <input type="text" placeholder="Name" />
            <input type="email" placeholder="Email Address" />
            <textarea placeholder="Message details..." />
            <button className="template-form-btn">Send Message</button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderLiveTemplate = () => {
    const templateClass = form.template === "minimal" ? "pt-minimal" : form.template === "creative" ? "pt-creative" : "pt-modern";

    return (
      <div className={`pt-container ${templateClass}`}>
        {renderTemplateNavbar(form)}
        <div style={{ maxWidth: 1000, margin: "0 auto", padding: "0 20px" }}>
          <div className="hero-section" id="home">
            {form.profileImage && (
              <div className="avatar-container">
                <img src={form.profileImage} alt={form.name} className="avatar-img" />
              </div>
            )}
            <h1>{form.name || "Your Name"}</h1>
            <p className="hero-title">{form.title || "Your Professional Title"}</p>
            <p className="hero-subtitle">{form.homeSubtitle || "Bio Subtitle"}</p>
            <SocialLinks links={form.socialLinks} />
          </div>

          <div className="section-divider" />

          <div id="about" style={{ marginBottom: 50 }}>
            <h2>About Me</h2>
            <div className="card" style={{ fontSize: "0.95rem", lineHeight: 1.7 }}>
              {form.about}
            </div>
          </div>

          {form.skills?.length > 0 && (
            <div style={{ marginBottom: 50 }}>
              <h2>Skills</h2>
              <div className="skills-badges">
                {form.skills.map((skill) => <span key={skill} className="skill-pill">{skill}</span>)}
              </div>
            </div>
          )}

          {form.experience?.length > 0 && (
            <div id="experience" style={{ marginBottom: 50 }}>
              <h2>Experience</h2>
              <div className="card-grid">
                {form.experience.map((item, index) => (
                  <div key={`${item.company}-${index}`} className="card">
                    <span className="card-subtitle">{item.duration}</span>
                    <h4 className="card-title">{item.role}</h4>
                    <p style={{ fontSize: "0.85rem", fontWeight: 700, marginBottom: 10 }}>{item.company}</p>
                    <p className="card-desc">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {form.education?.length > 0 && (
            <div id="education" style={{ marginBottom: 50 }}>
              <h2>Education</h2>
              <div className="card-grid">
                {form.education.map((item, index) => (
                  <div key={`${item.institution}-${index}`} className="card">
                    <span className="card-subtitle">{item.year}</span>
                    <h4 className="card-title">{item.degree}</h4>
                    <p style={{ fontSize: "0.85rem", fontWeight: 700, marginBottom: 10 }}>{item.institution}</p>
                    <p className="card-desc">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {form.projects?.length > 0 && (
            <div id="projects" style={{ marginBottom: 50 }}>
              <h2>Featured Projects</h2>
              <div className="card-grid">
                {form.projects.map((project, index) => (
                  <div key={`${project.title}-${index}`} className="card" style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                    {project.image && <img src={project.image} alt={project.title} style={{ width: "100%", height: 170, objectFit: "cover", borderRadius: 8 }} />}
                    <h4 className="card-title">{project.title}</h4>
                    <p className="card-desc">{project.description}</p>
                    {project.tags?.length > 0 && (
                      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                        {project.tags.map((tag) => <span key={tag} className="project-badge">{tag}</span>)}
                      </div>
                    )}
                    {project.link && <a href={project.link} target="_blank" rel="noreferrer" className="btn-project" style={{ alignSelf: "flex-start" }}>View Project</a>}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="section-divider" />
          {renderContact(form)}
        </div>
      </div>
    );
  };

  return (
    <div className="dashboard-container">
      <DashboardHeader
        fullscreenMode={fullscreenMode}
        slug={form.slug}
        onLogout={handleLogout}
        onPublish={handleSubmit}
        onSlugChange={handleSlugChange}
        onToggleFullscreen={() => setFullscreenMode(!fullscreenMode)}
      />

      <div className="main-workspace">
        {!fullscreenMode && (
          <aside className="customizer-sidebar">
            <nav className="tabs-nav">
              {[
                ["presets", "Presets"],
                ["home", "Hero"],
                ["about", "About"],
                ["experience", "Experience"],
                ["education", "Education"],
                ["projects", "Projects"],
                ["contact", "Contact"]
              ].map(([key, label]) => (
                <button key={key} onClick={() => setActiveTab(key)} className={`tab-btn ${activeTab === key ? "active" : ""}`}>{label}</button>
              ))}
            </nav>

            <div className="sidebar-content">
              {activeTab === "presets" && (
                <div>
                  <h3 className="section-title">Template Presets</h3>
                  <p className="section-desc">Select a visual style, then load a complete demo profile dataset.</p>
                  <div className="template-grid">
                    {[["modern", "Modern Tech Glow", "Dark slate with violet neon accents"], ["minimal", "Elegant Minimalist", "Light editorial layout"], ["creative", "Creative Gradient", "Warm playful cards"]].map(([template, title, desc]) => (
                      <button key={template} className={`template-card ${form.template === template ? "active" : ""}`} onClick={() => updateForm("template", template)}>
                        <div className="template-card-info">
                          <h4>{title}</h4>
                          <p>{desc}</p>
                        </div>
                        <div className="template-dot"></div>
                      </button>
                    ))}
                  </div>

                  <hr style={{ border: 0, height: 1, background: "rgba(255,255,255,0.08)", margin: "24px 0" }} />

                  <div className="form-group">
                    <label className="form-label">Load Demo Portfolio Datasets</label>
                    <div className="presets-grid">
                      <button className="preset-btn" onClick={() => handleLoadPreset("developer")}>
                        <h5>Full-Stack Web Developer</h5>
                        <p>Pre-fills cloud skills, dev experience, and custom dark theme.</p>
                      </button>
                      <button className="preset-btn" onClick={() => handleLoadPreset("designer")}>
                        <h5>UX/UI Product Designer</h5>
                        <p>Pre-fills design systems expertise, MFA background, and minimal light layout.</p>
                      </button>
                      <button className="preset-btn" onClick={() => handleLoadPreset("creative")}>
                        <h5>Growth Product Manager</h5>
                        <p>Pre-fills product launches, growth metrics, and creative cards.</p>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "home" && (
                <div>
                  <h3 className="section-title">Hero Section</h3>
                  <div className="form-group"><label className="form-label">Full Name</label><input className="form-control" value={form.name} onChange={(event) => updateForm("name", event.target.value)} /></div>
                  <div className="form-group"><label className="form-label">Professional Title</label><input className="form-control" value={form.title} onChange={(event) => updateForm("title", event.target.value)} /></div>
                  <div className="form-group"><label className="form-label">Subtitle</label><input className="form-control" value={form.homeSubtitle} onChange={(event) => updateForm("homeSubtitle", event.target.value)} /></div>
                  <div className="form-group">
                    <ImageUploadField id="profile-image-upload" label="Profile Image" previewAlt={form.name || "Profile image"} value={form.profileImage} onChange={(event) => handleImageUpload(event, (image) => updateForm("profileImage", image))} onRemove={() => updateForm("profileImage", "")} />
                  </div>
                </div>
              )}

              {activeTab === "about" && (
                <div>
                  <h3 className="section-title">About & Skills</h3>
                  <div className="form-group"><label className="form-label">Biography</label><textarea className="form-control" value={form.about} onChange={(event) => updateForm("about", event.target.value)} /></div>
                  <form onSubmit={handleAddSkill} className="skills-input-wrapper">
                    <input className="form-control" value={newSkill} onChange={(event) => setNewSkill(event.target.value)} placeholder="Add skill" />
                    <button type="submit" className="btn-secondary">Add</button>
                  </form>
                  <div className="skills-list">
                    {form.skills.map((skill) => <span key={skill} className="skill-tag">{skill}<button type="button" onClick={() => handleRemoveSkill(skill)}>x</button></span>)}
                  </div>
                </div>
              )}

              {activeTab === "experience" && (
                <div>
                  <h3 className="section-title">Work Experience</h3>
                  <p className="section-desc">Manage your professional career history. Cards update in real time.</p>

                  <div className="item-cards-list">
                    {(form.experience || []).map((item, index) => (
                      <div key={`${item.company}-${index}`} className="item-card">
                        <div className="item-card-details">
                          <h4>{item.role}</h4>
                          <p>{item.company} - {item.duration}</p>
                        </div>
                        <button className="btn-icon-danger" onClick={() => handleRemoveExperience(index)}>x</button>
                      </div>
                    ))}
                  </div>

                  <form onSubmit={handleAddExperience} className="add-item-form">
                    <h4 style={{ fontSize: "0.8rem", textTransform: "uppercase", marginBottom: 12 }}>Add New Job Card</h4>
                    <div className="form-group"><input className="form-control" placeholder="Company Name" value={experienceInput.company} onChange={(event) => setExperienceInput({ ...experienceInput, company: event.target.value })} /></div>
                    <div className="form-group"><input className="form-control" placeholder="Job Role / Title" value={experienceInput.role} onChange={(event) => setExperienceInput({ ...experienceInput, role: event.target.value })} /></div>
                    <div className="form-group"><input className="form-control" placeholder="Duration (e.g. 2023 - Present)" value={experienceInput.duration} onChange={(event) => setExperienceInput({ ...experienceInput, duration: event.target.value })} /></div>
                    <div className="form-group"><textarea className="form-control" placeholder="Role responsibilities / achievements" value={experienceInput.description} onChange={(event) => setExperienceInput({ ...experienceInput, description: event.target.value })} /></div>
                    <button type="submit" className="btn-primary" style={{ width: "100%" }}>Add Experience Card</button>
                  </form>
                </div>
              )}

              {activeTab === "education" && (
                <div>
                  <h3 className="section-title">Education History</h3>
                  <p className="section-desc">Manage academic background details, degrees, and institutions.</p>

                  <div className="item-cards-list">
                    {(form.education || []).map((item, index) => (
                      <div key={`${item.institution}-${index}`} className="item-card">
                        <div className="item-card-details">
                          <h4>{item.degree}</h4>
                          <p>{item.institution} - {item.year}</p>
                        </div>
                        <button className="btn-icon-danger" onClick={() => handleRemoveEducation(index)}>x</button>
                      </div>
                    ))}
                  </div>

                  <form onSubmit={handleAddEducation} className="add-item-form">
                    <h4 style={{ fontSize: "0.8rem", textTransform: "uppercase", marginBottom: 12 }}>Add Education Details</h4>
                    <div className="form-group"><input className="form-control" placeholder="School/College/University" value={educationInput.institution} onChange={(event) => setEducationInput({ ...educationInput, institution: event.target.value })} /></div>
                    <div className="form-group"><input className="form-control" placeholder="Degree/Certificate" value={educationInput.degree} onChange={(event) => setEducationInput({ ...educationInput, degree: event.target.value })} /></div>
                    <div className="form-group"><input className="form-control" placeholder="Year (e.g. 2017 - 2021)" value={educationInput.year} onChange={(event) => setEducationInput({ ...educationInput, year: event.target.value })} /></div>
                    <div className="form-group"><textarea className="form-control" placeholder="Specific details or achievements" value={educationInput.description} onChange={(event) => setEducationInput({ ...educationInput, description: event.target.value })} /></div>
                    <button type="submit" className="btn-primary" style={{ width: "100%" }}>Add Education Card</button>
                  </form>
                </div>
              )}

              {activeTab === "projects" && (
                <div>
                  <h3 className="section-title">Projects</h3>
                  <div className="item-cards-list">
                    {form.projects.map((project, index) => (
                      <div key={`${project.title}-${index}`} className="item-card"><div className="item-card-details"><h4>{project.title}</h4><p>{project.link || "No link"}</p></div><button className="btn-icon-danger" onClick={() => handleRemoveProject(index)}>x</button></div>
                    ))}
                  </div>
                  <form onSubmit={handleAddProject} className="add-item-form">
                    <div className="form-group"><input className="form-control" placeholder="Project title" value={projectInput.title} onChange={(event) => setProjectInput({ ...projectInput, title: event.target.value })} /></div>
                    <div className="form-group"><textarea className="form-control" placeholder="Project description" value={projectInput.description} onChange={(event) => setProjectInput({ ...projectInput, description: event.target.value })} /></div>
                    <div className="form-group"><input className="form-control" placeholder="Tags comma separated" value={projectInput.tags} onChange={(event) => setProjectInput({ ...projectInput, tags: event.target.value })} /></div>
                    <div className="form-group"><input className="form-control" placeholder="Project link" value={projectInput.link} onChange={(event) => setProjectInput({ ...projectInput, link: event.target.value })} /></div>
                    <div className="form-group"><ImageUploadField id="project-image-upload" label="Project Preview Image" previewAlt={projectInput.title || "Project image"} value={projectInput.image} onChange={(event) => handleImageUpload(event, (image) => setProjectInput({ ...projectInput, image }))} onRemove={() => setProjectInput({ ...projectInput, image: "" })} /></div>
                    <button type="submit" className="btn-primary" style={{ width: "100%" }}>Add Project</button>
                  </form>
                </div>
              )}

              {activeTab === "contact" && (
                <div>
                  <h3 className="section-title">Contact & Links</h3>
                  <div className="form-group"><label className="form-label">Email</label><input className="form-control" value={form.contactEmail} onChange={(event) => updateForm("contactEmail", event.target.value)} /></div>
                  <div className="form-group"><label className="form-label">Phone</label><input className="form-control" value={form.contactPhone} onChange={(event) => updateForm("contactPhone", event.target.value)} /></div>
                  <div className="form-group"><label className="form-label">Location</label><input className="form-control" value={form.contactAddress} onChange={(event) => updateForm("contactAddress", event.target.value)} /></div>
                  <div className="item-cards-list">
                    {getSocialLinkItems(form.socialLinks).map((link, index) => (
                      <div key={link.id || `${link.label}-${index}`} className="item-card"><div className="item-card-details"><h4>{link.label}</h4><p>{link.url}</p></div><button className="btn-icon-danger" onClick={() => handleRemoveSocialLink(index)}>x</button></div>
                    ))}
                  </div>
                  <form onSubmit={handleAddSocialLink} className="add-item-form">
                    <div className="form-group"><input className="form-control" placeholder="Link name e.g. LeetCode" value={socialInput.label} onChange={(event) => setSocialInput({ ...socialInput, label: event.target.value })} /></div>
                    <div className="form-group"><input className="form-control" placeholder="Link URL" value={socialInput.url} onChange={(event) => setSocialInput({ ...socialInput, url: event.target.value })} /></div>
                    <button type="submit" className="btn-primary" style={{ width: "100%" }}>Add Link</button>
                  </form>
                </div>
              )}
            </div>
          </aside>
        )}

        <main className="preview-pane">
          <div className="preview-toolbar">
            <div className="preview-title">Live Preview Frame <span className="live-badge">Interactive</span></div>
            <div className="preview-toggle-group">
              <button className={`preview-toggle-btn ${previewDevice === "desktop" ? "active" : ""}`} onClick={() => setPreviewDevice("desktop")}>Desktop</button>
              <button className={`preview-toggle-btn ${previewDevice === "mobile" ? "active" : ""}`} onClick={() => setPreviewDevice("mobile")}>Mobile</button>
            </div>
          </div>
          <div className="preview-frame-container">
            <div className={`browser-mockup ${previewDevice === "mobile" ? "mobile" : ""}`}>
              <div className="browser-bar"><div className="browser-dots"><div className="browser-dot dot-red" /><div className="browser-dot dot-yellow" /><div className="browser-dot dot-green" /></div><div className="browser-address"><span>localhost:5173/portfolio/{form.slug || "draft"}</span></div></div>
              <div className="browser-content">{renderLiveTemplate()}</div>
            </div>
          </div>
        </main>
      </div>

      {toast && <div className="toast-notification"><div className="toast-success-icon">✓</div><div>{toast}</div></div>}
    </div>
  );
}
