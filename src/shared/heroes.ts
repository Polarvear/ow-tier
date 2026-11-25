import type { Hero } from './types';

export const ROLE_META = {
  tank: {
    labelKo: '돌격',
    labelEn: 'TANK',
    badgeClass: 'bg-sky-500/20 text-sky-300 border-sky-400/40',
    glowColor: '#38bdf8',
  },
  damage: {
    labelKo: '공격',
    labelEn: 'DAMAGE',
    badgeClass: 'bg-rose-500/20 text-rose-300 border-rose-400/40',
    glowColor: '#fb7185',
  },
  support: {
    labelKo: '지원',
    labelEn: 'SUPPORT',
    badgeClass: 'bg-emerald-500/20 text-emerald-300 border-emerald-400/40',
    glowColor: '#34d399',
  },
} as const;

export const FEMALE_HEROES: Hero[] = [
  // Tank (6)
  {
    id: 'dva',
    nameKo: 'D.Va',
    nameEn: 'D.Va',
    role: 'tank',
    imageUrl: '/images/heroes/dva.png',
    sourceArtworkUrl:
      'https://d15f34w2p8l1cc.cloudfront.net/overwatch/df5a5532862d9292634fb3dc0e51a4705aa601de65e5e815513ccc663d84de56.png',
    tagline: '게임 시작! 부산을 지키는 천재 프로게이머 메카 파일럿',
    accentColor: '#f472b6',
    isOmnic: false,
  },
  {
    id: 'junker-queen',
    nameKo: '정커퀸',
    nameEn: 'Junker Queen',
    role: 'tank',
    imageUrl: '/images/heroes/junker-queen.png',
    sourceArtworkUrl:
      'https://d15f34w2p8l1cc.cloudfront.net/overwatch/06eeecb359f311f43a8f5121d4f9f3a93c565d70b30e94ef543c05596c9a39dc.png',
    tagline: '쓰레기촌의 무자비한 지배자, 카리스마 넘치는 검투사',
    accentColor: '#38bdf8',
    isOmnic: false,
  },
  {
    id: 'zarya',
    nameKo: '자리야',
    nameEn: 'Zarya',
    role: 'tank',
    imageUrl: '/images/heroes/zarya.png',
    sourceArtworkUrl:
      'https://d15f34w2p8l1cc.cloudfront.net/overwatch/9b6f63cc66ddf9d5e0862173c733cc0d2e574c5c89357798d91b93b2f95a7080.png',
    tagline: '강인한 의지와 압도적 파워를 지닌 최강의 수호자',
    accentColor: '#ec4899',
    isOmnic: false,
  },
  {
    id: 'domina',
    nameKo: '도미나',
    nameEn: 'Domina',
    role: 'tank',
    imageUrl: '/images/heroes/domina.png',
    sourceArtworkUrl:
      'https://d15f34w2p8l1cc.cloudfront.net/overwatch/1161c112292c56c052c0ae711792fcde06e3251b98bc9709e582dd7585b5dcd6.png',
    tagline: '전장을 압도하는 강철 같은 전술의 지휘관',
    accentColor: '#a855f7',
    isOmnic: false,
  },
  {
    id: 'dmon',
    nameKo: 'D.Mon',
    nameEn: 'D.Mon',
    role: 'tank',
    imageUrl: '/images/heroes/dmon.png',
    sourceArtworkUrl:
      'https://d15f34w2p8l1cc.cloudfront.net/overwatch/a46c60b8562fdbd0b8308396d0808f7606fba208bc67cccf3f82fe56d2c73b9d.png',
    tagline: 'MEKA 부대의 든든한 방패, 붉은 메카의 에이스 파일럿',
    accentColor: '#ef4444',
    isOmnic: false,
  },
  {
    id: 'orisa',
    nameKo: '오리사',
    nameEn: 'Orisa',
    role: 'tank',
    imageUrl: '/images/heroes/orisa.png',
    sourceArtworkUrl:
      'https://d15f34w2p8l1cc.cloudfront.net/overwatch/a73958a28551f5254f3ab3f97c5f5f8d698a95c0b6a515d1a2b1caac169205a6.png',
    tagline: '눔바니의 수호자, 창과 방패로 아군을 지키는 옴닉 영웅',
    accentColor: '#22c55e',
    isOmnic: true,
  },

  // Damage (13)
  {
    id: 'tracer',
    nameKo: '트레이서',
    nameEn: 'Tracer',
    role: 'damage',
    imageUrl: '/images/heroes/tracer.png',
    sourceArtworkUrl:
      'https://d15f34w2p8l1cc.cloudfront.net/overwatch/4504f6f15cb3feaa92ecd38e01dcf751cb5abdac2e0bb52d0555727e53277502.png',
    tagline: '안녕 친구들, 해결사가 왔어! 시간 도약의 아이콘',
    accentColor: '#fb923c',
    isOmnic: false,
  },
  {
    id: 'widowmaker',
    nameKo: '위도우메이커',
    nameEn: 'Widowmaker',
    role: 'damage',
    imageUrl: '/images/heroes/widowmaker.png',
    sourceArtworkUrl:
      'https://d15f34w2p8l1cc.cloudfront.net/overwatch/6e4702b45f196aaf51555cf57327322721f45458b17f5f0643ed008a88378259.png',
    tagline: '한 발, 한 명. 냉혹하고 우아한 탈론의 저격수',
    accentColor: '#a855f7',
    isOmnic: false,
  },
  {
    id: 'ashe',
    nameKo: '애쉬',
    nameEn: 'Ashe',
    role: 'damage',
    imageUrl: '/images/heroes/ashe.png',
    sourceArtworkUrl:
      'https://d15f34w2p8l1cc.cloudfront.net/overwatch/4076bbaa2eb52a0bfe612434071e56e7702d5454473dbbea2f9e392a9d997a94.png',
    tagline: '밥, 뭐라도 좀 해봐! 데드락 갱단의 카리스마 두목',
    accentColor: '#dc2626',
    isOmnic: false,
  },
  {
    id: 'pharah',
    nameKo: '파라',
    nameEn: 'Pharah',
    role: 'damage',
    imageUrl: '/images/heroes/pharah.png',
    sourceArtworkUrl:
      'https://d15f34w2p8l1cc.cloudfront.net/overwatch/60ac2d5de4a6d34644d8872233da402f1436c87f804bb11a21661bb30bf4a51f.png',
    tagline: '하늘에서 정의가 빗발친다! 랩토라 수트의 창공 지배자',
    accentColor: '#2563eb',
    isOmnic: false,
  },
  {
    id: 'mei',
    nameKo: '메이',
    nameEn: 'Mei',
    role: 'damage',
    imageUrl: '/images/heroes/mei.png',
    sourceArtworkUrl:
      'https://d15f34w2p8l1cc.cloudfront.net/overwatch/4a55ced3bd597fb08e0fde9dc007f8543ac616ba98ca3db9b0e4d871a8ae17f8.png',
    tagline: '우리 세계는 지킬 가치가 있어요! 다정한 기후학자',
    accentColor: '#38bdf8',
    isOmnic: false,
  },
  {
    id: 'sojourn',
    nameKo: '소전',
    nameEn: 'Sojourn',
    role: 'damage',
    imageUrl: '/images/heroes/sojourn.png',
    sourceArtworkUrl:
      'https://d15f34w2p8l1cc.cloudfront.net/overwatch/82b8c1b8765dcb9a0ba16e343c3516bf324c771ac81e9878473280216e70a889.png',
    tagline: '오버워치 전 사령관, 완벽한 레일건의 전술가',
    accentColor: '#f43f5e',
    isOmnic: false,
  },
  {
    id: 'symmetra',
    nameKo: '시메트라',
    nameEn: 'Symmetra',
    role: 'damage',
    imageUrl: '/images/heroes/symmetra.png',
    sourceArtworkUrl:
      'https://d15f34w2p8l1cc.cloudfront.net/overwatch/ebec57e8bd68b3d4383edfeb34f8f52dd0b94a6467d594c2fee722e8a97c32aa.png',
    tagline: '빛으로 질서를 빚어내는 비슈카르의 완벽주의 건축가',
    accentColor: '#06b6d4',
    isOmnic: false,
  },
  {
    id: 'freja',
    nameKo: '프레야',
    nameEn: 'Freja',
    role: 'damage',
    imageUrl: '/images/heroes/freja.png',
    sourceArtworkUrl:
      'https://d15f34w2p8l1cc.cloudfront.net/overwatch/811963897c352d9f178bec882d94bd0281074feee7c429c5145b6b8ea8ebe862.png',
    tagline: '폭발 볼트로 목표를 추적하는 날카로운 현상금 사냥꾼',
    accentColor: '#0ea5e9',
    isOmnic: false,
  },
  {
    id: 'vendetta',
    nameKo: '벤데타',
    nameEn: 'Vendetta',
    role: 'damage',
    imageUrl: '/images/heroes/vendetta.png',
    sourceArtworkUrl:
      'https://d15f34w2p8l1cc.cloudfront.net/overwatch/cf8ffb52b6f315546d5e94e9d6defad5a2c570798776956de23f47536f9529da.png',
    tagline: '복수의 칼날을 휘두르는 치명적인 근접 암살자',
    accentColor: '#e11d48',
    isOmnic: false,
  },
  {
    id: 'anran',
    nameKo: '안란',
    nameEn: 'Anran',
    role: 'damage',
    imageUrl: '/images/heroes/anran.png',
    sourceArtworkUrl:
      'https://d15f34w2p8l1cc.cloudfront.net/overwatch/2c38b41d79a1ce9a08b9ad8eb7edf3ff819bd448af16a5815be8c7fdb7203aa0.png',
    tagline: '불꽃 같은 기세로 전장을 가르는 날렵한 침투가',
    accentColor: '#f97316',
    isOmnic: false,
  },
  {
    id: 'sierra',
    nameKo: '시에라',
    nameEn: 'Sierra',
    role: 'damage',
    imageUrl: '/images/heroes/sierra.png',
    sourceArtworkUrl:
      'https://d15f34w2p8l1cc.cloudfront.net/overwatch/4bfd3d8b95844231115cb5bf4db03344c71bc3e865189c52403b2dc51438e63a.png',
    tagline: '정밀한 정찰과 화력으로 판도를 뒤집는 전술 요원',
    accentColor: '#14b8a6',
    isOmnic: false,
  },
  {
    id: 'shion',
    nameKo: '시온',
    nameEn: 'Shion',
    role: 'damage',
    imageUrl: '/images/heroes/shion.png',
    sourceArtworkUrl:
      'https://d15f34w2p8l1cc.cloudfront.net/overwatch/070481cf871590a2b45a51d1335f9fe3d65eb4e4d361ecdd998b34fae2ed65d5.png',
    tagline: '그림자처럼 스며들어 승부를 가르는 민첩한 결투자',
    accentColor: '#8b5cf6',
    isOmnic: false,
  },
  {
    id: 'echo',
    nameKo: '에코',
    nameEn: 'Echo',
    role: 'damage',
    imageUrl: '/images/heroes/echo.png',
    sourceArtworkUrl:
      'https://d15f34w2p8l1cc.cloudfront.net/overwatch/d4f2d5b0c2b7e82d61353186c5f23152ccba9d3569b50839aa580dca3e9114ba.png',
    tagline: '모든 가능성을 복제하는 순백의 차세대 인공지능',
    accentColor: '#38bdf8',
    isOmnic: true,
  },

  // Support (8)
  {
    id: 'mercy',
    nameKo: '메르시',
    nameEn: 'Mercy',
    role: 'support',
    imageUrl: '/images/heroes/mercy.png',
    sourceArtworkUrl:
      'https://d15f34w2p8l1cc.cloudfront.net/overwatch/3bfb8bd8ec827e53d870f1238ab73d8aa1f5dbfbcfaaf7f96ffcd35b5c6102ab.png',
    tagline: '영웅은 죽지 않아요! 전장을 수놓는 발키리 수호천사',
    accentColor: '#facc15',
    isOmnic: false,
  },
  {
    id: 'kiriko',
    nameKo: '키리코',
    nameEn: 'Kiriko',
    role: 'support',
    imageUrl: '/images/heroes/kiriko.png',
    sourceArtworkUrl:
      'https://d15f34w2p8l1cc.cloudfront.net/overwatch/408603fe037e8576078eaac5eab2fb251489ced4003b11f5f522776d43d0b83d.png',
    tagline: '여우님이 길을 인도하시리라! 카네자카의 닌자 치유사',
    accentColor: '#f43f5e',
    isOmnic: false,
  },
  {
    id: 'juno',
    nameKo: '주노',
    nameEn: 'Juno',
    role: 'support',
    imageUrl: '/images/heroes/juno.png',
    sourceArtworkUrl:
      'https://d15f34w2p8l1cc.cloudfront.net/overwatch/c0167d251e57b0aa2b1e16c37d87f0e7c77263db9dd0503d77b5f2589bf3e4a0.png',
    tagline: '화성에서 온 호기심 가득한 우주 비행사 서포터',
    accentColor: '#c084fc',
    isOmnic: false,
  },
  {
    id: 'ana',
    nameKo: '아나',
    nameEn: 'Ana',
    role: 'support',
    imageUrl: '/images/heroes/ana.png',
    sourceArtworkUrl:
      'https://d15f34w2p8l1cc.cloudfront.net/overwatch/985b06beae46b7ba3ca87d1512d0fc62ca7f206ceca58ef16fc44d43a1cc84ed.png',
    tagline: '전설의 저격수이자 오버워치 창립 멤버의 품격',
    accentColor: '#60a5fa',
    isOmnic: false,
  },
  {
    id: 'brigitte',
    nameKo: '브리기테',
    nameEn: 'Brigitte',
    role: 'support',
    imageUrl: '/images/heroes/brigitte.png',
    sourceArtworkUrl:
      'https://d15f34w2p8l1cc.cloudfront.net/overwatch/795fba91376d87d441a7f359ae12a3175dfa95825ccc4414cc6b95b129fc4cb0.png',
    tagline: '모두 내게 집결! 당당하고 씩씩한 최전선 방패 기사',
    accentColor: '#f59e0b',
    isOmnic: false,
  },
  {
    id: 'moira',
    nameKo: '모이라',
    nameEn: 'Moira',
    role: 'support',
    imageUrl: '/images/heroes/moira.png',
    sourceArtworkUrl:
      'https://d15f34w2p8l1cc.cloudfront.net/overwatch/f48f8485056d5d00dad195859188d23e50f7126b8b08b5646f46ef1b42f5e1de.png',
    tagline: '금기를 넘어 진화를 탐구하는 천재 유전학자',
    accentColor: '#9333ea',
    isOmnic: false,
  },
  {
    id: 'illari',
    nameKo: '일리아리',
    nameEn: 'Illari',
    role: 'support',
    imageUrl: '/images/heroes/illari.png',
    sourceArtworkUrl:
      'https://d15f34w2p8l1cc.cloudfront.net/overwatch/ce42d1455e03e79f321345fea84b27a8918b5db8bd7ab9b2ca9e569606ede9e4.png',
    tagline: '태양의 힘으로 어둠을 밝히는 최후의 인티 전사',
    accentColor: '#fbbf24',
    isOmnic: false,
  },
  {
    id: 'sombra',
    nameKo: '솜브라',
    nameEn: 'Sombra',
    role: 'support',
    imageUrl: '/images/heroes/sombra.png',
    sourceArtworkUrl:
      'https://d15f34w2p8l1cc.cloudfront.net/overwatch/47727b02a16e3bd7b2447d86ae1edf11587bc320b2aecb4f2f16a7ca4ad4e8a0.png',
    tagline: '모든 건 해킹될 수 있지! 장난기 넘치는 세계 최고의 해커',
    accentColor: '#7c3aed',
    isOmnic: false,
  },
];

export const HERO_MAP = new Map(FEMALE_HEROES.map((hero) => [hero.id, hero]));
