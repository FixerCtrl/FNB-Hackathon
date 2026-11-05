// Screen renderers. Every dynamic value goes through V.esc() before it reaches innerHTML.
const Screens = (() => {
  const t = k => I18N.t(k), e = V.esc;
  const S = () => Store.get();
  const data = { jobs: [], mentors: [], loaded: false, failed: false };
  const ui = { money: 'budget', biz: 'hustle', mcat: 'all', expResult: null, passErr: '', f: { q: '', type: 'all', province: 'all', industry: 'all', remote: false, level: 'all' } };

  const PROVINCES = ['Eastern Cape', 'Free State', 'Gauteng', 'KwaZulu-Natal', 'Limpopo', 'Mpumalanga', 'North West', 'Northern Cape', 'Western Cape'];
  const EDU = ['Grade 9-11', 'Matric', 'Matric + short course', 'TVET / N-level', 'Diploma', 'Degree'];
  const SKILLS = ['Communication', 'Computer literacy', 'Customer service', 'Sales', 'Teaching', 'Mechanical', 'Design', 'Coding', 'Admin', 'Sewing', 'Cooking', 'Writing'];
  const INTERESTS = ['Technology', 'Retail', 'Agriculture', 'Healthcare', 'Construction', 'Creative', 'Finance', 'Hospitality', 'Education'];
  const TYPES = ['Job', 'Internship', 'Learnership', 'Volunteer', 'Micro-internship'];
  const PASS_TYPES = ['Skill', 'Certificate', 'Volunteer', 'Sports Leadership', 'Community Project', 'Side Hustle', 'Recommendation Letter'];
  const BUDGET_CATS = ['transport', 'food', 'data', 'savings', 'housing', 'lifestyle'];
  const GOAL_PRESETS = ['Laptop Fund', 'Emergency Fund', 'Education Fund', 'Business Fund'];

  const LESSONS = [
    { id: 'budgeting', title: 'Budgeting', body: 'List income first, then needs (transport, food, data, housing), then savings, then wants. Aim to pay yourself first: move savings out as soon as you are paid.' },
    { id: 'saving', title: 'Saving', body: 'Start small and be consistent. A fixed amount each payday beats a big amount now and then. Keep an emergency fund separate from spending money.' },
    { id: 'credit', title: 'Responsible Credit', body: 'Borrow only from registered credit providers. Check the total cost, not just the monthly instalment. Never borrow to repay another loan.' },
    { id: 'payments', title: 'Digital Payments', body: 'Never share your PIN, OTP or password, even with someone claiming to be your bank. Check amounts and recipients before approving any payment.' },
    { id: 'fraud', title: 'Fraud Awareness', body: 'If an offer sounds too good to be true, it is. Pause, verify through an official channel, and talk to someone you trust before paying anything.' }
  ];
  const SCAMS = [
    { id: 'fakejobs', title: 'Fake Jobs', body: 'Real employers do not charge application, training or uniform fees. Be careful of jobs offered on WhatsApp with no interview.' },
    { id: 'fakeinvest', title: 'Fake Investments', body: 'Promises of guaranteed high returns, or pressure to recruit friends, are red flags. Check that the company is registered with the FSCA.' },
    { id: 'loans', title: 'Loan Scams', body: 'Lenders who ask for an upfront "fee" before paying out a loan are scammers. Registered lenders deduct costs from the loan.' },
    { id: 'online', title: 'Online Fraud', body: 'Fake online shops, fake prize draws and fake sellers. Pay only through protected methods, and be wary of prices far below market.' },
    { id: 'phishing', title: 'Phishing', body: 'Messages with urgent links asking you to "verify" an account. Do not tap the link. Open the official app or type the address yourself.' }
  ];
  const HUSTLES = [
    { id: 'h1', name: 'Phone and laptop repair', desc: 'Fix screens, install software, clean devices.', tags: ['Computer literacy', 'Mechanical', 'Coding', 'Technology'], cost: 'R200 - R800' },
    { id: 'h2', name: 'Social media content for small shops', desc: 'Make posts and WhatsApp catalogues for local businesses.', tags: ['Design', 'Writing', 'Communication', 'Creative', 'Technology'], cost: 'R0 - R200' },
    { id: 'h3', name: 'Home baking and catering', desc: 'Sell baked goods and lunch packs to offices and events.', tags: ['Cooking', 'Sales', 'Hospitality', 'Retail'], cost: 'R300 - R1,000' },
    { id: 'h4', name: 'Tutoring and homework club', desc: 'Help learners with maths, English and study skills.', tags: ['Teaching', 'Communication', 'Education'], cost: 'R0 - R100' },
    { id: 'h5', name: 'Sewing and alterations', desc: 'Alterations, school uniforms and custom clothing.', tags: ['Sewing', 'Design', 'Retail', 'Creative'], cost: 'R500 - R2,000' },
    { id: 'h6', name: 'Vegetable garden and fresh produce', desc: 'Grow and sell vegetables to neighbours and spaza shops.', tags: ['Agriculture', 'Sales'], cost: 'R200 - R800' },
    { id: 'h7', name: 'Admin and typing services', desc: 'CVs, forms, documents and basic bookkeeping for others.', tags: ['Admin', 'Computer literacy', 'Writing', 'Finance'], cost: 'R0 - R200' }
  ];
  const BIZ_Q = [['idea', 'Idea strength', 'How clear and different is your business idea?'], ['customer', 'Customer understanding', 'Do you know exactly who will pay and why?'], ['pricing', 'Pricing', 'Do you know your costs and a price that gives profit?'], ['marketing', 'Marketing', 'Do you have a way to reach your first 10 customers?'], ['competition', 'Competition', 'Do you know who else sells this and how you compare?']];
  const FUND = ['Business idea written in one paragraph', 'Simple budget of start-up costs', 'Proof of customers or demand (messages, orders)', 'ID and proof of address ready', 'Business bank account or savings plan'];
  const MARKETS = [['Community markets', 'Local township markets, church and school fairs, taxi-rank stalls.'], ['Online marketplaces', 'Facebook Marketplace, WhatsApp Business catalogues, local classifieds.'], ['Business networks', 'Local business forums and youth entrepreneur groups.'], ['Small-business programmes', 'Check the websites of SEDA and the NYDA for training and funding support.']];
  const KEYWORDS = [
    [/captain|soccer|netball|sport|coach|team|football|cricket/i, ['Leadership', 'Conflict Resolution', 'Team Coordination', 'Planning']],
    [/shop|spaza|sell|vendor|hustle|hair|stall|market/i, ['Customer Service', 'Sales', 'Cash Handling', 'Negotiation']],
    [/church|choir|volunteer|community|youth group|charity/i, ['Event Planning', 'Communication', 'Reliability', 'Community Engagement']],
    [/tutor|teach|homework|lesson/i, ['Communication', 'Patience', 'Subject Knowledge', 'Mentoring']],
    [/mechanic|fix|repair|engine|plumb|electric|weld/i, ['Technical Troubleshooting', 'Safety Awareness', 'Tool Proficiency', 'Problem Solving']],
    [/babysit|care|nanny|elder|nurse/i, ['Responsibility', 'Time Management', 'Empathy', 'Safety Awareness']],
    [/computer|phone|website|social media|code|design/i, ['Digital Literacy', 'Problem Solving', 'Self-learning', 'Creativity']]
  ];

  const initials = n => String(n || '?').split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();
  const head = (title, sub) => `<header class="top"><div><h1>${e(title)}</h1>${sub ? `<p class="muted">${e(sub)}</p>` : ''}</div></header>`;
  const chips = (g, opts, sel, act = 'chip') => `<div class="chips" role="group">${opts.map(o => `<button type="button" class="chip${sel.includes(o) ? ' on' : ''}" data-click="${act}" data-g="${g}" data-v="${e(o)}" aria-pressed="${sel.includes(o)}">${e(o)}</button>`).join('')}</div>`;
  const opts = (list, cur) => list.map(o => `<option${o === cur ? ' selected' : ''}>${e(o)}</option>`).join('');
  const langSel = cur => `<label class="fld"><span>${t('language')}</span><select data-change="lang">${Object.entries(I18N.names).map(([k, v]) => `<option value="${k}"${k === cur ? ' selected' : ''}>${e(v)}</option>`).join('')}</select></label>`;
  function ring(p) {
    const c = 2 * Math.PI * 52;
    return `<svg class="ring" viewBox="0 0 120 120" role="img" aria-label="${p}%"><circle cx="60" cy="60" r="52" class="rt"/><circle cx="60" cy="60" r="52" class="rf" stroke-dasharray="${(c * p / 100).toFixed(1)} ${c.toFixed(1)}" transform="rotate(-90 60 60)"/><text x="60" y="68" text-anchor="middle" class="rn">${p}%</text></svg>`;
  }
  const bar = (label, p, cls = '') => `<div class="bar"><div class="bl"><span>${e(label)}</span><b>${p}%</b></div><div class="bt" role="progressbar" aria-label="${e(label)}" aria-valuenow="${p}" aria-valuemin="0" aria-valuemax="100"><i class="${cls}" style="width:${p}%"></i></div></div>`;
  const rand = n => 'R' + Number(n || 0).toLocaleString('en-ZA');

  function welcome() {
    const jobs = data.jobs.slice(0, 3), mentors = data.mentors.slice(0, 3);
    return `<div class="welcome-page">
      <header class="welcome-nav">
        <a class="welcome-logo" href="#/welcome" aria-label="RisePath home">Rise<b>Path</b></a>
        <nav class="welcome-links" aria-label="Explore RisePath"><a href="#/jobs">${t('jobs')}</a><a href="#/mentors">${t('mentors')}</a><a href="#/passport">${t('passport')}</a></nav>
        <div class="welcome-nav-actions">${langSel(S().settings.lang)}<a class="btn sec sm" href="#/onboard">Get started</a><button class="btn sm" data-click="demo">Try the demo</button></div>
      </header>
      <section class="welcome-hero" aria-labelledby="welcome-title">
        <img class="welcome-photo" src="assets/images/student-collaboration.jpg" alt="South African students working together around a laptop">
        <div class="welcome-hero-copy"><p class="welcome-kicker">Built for young South Africans</p><h1 id="welcome-title">Turn your skills into a path forward.</h1><p class="welcome-lead">Find work and learnerships, grow a record of what you can do, and get guidance for your next move.</p><div class="welcome-hero-actions"><a class="btn welcome-primary" href="#/onboard">Build your profile</a><a class="welcome-text-link" href="#/jobs">Explore opportunities <span aria-hidden="true">&rarr;</span></a></div></div>
        <p class="welcome-image-credit">A practical path from experience to opportunity</p>
      </section>
      <section class="welcome-section welcome-paths" aria-labelledby="paths-title"><div class="welcome-section-head"><p class="welcome-kicker dark">A platform for your next step</p><h2 id="paths-title">Make progress that adds up.</h2></div><div class="welcome-feature-grid">
        <a class="welcome-feature" href="#/jobs"><span class="feature-index">01</span><h3>Find opportunities</h3><p>Explore entry-level jobs, internships, learnerships and community experience across South Africa.</p><span class="feature-link">Browse opportunities <span aria-hidden="true">&rarr;</span></span></a>
        <a class="welcome-feature" href="#/passport"><span class="feature-index">02</span><h3>Show what you can do</h3><p>Bring together skills, certificates and informal experience in one clear profile.</p><span class="feature-link">Build your Skill Passport <span aria-hidden="true">&rarr;</span></span></a>
        <a class="welcome-feature" href="#/mentors"><span class="feature-index">03</span><h3>Get guidance</h3><p>Learn from people who can help you prepare for work, study and small business.</p><span class="feature-link">Meet the mentors <span aria-hidden="true">&rarr;</span></span></a>
      </div></section>
      <section class="welcome-opportunities" aria-labelledby="opportunities-title"><div class="welcome-section welcome-opportunity-inner"><div class="welcome-section-head"><p class="welcome-kicker dark">A place to start</p><h2 id="opportunities-title">Opportunities to explore</h2><p class="muted">Sample listings are shown for demonstration. Check details with the provider before applying.</p></div><div class="welcome-job-grid">${!data.loaded ? '<p class="muted">Loading sample opportunities...</p>' : data.failed ? '<p class="muted">Sample opportunities are temporarily unavailable.</p>' : jobs.map(j => `<article class="welcome-job"><div class="welcome-job-meta"><span>${e(j.type)}</span><span>${e(j.province)}</span></div><h3>${e(j.title)}</h3><p>${e(j.org)}</p><a href="#/jobs">View opportunity <span aria-hidden="true">&rarr;</span></a></article>`).join('')}</div><a class="btn welcome-dark-link" href="#/jobs">See all opportunities</a></div></section>
      <section class="welcome-section welcome-mentors" aria-labelledby="mentors-title"><div class="welcome-mentor-copy"><p class="welcome-kicker dark">Learn from experience</p><h2 id="mentors-title">A little guidance can open a new door.</h2><p class="muted">Explore mentor profiles for career advice, portfolio feedback and practical next steps.</p><a class="btn" href="#/mentors">Explore mentors</a></div><div class="welcome-mentor-list">${!data.loaded ? '<p class="muted">Loading mentor profiles...</p>' : mentors.map(m => `<article class="welcome-mentor"><span class="mentor-initials" aria-hidden="true">${e(initials(m.name))}</span><div><h3>${e(m.name)}</h3><p>${e(m.role)} <span aria-hidden="true">&middot;</span> ${e(m.area)}</p></div></article>`).join('')}<p class="welcome-sample-note">Sample mentor profiles for demonstration.</p></div></section>
      <footer class="welcome-footer"><a class="welcome-logo" href="#/welcome">Rise<b>Path</b></a><p>Small steps. Real progress.</p><div><a href="#/jobs">${t('jobs')}</a><a href="#/mentors">${t('mentors')}</a><a href="#/onboard">Create a profile</a></div></footer>
    </div>`;
  }

  // ---------- Onboarding ----------
  function onboard(ob) {
    const dots = `<div class="dots" aria-hidden="true">${[0, 1, 2, 3].map(i => `<i class="${i <= ob.step ? 'on' : ''}"></i>`).join('')}</div>`;
    const err = ob.err ? `<div class="err" role="alert">${e(ob.err)}</div>` : '';
    let body = '';
    if (ob.step === 0) {
      body = `<p class="logo">Rise<b>Path</b></p><h1>Turn skills into income</h1><p class="muted">An income mobility platform that converts skills, informal experience, mentorship and opportunities into measurable economic progress.</p><div style="height:14px"></div>
      <label class="fld"><span>Full name</span><input data-input="obf" data-k="name" value="${e(ob.name)}" autocomplete="name" maxlength="60"></label>
      <label class="fld"><span>Email</span><input type="email" data-input="obf" data-k="email" value="${e(ob.email)}" autocomplete="email" maxlength="80"></label>
      <label class="fld"><span>Phone (optional)</span><input type="tel" data-input="obf" data-k="phone" value="${e(ob.phone)}" autocomplete="tel" placeholder="0821234567" maxlength="15"></label>
      ${langSel(ob.lang)}`;
    } else if (ob.step === 1) {
      body = `<h1>About you</h1><p class="muted">Used to match you with opportunities.</p><div style="height:12px"></div>
      <label class="fld"><span>Age</span><input type="number" inputmode="numeric" data-input="obf" data-k="age" value="${e(ob.age)}" min="15" max="35"></label>
      <label class="fld"><span>Province</span><select data-change="obf" data-k="province">${opts(PROVINCES, ob.province)}</select></label>
      <label class="fld"><span>Education level</span><select data-change="obf" data-k="education">${opts(EDU, ob.education)}</select></label>`;
    } else if (ob.step === 2) {
      body = `<h1>Skills and interests</h1><p class="muted">Pick everything that applies. Include informal skills too.</p><h2 style="margin-top:14px">Skills</h2>${chips('skills', SKILLS, ob.skills)}<h2>Interests</h2>${chips('interests', INTERESTS, ob.interests)}`;
    } else {
      body = `<h1>Your career goal</h1><p class="muted">What would you like to achieve in the next 12 months?</p><div style="height:12px"></div>
      <label class="fld"><span>Career goal</span><textarea rows="3" data-input="obf" data-k="goal" maxlength="140">${e(ob.goal)}</textarea></label>`;
    }
    const next = ob.step < 3 ? 'Continue' : 'Start using RisePath';
    return `<section>${dots}${err}${body}
      <div class="stack"><button class="btn full" data-click="obNext">${next}</button>
      ${ob.step > 0 ? '<button class="btn sec full" data-click="obBack">Back</button>' : '<button class="btn sec full" data-click="demo">Try the demo as Sarah</button>'}</div></section>`;
  }

  // ---------- Home ----------
  function home() {
    const s = S(), sc = Scoring.compute(s), recs = Scoring.recs(s).slice(0, 4);
    return `<header class="top"><div><p class="muted">${t('welcome')},</p><h1>${e(s.profile.name.split(' ')[0])}</h1></div><a class="avatar" href="#/profile" aria-label="${t('profile')}">${e(initials(s.profile.name))}</a></header>
    <div class="home-grid"><div class="home-main">
    <section class="card hero" aria-labelledby="sc"><div class="heroflex">${ring(sc.total)}<div><h2 id="sc">${t('score')}&trade;</h2><p class="muted">Work 70% + Money 15% + Business 15%</p></div></div>
      ${bar(t('work'), sc.work)}${bar(t('moneyc'), sc.money, 'g')}${bar(t('biz'), sc.biz, 'y')}</section>
    <section class="card"><h2>${t('next')}</h2>${recs.length ? recs.map(r => `<a class="rec" href="#/${r.route}"><span>${e(r.text)}</span><span class="pts">${e(r.pts)}</span></a>`).join('') : '<p class="muted">You have completed every action. Great work.</p>'}</section>
    </div><aside class="home-aside" aria-label="Progress summary and shortcuts"><div class="grid2" style="margin-bottom:14px">
      <div class="stat"><b>${s.applied.length}</b><span class="muted">Applications</span></div>
      <div class="stat"><b>${s.passport.filter(p => p.verified).length}</b><span class="muted">Verified skills</span></div>
      <div class="stat"><b>${s.mentors.length}</b><span class="muted">Mentor sessions</span></div>
      <div class="stat"><b>${s.lessons.length}</b><span class="muted">Lessons done</span></div></div>
    <div class="grid2"><a class="btn sec" href="#/passport">${t('passport')}</a><a class="btn sec" href="#/experience">${t('exp')}</a></div></aside></div>`;
  }

  // ---------- Opportunities ----------
  function filtered() {
    const f = ui.f, q = f.q.toLowerCase();
    return data.jobs.filter(j => (f.type === 'all' || j.type === f.type) && (f.province === 'all' || j.province === f.province) && (f.industry === 'all' || j.industry === f.industry) && (!f.remote || j.remote) && (f.level === 'all' || j.level === f.level) && (!q || (j.title + ' ' + j.org + ' ' + j.industry).toLowerCase().includes(q)));
  }
  function jobChips() { return `<div class="seg">${['all', ...TYPES].map(x => `<button class="chip${ui.f.type === x ? ' on' : ''}" data-click="jobType" data-v="${x}" aria-pressed="${ui.f.type === x}">${x === 'all' ? 'All' : x}</button>`).join('')}</div>`; }
  function jobList() {
    if (!data.loaded) return '<p class="muted">Loading opportunities...</p>';
    if (data.failed) return '<div class="err">Could not load opportunities. Connect once to download them for offline use.</div>';
    const s = S(), list = filtered();
    if (!list.length) return '<p class="muted">No matches. Try changing your filters.</p>';
    return list.map(j => `<article class="card"><div class="row"><h3>${e(j.title)}</h3><span class="tag">${e(j.type)}</span></div><p class="muted">${e(j.org)} &middot; ${e(j.province)}${j.remote ? ' &middot; Remote' : ''}</p><p>${e(j.note)}</p><div class="row"><span class="tag">${e(j.industry)}</span>
      <span><button class="btn sec sm" data-click="saveJob" data-id="${e(j.id)}">${s.saved.includes(j.id) ? t('saved') : t('save')}</button> <button class="btn sm" data-click="apply" data-id="${e(j.id)}"${s.applied.includes(j.id) ? ' disabled' : ''}>${s.applied.includes(j.id) ? t('applied') : t('apply')}</button></span></div></article>`).join('');
  }
  function jobs() {
    const inds = [...new Set(data.jobs.map(j => j.industry))].sort();
    return `${head(t('jobs'), 'Jobs, learnerships, internships and volunteering. Sample listings.')}
    <label class="fld"><span class="muted">Search</span><input type="search" data-input="jobf" data-k="q" value="${e(ui.f.q)}" maxlength="60" placeholder="e.g. IT, retail, remote"></label>
    <div id="jobchips">${jobChips()}</div>
    <div class="grid2"><label class="fld"><span>Province</span><select data-change="jobf" data-k="province"><option value="all">All</option>${opts(PROVINCES, ui.f.province)}</select></label>
    <label class="fld"><span>Industry</span><select data-change="jobf" data-k="industry"><option value="all">All</option>${opts(inds, ui.f.industry)}</select></label></div>
    <div class="grid2"><label class="fld"><span>Experience</span><select data-change="jobf" data-k="level"><option value="all">Any</option>${opts(['None', 'Some experience'], ui.f.level)}</select></label>
    <label class="fld"><span>Remote</span><label><input type="checkbox" data-change="jobf" data-k="remote"${ui.f.remote ? ' checked' : ''}> Remote only</label></label></div>
    <div id="joblist">${jobList()}</div>`;
  }

  // ---------- Skill Passport ----------
  function passport() {
    const s = S(), v = s.passport.filter(p => p.verified).length;
    const mh = s.mentors.map(id => data.mentors.find(m => m.id === id)).filter(Boolean);
    return `${head(t('passport'), 'Your verified profile: skills, volunteering, leadership and mentorship.')}
    <section class="card"><div class="row"><div><b class="sum">${v} verified</b><p class="muted">${s.passport.length} entries in total</p></div>
      <button class="btn sm${s.cv ? ' sec' : ''}" data-click="cv">${s.cv ? 'CV ready' : 'Generate my CV'}</button></div></section>
    <section class="card"><h2>Add to your passport</h2>${ui.passErr ? `<div class="err" role="alert">${e(ui.passErr)}</div>` : ''}
    <form data-form="addPass" class="stack"><label class="fld"><span>Type</span><select name="type">${opts(PASS_TYPES, '')}</select></label>
      <label class="fld"><span>Title</span><input name="title" maxlength="80" required placeholder="e.g. Mechanical Level 2 certificate"></label>
      <label class="fld"><span>Evidence (PDF, JPG or PNG, max 2 MB)</span><input type="file" name="file" accept=".pdf,.jpg,.jpeg,.png"></label>
      <p class="muted">Demo: uploading evidence marks an entry verified. In production, an issuer or mentor would confirm it.</p>
      <button class="btn full">Add entry</button></form></section>
    <section><h2>Your entries</h2>${s.passport.length ? s.passport.map(p => `<article class="card"><div class="row"><h3>${e(p.title)}</h3>${p.verified ? '<span class="tag ok">Verified</span>' : '<span class="tag warn">Unverified</span>'}</div><p class="muted">${e(p.type)}${p.file ? ' &middot; ' + e(p.file) : ''}</p>${(p.skills || []).map(k => `<span class="tag">${e(k)}</span>`).join('')}</article>`).join('') : '<p class="muted">Nothing here yet.</p>'}</section>
    <section><h2>Mentorship history</h2>${mh.length ? mh.map(m => `<article class="card"><h3>${e(m.name)}</h3><p class="muted">${e(m.role)}</p></article>`).join('') : '<p class="muted">Connect with a mentor to build this.</p>'}</section>`;
  }

  // ---------- Experience Builder ----------
  function translate(text) {
    for (const [re, skills] of KEYWORDS) if (re.test(text)) return skills;
    return ['Initiative', 'Responsibility', 'Communication', 'Time Management'];
  }
  function experience() {
    const r = ui.expResult;
    return `${head(t('exp'), 'Turn informal experience into skills employers recognise.')}
    <form data-form="expRun" class="card"><label class="fld"><span>What have you done?</span><input name="text" maxlength="80" required placeholder="e.g. Captain of soccer team"></label><button class="btn full">Translate to skills</button></form>
    ${r ? `<section class="card"><h2>${e(r.text)}</h2><p class="muted">Translated skills</p>${r.skills.map(k => `<span class="tag ok">${e(k)}</span>`).join('')}<div style="height:12px"></div><button class="btn full" data-click="expAdd">Add to my Skill Passport</button></section>` : ''}
    <p class="muted">Demo uses keyword rules. A production version would use a language model with human review.</p>
    ${S().experiences.length ? `<h2>Saved</h2>${S().experiences.map(x => `<article class="card"><h3>${e(x.text)}</h3>${x.skills.map(k => `<span class="tag">${e(k)}</span>`).join('')}</article>`).join('')}` : ''}`;
  }

  // ---------- Mentors ----------
  function mentors() {
    const s = S(), cats = ['all', 'Industry', 'Career Coach', 'Student', 'Entrepreneur'];
    const list = data.mentors.filter(m => ui.mcat === 'all' || m.cat === ui.mcat);
    const first = data.mentors.find(m => m.id === s.mentors[0]);
    return `${head(t('mentors'), 'Sample mentor profiles.')}
    <div class="seg">${cats.map(c => `<button class="chip${ui.mcat === c ? ' on' : ''}" data-click="mcat" data-v="${c}" aria-pressed="${ui.mcat === c}">${c === 'all' ? 'All' : c}</button>`).join('')}</div>
    ${list.map(m => `<article class="card"><div class="row"><h3>${e(m.name)}</h3><span class="tag">${e(m.cat)}</span></div><p class="muted">${e(m.role)} &middot; ${e(m.area)}</p><p>${e(m.bio)}</p><button class="btn sm" data-click="mentorReq" data-id="${e(m.id)}"${s.mentors.includes(m.id) ? ' disabled' : ''}>${s.mentors.includes(m.id) ? t('requested') : t('request')}</button></article>`).join('')}
    ${first ? `<section class="card"><h2>Chat with ${e(first.name)}</h2><div class="bubble them">Hi ${e(s.profile.name.split(' ')[0])}! What would you like to work on first?</div><div class="bubble me">My CV and interview practice.</div><p class="muted">Chat mockup for demonstration.</p>${bar('Mentorship progress (sessions)', Math.min(100, s.mentors.length * 34))}</section>` : ''}`;
  }

  // ---------- Money ----------
  function budgetSummary() {
    const b = S().budget, spent = BUDGET_CATS.reduce((a, c) => a + Number(b.items[c] || 0), 0), left = Number(b.income || 0) - spent;
    const pct = b.income > 0 ? Math.min(100, Math.round(spent / b.income * 100)) : 0;
    return `<p class="sum">${rand(left)} left</p><p class="muted">${rand(spent)} planned of ${rand(b.income)}</p>${bar('Budget used', pct, left < 0 ? 'y' : '')}${left < 0 ? '<div class="err">You have planned more than your income. Try reducing a category.</div>' : ''}`;
  }
  function moneyTab() {
    const s = S();
    if (ui.money === 'budget') return `<section class="card"><h2>Budget planner</h2><label class="fld"><span>Monthly income (Rand)</span><input type="number" inputmode="numeric" min="0" max="1000000" data-input="budget" data-k="income" value="${s.budget.income || ''}"></label>
      ${BUDGET_CATS.map(c => `<label class="fld"><span style="text-transform:capitalize">${c}</span><input type="number" inputmode="numeric" min="0" max="1000000" data-input="budget" data-k="${c}" value="${s.budget.items[c] || ''}"></label>`).join('')}<div id="bsum">${budgetSummary()}</div></section>`;
    if (ui.money === 'goals') return `<section class="card"><h2>New savings goal</h2><form data-form="addGoal" class="stack"><label class="fld"><span>Goal</span><select name="name">${opts(GOAL_PRESETS, '')}</select></label><label class="fld"><span>Target (Rand)</span><input type="number" name="target" min="1" max="1000000" required></label><button class="btn full">Create goal</button></form></section>
      ${s.goals.map((g, i) => `<article class="card"><div class="row"><h3>${e(g.name)}</h3><b>${rand(g.saved)} / ${rand(g.target)}</b></div>${bar('Progress', Math.min(100, Math.round(g.saved / g.target * 100)), 'g')}<button class="btn sec sm" data-click="goalAdd" data-i="${i}">Add R50</button></article>`).join('')}`;
    if (ui.money === 'learn') return LESSONS.map(l => `<article class="card"><h3>${l.title}</h3><p>${e(l.body)}</p><button class="btn sm${s.lessons.includes(l.id) ? ' sec' : ''}" data-click="lesson" data-id="${l.id}">${s.lessons.includes(l.id) ? 'Completed' : 'Mark complete'}</button></article>`).join('');
    return `<p class="muted">Know the signs before you lose money.</p>` + SCAMS.map(l => `<article class="card"><h3>${l.title}</h3><p>${e(l.body)}</p><button class="btn sm${s.scamsDone.includes(l.id) ? ' sec' : ''}" data-click="scam" data-id="${l.id}">${s.scamsDone.includes(l.id) ? 'Reviewed' : 'I understand'}</button></article>`).join('');
  }
  function money() {
    const tabs = [['budget', 'Budget'], ['goals', 'Savings'], ['learn', 'Learn'], ['scams', 'Scam alerts']];
    return `${head(t('money'))}<div class="seg"><button class="chip on" aria-pressed="true">${t('money')}</button><a class="chip" href="#/business" style="text-decoration:none;color:inherit">${t('business')}</a></div>
    <div class="seg">${tabs.map(([k, l]) => `<button class="chip${ui.money === k ? ' on' : ''}" data-click="mtab" data-v="${k}" aria-pressed="${ui.money === k}">${l}</button>`).join('')}</div>${moneyTab()}`;
  }

  // ---------- Business ----------
  function bizScore(a) { return Math.round(BIZ_Q.reduce((x, [k]) => x + Number(a[k] || 3), 0) / 25 * 100); }
  function bizTab() {
    const s = S(), p = s.profile;
    if (ui.biz === 'hustle') {
      const mine = [...p.skills, ...p.interests];
      const ranked = HUSTLES.map(h => ({ h, n: h.tags.filter(x => mine.includes(x)).length })).sort((a, b) => b.n - a.n).slice(0, 4);
      return `<p class="muted">Matched to your skills and interests in ${e(p.province)}.</p>` + ranked.map(({ h, n }) => `<article class="card"><div class="row"><h3>${e(h.name)}</h3><span class="tag ok">${n} match${n === 1 ? '' : 'es'}</span></div><p>${e(h.desc)}</p><p class="muted">Start-up cost: ${e(h.cost)}</p><button class="btn sm${s.hustles.includes(h.id) ? ' sec' : ''}" data-click="hustle" data-id="${h.id}">${s.hustles.includes(h.id) ? t('saved') : t('save')}</button></article>`).join('');
    }
    if (ui.biz === 'ready') {
      const a = s.bizAnswers || {};
      return `<section class="card"><h2>Business readiness</h2>${BIZ_Q.map(([k, l, d]) => `<label class="fld"><span>${l}: <b id="v_${k}">${a[k] || 3}</b>/5</span><input type="range" min="1" max="5" value="${a[k] || 3}" data-input="biz" data-k="${k}" aria-label="${e(l)}"><span class="muted">${e(d)}</span></label>`).join('')}
      <div id="bscore">${bar('Readiness score', bizScore(a))}</div><button class="btn full" data-click="bizSave">${s.bizAnswers ? 'Update assessment' : 'Save assessment'}</button></section>`;
    }
    if (ui.biz === 'funding') {
      const hs = s.hustles.map(id => HUSTLES.find(h => h.id === id)).filter(Boolean);
      const idea = hs.length ? hs.map(h => h.name).join(' and ') : 'a small business idea (save one in Side hustles)';
      const pitch = `${p.name} (${p.province}) is starting ${idea}. Skills: ${p.skills.join(', ') || 'to be added'}. Goal: ${p.goal || 'to grow income'}.${s.bizAnswers ? ' Readiness score: ' + bizScore(s.bizAnswers) + '%.' : ''}`;
      return `<section class="card"><h2>Funding checklist</h2>${FUND.map((f, i) => `<label class="rec" style="cursor:pointer"><span>${e(f)}</span><input type="checkbox" data-change="bizCheck" data-i="${i}"${s.bizChecks.includes(i) ? ' checked' : ''} aria-label="${e(f)}"></label>`).join('')}</section>
      <section class="card"><h2>Pitch summary</h2><p>${e(pitch)}</p><p class="muted">Edit and expand before sharing with a funder.</p></section>`;
    }
    return MARKETS.map(([a, b]) => `<article class="card"><h3>${e(a)}</h3><p>${e(b)}</p></article>`).join('');
  }
  function business() {
    const tabs = [['hustle', 'Side hustles'], ['ready', 'Readiness'], ['funding', 'Funding'], ['market', 'Markets']];
    return `${head(t('business'))}<div class="seg"><a class="chip" href="#/money" style="text-decoration:none;color:inherit">${t('money')}</a><button class="chip on" aria-pressed="true">${t('business')}</button></div>
    <div class="seg">${tabs.map(([k, l]) => `<button class="chip${ui.biz === k ? ' on' : ''}" data-click="btab" data-v="${k}" aria-pressed="${ui.biz === k}">${l}</button>`).join('')}</div>${bizTab()}`;
  }

  // ---------- Profile ----------
  function profile() {
    const s = S(), p = s.profile, sc = Scoring.compute(s);
    return `<header class="top"><div><h1>${e(p.name)}</h1><p class="muted">${e(p.education)} &middot; ${e(p.province)}</p></div><span class="avatar">${e(initials(p.name))}</span></header>
    <section class="card"><p>${e(p.goal || '')}</p>${p.skills.map(k => `<span class="tag">${e(k)}</span>`).join('')}</section>
    <div class="grid2" style="margin-bottom:14px"><a class="btn sec" href="#/passport">${t('passport')}</a><a class="btn sec" href="#/experience">${t('exp')}</a></div>
    <section class="card"><h2>Settings</h2>${langSel(s.settings.lang)}
      <label class="rec" style="cursor:pointer"><span><b>${t('lowdata')}</b><br><span class="muted">${t('lowdata_d')}</span></span><input type="checkbox" data-change="lowData"${s.settings.lowData ? ' checked' : ''} aria-label="${t('lowdata')}"></label>
      <div id="installBox" hidden style="margin-top:10px"><button class="btn full" data-click="install">Install RisePath on this device</button></div></section>
    <section class="card"><h2>How your ${sc.total}% is built</h2>${sc.items.map(i => `<div class="bl"><span>${e(i.label)}</span><b>${i.earned}/${i.max}</b></div>`).join('')}<p class="muted">Work counts 70%, Money 15%, Business 15%.</p></section>
    <button class="btn sec full" data-click="reset">Reset all my data</button>`;
  }

  return { welcome, onboard, home, jobs, passport, experience, mentors, money, business, profile, data, ui, jobList, jobChips, budgetSummary, bizScore, bar, translate, PROVINCES, EDU, SKILLS, INTERESTS };
})();
