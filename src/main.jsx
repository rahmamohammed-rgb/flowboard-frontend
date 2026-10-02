import React, { useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  Bell,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronDown,
  CircleHelp,
  FolderKanban,
  LayoutDashboard,
  ListChecks,
  Menu,
  Moon,
  MoreHorizontal,
  Plus,
  Search,
  Settings,
  SlidersHorizontal,
  Sun,
  Users,
  X,
} from 'lucide-react';
import './styles.css';

const projects = [
  { name: 'Website Redesign', type: 'Product', progress: 82, status: 'On track', color: 'indigo' },
  { name: 'Mobile App Sprint', type: 'Product', progress: 64, status: 'On track', color: 'blue' },
  { name: 'Marketing Launch', type: 'Campaign', progress: 41, status: 'Needs review', color: 'orange' },
];

const initialTasks = [
  { id: 1, title: 'Finalize landing page sections', project: 'Website Redesign', due: 'Today', status: 'In progress' },
  { id: 2, title: 'Review mobile navigation flow', project: 'Mobile App Sprint', due: 'Tomorrow', status: 'To do' },
  { id: 3, title: 'Prepare campaign content blocks', project: 'Marketing Launch', due: 'Oct 05', status: 'In review' },
  { id: 4, title: 'Update responsive breakpoints', project: 'Website Redesign', due: 'Oct 07', status: 'Done' },
];

const navItems = [
  { label: 'Overview', icon: LayoutDashboard },
  { label: 'Projects', icon: FolderKanban },
  { label: 'Tasks', icon: ListChecks },
  { label: 'Team', icon: Users },
];

function App() {
  const [activeNav, setActiveNav] = useState('Overview');
  const [query, setQuery] = useState('');
  const [dark, setDark] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [tasks, setTasks] = useState(initialTasks);
  const [modalOpen, setModalOpen] = useState(false);
  const [taskTitle, setTaskTitle] = useState('');

  const filteredTasks = useMemo(() => {
    const value = query.trim().toLowerCase();
    if (!value) return tasks;
    return tasks.filter((task) => `${task.title} ${task.project} ${task.status}`.toLowerCase().includes(value));
  }, [query, tasks]);

  const toggleTask = (id) => {
    setTasks((current) => current.map((task) => task.id === id
      ? { ...task, status: task.status === 'Done' ? 'To do' : 'Done' }
      : task
    ));
  };

  const addTask = (event) => {
    event.preventDefault();
    const title = taskTitle.trim();
    if (!title) return;
    setTasks((current) => [
      { id: Date.now(), title, project: 'Website Redesign', due: 'New', status: 'To do' },
      ...current,
    ]);
    setTaskTitle('');
    setModalOpen(false);
  };

  return (
    <div className={dark ? 'app dark' : 'app'}>
      <aside className={sidebarOpen ? 'sidebar open' : 'sidebar'}>
        <div className="brand-row">
          <div className="brand-mark">F</div>
          <div>
            <div className="brand-name">FlowBoard</div>
            <div className="brand-subtitle">Workspace</div>
          </div>
          <button className="icon-btn mobile-close" onClick={() => setSidebarOpen(false)} aria-label="Close menu"><X size={18} /></button>
        </div>

        <div className="workspace-card">
          <div className="workspace-dot" />
          <div className="workspace-copy"><strong>Creative Studio</strong><span>Product Team</span></div>
          <ChevronDown size={16} />
        </div>

        <nav className="main-nav">
          <div className="nav-label">WORKSPACE</div>
          {navItems.map(({ label, icon: Icon }) => (
            <button
              key={label}
              className={activeNav === label ? 'nav-item active' : 'nav-item'}
              onClick={() => { setActiveNav(label); setSidebarOpen(false); }}
            >
              <Icon size={18} />
              <span>{label}</span>
            </button>
          ))}
        </nav>

        <nav className="main-nav bottom-nav">
          <div className="nav-label">TOOLS</div>
          <button className="nav-item"><CalendarDays size={18} /><span>Calendar</span></button>
          <button className="nav-item"><Settings size={18} /><span>Settings</span></button>
          <button className="nav-item"><CircleHelp size={18} /><span>Help Center</span></button>
        </nav>

        <div className="upgrade-card">
          <div className="upgrade-icon"><SlidersHorizontal size={18} /></div>
          <strong>Keep work moving</strong>
          <span>Organize tasks, monitor progress, and keep every project on track.</span>
        </div>
      </aside>

      <main className="main">
        <header className="topbar">
          <button className="icon-btn mobile-menu" onClick={() => setSidebarOpen(true)} aria-label="Open menu"><Menu size={20} /></button>
          <div className="crumbs"><span>Workspace</span><span>/</span><strong>{activeNav}</strong></div>
          <div className="top-actions">
            <div className="search-box">
              <Search size={17} />
              <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search tasks or projects" aria-label="Search" />
              <kbd>⌘ K</kbd>
            </div>
            <button className="icon-btn" onClick={() => setDark((value) => !value)} aria-label="Toggle theme">{dark ? <Sun size={18} /> : <Moon size={18} />}</button>
            <button className="icon-btn notification" aria-label="Notifications"><Bell size={18} /><span /></button>
            <div className="avatar">CB</div>
          </div>
        </header>

        <div className="content">
          <section className="hero">
            <div>
              <div className="eyebrow">Friday, October 2</div>
              <h1>Good morning, team.</h1>
              <p>Here’s a clear view of what needs attention across your workspace.</p>
            </div>
            <button className="primary-btn" onClick={() => setModalOpen(true)}><Plus size={18} /> Add task</button>
          </section>

          <section className="stats-grid">
            <StatCard label="Active projects" value="08" delta="+2 this month" icon={<FolderKanban size={19} />} />
            <StatCard label="Open tasks" value="24" delta="06 due this week" icon={<ListChecks size={19} />} />
            <StatCard label="Completion rate" value="76%" delta="+8% vs. last month" icon={<CheckCircle2 size={19} />} />
            <StatCard label="Upcoming reviews" value="03" delta="Next: Oct 05" icon={<CalendarDays size={19} />} />
          </section>

          <section className="dashboard-grid">
            <div className="panel projects-panel">
              <div className="panel-head">
                <div><h2>Projects</h2><p>Progress across your active work</p></div>
                <button className="ghost-btn">View all</button>
              </div>
              <div className="project-list">
                {projects.map((project) => (
                  <div className="project-row" key={project.name}>
                    <div className={`project-icon ${project.color}`}><FolderKanban size={18} /></div>
                    <div className="project-info"><strong>{project.name}</strong><span>{project.type}</span></div>
                    <div className="progress-wrap"><div className="progress-track"><div className={`progress-fill ${project.color}`} style={{ width: `${project.progress}%` }} /></div><span>{project.progress}%</span></div>
                    <span className={`status-pill ${project.status === 'Needs review' ? 'warning' : 'success'}`}>{project.status}</span>
                    <button className="row-more" aria-label={`More options for ${project.name}`}><MoreHorizontal size={18} /></button>
                  </div>
                ))}
              </div>
            </div>

            <div className="panel completion-panel">
              <div className="panel-head">
                <div><h2>Weekly progress</h2><p>Tasks completed this week</p></div>
              </div>
              <div className="donut-wrap">
                <div className="donut"><div className="donut-center"><strong>76%</strong><span>Complete</span></div></div>
              </div>
              <div className="legend"><span><i className="dot done" />Completed <strong>38</strong></span><span><i className="dot pending" />Remaining <strong>12</strong></span></div>
            </div>
          </section>

          <section className="lower-grid">
            <div className="panel tasks-panel">
              <div className="panel-head">
                <div><h2>Priority tasks</h2><p>{filteredTasks.length} tasks shown</p></div>
                <button className="ghost-btn" onClick={() => setActiveNav('Tasks')}>Open task list</button>
              </div>
              <div className="task-list">
                {filteredTasks.map((task) => (
                  <div className="task-row" key={task.id}>
                    <button className={task.status === 'Done' ? 'check-box checked' : 'check-box'} onClick={() => toggleTask(task.id)} aria-label={`Mark ${task.title} complete`}>
                      {task.status === 'Done' && <Check size={14} />}
                    </button>
                    <div className="task-copy"><strong className={task.status === 'Done' ? 'completed-text' : ''}>{task.title}</strong><span>{task.project}</span></div>
                    <span className="due">{task.due}</span>
                    <span className={`task-status ${task.status.toLowerCase().replaceAll(' ', '-')}`}>{task.status}</span>
                  </div>
                ))}
                {!filteredTasks.length && <div className="empty-state">No matching tasks found.</div>}
              </div>
            </div>

            <div className="panel activity-panel">
              <div className="panel-head"><div><h2>Recent activity</h2><p>Latest workspace updates</p></div></div>
              <div className="activity-list">
                <Activity title="Landing page review" text="Design handoff moved to review" time="12 min ago" icon="LP" />
                <Activity title="Sprint planning" text="New tasks were added to sprint 08" time="38 min ago" icon="SP" />
                <Activity title="Campaign update" text="Content milestone reached 40%" time="1 hr ago" icon="CM" />
                <Activity title="Navigation QA" text="Responsive test checklist updated" time="2 hrs ago" icon="QA" />
              </div>
            </div>
          </section>

          <footer className="footer">FlowBoard · Front-End concept project · React + CSS</footer>
        </div>
      </main>

      {modalOpen && (
        <div className="modal-backdrop" onMouseDown={() => setModalOpen(false)}>
          <form className="modal" onSubmit={addTask} onMouseDown={(e) => e.stopPropagation()}>
            <div className="modal-head"><div><h2>Add a task</h2><p>Create a new front-end demo task.</p></div><button type="button" className="icon-btn" onClick={() => setModalOpen(false)} aria-label="Close"><X size={18} /></button></div>
            <label>Task title<input autoFocus value={taskTitle} onChange={(e) => setTaskTitle(e.target.value)} placeholder="e.g. Build mobile header" /></label>
            <button className="primary-btn full" type="submit"><Plus size={18} /> Create task</button>
          </form>
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value, delta, icon }) {
  return <div className="stat-card"><div className="stat-icon">{icon}</div><span>{label}</span><strong>{value}</strong><small>{delta}</small></div>;
}

function Activity({ title, text, time, icon }) {
  return <div className="activity-item"><div className="activity-icon">{icon}</div><div className="activity-copy"><strong>{title}</strong><span>{text}</span><small>{time}</small></div></div>;
}

createRoot(document.getElementById('root')).render(<App />);
