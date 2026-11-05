// Income Mobility Score engine: transparent, rule-based points per category.
// Overall = 70% Work Readiness + 15% Money Confidence + 15% Business Potential.
const Scoring = (() => {
  const n = (count, per, cap) => Math.min(count, cap) * per;
  // [label, max points, function(state) -> earned points]
  const RULES = {
    work: [
      ['Profile created', 10, s => (s.profile ? 10 : 0)],
      ['CV completed', 5, s => (s.cv ? 5 : 0)],
      ['Skills verified', 30, s => n(s.passport.filter(p => p.verified).length, 10, 3)],
      ['Skill Passport entries', 15, s => n(s.passport.length, 3, 5)],
      ['Informal experience translated', 15, s => n(s.experiences.length, 5, 3)],
      ['Opportunities applied to', 15, s => n(s.applied.length, 5, 3)],
      ['Mentor connected', 10, s => n(s.mentors.length, 5, 2)]
    ],
    money: [
      ['Monthly budget set', 25, s => (s.budget.income > 0 ? 25 : 0)],
      ['Savings goal created', 25, s => (s.goals.length ? 25 : 0)],
      ['Money lessons completed', 30, s => n(s.lessons.length, 10, 3)],
      ['Scam alerts reviewed', 20, s => n(s.scamsDone.length, 5, 4)]
    ],
    biz: [
      ['Readiness assessed', 30, s => (s.bizAnswers ? 30 : 0)],
      ['Funding checklist items', 40, s => n(s.bizChecks.length, 10, 4)],
      ['Side hustles saved', 30, s => n(s.hustles.length, 15, 2)]
    ]
  };

  function cat(key, s) {
    const items = RULES[key].map(([label, max, fn]) => ({ cat: key, label, max, earned: fn(s) }));
    const earned = items.reduce((a, i) => a + i.earned, 0);
    const max = items.reduce((a, i) => a + i.max, 0);
    return { items, pct: Math.round((earned / max) * 100) };
  }

  function compute(s) {
    const w = cat('work', s), m = cat('money', s), b = cat('biz', s);
    return {
      work: w.pct, money: m.pct, biz: b.pct,
      total: Math.round(w.pct * 0.7 + m.pct * 0.15 + b.pct * 0.15),
      items: [...w.items, ...m.items, ...b.items]
    };
  }

  // Next best actions: missing points, ordered by weight.
  function recs(s) {
    const r = [];
    if (!s.cv) r.push({ text: 'Complete your CV', route: 'passport', pts: '+5' });
    if (!s.applied.length) r.push({ text: 'Apply for an internship', route: 'jobs', pts: '+5' });
    if (!s.mentors.length) r.push({ text: 'Connect with a mentor', route: 'mentors', pts: '+5' });
    if (!s.experiences.length) r.push({ text: 'Translate your informal experience', route: 'experience', pts: '+5' });
    if (!s.goals.length) r.push({ text: 'Create a savings goal', route: 'money', pts: '+25 money' });
    if (s.passport.filter(p => !p.verified).length) r.push({ text: 'Upload evidence to verify a skill', route: 'passport', pts: '+10' });
    if (!s.bizAnswers) r.push({ text: 'Take the business readiness check', route: 'business', pts: '+30 biz' });
    if (s.lessons.length < 3) r.push({ text: 'Finish a money lesson', route: 'money', pts: '+10 money' });
    return r;
  }

  return { compute, recs };
})();
