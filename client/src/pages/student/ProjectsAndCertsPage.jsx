import React, { useState, useEffect } from 'react';
import { api } from '../../services/api.js';
import {
  Briefcase,
  Award,
  Trophy,
  FileText,
  Plus,
  Trash2,
  ExternalLink,
  CheckCircle,
  Upload,
  Download
} from 'lucide-react';

export const ProjectsAndCertsPage = () => {
  const [activeTab, setActiveTab] = useState('projects'); // 'projects' | 'certifications' | 'achievements' | 'documents'
  const [projects, setProjects] = useState([]);
  const [certifications, setCertifications] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  // Form states
  const [projectForm, setProjectForm] = useState({ title: '', description: '', technologies: '', projectUrl: '', githubUrl: '', demoUrl: '' });
  const [certForm, setCertForm] = useState({ name: '', issuingOrg: '', issueDate: '', credentialUrl: '', skillsCovered: '' });
  const [achieveForm, setAchieveForm] = useState({ title: '', organization: '', date: '', description: '', category: 'Hackathon' });
  const [docForm, setDocForm] = useState({ name: '', type: 'resume', isPrimary: true });
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    loadAll();
  }, []);

  const loadAll = async () => {
    setLoading(true);
    try {
      const [p, c, a, d] = await Promise.all([
        api.getProjects(),
        api.getCertifications(),
        api.getAchievements(),
        api.getDocuments()
      ]);
      setProjects(p.data || []);
      setCertifications(c.data || []);
      setAchievements(a.data || []);
      setDocuments(d.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddProject = async (e) => {
    e.preventDefault();
    try {
      await api.addProject(projectForm);
      setShowModal(false);
      setProjectForm({ title: '', description: '', technologies: '', projectUrl: '', githubUrl: '', demoUrl: '' });
      loadAll();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleAddCertification = async (e) => {
    e.preventDefault();
    try {
      await api.addCertification(certForm);
      setShowModal(false);
      setCertForm({ name: '', issuingOrg: '', issueDate: '', credentialUrl: '', skillsCovered: '' });
      loadAll();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleAddAchievement = async (e) => {
    e.preventDefault();
    try {
      await api.addAchievement(achieveForm);
      setShowModal(false);
      setAchieveForm({ title: '', organization: '', date: '', description: '', category: 'Hackathon' });
      loadAll();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleUploadDoc = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      alert('Please select a file to upload');
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('name', docForm.name || selectedFile.name);
    formData.append('type', docForm.type);
    formData.append('isPrimary', docForm.isPrimary);

    try {
      const token = localStorage.getItem('skillnexus_token');
      const res = await fetch('/api/students/documents', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setShowModal(false);
      setSelectedFile(null);
      loadAll();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDeleteItem = async (type, id) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;
    try {
      if (type === 'project') await api.deleteProject(id);
      if (type === 'certification') await api.deleteCertification(id);
      if (type === 'achievement') await api.deleteAchievement(id);
      if (type === 'document') await api.deleteDocument(id);
      loadAll();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleSetPrimaryDoc = async (id) => {
    try {
      await api.setPrimaryDocument(id);
      loadAll();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="container" style={{ padding: '2rem 1rem', maxWidth: '1050px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 700 }}>Projects & Credentials</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            Showcase your projects, professional certifications, hackathon awards, and uploaded resumes.
          </p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <Plus size={16} /> Add {activeTab === 'projects' ? 'Project' : activeTab === 'certifications' ? 'Certification' : activeTab === 'achievements' ? 'Achievement' : 'Document'}
        </button>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0.75rem', borderBottom: '1px solid var(--border-subtle)', marginBottom: '1.5rem', overflowX: 'auto' }}>
        {[
          { id: 'projects', label: `Projects (${projects.length})`, icon: Briefcase },
          { id: 'certifications', label: `Certifications (${certifications.length})`, icon: Award },
          { id: 'achievements', label: `Achievements (${achievements.length})`, icon: Trophy },
          { id: 'documents', label: `Resumes & Docs (${documents.length})`, icon: FileText }
        ].map(t => {
          const Icon = t.icon;
          return (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              style={{
                padding: '0.75rem 1.25rem',
                background: 'none',
                border: 'none',
                borderBottom: activeTab === t.id ? '2px solid var(--primary)' : '2px solid transparent',
                color: activeTab === t.id ? '#fff' : 'var(--text-muted)',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                whiteSpace: 'nowrap'
              }}
            >
              <Icon size={16} /> {t.label}
            </button>
          );
        })}
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>Loading items...</div>
      ) : activeTab === 'projects' ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.25rem' }}>
          {projects.length === 0 ? (
            <div className="card" style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem' }}>
              <Briefcase size={40} style={{ opacity: 0.3, margin: '0 auto 1rem' }} />
              <h3>No projects added yet</h3>
              <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>Showcase applications and repositories to impress recruiters.</p>
              <button onClick={() => setShowModal(true)} className="btn btn-primary">Add Project</button>
            </div>
          ) : (
            projects.map(p => (
              <div key={p._id} className="card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 600, marginBottom: '0.5rem' }}>{p.title}</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', lineHeight: 1.6, marginBottom: '1rem' }}>{p.description}</p>
                  {p.technologies?.length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '1rem' }}>
                      {p.technologies.map((t, idx) => (
                        <span key={idx} style={{ fontSize: '0.75rem', padding: '0.2rem 0.5rem', background: 'rgba(59,130,246,0.1)', color: '#3b82f6', borderRadius: '4px' }}>
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border-subtle)' }}>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    {p.demoUrl && <a href={p.demoUrl} target="_blank" rel="noreferrer" className="btn btn-sm btn-secondary"><ExternalLink size={14} /> Demo</a>}
                    {p.githubUrl && <a href={p.githubUrl} target="_blank" rel="noreferrer" className="btn btn-sm btn-secondary">Code</a>}
                  </div>
                  <button onClick={() => handleDeleteItem('project', p._id)} className="btn btn-sm btn-danger"><Trash2 size={14} /></button>
                </div>
              </div>
            ))
          )}
        </div>
      ) : activeTab === 'certifications' ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.25rem' }}>
          {certifications.length === 0 ? (
            <div className="card" style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem' }}>
              <Award size={40} style={{ opacity: 0.3, margin: '0 auto 1rem' }} />
              <h3>No certifications added</h3>
              <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>Add AWS, Google Cloud, Coursera, or industry certificates.</p>
              <button onClick={() => setShowModal(true)} className="btn btn-primary">Add Certification</button>
            </div>
          ) : (
            certifications.map(c => (
              <div key={c._id} className="card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 600, marginBottom: '0.4rem' }}>{c.name}</h3>
                  <div style={{ color: 'var(--primary)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>{c.issuingOrg}</div>
                  {c.issueDate && <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '0.75rem' }}>Issued: {c.issueDate}</div>}
                  {c.skillsCovered?.length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                      {c.skillsCovered.map((s, idx) => (
                        <span key={idx} style={{ fontSize: '0.75rem', padding: '0.15rem 0.4rem', background: 'rgba(255,255,255,0.06)', borderRadius: '4px' }}>
                          {s}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border-subtle)' }}>
                  {c.credentialUrl && <a href={c.credentialUrl} target="_blank" rel="noreferrer" className="btn btn-sm btn-secondary"><ExternalLink size={14} /> Verify</a>}
                  <button onClick={() => handleDeleteItem('certification', c._id)} className="btn btn-sm btn-danger"><Trash2 size={14} /></button>
                </div>
              </div>
            ))
          )}
        </div>
      ) : activeTab === 'achievements' ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.25rem' }}>
          {achievements.length === 0 ? (
            <div className="card" style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem' }}>
              <Trophy size={40} style={{ opacity: 0.3, margin: '0 auto 1rem' }} />
              <h3>No achievements recorded</h3>
              <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>Add hackathons, research awards, or coding contests.</p>
              <button onClick={() => setShowModal(true)} className="btn btn-primary">Add Achievement</button>
            </div>
          ) : (
            achievements.map(a => (
              <div key={a._id} className="card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.4rem' }}>
                    <h3 style={{ fontSize: '1.15rem', fontWeight: 600 }}>{a.title}</h3>
                    <span className="badge badge-primary" style={{ fontSize: '0.7rem' }}>{a.category}</span>
                  </div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '0.75rem' }}>{a.organization} • {a.date}</div>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', lineHeight: 1.6 }}>{a.description}</p>
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border-subtle)' }}>
                  <button onClick={() => handleDeleteItem('achievement', a._id)} className="btn btn-sm btn-danger"><Trash2 size={14} /></button>
                </div>
              </div>
            ))
          )}
        </div>
      ) : (
        /* Documents / Resumes Tab (Req 21) */
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {documents.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
              <FileText size={40} style={{ opacity: 0.3, margin: '0 auto 1rem' }} />
              <h3>No resume or documents uploaded</h3>
              <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Upload your primary resume to auto-attach when applying to jobs.</p>
              <button onClick={() => setShowModal(true)} className="btn btn-primary">Upload Document</button>
            </div>
          ) : (
            documents.map(d => (
              <div key={d._id} className="card" style={{ padding: '1.25rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ width: '42px', height: '42px', borderRadius: '8px', background: 'rgba(59,130,246,0.1)', color: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <FileText size={22} />
                  </div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ fontWeight: 600, fontSize: '1rem' }}>{d.name}</span>
                      {d.isPrimary && (
                        <span className="badge badge-success" style={{ fontSize: '0.7rem' }}>Primary Resume</span>
                      )}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      Type: {d.type} {d.sizeBytes ? `• ${(d.sizeBytes / 1024).toFixed(1)} KB` : ''}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  {!d.isPrimary && (
                    <button onClick={() => handleSetPrimaryDoc(d._id)} className="btn btn-sm btn-secondary">
                      Set as Primary
                    </button>
                  )}
                  {d.fileUrl && (
                    <a href={d.fileUrl} target="_blank" rel="noreferrer" className="btn btn-sm btn-secondary" download>
                      <Download size={14} />
                    </a>
                  )}
                  <button onClick={() => handleDeleteItem('document', d._id)} className="btn btn-sm btn-danger">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Modal for adding content */}
      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '1rem' }}>
          <div className="card" style={{ width: '100%', maxWidth: '500px', padding: '2rem' }}>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 600, marginBottom: '1.25rem' }}>
              Add {activeTab === 'projects' ? 'Project' : activeTab === 'certifications' ? 'Certification' : activeTab === 'achievements' ? 'Achievement' : 'Document'}
            </h2>

            {activeTab === 'projects' && (
              <form onSubmit={handleAddProject} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.3rem' }}>Project Title *</label>
                  <input required type="text" value={projectForm.title} onChange={e => setProjectForm({ ...projectForm, title: e.target.value })} className="form-input" />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.3rem' }}>Description</label>
                  <textarea rows={3} value={projectForm.description} onChange={e => setProjectForm({ ...projectForm, description: e.target.value })} className="form-input" />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.3rem' }}>Technologies (comma separated)</label>
                  <input type="text" placeholder="e.g. React, Node.js, Express, MongoDB" value={projectForm.technologies} onChange={e => setProjectForm({ ...projectForm, technologies: e.target.value })} className="form-input" />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.3rem' }}>GitHub URL</label>
                    <input type="url" value={projectForm.githubUrl} onChange={e => setProjectForm({ ...projectForm, githubUrl: e.target.value })} className="form-input" />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.3rem' }}>Demo URL</label>
                    <input type="url" value={projectForm.demoUrl} onChange={e => setProjectForm({ ...projectForm, demoUrl: e.target.value })} className="form-input" />
                  </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
                  <button type="button" onClick={() => setShowModal(false)} className="btn btn-secondary">Cancel</button>
                  <button type="submit" className="btn btn-primary">Save Project</button>
                </div>
              </form>
            )}

            {activeTab === 'certifications' && (
              <form onSubmit={handleAddCertification} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.3rem' }}>Certification Name *</label>
                  <input required type="text" value={certForm.name} onChange={e => setCertForm({ ...certForm, name: e.target.value })} className="form-input" />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.3rem' }}>Issuing Organization *</label>
                  <input required type="text" placeholder="e.g. AWS, Microsoft, Coursera" value={certForm.issuingOrg} onChange={e => setCertForm({ ...certForm, issuingOrg: e.target.value })} className="form-input" />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.3rem' }}>Credential URL</label>
                  <input type="url" value={certForm.credentialUrl} onChange={e => setCertForm({ ...certForm, credentialUrl: e.target.value })} className="form-input" />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.3rem' }}>Skills Covered (comma separated)</label>
                  <input type="text" value={certForm.skillsCovered} onChange={e => setCertForm({ ...certForm, skillsCovered: e.target.value })} className="form-input" />
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
                  <button type="button" onClick={() => setShowModal(false)} className="btn btn-secondary">Cancel</button>
                  <button type="submit" className="btn btn-primary">Save Certification</button>
                </div>
              </form>
            )}

            {activeTab === 'achievements' && (
              <form onSubmit={handleAddAchievement} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.3rem' }}>Title *</label>
                  <input required type="text" value={achieveForm.title} onChange={e => setAchieveForm({ ...achieveForm, title: e.target.value })} className="form-input" />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.3rem' }}>Category</label>
                  <select value={achieveForm.category} onChange={e => setAchieveForm({ ...achieveForm, category: e.target.value })} className="form-input">
                    <option value="Hackathon">Hackathon</option>
                    <option value="Award">Award</option>
                    <option value="Competition">Competition</option>
                    <option value="Scholarship">Scholarship</option>
                    <option value="Publication">Publication</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.3rem' }}>Organization / Event</label>
                  <input type="text" value={achieveForm.organization} onChange={e => setAchieveForm({ ...achieveForm, organization: e.target.value })} className="form-input" />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.3rem' }}>Description</label>
                  <textarea rows={2} value={achieveForm.description} onChange={e => setAchieveForm({ ...achieveForm, description: e.target.value })} className="form-input" />
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
                  <button type="button" onClick={() => setShowModal(false)} className="btn btn-secondary">Cancel</button>
                  <button type="submit" className="btn btn-primary">Save Achievement</button>
                </div>
              </form>
            )}

            {activeTab === 'documents' && (
              <form onSubmit={handleUploadDoc} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.3rem' }}>Document Name</label>
                  <input type="text" placeholder="e.g. SDE_Resume_2025.pdf" value={docForm.name} onChange={e => setDocForm({ ...docForm, name: e.target.value })} className="form-input" />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.3rem' }}>Document Type</label>
                  <select value={docForm.type} onChange={e => setDocForm({ ...docForm, type: e.target.value })} className="form-input">
                    <option value="resume">Resume / CV</option>
                    <option value="certificate">Certificate</option>
                    <option value="marksheet">Marksheet / Transcript</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.3rem' }}>Select File (PDF / DOCX, max 10MB) *</label>
                  <input required type="file" onChange={e => setSelectedFile(e.target.files[0])} className="form-input" accept=".pdf,.doc,.docx" />
                </div>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.9rem' }}>
                  <input type="checkbox" checked={docForm.isPrimary} onChange={e => setDocForm({ ...docForm, isPrimary: e.target.checked })} />
                  Set as primary resume for applications
                </label>
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
                  <button type="button" onClick={() => setShowModal(false)} className="btn btn-secondary">Cancel</button>
                  <button type="submit" className="btn btn-primary">Upload Now</button>
                </div>
              </form>
            )}

          </div>
        </div>
      )}
    </div>
  );
};
