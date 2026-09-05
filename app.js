/*
 * MyContentsChecker
 * A dependency-free local web app. All mutable user data lives in localStorage.
 * API order: TMDB (when configured) -> TVmaze -> cached search information.
 */

const API = {
  tmdb: 'https://api.themoviedb.org/3',
  tvmaze: 'https://api.tvmaze.com',
  fallbackImage: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=600&q=80',
};

const KEYS = {
  library: 'mcc-library', cache: 'mcc-content-cache', comments: 'mcc-comments',
  trash: 'mcc-trash', token: 'mcc-tmdb-token', demoVersion: 'mcc-demo-version',
};

const state = {
  library: read(KEYS.library, []), cache: read(KEYS.cache, {}),
  comments: read(KEYS.comments, {}), trash: read(KEYS.trash, []),
  token: localStorage.getItem(KEYS.token) || '', view: 'home', detailId: null,
  filter: 'all', libraryQuery: '', searchResults: [], searchSort: 'relevance', episodeSort: 'oldest',
};

function $(selector, root = document) { return root.querySelector(selector); }
function $all(selector, root = document) { return [...root.querySelectorAll(selector)]; }
function read(key, fallback) { try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; } }
function write(key, value) { localStorage.setItem(key, JSON.stringify(value)); }
function escapeHtml(value = '') { return String(value).replace(/[&<>'"]/g, c => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', "'":'&#39;', '"':'&quot;' }[c])); }
function stripHtml(value = '') { return String(value).replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim(); }
function contentOf(id) { return state.cache[id]; }
function libraryItem(id) { return state.library.find(item => item.id === id); }
function persist() { write(KEYS.library, state.library); write(KEYS.cache, state.cache); write(KEYS.comments, state.comments); write(KEYS.trash, state.trash); }
function episodeCount(content) { return content?.totalEpisodes || content?.episodes?.length || 0; }
function progress(item, content) { return episodeCount(content) ? Math.round(item.watched.length / episodeCount(content) * 100) : 0; }
function stars(value) { return [1,2,3,4,5].map(n => `<span>${n <= value ? '★' : '☆'}</span>`).join(''); }

/** Seeds the polished portfolio scenario only once, or when a visitor explicitly resets it. */
function seedDemoData(force = false) {
  const demo = window.MCC_DEMO_DATA;
  // Existing visitors' libraries take priority over the portfolio fixture.
  // This lets a previous user keep their own data when the site is updated.
  if (!demo || (!force && (localStorage.getItem(KEYS.demoVersion) || state.library.length > 0))) return false;
  state.cache = structuredClone(demo.catalog);
  state.library = demo.library.map(item => ({ ...item, watched:[...item.watched], ratings:{...item.ratings}, memos:{...item.memos} }));
  state.comments = Object.fromEntries(Object.entries(demo.comments).map(([key, comments]) => [key, comments.map(comment => ({ ...comment }))]));
  state.trash = [];
  localStorage.setItem(KEYS.demoVersion, demo.version);
  persist();
  return true;
}

/** Converts any provider record into the one content schema used by the UI. */
function makeContent(data) {
  return {
    id: data.id, provider: data.provider, sourceId: data.sourceId, mediaType: data.mediaType,
    title: data.title, type: data.type, country: data.country || '정보 없음', date: data.date || '정보 없음',
    description: data.description || '줄거리 정보가 없습니다.', image: data.image || API.fallbackImage,
    totalEpisodes: data.totalEpisodes || data.episodes?.length || 0,
    demoSample: Boolean(data.demoSample), episodes: data.episodes || [],
  };
}

async function tmdbFetch(path) {
  const response = await fetch(`${API.tmdb}${path}`, { headers: { Authorization: `Bearer ${state.token}`, accept: 'application/json' } });
  if (!response.ok) throw new Error(`TMDB ${response.status}`);
  return response.json();
}

function tmdbPreview(item) {
  const mediaType = item.media_type === 'movie' ? 'movie' : 'tv';
  const date = item.release_date || item.first_air_date || '';
  const anime = (item.origin_country || []).includes('JP');
  return makeContent({
    id: `tmdb:${mediaType}:${item.id}`, provider: 'tmdb', sourceId: item.id, mediaType,
    title: item.title || item.name, type: `${mediaType === 'movie' ? '영화' : anime ? '애니메이션' : '드라마'} · ${date.slice(0, 4) || '미정'}`,
    country: (item.production_countries || []).map(c => c.name).join(', ') || (item.origin_country || []).join(', '),
    date, description: item.overview, image: item.poster_path ? `https://image.tmdb.org/t/p/w342${item.poster_path}` : API.fallbackImage,
  });
}

async function tmdbDetails(sourceId, mediaType) {
  const record = await tmdbFetch(`/${mediaType}/${sourceId}?language=ko-KR`);
  const base = tmdbPreview({ ...record, media_type: mediaType });
  if (mediaType === 'movie') {
    return makeContent({ ...base, episodes: [{ id: 1, number: 1, season: 1, title: base.title, date: record.release_date, summary: record.overview }] });
  }
  const seasons = (record.seasons || []).filter(season => season.season_number > 0);
  const responses = await Promise.allSettled(seasons.map(season => tmdbFetch(`/tv/${sourceId}/season/${season.season_number}?language=ko-KR`)));
  const episodes = responses.flatMap(result => result.status === 'fulfilled' ? result.value.episodes || [] : []).map(episode => ({
    id: episode.id, number: episode.episode_number, season: episode.season_number, title: episode.name || `${episode.episode_number}화`,
    date: episode.air_date || '', summary: episode.overview || '에피소드 정보가 없습니다.',
  }));
  return makeContent({ ...base, episodes });
}

function tvmazePreview(show) {
  return makeContent({
    id: `tvmaze:${show.id}`, provider: 'tvmaze', sourceId: show.id, mediaType: 'tv', title: show.name,
    type: `${show.genres?.[0] || show.type || '드라마'} · ${(show.premiered || '').slice(0, 4) || '미정'}`,
    country: show.network?.country?.name || show.webChannel?.country?.name, date: show.premiered,
    description: stripHtml(show.summary), image: show.image?.medium || API.fallbackImage,
  });
}

async function tvmazeSearch(query) {
  const response = await fetch(`${API.tvmaze}/search/shows?q=${encodeURIComponent(query)}`);
  if (!response.ok) throw new Error(`TVmaze ${response.status}`);
  return (await response.json()).map(row => tvmazePreview(row.show));
}

async function tvmazeDetails(sourceId) {
  const response = await fetch(`${API.tvmaze}/shows/${sourceId}?embed=episodes`);
  if (!response.ok) throw new Error(`TVmaze ${response.status}`);
  const show = await response.json();
  return makeContent({ ...tvmazePreview(show), episodes: (show._embedded?.episodes || []).map((episode, index) => ({
    id: episode.id, number: index + 1, season: episode.season || 1, title: episode.name || `${index + 1}화`, date: episode.airdate || '', summary: stripHtml(episode.summary),
  })) });
}

/** Search never throws to the UI: an unavailable primary provider falls through to TVmaze. */
async function searchProviders(query) {
  if (state.token) {
    try {
      const data = await tmdbFetch(`/search/multi?query=${encodeURIComponent(query)}&language=ko-KR&include_adult=false`);
      const results = data.results.filter(item => item.media_type === 'movie' || item.media_type === 'tv').map(tmdbPreview);
      if (results.length) return results;
    } catch (error) { console.warn('TMDB search failed; using TVmaze.', error); }
  }
  return tvmazeSearch(query);
}

async function loadDetails(preview) {
  try {
    return preview.provider === 'tmdb' ? await tmdbDetails(preview.sourceId, preview.mediaType) : await tvmazeDetails(preview.sourceId);
  } catch (primaryError) {
    console.warn('Detail lookup failed; trying fallback.', primaryError);
    try {
      const fallback = (await tvmazeSearch(preview.title))[0];
      if (fallback) return await tvmazeDetails(fallback.sourceId);
    } catch (fallbackError) { console.warn('TVmaze fallback failed.', fallbackError); }
    // A registration must never fail merely because episode metadata is unavailable.
    return makeContent({ ...preview, episodes: [{ id: 1, number: 1, season: 1, title: preview.title, date: preview.date, summary: preview.description }] });
  }
}

/** Keeps app screens addressable so the browser's back and forward buttons work. */
function routeFromLocation() {
  const [rawView, rawId] = location.hash.slice(1).split('/');
  const view = ['home', 'search', 'detail', 'trash', 'settings'].includes(rawView) ? rawView : 'home';
  return { view, detailId: rawId ? decodeURIComponent(rawId) : null };
}

function routeUrl(view, detailId = null) {
  return `#${view}${view === 'detail' && detailId ? `/${encodeURIComponent(detailId)}` : ''}`;
}

function saveRoute(view, detailId, mode) {
  if (mode === 'none') return;
  const method = mode === 'replace' ? 'replaceState' : 'pushState';
  history[method]({ view, detailId }, '', routeUrl(view, detailId));
}

function setView(view, { historyMode = 'push' } = {}) {
  state.view = view;
  if (view !== 'detail') state.detailId = null;
  $all('.view').forEach(node => node.classList.toggle('active', node.id === `${view}-view`));
  $all('.nav-item').forEach(node => node.classList.toggle('active', node.dataset.view === view));
  $all('.mobile-nav [data-view]').forEach(node => node.classList.toggle('active', node.dataset.view === view));
  const labels = { home:['MY LIBRARY','내 콘텐츠'], search:['ADD TO LIBRARY','새 콘텐츠 찾기'], detail:['CONTENT DETAIL','콘텐츠 상세'], trash:['TRASH','휴지통'], settings:['SETTINGS','데이터 연결 설정'] };
  $('#page-kicker').textContent = labels[view][0]; $('#page-title').textContent = labels[view][1];
  // The shortcut belongs to the library header; other views already expose their own actions.
  $('#add-content').classList.toggle('hidden', view !== 'home');
  saveRoute(view, state.detailId, historyMode);
}

function renderHome() {
  const query = state.libraryQuery.toLowerCase();
  const candidates = state.library.map(item => ({ item, content: contentOf(item.id) })).filter(row => row.content && row.content.title.toLowerCase().includes(query));
  const rows = candidates.filter(({ item, content }) => state.filter === 'all' || (state.filter === 'done' ? item.watched.length >= episodeCount(content) : item.watched.length < episodeCount(content)));
  $('#library-count').textContent = `총 ${rows.length}개의 콘텐츠`;
  $('#content-grid').innerHTML = rows.map(({ item, content }) => `<article class="content-card"><button class="card-button" data-open="${content.id}"><img class="poster" loading="lazy" decoding="async" referrerpolicy="no-referrer" src="${escapeHtml(content.image)}" alt="${escapeHtml(content.title)}"><div class="card-copy"><p class="card-title">${escapeHtml(content.title)}</p><p class="card-meta">${item.watched.length}화 시청 · 총 ${episodeCount(content)}화</p><div class="progress-mini"><i style="width:${progress(item, content)}%"></i></div></div></button><button class="card-trash" data-trash="${content.id}" aria-label="${escapeHtml(content.title)} 휴지통으로 이동" title="휴지통으로 이동">×</button></article>`).join('');
  $('#empty-library').classList.toggle('hidden', rows.length > 0 || Boolean(query));
  $all('[data-open]').forEach(button => button.onclick = () => showDetail(button.dataset.open));
  $all('[data-trash]').forEach(button => button.onclick = () => moveToTrash(button.dataset.trash));
}

function sortSearchResults() {
  const results = [...state.searchResults];
  if (state.searchSort === 'newest') results.sort((a,b) => String(b.date).localeCompare(String(a.date)));
  if (state.searchSort === 'oldest') results.sort((a,b) => String(a.date).localeCompare(String(b.date)));
  return results;
}

function renderSearch() {
  const results = sortSearchResults();
  $('#search-results').innerHTML = results.map(content => `<article class="search-card"><img src="${escapeHtml(content.image)}" alt=""><div class="result-copy"><p class="type-badge">${escapeHtml(content.type.split(' · ')[0])}</p><h3>${escapeHtml(content.title)}</h3><p>${escapeHtml(content.date || '날짜 정보 없음')} · ${escapeHtml(content.country || '제작 국가 정보 없음')}</p><button class="add-result" data-register="${content.id}">${libraryItem(content.id) ? '등록됨' : '내 콘텐츠에 추가'}</button></div></article>`).join('');
  $all('[data-register]').forEach(button => button.onclick = () => registerContent(button.dataset.register));
}

function episodeMarkup(episode, item) {
  const watched = item.watched.includes(episode.id); const rating = item.ratings?.[episode.id] || 0;
  return `<article class="episode ${watched ? 'watched' : ''}" data-episode="${episode.id}"><button class="episode-top"><span class="check">${watched ? '✓' : ''}</span><span class="ep-name">${episode.number}화 · ${escapeHtml(episode.title)}</span><span class="ep-date">${escapeHtml(episode.date)}</span><span class="rating">${stars(rating)}</span><span>⌄</span></button><div class="episode-body hidden"><p>${escapeHtml(episode.summary)}</p><div class="episode-controls"><input class="comment-input" placeholder="감상을 작성하고 Enter를 누르세요"><span class="star-picker">${[1,2,3,4,5].map(n => `<button data-rate="${n}" class="${n <= rating ? 'on' : ''}">★</button>`).join('')}</span></div><div class="comments">${commentMarkup(episode.id)}</div></div></article>`;
}

function commentKey(episodeId) { return `${state.detailId}:${episodeId}`; }
function formatCommentTime(timestamp) { return new Date(timestamp).toLocaleString('ko-KR'); }
function commentMarkup(episodeId) {
  return (state.comments[commentKey(episodeId)] || []).map(comment => {
    const edited = comment.editedAt ? ` · 수정 ${formatCommentTime(comment.editedAt)}` : '';
    return `<article class="comment" data-comment="${comment.id}"><p>${escapeHtml(comment.text)}</p><small>작성 ${formatCommentTime(comment.createdAt)}${edited}</small><button data-edit-comment="${comment.id}">수정</button><button data-delete-comment="${comment.id}">삭제</button></article>`;
  }).join('');
}

function showDetail(id, { historyMode = 'push' } = {}) {
  state.detailId = id; const content = contentOf(id); const item = libraryItem(id); if (!content || !item) return setView('home', { historyMode });
  const groups = Object.groupBy ? Object.groupBy(content.episodes, e => e.season || 1) : content.episodes.reduce((map,e) => ((map[e.season || 1] ||= []).push(e), map), {});
  let seasons = Object.entries(groups).sort(([a],[b]) => Number(a) - Number(b)); if (state.episodeSort === 'newest') seasons = seasons.reverse();
  const hasMultipleSeasons = seasons.length > 1;
  const demoNote = content.demoSample && episodeCount(content) > content.episodes.length
    ? `<p class="demo-episode-note">실제 전체 ${episodeCount(content)}화 중 대표 회차 정보입니다.</p>` : '';
  $('#detail-content').innerHTML = `<article class="detail-hero"><img src="${escapeHtml(content.image)}" alt=""><div class="detail-info"><p class="type-badge">${escapeHtml(content.type)}</p><h2>${escapeHtml(content.title)}</h2><p class="sub">최초 방영일 ${escapeHtml(content.date)} · 제작 국가 ${escapeHtml(content.country)}</p><p class="overview">${escapeHtml(content.description)}</p><button class="danger-action" id="delete-content">휴지통으로 이동</button></div></article><section class="episode-section"><div class="episode-toolbar"><div><p class="eyebrow">EPISODES</p><h3>에피소드</h3></div><label><select id="episode-sort" aria-label="에피소드 나열 방식"><option value="oldest">날짜순 · 오래된 순</option><option value="newest">최신순 · 최신이 상단</option></select></label></div>${demoNote}${seasons.map(([season, episodes]) => { const ordered = state.episodeSort === 'newest' ? [...episodes].reverse() : episodes; return `<details class="season" ${hasMultipleSeasons ? '' : 'open'}><summary class="${hasMultipleSeasons ? '' : 'hidden'}">시즌 ${season} <span>${episodes.length}개 에피소드</span></summary><div class="episode-list">${ordered.map(ep => episodeMarkup(ep, item)).join('')}</div></details>`; }).join('')}</section>`;
  $('#episode-sort').value = state.episodeSort; $('#episode-sort').onchange = event => { state.episodeSort = event.target.value; showDetail(id, { historyMode: 'none' }); };
  $('#delete-content').onclick = () => moveToTrash(id); bindDetailEvents(); setView('detail', { historyMode });
}

/** All comment mutations update the local row rather than rerendering/scrolling the detail view. */
function bindDetailEvents() {
  $all('.episode-top').forEach(button => button.onclick = () => button.closest('.episode').querySelector('.episode-body').classList.toggle('hidden'));
  $all('.check').forEach(check => check.onclick = event => { event.stopPropagation(); const row = check.closest('.episode'); const id = Number(row.dataset.episode); const item = libraryItem(state.detailId); const index = item.watched.indexOf(id); index < 0 ? item.watched.push(id) : item.watched.splice(index, 1); persist(); row.classList.toggle('watched'); check.textContent = row.classList.contains('watched') ? '✓' : ''; });
  $all('[data-rate]').forEach(button => button.onclick = () => { const row = button.closest('.episode'); const id = Number(row.dataset.episode); libraryItem(state.detailId).ratings[id] = Number(button.dataset.rate); persist(); row.querySelector('.rating').innerHTML = stars(Number(button.dataset.rate)); $all('[data-rate]', row).forEach(star => star.classList.toggle('on', Number(star.dataset.rate) <= Number(button.dataset.rate))); });
  $all('.comment-input').forEach(input => input.onkeydown = event => { if (event.key !== 'Enter' || !input.value.trim()) return; event.preventDefault(); const row = input.closest('.episode'); const key = commentKey(row.dataset.episode); (state.comments[key] ||= []).push({ id: crypto.randomUUID(), text: input.value.trim(), createdAt: Date.now() }); persist(); input.value = ''; renderComments(row); });
  $all('.episode').forEach(bindCommentButtons);
}

function renderComments(row) { row.querySelector('.comments').innerHTML = commentMarkup(row.dataset.episode); bindCommentButtons(row); }
function bindCommentButtons(row) {
  $all('[data-delete-comment]', row).forEach(button => button.onclick = async () => { if (!await confirmAction('감상 삭제', '이 감상을 삭제할까요?', '삭제')) return; const key = commentKey(row.dataset.episode); state.comments[key] = state.comments[key].filter(comment => comment.id !== button.dataset.deleteComment); persist(); renderComments(row); });
  $all('[data-edit-comment]', row).forEach(button => button.onclick = () => { const card = button.closest('.comment'); const old = card.querySelector('p').textContent; card.innerHTML = `<textarea class="comment-editor">${escapeHtml(old)}</textarea><button class="secondary-button save-edit">저장</button><button class="text-button cancel-edit">취소</button>`; $('.save-edit', card).onclick = () => { const text = $('.comment-editor', card).value.trim(); if (!text) return; const comment = state.comments[commentKey(row.dataset.episode)].find(x => x.id === button.dataset.editComment); comment.text = text; comment.editedAt = Date.now(); persist(); renderComments(row); }; $('.cancel-edit', card).onclick = () => renderComments(row); });
}

async function confirmAction(title, message, confirmLabel) { const dialog = $('#confirm-dialog'); $('#dialog-title').textContent = title; $('#dialog-message').textContent = message; $('#dialog-confirm').textContent = confirmLabel; dialog.showModal(); return new Promise(resolve => dialog.addEventListener('close', () => resolve(dialog.returnValue === 'confirm'), { once: true })); }

async function registerContent(id) {
  const preview = state.searchResults.find(result => result.id === id); if (!preview || libraryItem(id)) return;
  if (!await confirmAction('콘텐츠 추가', `「${preview.title}」을(를) 내 콘텐츠에 추가할까요?`, '추가')) return;
  $('#search-status').textContent = '상세 회차 정보를 가져오는 중…'; const content = await loadDetails(preview); state.cache[content.id] = content; state.library.push({ id: content.id, watched: [], ratings: {}, memos: {} }); persist(); renderHome(); $('#search-status').textContent = '콘텐츠를 등록했습니다.'; setView('home');
}

async function moveToTrash(id) {
  const content = contentOf(id);
  const index = state.library.findIndex(item => item.id === id);
  if (!content || index < 0 || !await confirmAction('콘텐츠 삭제', `「${content.title}」을(를) 휴지통으로 이동할까요?`, '이동')) return;
  state.trash.push({ ...state.library[index], deletedAt: Date.now() });
  state.library.splice(index, 1);
  persist();
  renderHome();
  setView('home');
}

/** Removes metadata and comments together when a trashed item is permanently erased. */
function removeContentData(id) {
  delete state.cache[id];
  Object.keys(state.comments)
    .filter(key => key.startsWith(`${id}:`))
    .forEach(key => delete state.comments[key]);
}

function renderTrash() {
  const now = Date.now();
  const expiration = 30 * 86400000;
  const expired = state.trash.filter(item => now - item.deletedAt >= expiration);
  expired.forEach(item => removeContentData(item.id));
  state.trash = state.trash.filter(item => now - item.deletedAt < expiration);
  persist();

  $('#trash-list').innerHTML = state.trash.map(item => {
    const content = contentOf(item.id) || { title: item.id, image: API.fallbackImage };
    return `<article class="search-card"><img src="${escapeHtml(content.image)}" alt=""><div class="result-copy"><h3>${escapeHtml(content.title)}</h3><p>삭제일 ${new Date(item.deletedAt).toLocaleDateString('ko-KR')}</p><button class="add-result" data-restore="${item.id}">복원</button><button class="text-button" data-purge="${item.id}">완전 삭제</button></div></article>`;
  }).join('') || '<p class="empty-copy">휴지통이 비어 있습니다.</p>';

  $all('[data-restore]').forEach(button => button.onclick = () => {
    const index = state.trash.findIndex(item => item.id === button.dataset.restore);
    if (index < 0) return;
    state.library.push(state.trash.splice(index, 1)[0]);
    persist();
    renderTrash();
    renderHome();
  });

  $all('[data-purge]').forEach(button => button.onclick = async () => {
    if (!await confirmAction('완전 삭제', '복구할 수 없게 완전히 삭제할까요?', '삭제')) return;
    removeContentData(button.dataset.purge);
    state.trash = state.trash.filter(item => item.id !== button.dataset.purge);
    persist();
    renderTrash();
  });
}

async function runSearch() { const query = $('#search-query').value.trim(); if (!query) return; $('#search-status').textContent = '콘텐츠를 검색하는 중…'; $('#search-results').innerHTML = ''; try { state.searchResults = await searchProviders(query); $('#search-status').textContent = state.searchResults.length ? `${state.searchResults.length}개 결과` : '검색 결과가 없습니다.'; } catch { state.searchResults = []; $('#search-status').textContent = '검색 서버에 연결하지 못했습니다.'; } renderSearch(); }

function applyHistoryRoute() {
  const route = routeFromLocation();
  if (route.view === 'detail' && route.detailId) return showDetail(route.detailId, { historyMode: 'none' });
  setView(route.view, { historyMode: 'none' });
  if (route.view === 'trash') renderTrash();
}

function bindAppEvents() {
  $('.brand').onclick = event => { event.preventDefault(); setView('home'); };
  $all('[data-view]').forEach(button => button.onclick = () => { setView(button.dataset.view); if (button.dataset.view === 'trash') renderTrash(); });
  $('#add-content').onclick = () => { setView('search'); $('#search-query').focus(); }; $all('[data-go-search]').forEach(button => button.onclick = () => setView('search'));
  $('#library-query').oninput = event => { state.libraryQuery = event.target.value; renderHome(); }; $all('[data-filter]').forEach(button => button.onclick = () => { state.filter = button.dataset.filter; $all('[data-filter]').forEach(node => node.classList.toggle('active', node === button)); renderHome(); });
  $('#search-button').onclick = runSearch; $('#search-query').onkeydown = event => { if (event.key === 'Enter') runSearch(); }; $('#search-sort').onchange = event => { state.searchSort = event.target.value; renderSearch(); };
  $('#tmdb-token').value = state.token; const updateTokenState = () => { $('#tmdb-state').textContent = state.token ? '연결됨' : '연결 안 됨'; $('#tmdb-state').classList.toggle('connected', Boolean(state.token)); }; updateTokenState(); $('#save-token').onclick = () => { state.token = $('#tmdb-token').value.trim(); if (state.token) localStorage.setItem(KEYS.token, state.token); updateTokenState(); }; $('#clear-token').onclick = () => { state.token = ''; $('#tmdb-token').value = ''; localStorage.removeItem(KEYS.token); updateTokenState(); };
  $('#reset-demo').onclick = async () => { if (!await confirmAction('데모 데이터 다시 불러오기', '현재 라이브러리, 댓글, 휴지통을 데모 초기 상태로 바꿀까요?', '초기화')) return; seedDemoData(true); renderHome(); renderTrash(); setView('home'); };
  window.addEventListener('popstate', applyHistoryRoute);
}

function initialize() {
  seedDemoData(); bindAppEvents(); renderHome(); renderTrash();
  const route = routeFromLocation();
  applyHistoryRoute();
  history.replaceState(route, '', routeUrl(state.view, state.detailId));
}
initialize();
