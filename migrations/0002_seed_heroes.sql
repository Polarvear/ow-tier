-- Seed 27 official Overwatch base female heroes

INSERT OR IGNORE INTO heroes (id, name_ko, name_en, role, image_url, tagline, accent_color, is_omnic) VALUES
('dva', 'D.Va', 'D.Va', 'tank', '/images/heroes/dva.png', '게임 시작! 부산을 지키는 천재 프로게이머 메카 파일럿', '#f472b6', 0),
('junker-queen', '정커퀸', 'Junker Queen', 'tank', '/images/heroes/junker-queen.png', '쓰레기촌의 무자비한 지배자, 카리스마 넘치는 검투사', '#38bdf8', 0),
('zarya', '자리야', 'Zarya', 'tank', '/images/heroes/zarya.png', '강인한 의지와 압도적 파워를 지닌 최강의 수호자', '#ec4899', 0),
('domina', '도미나', 'Domina', 'tank', '/images/heroes/domina.png', '전장을 압도하는 강철 같은 전술의 지휘관', '#a855f7', 0),
('dmon', 'D.Mon', 'D.Mon', 'tank', '/images/heroes/dmon.png', 'MEKA 부대의 든든한 방패, 붉은 메카의 에이스 파일럿', '#ef4444', 0),
('orisa', '오리사', 'Orisa', 'tank', '/images/heroes/orisa.png', '눔바니의 수호자, 창과 방패로 아군을 지키는 옴닉 영웅', '#22c55e', 1),

('tracer', '트레이서', 'Tracer', 'damage', '/images/heroes/tracer.png', '안녕 친구들, 해결사가 왔어! 시간 도약의 아이콘', '#fb923c', 0),
('widowmaker', '위도우메이커', 'Widowmaker', 'damage', '/images/heroes/widowmaker.png', '한 발, 한 명. 냉혹하고 우아한 탈론의 저격수', '#a855f7', 0),
('ashe', '애쉬', 'Ashe', 'damage', '/images/heroes/ashe.png', '밥, 뭐라도 좀 해봐! 데드락 갱단의 카리스마 두목', '#dc2626', 0),
('pharah', '파라', 'Pharah', 'damage', '/images/heroes/pharah.png', '하늘에서 정의가 빗발친다! 랩토라 수트의 창공 지배자', '#2563eb', 0),
('mei', '메이', 'Mei', 'damage', '/images/heroes/mei.png', '우리 세계는 지킬 가치가 있어요! 다정한 기후학자', '#38bdf8', 0),
('sojourn', '소전', 'Sojourn', 'damage', '/images/heroes/sojourn.png', '오버워치 전 사령관, 완벽한 레일건의 전술가', '#f43f5e', 0),
('symmetra', '시메트라', 'Symmetra', 'damage', '/images/heroes/symmetra.png', '빛으로 질서를 빚어내는 비슈카르의 완벽주의 건축가', '#06b6d4', 0),
('freja', '프레야', 'Freja', 'damage', '/images/heroes/freja.png', '폭발 볼트로 목표를 추적하는 날카로운 현상금 사냥꾼', '#0ea5e9', 0),
('vendetta', '벤데타', 'Vendetta', 'damage', '/images/heroes/vendetta.png', '복수의 칼날을 휘두르는 치명적인 근접 암살자', '#e11d48', 0),
('anran', '안란', 'Anran', 'damage', '/images/heroes/anran.png', '불꽃 같은 기세로 전장을 가르는 날렵한 침투가', '#f97316', 0),
('sierra', '시에라', 'Sierra', 'damage', '/images/heroes/sierra.png', '정밀한 정찰과 화력으로 판도를 뒤집는 전술 요원', '#14b8a6', 0),
('shion', '시온', 'Shion', 'damage', '/images/heroes/shion.png', '그림자처럼 스며들어 승부를 가르는 민첩한 결투자', '#8b5cf6', 0),
('echo', '에코', 'Echo', 'damage', '/images/heroes/echo.png', '모든 가능성을 복제하는 순백의 차세대 인공지능', '#38bdf8', 1),

('mercy', '메르시', 'Mercy', 'support', '/images/heroes/mercy.png', '영웅은 죽지 않아요! 전장을 수놓는 발키리 수호천사', '#facc15', 0),
('kiriko', '키리코', 'Kiriko', 'support', '/images/heroes/kiriko.png', '여우님이 길을 인도하시리라! 카네자카의 닌자 치유사', '#f43f5e', 0),
('juno', '주노', 'Juno', 'support', '/images/heroes/juno.png', '화성에서 온 호기심 가득한 우주 비행사 서포터', '#c084fc', 0),
('ana', '아나', 'Ana', 'support', '/images/heroes/ana.png', '전설의 저격수이자 오버워치 창립 멤버의 품격', '#60a5fa', 0),
('brigitte', '브리기테', 'Brigitte', 'support', '/images/heroes/brigitte.png', '모두 내게 집결! 당당하고 씩씩한 최전선 방패 기사', '#f59e0b', 0),
('moira', '모이라', 'Moira', 'support', '/images/heroes/moira.png', '금기를 넘어 진화를 탐구하는 천재 유전학자', '#9333ea', 0),
('illari', '일리아리', 'Illari', 'support', '/images/heroes/illari.png', '태양의 힘으로 어둠을 밝히는 최후의 인티 전사', '#fbbf24', 0),
('sombra', '솜브라', 'Sombra', 'support', '/images/heroes/sombra.png', '모든 건 해킹될 수 있지! 장난기 넘치는 세계 최고의 해커', '#7c3aed', 0);
