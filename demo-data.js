/*
 * Portfolio fixture data.
 *
 * This is a static snapshot normalized from TMDB's Korean-language responses
 * on 2026-09-05. It intentionally keeps representative episodes only so a
 * first portfolio visit stays lightweight. The UI discloses that distinction.
 */
(function createDemoData() {
  const episode = (id, season, number, title, date, summary) => ({
    id, season, number, title, date, summary,
  });

  const content = ({
    id, tmdbId, title, type, country, date, totalEpisodes, description, image, episodes,
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
    image: `https://image.tmdb.org/t/p/w500${image}`,
    episodes,
  });

  const catalog = [
    content({
      id: 'liberation', tmdbId: 154887, title: '나의 해방일지', type: '드라마', country: '대한민국', date: '2022-04-09', totalEpisodes: 16,
      description: '시골과 다를 바 없는 경기도 끝자락에 사는 염씨 삼남매. 반복되는 단조로운 일상에 지친 세 사람은 평범한 삶 속에서 특별한 성취와 자유를 찾아, 각자의 삶에서 해방하기로 결심한다.',
      image: '/mrOxruke1FI0Sx6v6BOdpu4yppZ.jpg',
      episodes: [
        episode(3432768, 1, 1, '태어나자마자 정해진 염창희의 운명', '2022-04-09', '서울로 출퇴근하느라 하루에 서너 시간을 길바닥에 보내는 염 씨 삼남매. 둘째 창희는 애인과 구질구질한 이별을 하고, 첫째 기정은 지치기만 하는 삶의 비책을 찾아 나선다.'),
        episode(3510380, 1, 2, '해결은 해야 되는데', '2022-04-10', '올겨울엔 아무나 사랑하기로 결심한 기정. 이리저리 치이던 미정은 결국 터져버리고 극약처방으로 누군가에게 뚜벅뚜벅 걸어간다.'),
        episode(3510381, 1, 3, '거지 같은 인간들', '2022-04-16', '구씨와 마주치지 않으려고 평소 안 하던 행동을 하는 미정. 기정은 직장에서 불편한 남자 동료에게 이유를 대놓고 묻는다.'),
        episode(3510385, 1, 4, '진짜 하기로 했어', '2022-04-17', '끝없이 떠들어대는 직장 동료 때문에 미칠 지경인 창희. 미정의 새 동호회는 사람들의 관심을 끌고, 창희는 아버지에게 구박을 받다 폭발한다.'),
      ],
    }),
    content({
      id: 'bear', tmdbId: 136315, title: '더 베어', type: '드라마', country: '미국', date: '2022-06-23', totalEpisodes: 46,
      description: '최고급 레스토랑의 유명 셰프가 세상을 떠난 형이 운영하던 샌드위치 가게를 물려받아, 망해가는 식당을 살리려는 이야기.',
      image: '/t23nESlKRH1qQYWIoUQCOWkS2dl.jpg',
      episodes: [
        episode(3281115, 1, 1, '시스템', '2022-06-23', '카미는 오리지널 비프 오브 시카고랜드의 직원들을 붙잡으려 한다.'),
        episode(3720502, 1, 2, '손', '2022-06-23', '깜짝 위생 점검에서 식당의 근간을 흔드는 균열이 발견된다.'),
        episode(4423391, 2, 1, '비프', '2023-06-22', '빡빡한 예산과 살벌한 일정 속에서 카르멘과 직원들이 식당 오픈 계획을 세우려 한다.'),
        episode(4423392, 2, 2, '파스타', '2023-06-22', '오픈까지 남은 시간은 단 12주. 직원들이 각자의 자리에서 어려움을 이겨내며 분주하게 식당 개업을 준비한다.'),
        episode(5334913, 3, 1, '내일', '2024-06-26', '그날로 이끈 나날들.'),
        episode(6231138, 4, 1, '반복되는 하루', '2025-06-25', '오늘은 마치 어제처럼 느껴진다.'),
        episode(7239761, 5, 1, '에피소드 1', '2026-06-25', '에피소드 정보가 없습니다.'),
      ],
    }),
    content({
      id: 'dune', tmdbId: 693134, title: '듄: 파트 2', type: '영화', country: '미국', date: '2024-02-27', totalEpisodes: 1,
      description: '황제의 모략으로 멸문한 가문의 유일한 후계자 폴이 사막의 반란군과 함께 황제의 모든 것을 파괴할 전투를 준비하는 이야기.',
      image: '/8AsDR2o5AC3V8Jmj6JH6cpta7dz.jpg',
      episodes: [episode(693134, 1, 1, '듄: 파트 2', '2024-02-27', '폴은 프레멘과 함께 황제와 귀족 가문에 맞설 전투를 준비한다.')],
    }),
    content({
      id: 'frieren', tmdbId: 209867, title: '장송의 프리렌', type: '애니메이션', country: '일본', date: '2023-09-29', totalEpisodes: 38,
      description: '마왕을 물리친 뒤 힘멜의 죽음을 계기로 인간을 알지 못했던 자신을 후회한 엘프 마법사 프리렌이, 인간을 이해하기 위한 여행을 떠나는 이야기.',
      image: '/mnj30hYDVAbL9BOA0f4HrKubAGF.jpg',
      episodes: [
        episode(3946240, 1, 1, '모험의 끝', '2023-09-29', '마왕을 물리친 용사 힘멜 일행은 모험을 되돌아본다. 50년 후 재회를 계기로 프리렌은 새로운 여행을 떠난다.'),
        episode(4698536, 1, 2, '딱히 마법이 아니어도...', '2023-09-29', '프리렌은 하이터와 함께 사는 고아 페른을 만나고, 마법을 가르쳐 달라는 부탁을 받는다.'),
        episode(4698538, 1, 3, '사람을 죽이는 마법', '2023-09-29', '교역 도시를 찾은 프리렌과 페른은 과거 힘멜 일행이 싸웠던 마족 크발과 관련된 장소를 찾는다.'),
        episode(4698539, 1, 4, '혼이 잠드는 땅', '2023-09-29', '프리렌과 페른은 아이젠을 찾아가 대마법사 플람메의 수기를 찾는 일을 도와 달라는 부탁을 받는다.'),
      ],
    }),
    content({
      id: 'moving', tmdbId: 126485, title: '무빙', type: '드라마', country: '대한민국', date: '2023-08-09', totalEpisodes: 20,
      description: '초능력을 숨긴 채 살아가는 아이들과, 과거의 아픈 비밀을 감춘 부모들이 거대한 위험에 함께 맞서는 초능력 휴먼 액션 시리즈.',
      image: '/b9MhD5syJ7TbYSeje4wB4oyTzc7.jpg',
      episodes: [
        episode(3871835, 1, 1, '고3', '2023-08-09', '비밀을 감춘 고등학생 봉석. 개학 날 등굣길 버스에서 만난 여학생이 같은 반으로 전학 오고, 서울 한복판에서 의문의 사고가 발생한다.'),
        episode(4543076, 1, 2, '부양', '2023-08-09', '미현은 봉석의 초능력을 숨기기 위해 오랜 기간 애쓴다. 한편 프랭크는 숨어 지내는 초능력자를 찾아간다.'),
        episode(4543077, 1, 3, '원+원', '2023-08-09', '봉석과 희수는 공통점을 발견하며 가까워지고, 봉석은 초능력을 들킬 위기에 빠진다.'),
        episode(4543080, 1, 4, '비밀', '2023-08-09', '봉석의 비밀이 발각되고 희수는 그를 집까지 바래다준다. 프랭크는 세 번째 타깃을 찾아간다.'),
      ],
    }),
    content({
      id: 'solitary-gourmet', tmdbId: 55582, title: '고독한 미식가', type: '드라마', country: '일본', date: '2012-01-04', totalEpisodes: 12,
      description: '수입 잡화상 이노가시라 고로가 도쿄와 오사카의 소박한 식당을 찾아다니며, 누구에게도 방해받지 않는 한 끼의 즐거움을 만나는 이야기.',
      image: '/rObv2nGd4EbUCDPP5UYQP06A7pb.jpg',
      episodes: [
        episode(933621, 1, 1, '코토 구 몬젠나카쵸의 닭꼬치와 볶음밥', '2012-01-04', '몬젠나카쵸의 카페에 들른 고로는 배가 고파지고, 작은 술집에서 닭꼬치와 볶음밥을 주문한다.'),
        episode(933620, 1, 2, '토시마 구 코마고메 생선조림 정식', '2012-01-11', '단골 고객을 찾아 코마고메에 온 고로는 장기를 두다가 배가 고파져 가정요리집에 들어간다.'),
        episode(933619, 1, 3, '토시마 구 이케부쿠로의 국물 없는 탄탄면', '2012-01-18', '이케부쿠로에서 부동산을 둘러보던 고로는 중화요리 양에 들어가 국물 없는 탄탄면을 주문한다.'),
        episode(933625, 1, 4, '치바 현 우라야스 시의 시즈오카 오뎅', '2012-01-25', '우라야스의 결혼식장을 찾은 고로는 배가 고파진 끝에 카페에서 시즈오카 오뎅을 발견한다.'),
      ],
    }),
    content({
      id: 'blue-eye', tmdbId: 225180, title: '푸른 눈의 사무라이', type: '애니메이션', country: '미국 · 프랑스', date: '2023-11-03', totalEpisodes: 8,
      description: '에도 시대 일본에서 자신을 이방인으로 만든 이들에게 복수심을 품은 젊은 무사 미즈가 피의 여정을 시작하는 이야기.',
      image: '/gJLJcZpqUkS03zF65d4EIfqchNH.jpg',
      episodes: [
        episode(4387269, 1, 1, '불순한 존재', '2023-11-03', '외톨이 무사 미즈는 생각지도 못한 여정의 동반자를 만난다. 귀족 자제 아케미는 자신의 미래를 스스로 결정할 방법을 고민한다.'),
        episode(4793056, 1, 2, '예상치 못한 요소', '2023-11-03', '치명적인 암살자 군단이 미즈를 쫓는다. 링고와 함께 도착한 마을 축제에서도 장애물을 만난다.'),
        episode(4793057, 1, 3, '정해진 두 가지 길', '2023-11-03', '타이겐은 한 가지 제안을 하고, 미즈는 차 약속에 초대된다. 떠돌이 생활은 아케미에게 어려움을 안긴다.'),
        episode(4793058, 1, 4, '기이한 욕망', '2023-11-03', '아케미는 새 일자리를 구하고, 미즈는 파울러에게 연락할 방법을 모색한다.'),
      ],
    }),
  ];

  const byId = Object.fromEntries(catalog.map(item => [item.id, item]));
  const library = [
    { id: 'demo:liberation', watched: [3432768, 3510380, 3510381], ratings: { 3432768: 5, 3510380: 5, 3510381: 4 }, memos: {} },
    { id: 'demo:bear', watched: [3281115, 3720502, 4423391, 4423392], ratings: { 3281115: 4, 3720502: 5, 4423391: 5, 4423392: 5 }, memos: {} },
    { id: 'demo:dune', watched: [693134], ratings: { 693134: 5 }, memos: {} },
    { id: 'demo:frieren', watched: [3946240, 4698536], ratings: { 3946240: 5, 4698536: 5 }, memos: {} },
    { id: 'demo:moving', watched: [3871835, 4543076, 4543077], ratings: { 3871835: 5, 4543076: 4, 4543077: 5 }, memos: {} },
    { id: 'demo:solitary-gourmet', watched: [933621], ratings: { 933621: 4 }, memos: {} },
    { id: 'demo:blue-eye', watched: [], ratings: {}, memos: {} },
  ];

  window.MCC_DEMO_DATA = {
    version: '3', catalog: byId, library,
    comments: {
      'demo:liberation:3432768': [
        { id: 'demo-c1', text: '첫 화부터 인물들의 답답함이 현실적으로 다가온다.', createdAt: 1756684800000 },
        { id: 'demo-c2', text: '대사의 여백이 커서 오히려 감정이 오래 남는다.', createdAt: 1756771200000 },
      ],
      'demo:bear:4423392': [{ id: 'demo-c3', text: '주방의 긴장감과 인물들의 호흡이 특히 좋았던 회차.', createdAt: 1759363200000 }],
      'demo:dune:693134': [{ id: 'demo-c4', text: '압도적인 화면과 사운드를 다시 떠올리게 하는 영화.', createdAt: 1762041600000 }],
      'demo:frieren:3946240': [{ id: 'demo-c5', text: '모험 이후의 시간을 다루는 방식이 인상적이다.', createdAt: 1764633600000 }],
      'demo:moving:4543077': [{ id: 'demo-c6', text: '두 인물이 가까워지는 장면의 리듬이 좋았다.', createdAt: 1767312000000 }],
      'demo:solitary-gourmet:933621': [{ id: 'demo-c7', text: '조용히 한 끼를 즐기는 분위기가 편안하다.', createdAt: 1769904000000 }],
      'demo:blue-eye:4387269': [{ id: 'demo-c8', text: '색감과 액션 연출이 강렬해서 다음 회차가 궁금해진다.', createdAt: 1772323200000 }],
    },
  };
})();
