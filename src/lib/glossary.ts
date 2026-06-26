// Glossary of fretted-instrument terms ("Glossário"). Static content; the
// database only tracks which terms a user has marked as understood.

export interface GlossaryTerm {
  id: string;
  term: string;
  category: "Básico" | "Técnica" | "Teoria" | "Ritmo" | "Equipamento";
  short: string;
  detail: string;
}

export const GLOSSARY: GlossaryTerm[] = [
  {
    id: "traste",
    term: "Traste",
    category: "Básico",
    short: "As divisórias de metal no braço.",
    detail:
      "Cada espaço entre dois trastes é uma 'casa'. Apertar a corda numa casa encurta a parte que vibra e deixa a nota mais aguda.",
  },
  {
    id: "casa",
    term: "Casa",
    category: "Básico",
    short: "O espaço entre dois trastes.",
    detail:
      "Contamos as casas a partir da pestana (cabeça do braço). A 1ª casa é a mais próxima da cabeça.",
  },
  {
    id: "corda-solta",
    term: "Corda solta",
    category: "Básico",
    short: "Corda tocada sem apertar nenhuma casa.",
    detail:
      "No violão padrão as cordas soltas soam (da mais grave à mais aguda) E, A, D, G, B, E.",
  },
  {
    id: "afinacao",
    term: "Afinação",
    category: "Básico",
    short: "Ajustar a altura de cada corda.",
    detail:
      "A afinação padrão do violão/guitarra é E-A-D-G-B-E. Use o afinador do Strum para deixar cada corda no ponto.",
  },
  {
    id: "acorde",
    term: "Acorde",
    category: "Teoria",
    short: "Três ou mais notas tocadas juntas.",
    detail:
      "Acordes maiores soam 'alegres' e menores soam 'tristes'. A biblioteca de acordes mostra onde pôr cada dedo.",
  },
  {
    id: "escala",
    term: "Escala",
    category: "Teoria",
    short: "Sequência de notas em ordem de altura.",
    detail:
      "A escala maior é a base de quase tudo. Praticar escalas treina os dedos e o ouvido ao mesmo tempo.",
  },
  {
    id: "tom",
    term: "Tom e semitom",
    category: "Teoria",
    short: "A menor distância entre notas.",
    detail:
      "Um semitom é uma casa no braço; um tom são duas casas. A escala maior segue o padrão T-T-st-T-T-T-st.",
  },
  {
    id: "intervalo",
    term: "Intervalo",
    category: "Teoria",
    short: "A distância entre duas notas.",
    detail:
      "Reconhecer intervalos de ouvido é uma habilidade-chave — treine no módulo de Treino auditivo.",
  },
  {
    id: "pestana",
    term: "Pestana",
    category: "Técnica",
    short: "Um dedo pressionando várias cordas.",
    detail:
      "Geralmente o indicador deita sobre o braço para fazer vários acordes 'móveis', como F e Bm. Exige força — vem com o tempo.",
  },
  {
    id: "palhetada",
    term: "Palhetada",
    category: "Técnica",
    short: "Tocar a corda com a palheta.",
    detail:
      "Palhetada alternada (baixo-cima-baixo-cima) é o caminho para ganhar velocidade e constância.",
  },
  {
    id: "ligado",
    term: "Ligado (hammer/pull)",
    category: "Técnica",
    short: "Notas sem nova palhetada.",
    detail:
      "Hammer-on: martelar um dedo na casa. Pull-off: puxar o dedo soltando a corda. Deixam a frase mais fluida.",
  },
  {
    id: "bend",
    term: "Bend",
    category: "Técnica",
    short: "Empurrar a corda para subir a nota.",
    detail:
      "Muito usado em solos de blues e rock. Um bend de tom sobe a nota duas casas sem mudar de posição.",
  },
  {
    id: "compasso",
    term: "Compasso",
    category: "Ritmo",
    short: "Agrupamento de tempos.",
    detail:
      "Em 4/4 há quatro tempos por compasso — o ritmo mais comum na música popular.",
  },
  {
    id: "bpm",
    term: "BPM",
    category: "Ritmo",
    short: "Batidas por minuto (andamento).",
    detail:
      "Quanto maior o BPM, mais rápida a música. Use o metrônomo para subir a velocidade aos poucos.",
  },
  {
    id: "seminima",
    term: "Semínima e colcheia",
    category: "Ritmo",
    short: "Durações de nota.",
    detail:
      "Uma semínima dura um tempo; duas colcheias cabem num tempo. Contar 'um-e-dois-e' ajuda com colcheias.",
  },
  {
    id: "sincope",
    term: "Síncope",
    category: "Ritmo",
    short: "Acento fora do tempo forte.",
    detail:
      "Dá aquele 'balanço'. Muito presente no samba, funk e reggae.",
  },
  {
    id: "tablatura",
    term: "Tablatura (tab)",
    category: "Básico",
    short: "Notação que mostra casa e corda.",
    detail:
      "Cada linha é uma corda e os números são as casas. É a forma mais rápida de aprender uma música.",
  },
  {
    id: "capotraste",
    term: "Capotraste",
    category: "Equipamento",
    short: "Pestana mecânica presa no braço.",
    detail:
      "Sobe o tom de todas as cordas de uma vez, permitindo tocar acordes abertos em outras tonalidades.",
  },
  {
    id: "captador",
    term: "Captador",
    category: "Equipamento",
    short: "Transforma a vibração em sinal elétrico.",
    detail:
      "Em guitarras e baixos, os captadores 'ouvem' as cordas e mandam o som para o amplificador.",
  },
  {
    id: "baixo",
    term: "Baixo",
    category: "Básico",
    short: "Instrumento grave de 4 a 6 cordas.",
    detail:
      "Faz a ponte entre ritmo e harmonia. A afinação de 4 cordas é E-A-D-G, uma oitava abaixo das cordas graves da guitarra.",
  },
];

export const GLOSSARY_CATEGORIES: GlossaryTerm["category"][] = [
  "Básico",
  "Técnica",
  "Teoria",
  "Ritmo",
  "Equipamento",
];
