
(function () {
  const DATA = window.TIDE_DATA || { club: {}, domains: [] };
  const app = document.getElementById('app');

  const APPLY_LINK_DEFAULT = 'https://tideclub26.feishu.cn/share/base/form/shrcnYVMC76jFL0oD5ChfRJbBff';
  const APPLY_LINK_YUHONG = 'https://tideclub26.feishu.cn/share/base/form/shrcnlmjpcnAIq55M84kT2YtrTe';
  const PROJECT_PORTAL_LINK = 'https://tideclub26.aiforce.cloud/app/app_4k70fuutr5nxe';
  const DEADLINE = new Date('2026-06-14T12:00:00+08:00').getTime();

  const guideSteps = [
    {
      title: '初步想法 · 寻伴',
      description: '如果你有一个初步想法，希望通过 TIDE 寻找志趣相投的伙伴，请填写这份问卷。运营团队将与你联系，协助你找到合适的同学。',
      link: 'https://tideclub26.feishu.cn/share/base/form/shrcn7qEHYRwqSsBOmefwyEpRJb',
      buttonText: '初步想法寻伴报名表'
    },
    {
      title: '成熟想法 · 立项',
      description: '如果你已有成熟想法，并希望在 TIDE 正式立项，请填写这份问卷。运营团队将与你联系，协助你组建项目团队。',
      link: 'https://tideclub26.feishu.cn/share/base/form/shrcnpx1p2COaAHvGWCPaSXgxb4',
      buttonText: '立项申请表'
    },
    {
      title: '加入已有项目',
      description: '如果你想加入已有的 TIDE 项目，请查阅下方各招募中项目的介绍，并在意向项目页面中填写问卷报名。项目管理团队将组织面试，并决定是否录取。',
      link: '#/projects',
      buttonText: '浏览招募项目'
    },
    {
      title: '学习小组',
      description: '学习小组是一种以同学们为主体的共同学习机制，提供自学支持、同伴交流、工具入门、主题探索与成果沉淀。TIDE 为各小组提供平台、资料、工具与流程支持。',
      link: PROJECT_PORTAL_LINK,
      buttonText: '前往学习小组'
    }
  ];

  function esc(value) {
    return String(value ?? '')
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#039;');
  }

  function paragraphs(text) {
    return String(text || '')
      .split(/\n+/)
      .map(s => s.trim())
      .filter(Boolean)
      .map(s => `<p>${esc(s)}</p>`)
      .join('');
  }

  function btn(href, label, variant = 'primary', extra = '') {
    const external = /^https?:\/\//.test(href);
    const target = external ? ' target="_blank" rel="noopener noreferrer"' : '';
    return `<a class="btn btn-${variant} ${extra}" href="${esc(href)}"${target}>${esc(label)} <span aria-hidden="true">→</span></a>`;
  }

  function list(items) {
    if (!items || !items.length) return '';
    return `<ul class="clean">${items.map(item => `<li><span>${esc(item)}</span></li>`).join('')}</ul>`;
  }

  function getAllProjects() {
    return (DATA.domains || []).flatMap(domain => (domain.projects || []).map(project => ({ ...project, domain })));
  }

  function findProject(projectId) {
    return getAllProjects().find(project => project.id === projectId);
  }

  function findSubProject(projectId, subId) {
    const project = findProject(projectId);
    if (!project || !project.subProjects) return null;
    const sub = project.subProjects.find(item => item.id === subId);
    return sub ? { ...sub, parent: project } : null;
  }

  function applyLink(project) {
    return project && project.id === 'yuhong-agent-main' ? APPLY_LINK_YUHONG : APPLY_LINK_DEFAULT;
  }

  function statusBadge(progress) {
    const text = progress || '进行中';
    const cls = /招募中|开放|进行/.test(text) ? 'success' : /截止|结束/.test(text) ? 'warning' : 'primary';
    return `<span class="badge ${cls}">${esc(text)}</span>`;
  }

  function renderCountdown() {
    const left = DEADLINE - Date.now();
    if (left <= 0) return `<div class="countdown">⏱ 部分项目报名已截止</div>`;
    const d = Math.floor(left / 86400000);
    const h = Math.floor((left % 86400000) / 3600000);
    const m = Math.floor((left % 3600000) / 60000);
    return `<div class="countdown">⏱ 距离项目截止报名还剩：${d} 天 ${h} 时 ${m} 分</div>`;
  }

  function projectCard(project, showDomain = true) {
    const domainName = project.domain?.name || '';
    const textForSearch = [project.name, project.description, domainName, project.partner, project.leader].join(' ').toLowerCase();
    return `<article class="card card-pad project-card" data-project-card data-domain="${esc(project.domain?.id || '')}" data-search="${esc(textForSearch)}">
      <div>
        <div class="pill-row" style="margin-bottom:14px;">
          ${showDomain ? `<span class="badge primary">${esc(domainName)}</span>` : ''}
          ${statusBadge(project.progress)}
        </div>
        <h3>${esc(project.name)}</h3>
        <p class="muted small" style="margin-top:12px;">${esc(project.description || '').slice(0, 168)}${(project.description || '').length > 168 ? '...' : ''}</p>
      </div>
      <div class="project-meta">
        <span>📅 <b>${esc(project.period || '待定')}</b></span>
        <span>👥 ${esc(project.members || '待定')}</span>
        <span>🤝 ${esc(project.partner || 'TIDE Club')}</span>
      </div>
      <div class="pill-row">
        ${btn(`#/projects/${project.id}`, '查看详情', 'primary', 'btn-sm')}
      </div>
    </article>`;
  }

  function renderHome() {
    const club = DATA.club || {};
    const missions = club.missions || [];
    const domains = DATA.domains || [];
    const projects = getAllProjects();

    return `<div class="fade-in">
      <section class="hero">
        <div class="hero-bg"></div>
        <div class="container hero-inner">
          <div class="hero-copy">
            <span class="eyebrow">青年学生实践平台</span>
            <h1>${esc(club.name || 'TIDE Club')}</h1>
            <p class="hero-slogan">${esc(club.slogan || 'Technology and Innovation in Digital Era')}</p>
            <div class="hero-description">${paragraphs(club.description)}</div>
          </div>
          <aside class="hero-panel">
            <h2>TIDE 俱乐部行动纲领</h2>
            <div class="mission-mini-grid">
              ${missions.map((mission, index) => {
                const parts = String(mission).split('：');
                const title = parts.shift() || mission;
                const description = parts.join('：');
                return `<div class="mission-mini"><span class="icon-bubble">${index + 1}</span><div><h3>${esc(title)}</h3>${description ? `<p class="muted small">${esc(description)}</p>` : ''}</div></div>`;
              }).join('')}
            </div>
          </aside>
        </div>
      </section>

      <section class="section" style="background:#fff;">
        <div class="container">
          <div class="section-header">
            <span class="eyebrow">Join TIDE</span>
            <h2>加入我们</h2>
            <p class="lead">无论你是对正在招募的项目感兴趣想加入到项目团队中一起共同协作，还是已有一个比较成熟的idea想自己组建团队合作互助，亦或是从一个初步的想法开始寻找伙伴共同对一个话题钻研探索，TIDE 欢迎所有怀揣这些想法和热情的同学通过申请问卷进行投递报名并加入我们。</p>
          </div>
          <div class="guide-list">
            ${guideSteps.map((step, index) => `<article class="card guide-card">
              <span class="step-num">${index + 1}</span>
              <div><h3>${esc(step.title)}</h3><p class="muted small" style="margin-top:8px;">${esc(step.description)}</p></div>
              ${btn(step.link, step.buttonText, 'primary', 'btn-sm')}
            </article>`).join('')}
          </div>
          <p style="text-align:center;margin-top:28px;font-weight:800;">TIDE Club 欢迎你的加入！</p>
        </div>
      </section>

      <section class="section">
        <div class="container">
          <div class="section-header">
            <span class="eyebrow">Project-based Practice</span>
            <h2>项目招募中</h2>
            ${renderCountdown()}
          </div>
          <div class="grid grid-3 home-project-grid">
            ${projects.map(project => projectCard(project)).join('')}
          </div>
          <div style="text-align:center;margin-top:28px;">${btn('#/projects', '查看全部项目', 'secondary')}</div>
        </div>
      </section>
    </div>`;
  }

  function renderProjectsPage() {
    const projects = getAllProjects();
    const domains = DATA.domains || [];
    return `<div class="fade-in">
      <section class="section-tight">
        <div class="container">
          <div class="breadcrumb"><a href="#/">首页</a><span>/</span><span>项目列表</span></div>
          <div class="page-title">
            <span class="eyebrow">Projects</span>
            <h1 style="font-size:clamp(34px,4vw,52px);">TIDE 项目列表</h1>
            <p class="lead" style="margin-top:14px;">查找正在展示和招募的项目，进入项目详情页查看岗位、目标、产出与报名入口。</p>
          </div>
          <div class="card search-panel">
            <input class="search-input" id="project-search" type="search" placeholder="搜索项目、合作方、负责人或关键词..." />
            <div class="filter-row" id="domain-filters">
              <button class="filter-btn active" data-domain-filter="all">全部方向</button>
              ${domains.map(domain => `<button class="filter-btn" data-domain-filter="${esc(domain.id)}">${esc(domain.name)}</button>`).join('')}
            </div>
          </div>
          <div class="grid grid-3" id="project-grid">${projects.map(project => projectCard(project)).join('')}</div>
          <div class="empty-state no-results" id="no-results"><h2>没有找到匹配项目</h2><p class="muted">可以换一个关键词，或切换到“全部方向”。</p></div>
        </div>
      </section>
    </div>`;
  }

  function metaBox(label, value) {
    if (!value) return '';
    return `<div class="meta-box"><div class="meta-label">${esc(label)}</div><div class="meta-value">${esc(value)}</div></div>`;
  }

  function renderObjectives(items) {
    if (!items || !items.length) return '';
    return `<section class="section-tight"><div class="container"><div class="section-header"><h2>核心目标</h2></div><div class="grid grid-2">${items.map((item, index) => `<article class="card objective-card"><span class="number">${index + 1}</span><h3>${esc(item.title || `目标 ${index + 1}`)}</h3><p class="muted small">${esc(item.content || item.description || '')}</p></article>`).join('')}</div></div></section>`;
  }

  function renderRecruitment(project) {
    const r = project.recruitment;
    if (!r) return '';
    const groups = [
      ['技能要求', r.skillRequirements],
      ['时间投入', r.timeRequirements],
      ['能力素质', r.qualityRequirements],
      ['预期收获', r.expectedGains]
    ];
    return `<section class="section-tight"><div class="container">
      <div class="section-header"><h2>开放招募岗位</h2><p class="lead">加入真实项目，积累产学研实战经验。</p></div>
      <div class="grid grid-3" style="margin-bottom:20px;">
        ${metaBox('招募人数', r.count)}
        ${metaBox('招聘岗位', r.position)}
        ${metaBox('报名通信', r.contact)}
      </div>
      ${r.positionDescription ? `<div class="card card-pad" style="margin-bottom:20px;"><p class="muted">${esc(r.positionDescription)}</p></div>` : ''}
      ${r.roles && r.roles.length ? `<div class="card card-pad" style="margin-bottom:20px;"><h3>招募角色</h3><div class="grid grid-3" style="margin-top:16px;">${r.roles.map(role => `<div class="meta-box"><div class="meta-label">${esc(role.count || '')}</div><div class="meta-value">${esc(role.name || '')}</div><p class="muted small" style="margin-top:8px;">${esc(role.description || '')}</p></div>`).join('')}</div></div>` : ''}
      <div class="recruitment-grid">
        ${groups.filter(([, items]) => items && items.length).map(([title, items]) => `<article class="card card-pad"><h3>${esc(title)}</h3><div style="margin-top:14px;">${list(items)}</div></article>`).join('')}
      </div>
      ${project.priorityConditions && project.priorityConditions.length ? `<div class="card card-pad" style="margin-top:20px;"><h3>优先条件</h3><div style="margin-top:14px;">${list(project.priorityConditions)}</div></div>` : ''}
    </div></section>`;
  }

  function renderSpecialSections(project) {
    let html = '';
    if (project.jobResponsibilities && project.jobResponsibilities.length) {
      html += `<section class="section-tight"><div class="container"><div class="section-header"><h2>工作职责</h2></div><div class="content-list">${project.jobResponsibilities.map(group => `<article class="responsibility"><h3>${esc(group.category)}</h3>${list(group.items || [])}</article>`).join('')}</div></div></section>`;
    }
    if (project.researchGroups && project.researchGroups.length) {
      html += `<section class="section-tight"><div class="container"><div class="section-header"><h2>研究分组</h2></div><div class="grid grid-2">${project.researchGroups.map(group => `<article class="card card-pad"><span class="badge primary">${esc(group.name)}</span><h3 style="margin-top:12px;">${esc(group.direction)}</h3><p class="muted small" style="margin-top:10px;">${esc(group.tasks)}</p></article>`).join('')}</div></div></section>`;
    }
    return html;
  }

  function renderSubProjects(project) {
    if (!project.subProjects || !project.subProjects.length) return '';
    return `<section class="section-tight"><div class="container"><div class="section-header"><h2>专项子项目</h2><p class="lead">按方向进入专项详情，查看更具体的任务与产出。</p></div><div class="grid grid-3">${project.subProjects.map(sub => `<article class="card card-pad project-card"><div><span class="badge primary">专项方向</span><h3 style="margin-top:12px;">${esc(sub.name)}</h3><p class="muted small" style="margin-top:10px;">${esc(sub.description || '').slice(0,150)}${(sub.description || '').length > 150 ? '...' : ''}</p></div><div class="project-meta"><span>📅 ${esc(sub.period || '')}</span><span>👥 ${esc(sub.members || '')}</span></div>${btn(`#/projects/${project.id}/sub/${sub.id}`, '查看专项详情', 'primary', 'btn-sm')}</article>`).join('')}</div></div></section>`;
  }

  function renderProjectDetail(projectId) {
    const project = findProject(projectId);
    if (!project) return renderNotFound('项目未找到', '该项目可能已被移除或不存在。');
    const externalLinks = [
      project.partnerUrl ? btn(project.partnerUrl, '合作方链接', 'secondary', 'btn-sm') : '',
      project.sribdUrl ? btn(project.sribdUrl, 'SRIBD 链接', 'secondary', 'btn-sm') : ''
    ].join('');
    return `<div class="fade-in">
      <section class="section-tight"><div class="container">
        <div class="breadcrumb"><a href="#/">首页</a><span>/</span><a href="#/projects">项目列表</a><span>/</span><span>${esc(project.name)}</span></div>
        <article class="card detail-hero">
          <div class="detail-title-row">
            <div>
              <div class="pill-row" style="margin-bottom:14px;"><span class="badge primary">${esc(project.domain?.name || '')}</span>${statusBadge(project.progress)}</div>
              <h1 style="font-size:clamp(30px,4vw,52px);">${esc(project.name)}</h1>
              <p class="lead" style="margin-top:16px;">${esc(project.description)}</p>
            </div>
            <div class="pill-row" style="flex-shrink:0;">${btn(applyLink(project), '点击报名', 'primary')}${externalLinks}</div>
          </div>
          <div class="detail-meta-grid">
            ${metaBox('项目周期', project.period)}
            ${metaBox('负责人', project.leader)}
            ${metaBox('指导老师', project.supervisor)}
            ${metaBox('项目成员', project.members)}
            ${metaBox('合作方', project.partner)}
            ${metaBox('录取方式', project.achievements)}
          </div>
          ${project.techIndicators ? `<div class="meta-box"><div class="meta-label">技术指标</div><div class="meta-value">${esc(project.techIndicators)}</div></div>` : ''}
          ${project.expectedOutcome ? `<div class="meta-box"><div class="meta-label">预期产出</div><div class="meta-value">${esc(project.expectedOutcome)}</div></div>` : ''}
        </article>
      </div></section>
      ${renderObjectives(project.coreObjectives)}
      ${renderRecruitment(project)}
      ${renderSpecialSections(project)}
      ${renderSubProjects(project)}
    </div>`;
  }

  function renderSubProjectDetail(projectId, subId) {
    const sub = findSubProject(projectId, subId);
    if (!sub) return renderNotFound('专项未找到', '该专项可能已被移除或不存在。');
    const parent = sub.parent;
    return `<div class="fade-in">
      <section class="section-tight"><div class="container">
        <div class="breadcrumb"><a href="#/">首页</a><span>/</span><a href="#/projects">项目列表</a><span>/</span><a href="#/projects/${esc(parent.id)}">${esc(parent.name)}</a><span>/</span><span>${esc(sub.name)}</span></div>
        <article class="card detail-hero">
          <div class="detail-title-row">
            <div>
              <div class="pill-row" style="margin-bottom:14px;"><span class="badge primary">专项子项目</span>${statusBadge(sub.progress || parent.progress)}</div>
              <h1 style="font-size:clamp(30px,4vw,50px);">${esc(sub.name)}</h1>
              <p class="lead" style="margin-top:16px;">${esc(sub.description)}</p>
            </div>
            <div class="pill-row" style="flex-shrink:0;">${btn(APPLY_LINK_DEFAULT, '报名申请', 'primary')}</div>
          </div>
          <div class="detail-meta-grid">
            ${metaBox('项目周期', sub.period)}
            ${metaBox('负责人', sub.leader)}
            ${metaBox('项目成员', sub.members)}
            ${metaBox('合作方', sub.partner)}
          </div>
          ${sub.techIndicators ? `<div class="meta-box"><div class="meta-label">技术指标</div><div class="meta-value">${esc(sub.techIndicators)}</div></div>` : ''}
          ${sub.expectedOutcome ? `<div class="meta-box"><div class="meta-label">预期产出</div><div class="meta-value">${esc(sub.expectedOutcome)}</div></div>` : ''}
        </article>
      </div></section>
      ${renderObjectives(sub.coreObjectives)}
      ${sub.recruitment ? renderRecruitment(sub) : ''}
    </div>`;
  }

  function renderNotFound(title = '页面未找到', desc = '你访问的页面不存在。') {
    return `<section class="section"><div class="container"><div class="empty-state card"><h1>${esc(title)}</h1><p class="muted" style="margin:14px 0 24px;">${esc(desc)}</p>${btn('#/', '返回首页', 'primary')}</div></div></section>`;
  }

  function parseRoute() {
    const raw = (window.location.hash || '#/').replace(/^#\/?/, '').replace(/^\//, '');
    const parts = raw.split('/').filter(Boolean).map(decodeURIComponent);
    if (!parts.length) return { name: 'home' };
    if (parts[0] === 'projects' && parts.length === 1) return { name: 'projects' };
    if (parts[0] === 'projects' && parts.length >= 2 && parts[2] === 'sub') return { name: 'subproject', projectId: parts[1], subId: parts[3] };
    if (parts[0] === 'projects' && parts.length >= 2) return { name: 'project', projectId: parts[1] };
    return { name: 'notfound' };
  }

  function updateNav(routeName) {
    const navKey = routeName === 'home' ? 'home' : 'projects';
    document.querySelectorAll('[data-nav]').forEach(item => {
      item.classList.toggle('active', item.dataset.nav === navKey);
    });
  }

  function initProjectFilters() {
    const input = document.getElementById('project-search');
    const filters = document.getElementById('domain-filters');
    if (!input || !filters) return;
    let activeDomain = 'all';
    const apply = () => {
      const q = input.value.trim().toLowerCase();
      let visible = 0;
      document.querySelectorAll('[data-project-card]').forEach(card => {
        const matchDomain = activeDomain === 'all' || card.dataset.domain === activeDomain;
        const matchText = !q || (card.dataset.search || '').includes(q);
        const show = matchDomain && matchText;
        card.style.display = show ? '' : 'none';
        if (show) visible++;
      });
      const noResults = document.getElementById('no-results');
      if (noResults) noResults.classList.toggle('show', visible === 0);
    };
    input.addEventListener('input', apply);
    filters.addEventListener('click', event => {
      const button = event.target.closest('[data-domain-filter]');
      if (!button) return;
      activeDomain = button.dataset.domainFilter;
      filters.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');
      apply();
    });
  }

  function render() {
    const route = parseRoute();
    let html = '';
    if (route.name === 'home') html = renderHome();
    else if (route.name === 'projects') html = renderProjectsPage();
    else if (route.name === 'project') html = renderProjectDetail(route.projectId);
    else if (route.name === 'subproject') html = renderSubProjectDetail(route.projectId, route.subId);
    else html = renderNotFound();
    app.innerHTML = html;
    updateNav(route.name);
    initProjectFilters();
    app.focus({ preventScroll: true });
    window.scrollTo({ top: 0, behavior: 'instant' in window ? 'instant' : 'auto' });
    document.querySelector('.mobile-nav')?.classList.remove('open');
    document.querySelector('.mobile-menu-button')?.setAttribute('aria-expanded', 'false');
  }

  document.querySelector('.mobile-menu-button')?.addEventListener('click', function () {
    const nav = document.querySelector('.mobile-nav');
    const open = nav.classList.toggle('open');
    this.setAttribute('aria-expanded', String(open));
    this.textContent = open ? '×' : '☰';
  });

  window.addEventListener('hashchange', render);
  render();
})();
