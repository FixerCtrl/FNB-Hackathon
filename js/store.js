// Local-first state, persisted to localStorage (works offline, no server).
const Store = (() => {
  const KEY = 'risepath.v1';
  const def = () => ({
    profile: null,
    settings: { lang: 'en', lowData: false },
    passport: [], experiences: [], applied: [], saved: [], mentors: [],
    cv: false, goals: [], budget: { income: 0, items: {} },
    lessons: [], scamsDone: [], bizAnswers: null, bizChecks: [], hustles: []
  });
  function load() {
    try {
      const raw = JSON.parse(localStorage.getItem(KEY) || '{}');
      const d = def();
      return Object.assign(d, raw, { settings: Object.assign(d.settings, raw.settings || {}) });
    } catch (e) { return def(); }
  }
  let s = load();
  function persist() { try { localStorage.setItem(KEY, JSON.stringify(s)); } catch (e) { /* storage blocked */ } }
  return {
    get: () => s,
    set(fn) { fn(s); persist(); },
    reset() { s = def(); persist(); },
    demo() {
      s = def();
      s.profile = { name: 'Sarah Mokoena', email: 'sarah@example.com', phone: '0821234567', age: 21, province: 'Gauteng', education: 'Matric', skills: ['Communication', 'Customer service', 'Computer literacy'], interests: ['Technology', 'Retail'], goal: 'Get my first job in IT support' };
      s.cv = true;
      s.passport = [
        { id: 'd1', type: 'Certificate', title: 'Computer Literacy Certificate', verified: true, file: 'certificate.pdf' },
        { id: 'd2', type: 'Volunteer', title: 'Community library helper', verified: true, file: 'letter.pdf' },
        { id: 'd3', type: 'Sports Leadership', title: 'Netball team captain', verified: false }
      ];
      s.experiences = [{ text: 'Netball team captain', skills: ['Leadership', 'Conflict Resolution', 'Team Coordination', 'Planning'] }];
      s.applied = ['j2'];
      s.mentors = ['m1'];
      s.budget = { income: 3500, items: { transport: 800, food: 900, data: 200, savings: 300, housing: 600, lifestyle: 200 } };
      s.lessons = ['budgeting'];
      s.scamsDone = ['fakejobs'];
      s.bizAnswers = { idea: 3, customer: 2, pricing: 2, marketing: 3, competition: 2 };
      s.bizChecks = [0];
      persist();
    }
  };
})();
