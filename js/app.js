// App shell: routing, event delegation, PWA install/offline handling.
const App = (() => {
  const $ = s => document.querySelector(s);
  const ob = { step: 0, err: '', name: '', email: '', phone: '', age: '', province: 'Gauteng', education: 'Matric', skills: [], interests: [], goal: '', lang: 'en' };
  let deferredInstall = null;

  const ICONS = {
    home: '<path d="M3 11l9-8 9 8M5 10v10h14V10"/>',
    jobs: '<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M9 7V4h6v3"/>',
    mentors: '<circle cx="9" cy="8" r="3.5"/><path d="M2 20c0-4 3-6 7-6s7 2 7 6M17 6a3 3 0 010 6M22 20c0-3-2-5-4-5.5"/>',
    money: '<rect x="2" y="6" width="20" height="13" rx="2"/><circle cx="12" cy="12.5" r="3"/>',
    profile: '<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4.5 3.5-7 8-7s8 2.5 8 7"/>'
  };
  const NAV = ['home', 'jobs', 'mentors', 'money', 'profile'];
  const NAV_OF = { home: 'home', jobs: 'jobs', mentors: 'mentors', money: 'money', business: 'money', profile: 'profile', passport: 'profile', experience: 'profile' };

  function navHtml(r) {
    return `<div class="navbrand">Rise<b>Path</b></div>${NAV.map(k => `<a href="#/${k}"${NAV_OF[r] === k ? ' aria-current="page"' : ''}><svg viewBox="0 0 24 24" aria-hidden="true">${ICONS[k]}</svg>${I18N.t(k)}</a>`).join('')}`;
  }

  function render() {
    const s = Store.get();
    I18N.set(s.settings.lang);
    document.documentElement.lang = s.settings.lang === 'nso' ? 'nso' : s.settings.lang;
    document.body.classList.toggle('lowdata', !!s.settings.lowData);
    let r = (location.hash || '#/home').replace(/^#\/?/, '') || 'home';
    if (!s.profile) r = 'onboard';
    else if (r === 'onboard' || !Screens[r] || typeof Screens[r] !== 'function') r = 'home';
    $('#view').innerHTML = Screens[r](ob);
    const nav = $('#nav');
    nav.hidden = r === 'onboard';
    nav.innerHTML = r === 'onboard' ? '' : navHtml(r);
    window.scrollTo(0, 0);
    if (deferredInstall && $('#installBox')) $('#installBox').hidden = false;
  }

  const go = r => { if (location.hash === '#/' + r) render(); else location.hash = '#/' + r; };
  const toggle = (arr, v) => { const i = arr.indexOf(v); i < 0 ? arr.push(v) : arr.splice(i, 1); };
  const redo = () => render();
  const keepScroll = fn => { const y = window.scrollY; fn(); window.scrollTo(0, y); };

  const A = {
    // --- onboarding
    obf(el) { ob[el.dataset.k] = V.clean(el.value, 140); },
    chip(el) { toggle(ob[el.dataset.g], el.dataset.v); keepScroll(redo); },
    lang(el) { ob.lang = el.value; Store.set(s => { s.settings.lang = el.value; }); keepScroll(redo); },
    obBack() { ob.err = ''; ob.step--; redo(); },
    obNext() {
      ob.err = '';
      if (ob.step === 0) {
        if (ob.name.length < 2) ob.err = 'Please enter your full name.';
        else if (!V.email(ob.email)) ob.err = 'Please enter a valid email address.';
        else if (ob.phone && !V.phone(ob.phone)) ob.err = 'Phone must be a South African number, e.g. 0821234567.';
      } else if (ob.step === 1) {
        if (!V.age(ob.age)) ob.err = 'Age must be between 15 and 35.';
      } else if (ob.step === 2) {
        if (!ob.skills.length) ob.err = 'Pick at least one skill.';
      }
      if (ob.err) return redo();
      if (ob.step < 3) { ob.step++; return redo(); }
      Store.set(s => { s.profile = { name: ob.name, email: ob.email, phone: ob.phone, age: Number(ob.age), province: ob.province, education: ob.education, skills: ob.skills.slice(), interests: ob.interests.slice(), goal: ob.goal }; s.settings.lang = ob.lang; });
      go('home');
    },
    demo() { Store.demo(); go('home'); },

    // --- opportunities
    jobf(el) {
      Screens.ui.f[el.dataset.k] = el.type === 'checkbox' ? el.checked : V.clean(el.value, 60);
      $('#joblist').innerHTML = Screens.jobList();
    },
    jobType(el) { Screens.ui.f.type = el.dataset.v; $('#jobchips').innerHTML = Screens.jobChips(); $('#joblist').innerHTML = Screens.jobList(); },
    apply(el) { Store.set(s => { if (!s.applied.includes(el.dataset.id)) s.applied.push(el.dataset.id); }); $('#joblist').innerHTML = Screens.jobList(); },
    saveJob(el) { Store.set(s => toggle(s.saved, el.dataset.id)); $('#joblist').innerHTML = Screens.jobList(); },

    // --- passport + experience
    cv() { Store.set(s => { s.cv = true; }); keepScroll(redo); },
    addPass(form) {
      const fd = new FormData(form), file = form.querySelector('input[type=file]').files[0];
      const title = V.clean(fd.get('title'), 80);
      Screens.ui.passErr = '';
      if (title.length < 2) Screens.ui.passErr = 'Please enter a title.';
      else if (file) Screens.ui.passErr = V.file(file);
      if (Screens.ui.passErr) return redo();
      Store.set(s => s.passport.push({ id: 'p' + Date.now(), type: V.clean(fd.get('type'), 30), title, verified: !!file, file: file ? V.clean(file.name, 40) : '' }));
      redo();
    },
    expRun(form) {
      const text = V.clean(new FormData(form).get('text'), 80);
      if (text.length < 2) return;
      Screens.ui.expResult = { text, skills: Screens.translate(text) };
      redo();
    },
    expAdd() {
      const r = Screens.ui.expResult; if (!r) return;
      Store.set(s => { s.experiences.push(r); s.passport.push({ id: 'p' + Date.now(), type: 'Informal Experience', title: r.text, verified: false, skills: r.skills }); });
      Screens.ui.expResult = null; redo();
    },

    // --- mentors
    mcat(el) { Screens.ui.mcat = el.dataset.v; keepScroll(redo); },
    mentorReq(el) { Store.set(s => { if (!s.mentors.includes(el.dataset.id)) s.mentors.push(el.dataset.id); }); keepScroll(redo); },

    // --- money
    mtab(el) { Screens.ui.money = el.dataset.v; redo(); },
    budget(el) {
      const n = Math.max(0, Math.min(1000000, Number(el.value) || 0));
      Store.set(s => { if (el.dataset.k === 'income') s.budget.income = n; else s.budget.items[el.dataset.k] = n; });
      $('#bsum').innerHTML = Screens.budgetSummary();
    },
    addGoal(form) {
      const fd = new FormData(form), target = Math.max(1, Math.min(1000000, Number(fd.get('target')) || 0));
      Store.set(s => s.goals.push({ name: V.clean(fd.get('name'), 40), target, saved: 0 }));
      redo();
    },
    goalAdd(el) { Store.set(s => { const g = s.goals[Number(el.dataset.i)]; if (g) g.saved = Math.min(g.target, g.saved + 50); }); keepScroll(redo); },
    lesson(el) { Store.set(s => toggle(s.lessons, el.dataset.id)); keepScroll(redo); },
    scam(el) { Store.set(s => toggle(s.scamsDone, el.dataset.id)); keepScroll(redo); },

    // --- business
    btab(el) { Screens.ui.biz = el.dataset.v; redo(); },
    biz(el) {
      const k = el.dataset.k, a = Object.assign({ idea: 3, customer: 3, pricing: 3, marketing: 3, competition: 3 }, Store.get().bizAnswers || {});
      a[k] = Number(el.value); Screens.ui.draft = a;
      $('#v_' + k).textContent = el.value;
      $('#bscore').innerHTML = Screens.bar('Readiness score', Screens.bizScore(a));
    },
    bizSave() {
      const d = Screens.ui.draft || Store.get().bizAnswers || { idea: 3, customer: 3, pricing: 3, marketing: 3, competition: 3 };
      Store.set(s => { s.bizAnswers = d; }); keepScroll(redo);
    },
    bizCheck(el) { Store.set(s => toggle(s.bizChecks, Number(el.dataset.i))); },
    hustle(el) { Store.set(s => toggle(s.hustles, el.dataset.id)); keepScroll(redo); },

    // --- profile / settings
    lowData(el) { Store.set(s => { s.settings.lowData = el.checked; }); render(); },
    install() { if (deferredInstall) { deferredInstall.prompt(); deferredInstall = null; } },
    reset() { if (confirm('Delete all your RisePath data on this device?')) { Store.reset(); Object.assign(ob, { step: 0, err: '', name: '', email: '', phone: '', age: '', skills: [], interests: [], goal: '' }); go('onboard'); render(); } }
  };

  // Delegated events keep inline handlers out of the HTML (CSP-friendly).
  ['click', 'change', 'input'].forEach(ev => document.addEventListener(ev, e => {
    const el = e.target.closest('[data-' + ev + ']');
    if (!el || !A[el.dataset[ev]]) return;
    if (ev === 'click' && el.tagName === 'A') return;
    A[el.dataset[ev]](el, e);
  }));
  document.addEventListener('submit', e => {
    const f = e.target.closest('[data-form]');
    if (f && A[f.dataset.form]) { e.preventDefault(); A[f.dataset.form](f); }
  });

  function setOffline() {
    const box = $('#offline');
    box.hidden = navigator.onLine;
    box.textContent = navigator.onLine ? '' : I18N.t('offline');
  }

  async function loadData() {
    try {
      const [j, m] = await Promise.all([fetch('opportunities.json'), fetch('mentors.json')]);
      Screens.data.jobs = (await j.json()).jobs;
      Screens.data.mentors = (await m.json()).mentors;
    } catch (err) { Screens.data.failed = true; }
    Screens.data.loaded = true;
    render();
  }

  function boot() {
    window.addEventListener('hashchange', render);
    window.addEventListener('online', setOffline);
    window.addEventListener('offline', setOffline);
    window.addEventListener('beforeinstallprompt', e => { e.preventDefault(); deferredInstall = e; const b = $('#installBox'); if (b) b.hidden = false; });
    if ('serviceWorker' in navigator) navigator.serviceWorker.register('sw.js').catch(() => {});
    render(); setOffline(); loadData();
  }
  return { boot };
})();
App.boot();
