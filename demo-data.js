/*
 * Portfolio fixture data.
 *
 * The seven records use real titles, release information, episode counts and
 * representative episode metadata. Poster URLs use TMDB's image CDN or
 * publisher-hosted promotional artwork; attribution is shown in the app.
 * To keep the initial localStorage payload small, multi-episode works include
 * a curated set of real representative episodes rather than every episode.
 */
(function createDemoData() {
  const episodeSamples = (season, records) => records.map(([title, date, summary], index) => ({
    id: season * 100 + index + 1,
    number: index + 1,
    season,
    title,
    date,
    summary,
  }));

  const content = ({
    id, tmdbId, title, type, country, date, totalEpisodes, description, image, seasons,
  }) => ({
    id: `demo:${id}`,
    provider: 'demo',
    sourceId: tmdbId,
    mediaType: type === '영화' ? 'movie' : 'tv',
    title,
    type: `${type} · ${date.slice(0, 4)}`,
    country,
    date,
    totalEpisodes,
    demoSample: true,
    description,
    image,
    episodes: seasons.flatMap(([season, records]) => episodeSamples(season, records)),
  });

  const catalog = [
    content({
      id: 'liberation',
      tmdbId: 154887,
      title: '나의 해방일지',
      type: '드라마',
      country: '대한민국',
      date: '2022-04-09',
      totalEpisodes: 16,
      description: '반복되는 일상과 채워지지 않는 관계 속에서 답답함의 한계에 다다른 경기도 산포시의 염씨 삼남매가, 각자의 삶에서 해방될 길을 찾아 나서는 이야기.',
      image: 'https://static.tvmaze.com/uploads/images/original_untouched/397/993422.jpg',
      seasons: [[1, [
        ['1화', '2022-04-09', '염미정과 두 언니·남동생은 반복되는 일상 속에서 저마다의 답답함을 마주한다.'],
        ['2화', '2022-04-10', '미정은 자신을 둘러싼 관계와 거리감을 조금씩 드러낸다.'],
        ['3화', '2022-04-16', '세 남매의 일상에 예상하지 못한 선택들이 겹쳐진다.'],
        ['4화', '2022-04-17', '각자의 방식으로 변화를 꿈꾸는 이들의 이야기가 이어진다.'],
      ]]],
    }),
    content({
      id: 'bear',
      tmdbId: 136315,
      title: '더 베어',
      type: '드라마',
      country: '미국',
      date: '2022-06-23',
      totalEpisodes: 38,
      description: '파인다이닝 셰프 카미가 형이 남긴 시카고의 샌드위치 가게를 맡으며, 거친 주방 팀과 함께 가게와 자신을 바꿔 가는 이야기.',
      image: 'https://image.tmdb.org/t/p/w500/eKfVzzEazSIjJMrw9ADa2x8ksLz.jpg',
      seasons: [
        [1, [
          ['System', '2022-06-23', '카미는 형이 남긴 가게의 혼란스러운 현실과 마주한다.'],
          ['Hands', '2022-06-23', '주방의 오랜 방식과 카미의 기준이 충돌한다.'],
          ['Brigade', '2022-06-23', '카미는 팀에 새로운 주방 규율을 도입하려 한다.'],
          ['Dogs', '2022-06-23', '예상치 못한 손님과 문제들이 주방의 긴장을 높인다.'],
        ]],
        [2, [
          ['Beef', '2023-06-22', '새로운 시작을 위한 준비가 본격적으로 움직인다.'],
          ['Pasta', '2023-06-22', '팀은 함께 일하는 방식과 서로의 신뢰를 다시 배운다.'],
        ]],
        [3, [
          ['Tomorrow', '2024-06-26', '레스토랑을 향한 기대와 부담이 동시에 커진다.'],
        ]],
        [4, [
          ['Groundhogs', '2025-06-25', '가게와 팀은 새로운 압박 속에서 다음 단계를 고민한다.'],
        ]],
      ],
    }),
    content({
      id: 'dune',
      tmdbId: 693134,
      title: '듄: 파트 2',
      type: '영화',
      country: '미국',
      date: '2024-02-28',
      totalEpisodes: 1,
      description: '폴 아트레이드가 챠니와 프레멘과 힘을 합쳐 가문을 파괴한 자들에게 맞서며, 사랑과 우주의 운명 사이에서 선택해야 하는 이야기.',
      image: 'https://image.tmdb.org/t/p/w500/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg',
      seasons: [[1, [
        ['듄: 파트 2', '2024-02-28', '아라키스에서 폴은 복수와 예언, 그리고 자신이 선택할 미래를 마주한다.'],
      ]]],
    }),
    content({
      id: 'frieren',
      tmdbId: 209867,
      title: '장송의 프리렌 — 시즌 1',
      type: '애니메이션',
      country: '일본',
      date: '2023-09-29',
      totalEpisodes: 28,
      description: '마왕을 물리친 용사 일행의 여정이 끝난 뒤, 엘프 마법사 프리렌이 인간을 이해하기 위한 새로운 여행을 시작한다.',
      image: 'https://image.tmdb.org/t/p/w500/dqZENchTd7lp5zht7BdlqM7RBhD.jpg',
      seasons: [[1, [
        ['여행의 끝', '2023-09-29', '마왕 토벌 이후, 프리렌은 오랜 동료와의 이별을 계기로 시간을 돌아본다.'],
        ['굳이 마법일 필요는 없잖아', '2023-09-29', '프리렌은 페른에게 마법을 가르치며 하이터의 부탁을 해결한다.'],
        ['사람을 죽이는 마법', '2023-09-29', '과거의 여정을 되짚던 프리렌은 오래된 적과 마주한다.'],
        ['영혼이 잠드는 땅', '2023-09-29', '프리렌과 페른은 아이젠을 찾아 새로운 여행의 단서를 얻는다.'],
      ]]],
    }),
    content({
      id: 'moving',
      tmdbId: 204082,
      title: '무빙',
      type: '드라마',
      country: '대한민국',
      date: '2023-08-09',
      totalEpisodes: 20,
      description: '초능력을 숨긴 아이들과 과거의 비밀을 간직한 부모들이 거대한 위협에 맞서는 액션 휴먼 드라마.',
      image: 'https://m.media-amazon.com/images/M/MV5BZWY4NjFiMzgtYjVjMS00NTAwLWE1MDYtYWViOTI2NmJkMDE5XkEyXkFqcGc%40._V1_.jpg',
      seasons: [[1, [
        ['1화', '2023-08-09', '특별한 능력을 감춘 봉석과 희수의 학교생활이 시작된다.'],
        ['2화', '2023-08-09', '아이들의 능력과 이를 둘러싼 불안이 조금씩 드러난다.'],
        ['3화', '2023-08-09', '부모 세대의 과거와 아이들의 현재가 교차한다.'],
        ['4화', '2023-08-09', '평범해 보이던 일상에 예상하지 못한 위협이 다가온다.'],
      ]]],
    }),
    content({
      id: 'solitary-gourmet',
      tmdbId: 79744,
      title: '고독한 미식가 — 시즌 1',
      type: '드라마',
      country: '일본',
      date: '2012-01-05',
      totalEpisodes: 12,
      description: '수입 잡화상 이노가시라 고로가 출장지에서 우연히 발견한 식당과 한 끼의 즐거움을 만나는 이야기.',
      image: 'https://video-tvtokyo.imgix.net/kodokunogurume1/_MASTER/kodokunogurume1_pg2.jpg?auto=compress%2Cformat&w=900',
      seasons: [[1, [
        ['도쿄도 고토구 몬젠나카초의 야키토리와 야키메시', '2012-01-05', '고로는 몬젠나카초에서 야키토리와 야키메시를 맛본다.'],
        ['도쿄도 무사시노시 기치조지의 회전초밥', '2012-01-12', '기치조지에서 고로는 회전초밥집의 한 끼를 즐긴다.'],
        ['도쿄도 도시마구 이케부쿠로의 즙 없는 탄탄면', '2012-01-19', '이케부쿠로에서 새로운 메뉴를 발견한 고로의 식사 시간.'],
        ['지바현 우라야스시의 시즈오카 오뎅', '2012-01-26', '우라야스 출장길, 고로는 시즈오카식 오뎅을 만난다.'],
      ]]],
    }),
    content({
      id: 'blue-eye',
      tmdbId: 225180,
      title: '푸른 눈의 사무라이',
      type: '애니메이션',
      country: '미국 · 프랑스',
      date: '2023-11-03',
      totalEpisodes: 8,
      description: '에도 시대 일본에서 혼혈이라는 이유로 배척받은 검사 미즈가 자신의 운명과 복수를 향해 나아가는 이야기.',
      image: 'https://image.tmdb.org/t/p/w500/bOPIUxriSFP2xqlzTYRdInFZAsG.jpg',
      seasons: [[1, [
        ['로닌의 이야기', '2023-11-03', '미즈는 복수를 향한 여정의 첫걸음을 내딛는다.'],
        ['뜻밖의 요소', '2023-11-03', '예상하지 못한 동행과 적이 미즈의 길에 얽힌다.'],
        ['정해진 길의 수', '2023-11-03', '각자의 선택이 서로 다른 운명을 향해 흐르기 시작한다.'],
        ['특이점', '2023-11-03', '미즈는 자신의 과거와 목표를 다시 마주한다.'],
      ]]],
    }),
  ];

  const byId = Object.fromEntries(catalog.map(item => [item.id, item]));
  const library = [
    { id: 'demo:liberation', watched: [101, 102, 103], ratings: { 101: 5, 102: 5, 103: 4 }, memos: {} },
    { id: 'demo:bear', watched: [101, 102, 103, 104, 201, 202], ratings: { 101: 4, 102: 5, 103: 4, 104: 4, 201: 5, 202: 5 }, memos: {} },
    { id: 'demo:dune', watched: [101], ratings: { 101: 5 }, memos: {} },
    { id: 'demo:frieren', watched: [101, 102], ratings: { 101: 5, 102: 5 }, memos: {} },
    { id: 'demo:moving', watched: [101, 102, 103], ratings: { 101: 5, 102: 4, 103: 5 }, memos: {} },
    { id: 'demo:solitary-gourmet', watched: [101], ratings: { 101: 4 }, memos: {} },
    { id: 'demo:blue-eye', watched: [], ratings: {}, memos: {} },
  ];

  window.MCC_DEMO_DATA = {
    version: '2',
    catalog: byId,
    library,
    comments: {
      'demo:liberation:101': [{ id: 'demo-c1', text: '첫 화부터 잔잔한 대사가 오래 남는다.', createdAt: 1704067200000 }],
      'demo:bear:202': [{ id: 'demo-c2', text: '주방의 긴장감과 인물들의 호흡이 특히 좋았던 회차.', createdAt: 1706745600000 }],
      'demo:frieren:101': [{ id: 'demo-c3', text: '모험 이후의 시간을 다루는 방식이 인상적이다.', createdAt: 1709251200000 }],
    },
  };
})();
