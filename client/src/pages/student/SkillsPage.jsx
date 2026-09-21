import React, { useState, useEffect } from 'react';
import { api } from '../../services/api.js';
import { Award, Plus, Trash2, Edit2, CheckCircle, BarChart2, Star, Sparkles, BookOpen } from 'lucide-react';

export const SkillsPage = () => {
  const [skills, setSkills] = useState([]);
  const [unifiedProfile, setUnifiedProfile] = useState(null);
  const [activeTab, setActiveTab] = useState('skills'); // 'skills' | 'unified'
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingSkill, setEditingSkill] = useState(null);
  const [formData, setFormData] = useState({
    skillName: '',
    category: 'Programming',
    proficiency: 'Beginner',
    yearsExperience: 0,
    evidence: ''
  });
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [skillsRes, unifiedRes] = await Promise.all([
        api.getSkills(),
        api.getUnifiedSkillProfile()
      ]);
      setSkills(skillsRes.data || []);
      setUnifiedProfile(unifiedRes.data || null);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (editingSkill) {
        await api.updateSkill(editingSkill._id, formData);
        setMessage('Skill updated successfully');
      } else {
        await api.addSkill(formData);
        setMessage('Skill added successfully');
      }
      setShowModal(false);
      setEditingSkill(null);
      setFormData({ skillName: '', category: 'Programming', proficiency: 'Beginner', yearsExperience: 0, evidence: '' });
      loadData();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to remove this skill?')) return;
    try {
      await api.deleteSkill(id);
      loadData();
    } catch (err) {
      alert(err.message);
    }
  };

  const categories = ['All', 'Programming', 'Web Development', 'AI/ML', 'Cloud', 'Databases', 'Soft Skills'];
  const [selectedCat, setSelectedCat] = useState('All');

  const filteredSkills = selectedCat === 'All'
    ? skills
    : skills.filter(s => s.category === selectedCat);

  return (
    <div className="container" style={{ padding: '2rem 1rem', maxWidth: '1100px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Award className="text-primary" size={28} />
            Skills & Competency Matrix
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            Manage verified competencies, self-declared proficiencies, and aggregated profile matrix.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button
            onClick={() => { setEditingSkill(null); setShowModal(true); }}
            className="btn btn-primary"
            style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
          >
            <Plus size={16} /> Add New Skill
          </button>
        </div>
      </div>

      {message && (
        <div className="alert alert-success" style={{ marginBottom: '1.5rem' }}>
          {message}
        </div>
      )}

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '1rem', borderBottom: '1px solid var(--border-subtle)', marginBottom: '1.5rem' }}>
        <button
          onClick={() => setActiveTab('skills')}
          style={{
            padding: '0.75rem 1.25rem',
            background: 'none',
            border: 'none',
            borderBottom: activeTab === 'skills' ? '2px solid var(--primary)' : '2px solid transparent',
            color: activeTab === 'skills' ? '#fff' : 'var(--text-muted)',
            fontWeight: 600,
            cursor: 'pointer'
          }}
        >
          My Skills ({skills.length})
        </button>
        <button
          onClick={() => setActiveTab('unified')}
          style={{
            padding: '0.75rem 1.25rem',
            background: 'none',
            border: 'none',
            borderBottom: activeTab === 'unified' ? '2px solid var(--primary)' : '2px solid transparent',
            color: activeTab === 'unified' ? '#fff' : 'var(--text-muted)',
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem'
          }}
        >
          <Sparkles size={16} /> Unified Skill Profile (Req 27)
        </button>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>Loading skills...</div>
      ) : activeTab === 'skills' ? (
        <div>
          {/* Category Filter */}
          <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '1rem', marginBottom: '1rem' }}>
            {categories.map(c => (
              <button
                key={c}
                onClick={() => setSelectedCat(c)}
                className={`btn btn-sm ${selectedCat === c ? 'btn-primary' : 'btn-secondary'}`}
                style={{ borderRadius: '20px', padding: '0.35rem 0.9rem', whiteSpace: 'nowrap' }}
              >
                {c}
              </button>
            ))}
          </div>

          {filteredSkills.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
              <Award size={48} style={{ opacity: 0.3, margin: '0 auto 1rem' }} />
              <h3>No skills added in this category</h3>
              <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
                Add your technical and domain competencies to boost your opportunity matches.
              </p>
              <button onClick={() => setShowModal(true)} className="btn btn-primary">Add Skill Now</button>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
              {filteredSkills.map(skill => (
                <div key={skill._id} className="card" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                      <h3 style={{ fontSize: '1.1rem', fontWeight: 600 }}>{skill.skillName}</h3>
                      <span className={`badge ${skill.source === 'assessment' ? 'badge-success' : 'badge-neutral'}`} style={{ fontSize: '0.7rem' }}>
                        {skill.source === 'assessment' ? 'Verified' : 'Self-declared'}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
                      Category: <span style={{ color: 'var(--text-main)' }}>{skill.category}</span>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '0.5rem' }}>
                      <span style={{
                        padding: '0.2rem 0.6rem',
                        borderRadius: '4px',
                        fontSize: '0.8rem',
                        fontWeight: 600,
                        background: skill.proficiency === 'Expert' ? 'rgba(16,185,129,0.15)' :
                                   skill.proficiency === 'Advanced' ? 'rgba(59,130,246,0.15)' :
                                   skill.proficiency === 'Intermediate' ? 'rgba(245,158,11,0.15)' : 'rgba(255,255,255,0.08)',
                        color: skill.proficiency === 'Expert' ? '#10b981' :
                               skill.proficiency === 'Advanced' ? '#3b82f6' :
                               skill.proficiency === 'Intermediate' ? '#f59e0b' : '#94a3b8'
                      }}>
                        {skill.proficiency}
                      </span>
                      {skill.yearsExperience > 0 && (
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                          {skill.yearsExperience} yr{skill.yearsExperience > 1 ? 's' : ''} exp
                        </span>
                      )}
                    </div>
                    {skill.evidence && (
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', background: 'rgba(255,255,255,0.03)', padding: '0.5rem', borderRadius: '4px' }}>
                        {skill.evidence}
                      </p>
                    )}
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '1rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border-subtle)' }}>
                    <button
                      onClick={() => {
                        setEditingSkill(skill);
                        setFormData({
                          skillName: skill.skillName,
                          category: skill.category,
                          proficiency: skill.proficiency,
                          yearsExperience: skill.yearsExperience || 0,
                          evidence: skill.evidence || ''
                        });
                        setShowModal(true);
                      }}
                      className="btn btn-sm btn-secondary"
                    >
                      <Edit2 size={14} />
                    </button>
                    <button onClick={() => handleDelete(skill._id)} className="btn btn-sm btn-danger">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        /* Unified Skill Profile View (Req 27) */
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="card" style={{ padding: '1.5rem' }}>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 600, marginBottom: '0.5rem' }}>
              Consolidated Skill Matrix
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
              Combines self-reported proficiencies, assessment scores, academic coursework, and practical projects into a single verified view.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
              <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Total Skills</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>{unifiedProfile?.summary?.totalSkills || 0}</div>
              </div>
              <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Assessments Passed</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#10b981' }}>{unifiedProfile?.summary?.totalAssessments || 0}</div>
              </div>
              <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Projects Portfolio</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#3b82f6' }}>{unifiedProfile?.summary?.totalProjects || 0}</div>
              </div>
              <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Certifications</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#f59e0b' }}>{unifiedProfile?.summary?.totalCertifications || 0}</div>
              </div>
            </div>

            {/* Assessment-Verified Skills */}
            <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <CheckCircle size={18} className="text-success" /> Assessment-Verified Proficiencies
            </h3>
            {unifiedProfile?.assessedSkills?.length === 0 ? (
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                No assessments taken yet. Visit the Assessments tab to verify your competencies with proctored exams.
              </p>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
                {unifiedProfile?.assessedSkills?.map((ass, i) => (
                  <div key={i} style={{ padding: '1rem', borderRadius: '8px', background: 'rgba(16,185,129,0.05)', border: '1px solid rgba(16,185,129,0.2)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                      <span style={{ fontWeight: 600 }}>{ass.topic}</span>
                      <span style={{ color: '#10b981', fontWeight: 700 }}>{ass.score}%</span>
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      Rating: <strong style={{ color: '#fff' }}>{ass.level}</strong> • {ass.assessmentType}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Add / Edit Skill Modal */}
      {showModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 9999, padding: '1rem'
        }}>
          <div className="card" style={{ width: '100%', maxWidth: '500px', padding: '1.75rem' }}>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 600, marginBottom: '1.25rem' }}>
              {editingSkill ? 'Edit Skill' : 'Add New Skill'}
            </h2>
            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.4rem' }}>Skill Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. React.js, Python, System Design"
                  value={formData.skillName}
                  onChange={e => setFormData({ ...formData, skillName: e.target.value })}
                  className="form-input"
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.4rem' }}>Category</label>
                <select
                  value={formData.category}
                  onChange={e => setFormData({ ...formData, category: e.target.value })}
                  className="form-input"
                >
                  <option value="Programming">Programming</option>
                  <option value="Web Development">Web Development</option>
                  <option value="Mobile Development">Mobile Development</option>
                  <option value="Data Science">Data Science</option>
                  <option value="AI/ML">AI/ML</option>
                  <option value="Cloud">Cloud</option>
                  <option value="Databases">Databases</option>
                  <option value="Cybersecurity">Cybersecurity</option>
                  <option value="Soft Skills">Soft Skills</option>
                  <option value="Domain Skills">Domain Skills</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.4rem' }}>Proficiency</label>
                  <select
                    value={formData.proficiency}
                    onChange={e => setFormData({ ...formData, proficiency: e.target.value })}
                    className="form-input"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                    <option value="Expert">Expert</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.4rem' }}>Years of Experience</label>
                  <input
                    type="number"
                    min="0"
                    max="20"
                    value={formData.yearsExperience}
                    onChange={e => setFormData({ ...formData, yearsExperience: e.target.value })}
                    className="form-input"
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.4rem' }}>Evidence / Project link / Note</label>
                <input
                  type="text"
                  placeholder="e.g. Built 3 production SPAs using React & Redux"
                  value={formData.evidence}
                  onChange={e => setFormData({ ...formData, evidence: e.target.value })}
                  className="form-input"
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
                <button type="button" onClick={() => setShowModal(false)} className="btn btn-secondary">Cancel</button>
                <button type="submit" className="btn btn-primary">{editingSkill ? 'Save Changes' : 'Add Skill'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
