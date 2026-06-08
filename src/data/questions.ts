export interface Option {
  label: string;
  text: string;
  score: number;
}

export interface Question {
  id: number;
  category: string;
  context: string;
  is_pressure: boolean;
  cross_val_pair: string | null;
  pair_id: number | null;
  text: string;
  options: Option[];
}

export const QUESTIONS: Question[] = [
  {
    id:1,category:"문제설계력",context:"업무",is_pressure:false,cross_val_pair:null,pair_id:null,
    text:"프로젝트 회의를 반복해도 결과물이 나오지 않고 있습니다. 팀원들도 '뭔가 막힌 것 같다'고 느끼는 상황입니다. 당신이 가장 먼저 확인하는 것은 무엇입니까?",
    options:[
      {label:"①",text:"회의록과 자료를 다시 훑어보며 누락된 항목이 있는지 점검한다.",score:1},
      {label:"②",text:"일정표를 펴고 어느 단계에서 지연이 시작됐는지 타임라인을 추적한다.",score:2},
      {label:"③",text:"팀원 각자가 이 프로젝트의 최종 목표를 어떻게 이해하고 있는지 한 명씩 확인한다.",score:3},
      {label:"④",text:"프로젝트의 목표가 처음부터 측정 가능하게 정의되어 있었는지, 성공 기준 자체를 다시 검토한다.",score:4},
    ],
  },
  {
    id:2,category:"판단정확도",context:"업무",is_pressure:false,cross_val_pair:"normal",pair_id:1,
    text:"동료가 공유한 자료에 '고객 만족도 92%'라는 수치가 있습니다. 출처는 '자체 조사'라고만 표기되어 있습니다. 이 수치를 외부 발표 자료에 인용하려 합니다. 어떻게 합니까?",
    options:[
      {label:"①",text:"내부 자료도 공식 수치다. 그대로 인용한다.",score:1},
      {label:"②",text:"'자체 조사 기준'이라는 단서를 달고 인용한다.",score:2},
      {label:"③",text:"조사 방법(샘플 수·기간·질문 방식)을 확인한 뒤 인용 여부를 결정한다.",score:3},
      {label:"④",text:"조사 방법을 확인하고, 외부 공신력 있는 데이터와 교차 검증 후 인용 범위를 결정한다.",score:4},
    ],
  },
  {
    id:3,category:"변화민첩도",context:"업무",is_pressure:false,cross_val_pair:null,pair_id:null,
    text:"조직 전체가 새로운 협업 툴로 전환해야 합니다. 기존 방식이 익숙하고 특별히 불편하지도 않았습니다. 당신의 첫 반응은 무엇입니까?",
    options:[
      {label:"①",text:"일단 따라가되, 불편한 점이 생기면 그때 적응 방법을 찾는다.",score:1},
      {label:"②",text:"전환 전에 기존 방식의 어떤 점이 새 툴로 해결되는지 먼저 파악해둔다.",score:2},
      {label:"③",text:"다른 사람보다 먼저 써보고, 팀원들이 막히는 부분을 도와줄 준비를 한다.",score:3},
      {label:"④",text:"새 툴을 빠르게 익힌 뒤, 팀 전체의 전환 속도를 높일 수 있는 간단한 가이드나 팁을 만들어 공유한다.",score:4},
    ],
  },
  {
    id:4,category:"실행돌파력",context:"업무",is_pressure:false,cross_val_pair:null,pair_id:null,
    text:"회의에서 한 사람이 제안한 아이디어가 분명히 비효율적으로 보입니다. 그 사람이 분위기를 주도하고 있고, 다른 참석자들도 동의하는 분위기입니다. 당신은 어떻게 합니까?",
    options:[
      {label:"①",text:"일단 동의하고, 실행 단계에서 문제가 드러나면 그때 수정을 제안한다.",score:1},
      {label:"②",text:"분위기를 깨지 않기 위해 회의 후 조용히 그 사람에게 따로 얘기한다.",score:2},
      {label:"③",text:"지금 이 자리에서 구체적인 우려 사항을 데이터나 예시와 함께 제기한다.",score:3},
      {label:"④",text:"지금 자리에서 우려를 제기하고, 동시에 더 나은 대안을 즉시 제시하여 논의를 생산적으로 전환한다.",score:4},
    ],
  },
  {
    id:5,category:"문제설계력",context:"업무",is_pressure:false,cross_val_pair:"normal",pair_id:2,
    text:"상반기 목표를 달성하지 못했습니다. 팀원마다 원인 분석이 다릅니다(경기 탓, 프로세스 문제, 역량 부족 등). 보고를 위한 분석을 어떻게 시작합니까?",
    options:[
      {label:"①",text:"팀원 의견 중 가장 많이 언급된 원인을 주요 원인으로 정하고 분석한다.",score:1},
      {label:"②",text:"외부 요인(시장·경쟁)과 내부 요인(역량·프로세스)으로 분리해 각각 데이터를 수집한다.",score:2},
      {label:"③",text:"목표 미달이 전체적인 현상인지, 특정 영역·시기에만 발생했는지를 먼저 구분해 원인 범위를 좁힌다.",score:3},
      {label:"④",text:"미달의 패턴을 시기·영역·담당자별로 세분화한 뒤, 변수별 상관관계를 찾아 진짜 구조적 원인을 규명한다.",score:4},
    ],
  },
  {
    id:6,category:"판단정확도",context:"일상",is_pressure:false,cross_val_pair:null,pair_id:null,
    text:"SNS에서 '이 방법으로 한 달 만에 10kg 감량'이라는 게시물이 퍼지고 있습니다. 댓글에는 성공 후기가 수십 개 달려 있습니다. 이 정보를 어떻게 받아들입니까?",
    options:[
      {label:"①",text:"후기가 많으면 어느 정도 효과가 있는 것이다. 따라해볼 만하다.",score:1},
      {label:"②",text:"검색해서 반박 의견이나 전문가 견해를 찾아본 다음 판단한다.",score:2},
      {label:"③",text:"성공 후기만 공유되는 구조적 편향을 고려하고, 이 방법의 원리가 과학적으로 타당한지 먼저 따진다.",score:3},
      {label:"④",text:"편향 구조를 분석하고, 신뢰할 수 있는 연구 데이터를 직접 찾아 원리의 타당성과 개인별 적용 가능성까지 검토한다.",score:4},
    ],
  },
  {
    id:7,category:"변화민첩도",context:"업무",is_pressure:false,cross_val_pair:"normal",pair_id:3,
    text:"내가 맡아온 업무 영역이 AI 도구 도입으로 상당 부분 자동화될 것이 확실해졌습니다. 아직 당장 영향은 없지만, 1~2년 안에 변화가 예상됩니다. 지금 당신이 취할 행동은?",
    options:[
      {label:"①",text:"아직 변화가 오지 않았다. 실제로 닥쳤을 때 대응해도 충분하다.",score:1},
      {label:"②",text:"AI가 대체하기 어려운 고난이도 영역에 더 깊이 파고들어 전문성을 강화한다.",score:2},
      {label:"③",text:"기존 전문성과 AI 활용 능력을 결합해, 내 역할을 '결과물을 설계하고 검토하는 사람'으로 재정의한다.",score:3},
      {label:"④",text:"역할을 재정의하고, AI 도구를 직접 구축·운용하거나 조직 내 AI 도입을 주도하는 위치로 선제적으로 이동한다.",score:4},
    ],
  },
  {
    id:8,category:"실행돌파력",context:"업무",is_pressure:true,cross_val_pair:"pressure",pair_id:1,
    text:"중요한 발표가 내일 오전인데, 오늘 오후 준비 자료에서 핵심 수치 오류를 발견했습니다. 수정하면 전체 논리 구조를 바꿔야 하고, 담당자는 이미 퇴근했습니다. 어떻게 합니까?",
    options:[
      {label:"①",text:"오류가 작아 발표에 큰 영향이 없을 것이다. 내일 발표 후 정정한다.",score:1},
      {label:"②",text:"오류 부분만 빠르게 수정하고, 논리 구조는 최대한 살려 마무리한다.",score:2},
      {label:"③",text:"퇴근한 담당자에게 연락해 상황을 공유하고, 함께 수정 방향을 잡아 밤새 고친다.",score:3},
      {label:"④",text:"담당자에게 즉시 연락하고, 동시에 수정 작업을 시작한다. 발표 당일 오전 시작 전까지 검토 완료 시간을 확보하고, 필요시 발표자에게 미리 브리핑한다.",score:4},
    ],
  },
  {
    id:9,category:"문제설계력",context:"업무",is_pressure:false,cross_val_pair:null,pair_id:null,
    text:"AI 도구에 '우리 제품의 강점을 분석해줘'라고 요청했더니 너무 일반적인 내용만 나왔습니다. 더 쓸모 있는 결과를 얻기 위해 어떻게 합니까?",
    options:[
      {label:"①",text:"다른 AI 도구를 사용해 같은 질문을 해보고 더 나은 결과를 선택한다.",score:1},
      {label:"②",text:"AI 결과에 내 경험을 더해 직접 보강한다.",score:2},
      {label:"③",text:"'경쟁사 X와 비교했을 때 우리 제품이 Y 고객군에서 차별화되는 점'처럼 맥락을 구체적으로 넣어 질문을 다시 설계한다.",score:3},
      {label:"④",text:"제품·고객·경쟁사·시장 맥락을 모두 명시하고, AI에게 특정 관점(예: 구매 결정권자 입장)에서 분석하도록 역할까지 부여해 질문을 재설계한다.",score:4},
    ],
  },
  {
    id:10,category:"판단정확도",context:"업무",is_pressure:true,cross_val_pair:"pressure",pair_id:2,
    text:"오늘 마감인 보고서를 마무리하던 중, 핵심 근거로 쓴 외부 데이터가 1년 전 자료라는 것을 방금 알았습니다. 최신 데이터를 찾으려면 2~3시간이 더 걸립니다. 어떻게 합니까?",
    options:[
      {label:"①",text:"1년 전 자료도 큰 추세는 변하지 않는다. 그대로 제출한다.",score:1},
      {label:"②",text:"보고서에 '○○년 기준 데이터'임을 명시하고 제출한다. 최신 데이터는 후속 자료로 보완한다.",score:2},
      {label:"③",text:"담당자에게 데이터 이슈를 먼저 알리고 마감 조정 가능성을 확인한 뒤, 최신 데이터로 교체한다.",score:3},
      {label:"④",text:"담당자에게 즉시 이슈를 보고하고, 빠르게 확보 가능한 공신력 있는 최신 데이터 소스를 병렬로 탐색해 최단 시간 내 교체하거나, 데이터 한계를 명확히 기술한 조건부 제출안을 준비한다.",score:4},
    ],
  },
  {
    id:11,category:"실행돌파력",context:"일상",is_pressure:false,cross_val_pair:null,pair_id:null,
    text:"운동, 독서, 언어 학습 등 꾸준히 하겠다고 결심한 것들이 작심삼일로 끝나는 경우가 많습니다. 당신은 보통 어떻게 대처합니까?",
    options:[
      {label:"①",text:"의지력의 문제다. 더 강한 각오로 다시 시작한다.",score:1},
      {label:"②",text:"목표 크기를 줄인다. '매일 30분'이 힘들면 '매일 5분'으로 시작한다.",score:2},
      {label:"③",text:"왜 번번이 멈추는지 패턴을 먼저 파악한다. 시간대, 방해 요인, 현실적 장벽 등 원인을 알아야 바꿀 수 있다.",score:3},
      {label:"④",text:"실패 패턴을 구조적으로 분석한 뒤, 환경 자체를 재설계한다. (알림 제거, 공간 변경, 루틴 연결 등으로 의지력 불필요한 시스템 구축)",score:4},
    ],
  },
  {
    id:12,category:"변화민첩도",context:"일상",is_pressure:false,cross_val_pair:null,pair_id:null,
    text:"평소 즐겨 보던 유튜브 채널이나 콘텐츠 취향이 있고, 알고리즘은 늘 비슷한 영상만 추천해줍니다. 이 상황에서 당신은 어떻게 행동합니까?",
    options:[
      {label:"①",text:"좋아하는 걸 보는 게 맞다. 알고리즘대로 즐긴다.",score:1},
      {label:"②",text:"가끔 관심 없던 주제도 눌러보며 새로운 취미를 탐색한다.",score:2},
      {label:"③",text:"의도적으로 불편하거나 동의하지 않는 관점의 콘텐츠를 찾아본다. 시각이 넓어진다.",score:3},
      {label:"④",text:"알고리즘 편향을 인식하고 의도적으로 다양한 분야를 주기적으로 탐색한다. 새로운 시각이 실제 문제 해결에 연결될 수 있도록 메모하거나 적용한다.",score:4},
    ],
  },
  {
    id:13,category:"문제설계력",context:"일상",is_pressure:false,cross_val_pair:null,pair_id:null,
    text:"오랜 친구가 자꾸 같은 연애 고민을 털어놓습니다. 이야기를 들을수록 '문제가 연애 자체가 아닐 수도 있다'는 생각이 듭니다. 당신은 어떻게 반응합니까?",
    options:[
      {label:"①",text:"친구가 힘들어하니 공감해주고 위로한다. 조언은 나중에 해도 된다.",score:1},
      {label:"②",text:"연애 문제에 대한 현실적인 조언과 해결책을 제시한다.",score:2},
      {label:"③",text:"공감한 뒤, '혹시 연애 말고 다른 부분에서 스트레스받고 있는 건 아냐?'라고 더 깊은 원인을 탐색하는 질문을 건넨다.",score:3},
      {label:"④",text:"공감 후 친구가 스스로 문제의 본질을 인식할 수 있도록 질문을 설계해나간다. '같은 상황이 반복되는 건 어떤 패턴 때문일까?'처럼 구조적 통찰을 유도한다.",score:4},
    ],
  },
  {
    id:14,category:"판단정확도",context:"일상",is_pressure:false,cross_val_pair:null,pair_id:null,
    text:"단체 채팅방에 충격적이고 자극적인 뉴스 기사가 공유됐습니다. 당신은 이 기사를 어떻게 처리합니까?",
    options:[
      {label:"①",text:"기사가 맞는 것 같다. 내 생각을 댓글로 달거나 다른 채팅방에 공유한다.",score:1},
      {label:"②",text:"다른 언론사 기사를 검색해 같은 내용이 있는지 확인하고 나서 반응한다.",score:2},
      {label:"③",text:"기사 출처, 인용 방식, 맥락 생략 여부를 먼저 따진다. 자극적인 기사일수록 편집 의도가 있을 수 있다.",score:3},
      {label:"④",text:"출처·인용·맥락을 분석하고, 이 기사가 왜 지금 확산되는지 구조적 배경까지 파악한 뒤 판단한다. 필요시 사실 여부를 팀원에게 공유한다.",score:4},
    ],
  },
  {
    id:15,category:"실행돌파력",context:"일상",is_pressure:true,cross_val_pair:"pressure",pair_id:3,
    text:"모임에서 모두가 한 방향으로 결정을 내리려 하는데, 당신만 그게 틀렸다는 생각이 강하게 듭니다. 분위기를 깨는 것이 부담스럽습니다. 어떻게 합니까?",
    options:[
      {label:"①",text:"내가 잘못 이해한 것일 수 있다. 모임의 결정을 따른다.",score:1},
      {label:"②",text:"모임이 끝난 뒤 가까운 사람에게만 조용히 의견을 말한다.",score:2},
      {label:"③",text:"불편하더라도 지금 이 자리에서 '한 가지만 확인하고 싶다'며 구체적 의문을 제기한다.",score:3},
      {label:"④",text:"지금 자리에서 의문을 제기하고, 논의를 차단하지 않으면서도 결정이 재검토될 수 있도록 구체적 근거와 질문을 전략적으로 제시한다.",score:4},
    ],
  },
  {
    id:16,category:"변화민첩도",context:"일상",is_pressure:false,cross_val_pair:null,pair_id:null,
    text:"오래 써온 방식(앱, 습관, 루틴 등)보다 더 나은 대안이 있다는 것을 알게 됐습니다. 하지만 바꾸는 데 시간과 노력이 필요합니다. 당신은 어떻게 합니까?",
    options:[
      {label:"①",text:"지금 방식이 크게 불편하지 않다. 굳이 바꿀 필요를 못 느낀다.",score:1},
      {label:"②",text:"더 나은 방법이 충분히 검증되면 그때 바꾼다. 지금 당장은 아니다.",score:2},
      {label:"③",text:"'더 낫다'는 것을 알았다면 지금 당장 시작한다. 초기 불편은 감수할 만하다.",score:3},
      {label:"④",text:"즉시 전환을 시작하되, 전환 비용을 최소화할 방법을 먼저 설계한다. 새 방식이 루틴에 정착되도록 환경까지 바꾼다.",score:4},
    ],
  },
  {
    id:17,category:"문제설계력",context:"일상",is_pressure:false,cross_val_pair:null,pair_id:null,
    text:"중요한 선택(이직, 이사, 큰 구매 등)을 앞두고 있습니다. 주변 사람마다 하는 말이 다릅니다. 당신은 어떻게 결정을 내립니까?",
    options:[
      {label:"①",text:"가장 신뢰하는 사람의 의견을 따른다.",score:1},
      {label:"②",text:"장단점을 표로 정리하고 점수를 매겨 가장 높은 선택지를 고른다.",score:2},
      {label:"③",text:"'내가 이 선택으로 무엇을 얻으려 하는가'를 먼저 명확히 한 뒤, 그 기준에 맞는 정보만 추려서 판단한다.",score:3},
      {label:"④",text:"선택의 본질적 목적을 먼저 정의하고, 각 선택지의 단기·장기 결과를 시뮬레이션한 뒤, 되돌리기 어려운 선택일수록 기준을 더 엄격히 적용한다.",score:4},
    ],
  },
  {
    id:18,category:"판단정확도",context:"업무",is_pressure:false,cross_val_pair:null,pair_id:null,
    text:"상사가 지시한 방향이 당신이 조사한 내용과 다릅니다. 상사는 '업계가 다 이렇게 한다'고 하지만, 당신이 찾은 자료에는 반대 사례가 여럿 있습니다. 어떻게 합니까?",
    options:[
      {label:"①",text:"상사가 더 많은 경험이 있다. 내 자료가 틀렸을 수 있으니 지시를 따른다.",score:1},
      {label:"②",text:"일단 지시대로 진행하되, 중간 점검 때 데이터를 꺼내 확인받는다.",score:2},
      {label:"③",text:"반대 사례 자료를 정리해서 상사에게 따로 보여주고, 방향 재검토를 요청한다.",score:3},
      {label:"④",text:"반대 사례를 체계적으로 정리하고, 우리 상황에 적용했을 때의 리스크와 기대 효과를 비교한 분석 자료를 만들어 의사결정 재검토를 공식 제안한다.",score:4},
    ],
  },
  {
    id:19,category:"실행돌파력",context:"일상",is_pressure:false,cross_val_pair:null,pair_id:null,
    text:"평소 친하지 않은 사람에게 먼저 연락하거나, 새로운 모임에 혼자 참석하거나, 낯선 경험에 자발적으로 나서는 것에 대해 당신은 어떻습니까?",
    options:[
      {label:"①",text:"원래 안 하던 일이다. 기회가 저절로 오면 하지만 먼저 나서진 않는다.",score:1},
      {label:"②",text:"부담스럽지만 좋은 기회라고 생각되면 용기를 내어 한다.",score:2},
      {label:"③",text:"불편함이 성장의 신호라고 생각한다. 의도적으로 낯선 상황에 나를 던진다.",score:3},
      {label:"④",text:"낯선 상황을 적극적으로 찾아 나서며, 그 경험에서 배운 것을 다음 행동으로 연결하는 루프를 만든다.",score:4},
    ],
  },
  {
    id:20,category:"변화민첩도",context:"일상",is_pressure:false,cross_val_pair:null,pair_id:null,
    text:"새로운 기술이나 도구(AI, 앱, 방법론 등)가 등장했을 때, 당신은 보통 어떻게 반응합니까?",
    options:[
      {label:"①",text:"필요성을 느낄 때까지 기다린다. 남들이 다 쓰면 그때 시작한다.",score:1},
      {label:"②",text:"관심은 있지만 안정화된 뒤에 도입한다. 초기 혼란을 피하고 싶다.",score:2},
      {label:"③",text:"빠르게 직접 써보고, 내 업무·생활에 적용 가능한지 실험한다.",score:3},
      {label:"④",text:"조기 도입 후 실제 활용 사례를 만들고, 주변에도 적용 방법을 공유해 조직·커뮤니티 전체의 학습 속도를 높인다.",score:4},
    ],
  },
];

export const CATEGORY_INFO: Record<string, { color: string; emoji: string; description: string }> = {
  "문제설계력": { color: "#00E5FF", emoji: "🧩", description: "문제의 본질을 정의하고 올바른 질문을 설계하는 능력" },
  "판단정확도": { color: "#BF5AF2", emoji: "🎯", description: "데이터와 정보를 비판적으로 평가하고 정확히 판단하는 능력" },
  "변화민첩도": { color: "#32D74B", emoji: "⚡", description: "변화를 빠르게 인식하고 선제적으로 적응·주도하는 능력" },
  "실행돌파력": { color: "#FF9F0A", emoji: "🚀", description: "압박 상황에서도 결단하고 끝까지 실행하는 능력" },
};

export const MBTI_LIST = [
  "INTJ","INTP","ENTJ","ENTP",
  "INFJ","INFP","ENFJ","ENFP",
  "ISTJ","ISFJ","ESTJ","ESFJ",
  "ISTP","ISFP","ESTP","ESFP",
];

export const MBTI_HINTS: Record<string, string> = {
  "INTJ": "장기 전략적 사고·독립적 실행에 강하나 유연성과 협업 소통이 약점일 수 있음",
  "INTP": "논리·분석에 탁월하나 실행력과 마감 준수가 도전 과제",
  "ENTJ": "결단력·리더십 강함, 세부 감성 소통에 주의 필요",
  "ENTP": "아이디어 풍부·변화 적응 빠름, 완료·정리 역량 강화 필요",
  "INFJ": "통찰력·장기 비전 강함, 실행 속도와 갈등 직면 개선 필요",
  "INFP": "가치 주도·창의적, 현실적 실행과 우선순위 설정 강화 필요",
  "ENFJ": "공감·조직력 탁월, 데이터 기반 판단과 자기주장 강화 필요",
  "ENFP": "에너지·창의성 높음, 집중력·실행 완결성이 핵심 과제",
  "ISTJ": "책임감·체계성 강함, 변화 수용과 새 방식 실험 영역이 도전",
  "ISFJ": "헌신적·배려 강함, 자기주장과 변화 주도력 개발 필요",
  "ESTJ": "실행력·조직화 탁월, 유연성과 감성 리더십 보완 필요",
  "ESFJ": "협력·조화 강함, 비판적 판단력과 독립적 의사결정 강화 필요",
  "ISTP": "분석·문제해결 탁월, 장기 전략과 협업 소통 강화 필요",
  "ISFP": "적응력·실용성 강함, 장기 계획과 적극적 표현이 도전",
  "ESTP": "즉각 실행·위기 대응 강함, 장기 전략과 깊이 있는 분석 강화 필요",
  "ESFP": "활력·즉흥성 강함, 계획성과 비판적 분석 역량 강화 필요",
};

export function getGrade(total: number): { grade: string; label: string; color: string } {
  if (total >= 72) return { grade: "S",  label: "AI 시대 설계자형 인재", color: "#32D74B" };
  if (total >= 64) return { grade: "A+", label: "전략적 실행가",          color: "#00E5FF" };
  if (total >= 56) return { grade: "A",  label: "성장 잠재형 인재",        color: "#BF5AF2" };
  if (total >= 46) return { grade: "B+", label: "안정 지향형 실무자",      color: "#FF9F0A" };
  if (total >= 36) return { grade: "B",  label: "루틴 의존형 실무자",      color: "#FF6B35" };
  return                   { grade: "C",  label: "현상 유지형",             color: "#FF453A" };
}

export function calcScores(answers: Record<number, number>): Record<string, number> {
  const scores: Record<string, number> = { "문제설계력": 0, "판단정확도": 0, "변화민첩도": 0, "실행돌파력": 0 };
  for (const q of QUESTIONS) {
    const idx = answers[q.id];
    if (idx !== undefined) scores[q.category] += q.options[idx].score;
  }
  return scores;
}

export function calcConsistency(answers: Record<number, number>): { consistency: number; alerts: string[] } {
  const pairMap: Record<number, Record<string, number | null>> = {};
  for (const q of QUESTIONS) {
    if (q.pair_id !== null && q.cross_val_pair) {
      if (!pairMap[q.pair_id]) pairMap[q.pair_id] = {};
      const idx = answers[q.id];
      pairMap[q.pair_id][q.cross_val_pair] = idx !== undefined ? q.options[idx].score : null;
    }
  }
  let penalty = 0;
  const alerts: string[] = [];
  const pairLabels: Record<number, string> = { 1: "세트 A", 2: "세트 B", 3: "세트 C" };
  for (const [pid, roles] of Object.entries(pairMap)) {
    const n = roles["normal"], p = roles["pressure"];
    if (n === 4 && p === 1) { penalty++; alerts.push(pairLabels[Number(pid)] || `세트 ${pid}`); }
  }
  return { consistency: Math.max(0, 100 - penalty * 34), alerts };
}
