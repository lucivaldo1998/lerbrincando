// Configuração declarativa das telas do funil.
// Cada step tem um tipo que o componente sabe renderizar.

export type QuizOption = { emoji?: string; label: string; value: string };

// Campo opcional comum: um vídeo local (em /public/videos/*) que será renderizado
// acima do conteúdo principal da tela. Ou imagem custom via imageSrc.
type MediaSlot = {
  videoSrc?: string;
  imageSrc?: string;
  imageIdx?: number;
};

export type QuizStep =
  | ({
      kind: 'choice';
      slug: string;
      progress: number; // 0-100
      phaseLabel?: string;
      title: string;
      subtitle?: string;
      fieldKey: string;
      options: QuizOption[];
      multi?: boolean;
    } & MediaSlot)
  | ({
      kind: 'info';
      slug: string;
      progress: number;
      phaseLabel?: string;
      title: string;
      subtitle?: string;
      bullets?: string[];
      cta: string;
    } & MediaSlot)
  | ({
      kind: 'diagnosis';
      slug: string;
      progress: number;
      phaseLabel?: string;
      title: string;
      subtitle?: string;
      score: number; // 0-100 (ex: 28)
      reasons: { title: string; body: string }[];
      cta: string;
    } & MediaSlot)
  | ({
      kind: 'projection';
      slug: string;
      progress: number;
      title: string;
      subtitle?: string;
      today: number;
      future: number;
      options: QuizOption[];
      fieldKey: string;
    } & MediaSlot)
  | ({
      kind: 'social';
      slug: string;
      progress: number;
      title: string;
      subtitle?: string;
      options: QuizOption[];
      fieldKey: string;
    } & MediaSlot)
  | ({
      kind: 'loading';
      slug: string;
      progress: number;
      title: string;
      subtitle?: string;
      durationMs: number;
    } & MediaSlot)
  | ({
      kind: 'plan-reveal';
      slug: string;
      progress: number;
      title: string;
      subtitle?: string;
      weeks: { range: string; title: string }[];
      features: { emoji: string; text: string }[];
      cta: string;
    } & MediaSlot);

// Mídias do acervo da marca.
export const media = {
  hero: '/media/d17777b4-787e-4d5e-a68b-43dfc6e8592d.png',
  plan: '/media/c7876598-3dd4-47cb-80d6-f3a01b42c6a9.png',
  gabriele: '/media/gabi-collage.webp', // ← collage oficial da Gabriele (3 fotos)
  paulaHarvard: '/media/paula-harvard.webp', // ← Paola Uccelli com selo Harvard
  trophy: '/media/de094bef-58ef-4fc6-b9f8-deb3771b5132.png',
  social1: '/media/129f94a0-5f85-457b-95ea-09d2fce79ce2.webp',
  social2: '/media/d625910b-2b60-41e5-920e-bfa2224ec345.webp',
  social3: '/media/3130c4e2-1bc6-4f97-b337-86d70d9fba7b.webp',
  social4: '/media/1c171a0f-2583-448a-a6c7-edf966b4f3da.webp',
  kid1: '/media/a17e4a61-880e-45f6-9dad-def0cfd2b78d.webp',
  kid2: '/media/9c085d5b-f261-452b-87c9-3d3d87174593.webp',
  kid3: '/media/1196e3fd-fa49-4deb-8b06-9ee7e1b38878.webp',
  icon1: '/media/39840a9d-3dcf-47a3-9a93-8ece252df3fc.webp',
  icon2: '/media/7102325f-6b6e-4891-ae23-09d5b2a0b45e.webp',
  brain: '/media/e18c7c76-2459-463b-9391-6ac4db58fa11.png',
  feedback: '/media/238271ed-f1c6-48a4-aabb-7bf8741ec9d5.webp',
  chart: '/media/216d5881-fe2b-4f74-a00e-435598d6517d.webp',
};

// Vídeos locais em /public/videos (servidos pelo próprio Railway; sem CDN externa).
export const videos = {
  lendoTexto: '/videos/lendo-texto.mp4',
  depoimentoMae: '/videos/depoimento-mae.mp4',
  metodoPratica: '/videos/metodo-pratica.mp4',
  demoProduto: '/videos/demo-produto.mp4',
};

export const steps: QuizStep[] = [
  {
    kind: 'choice',
    slug: 'tempo',
    progress: 10,
    phaseLabel: 'Fase 1 · Personalizando seu plano',
    title: 'Quanto tempo por dia você consegue dedicar para alfabetizar?',
    subtitle: 'Seu plano será ajustado para caber na sua rotina 🧒❤️',
    fieldKey: 'tempo_diario',
    options: [
      { emoji: '😀', label: '0 a 15 minutos', value: '0-15' },
      { emoji: '😎', label: '15 a 30 minutos', value: '15-30' },
      { emoji: '😁', label: '30 a 45 minutos', value: '30-45' },
      { emoji: '🤗', label: '45 a 60 minutos', value: '45-60' },
    ],
  },
  {
    kind: 'choice',
    slug: 'idade',
    progress: 18,
    title: 'Qual é a idade do seu filho(a)?',
    subtitle: 'Cada faixa etária tem um método ideal — vamos ajustar tudo para ele(a).',
    fieldKey: 'idade',
    options: [
      { emoji: '🧸', label: '4 anos', value: '4' },
      { emoji: '🖍️', label: '5 anos', value: '5' },
      { emoji: '📚', label: '6 anos', value: '6' },
      { emoji: '✏️', label: '7 anos', value: '7' },
      { emoji: '🎨', label: '8 anos', value: '8' },
      { emoji: '🔍', label: '9 anos', value: '9' },
      { emoji: '🚀', label: '10 anos ou mais', value: '10+' },
    ],
  },
  {
    kind: 'choice',
    slug: 'tentou',
    progress: 26,
    title: 'Você já tentou alfabetizar em casa?',
    subtitle: 'Isso nos ajuda a direcionar cada passo do método.',
    fieldKey: 'ja_tentou',
    options: [
      { emoji: '✅', label: 'Sim, já tentei algumas vezes', value: 'sim' },
      { emoji: '🤷‍♀️', label: 'Ainda não, mas quero começar agora', value: 'nao' },
    ],
  },
  {
    kind: 'info',
    slug: 'prova-social-1',
    progress: 34,
    phaseLabel: 'Mais de 15.000 famílias atendidas',
    title: 'Mais de 15 mil crianças a partir de 4 anos já aprenderam a ler com o nosso método',
    subtitle: 'Pais como você, com a mesma dúvida, transformaram a rotina de leitura dos filhos em poucas semanas.',
    imageIdx: 0,
    cta: 'Continuar',
  },
  {
    kind: 'choice',
    slug: 'nome-proprio',
    progress: 42,
    phaseLabel: 'Fase 2 · Entendendo as dificuldades',
    title: 'Seu filho(a) já consegue ler o próprio nome?',
    subtitle: 'Essa é uma etapa importante para definirmos o ponto de partida.',
    fieldKey: 'le_nome',
    options: [
      { emoji: '✅', label: 'Sim, já consegue ler', value: 'sim' },
      { emoji: '❌', label: 'Ainda não consegue', value: 'nao' },
    ],
  },
  {
    kind: 'choice',
    slug: 'combinar',
    progress: 50,
    title: 'Quando ele(a) tenta juntar letras para formar sons, o que acontece?',
    subtitle: 'Escolha a opção que mais parece com a situação dele(a).',
    fieldKey: 'combinar',
    options: [
      { emoji: '😕', label: 'Tem dificuldade e não entende', value: 'dificuldade' },
      { emoji: '🙋', label: 'Às vezes entende, mas pede ajuda o tempo todo', value: 'pede_ajuda' },
    ],
  },
  {
    kind: 'choice',
    slug: 'palavra-nova',
    progress: 58,
    title: 'E quando aparece uma palavra nova?',
    subtitle: 'Como ele(a) costuma reagir?',
    fieldKey: 'palavra_nova',
    options: [
      { emoji: '🤔', label: 'Tenta adivinhar, sem separar os sons', value: 'adivinha' },
      { emoji: '👩‍🏫', label: 'Espera eu ou a professora falar antes', value: 'depende' },
    ],
  },
  {
    kind: 'info',
    slug: 'diagnostico-inicial',
    progress: 62,
    title: 'Já entendi o que está acontecendo',
    subtitle: 'A principal dificuldade dele(a) é conseguir ler palavras mesmo já conhecendo o nome das letras — e isso acontece porque os métodos tradicionais não ensinam a reconhecer o som de cada letra antes de juntá-las. Com o método correto, isso muda em poucos dias.',
    imageIdx: 1,
    cta: 'Ver o nível de leitura dele(a)',
  },
  {
    kind: 'loading',
    slug: 'calculando',
    progress: 68,
    title: 'Calculando o nível de progresso na leitura...',
    subtitle: 'Estamos cruzando as respostas com nosso banco de mais de 15 mil crianças.',
    durationMs: 2800,
  },
  {
    kind: 'diagnosis',
    slug: 'resultado',
    progress: 72,
    phaseLabel: '🚨 Resultado do diagnóstico',
    title: 'O nível atual de leitura está ABAIXO do esperado para a idade',
    subtitle: 'Sem a intervenção certa, isso pode afetar a autoconfiança e o desempenho escolar nos próximos anos. A boa notícia: dá pra reverter em 30 dias.',
    score: 28,
    reasons: [
      { title: 'Falta de consciência fonológica', body: 'Ele(a) ainda não reconhece o som de cada letra, o que trava a junção silábica.' },
      { title: 'Dificuldade na rota fonológica', body: 'Tenta adivinhar palavras em vez de decodificá-las — um sinal clássico da rota visual dominante.' },
      { title: 'Método tradicional desalinhado', body: 'O ensino pela ordem alfabética não prepara o cérebro para ler; o método fônico sim.' },
    ],
    cta: 'Quero virar esse jogo',
  },
  {
    kind: 'choice',
    slug: 'metas',
    progress: 80,
    phaseLabel: 'Últimas perguntas · 80% concluído',
    title: 'Quais objetivos você quer alcançar com o plano?',
    subtitle: 'Pode marcar quantos quiser — vamos priorizar tudo no método.',
    fieldKey: 'metas',
    multi: true,
    options: [
      { emoji: '🏅', label: 'Que ele(a) se destaque na escola', value: 'destaque' },
      { emoji: '😊', label: 'Que aprenda a ler sem estresse e sem choro', value: 'leveza' },
      { emoji: '🎓', label: 'Que acompanhe o ritmo da turma', value: 'ritmo' },
      { emoji: '✍️', label: 'Que consiga fazer as tarefas sozinho(a)', value: 'autonomia' },
    ],
  },
  {
    kind: 'choice',
    slug: 'harvard-conhece',
    progress: 85,
    title: 'Você sabia que existe uma técnica validada por Harvard que torna a alfabetização muito mais simples?',
    subtitle: 'Queremos te mostrar como ela funciona agora.',
    fieldKey: 'harvard_conhece',
    options: [
      { emoji: '👀', label: 'Sério? Me conta mais!', value: 'curioso' },
      { emoji: '😍', label: 'Sim, já vi crianças lendo com isso', value: 'conhece' },
    ],
  },
  {
    kind: 'info',
    slug: 'harvard-metodo',
    progress: 88,
    phaseLabel: '🎓 Harvard comprova',
    title: 'O método fônico é o mais eficiente para alfabetização inicial',
    subtitle: 'Estudos conduzidos pela linguista Paola Uccelli, da Harvard Graduate School of Education, confirmam: crianças alfabetizadas pelo método fônico aprendem até 3x mais rápido do que pelo método tradicional.',
    bullets: [
      'Passo 1: Ensinar as letras na ordem correta (não é a ordem alfabética) — 2 letras por dia',
      'Passo 2: Juntar letras em sílabas usando o método da aproximação',
      'Passo 3: Formar palavras simples com as sílabas já dominadas',
      'Passo 4: Introduzir sílabas complexas (dígrafos, encontros consonantais)',
      'Passo 5: Ler palavras mais longas com fluência',
      'Passo 6: Construir pequenas frases e pequenos textos',
    ],
    imageSrc: media.paulaHarvard,
    videoSrc: videos.metodoPratica,
    cta: 'Continuar',
  },
  {
    kind: 'projection',
    slug: 'projecao',
    progress: 90,
    title: 'Nossa IA projetou o que acontece em 30 dias com o plano aplicado',
    subtitle: 'Você gostaria de chegar nesse cenário?',
    today: 28,
    future: 100,
    fieldKey: 'gostaria',
    options: [
      { emoji: '✅', label: 'Sim! Adoraria isso', value: 'sim' },
      { emoji: '❌', label: 'Não gostaria', value: 'nao' },
    ],
  },
  {
    kind: 'social',
    slug: 'apresentacao',
    progress: 93,
    title: 'Olá, eu sou a Gabriele',
    subtitle: 'Sou a fundadora do método LerBrincando. Já ajudei centenas de famílias a alfabetizar seus filhos aplicando neurociência no dia a dia — de forma leve, em casa e em poucos dias. Agora vou pegar na sua mão. Você está pronta(o) pra começar?',
    imageSrc: media.gabriele,
    fieldKey: 'pronta',
    options: [
      { emoji: '✅', label: 'SIMMM, vamos!', value: 'sim' },
      { emoji: '❌', label: 'Ainda não', value: 'nao' },
    ],
  },
  {
    kind: 'social',
    slug: 'caso-lais',
    progress: 95,
    title: 'Aprendendo a ler ainda pequena',
    subtitle: 'Com o método aplicado em casa, em poucas semanas ela passou a ler palavras e frases curtas sozinha. Você gostaria desse resultado pro seu filho(a)?',
    videoSrc: videos.lendoTexto,
    fieldKey: 'caso_lais',
    options: [
      { emoji: '✅', label: 'Com certeza!', value: 'sim' },
      { emoji: '❌', label: 'Não gostaria', value: 'nao' },
    ],
  },
  {
    kind: 'social',
    slug: 'caso-dificuldade',
    progress: 97,
    title: 'Não é sorte — é método',
    subtitle: 'Aos 6 anos, ele ainda não lia e tinha receio até de tentar. Com o passo a passo do método LerBrincando (criado pela Gabriele), em poucas semanas leu seu primeiro livro sozinho. Você quer isso pro seu filho(a)?',
    imageIdx: 9,
    videoSrc: videos.depoimentoMae,
    fieldKey: 'caso_dificuldade',
    options: [
      { emoji: '✅', label: 'Com toda certeza!', value: 'sim' },
      { emoji: '❌', label: 'Prefiro deixar como está', value: 'nao' },
    ],
  },
  {
    kind: 'choice',
    slug: 'pergunta-final',
    progress: 98,
    phaseLabel: 'Pergunta final',
    title: 'O próximo passo é só pra quem quer isso de verdade:',
    subtitle: '✅ Ver o filho lendo com segurança e alegria\n✅ Que ele(a) faça as tarefas sozinho(a)\n✅ Parar de comparar com outras crianças\n✅ Transformar a leitura em um momento divertido\n✅ Ver o filho(a) se apaixonar por livros',
    fieldKey: 'quer',
    options: [
      { emoji: '✅', label: 'SIM! Quero isso', value: 'sim' },
      { emoji: '❌', label: 'Não é pra mim agora', value: 'nao' },
    ],
  },
  {
    kind: 'loading',
    slug: 'gerando-plano-82',
    progress: 99,
    title: 'Montando o plano personalizado do seu filho(a)...',
    subtitle: 'Enquanto isso, uma mãe conta a experiência dela com o método 👇',
    videoSrc: videos.depoimentoMae,
    durationMs: 6000,
  },
  {
    kind: 'loading',
    slug: 'gerando-plano-97',
    progress: 99,
    title: 'Quase lá... ajustando cada etapa pra idade e rotina do seu filho(a)',
    subtitle: 'Priorizando os 30 dias com base nas respostas.',
    durationMs: 2200,
  },
  {
    kind: 'loading',
    slug: 'gerando-plano-99',
    progress: 99,
    title: 'Finalizando os últimos detalhes do seu plano...',
    subtitle: '',
    durationMs: 1500,
  },
  {
    kind: 'plan-reveal',
    slug: 'plano-pronto',
    progress: 100,
    title: 'Seu plano personalizado de 30 dias está pronto',
    subtitle: 'Feito sob medida com base em todas as respostas. Veja a divisão:',
    videoSrc: videos.demoProduto,
    weeks: [
      { range: 'Dias 1 – 14', title: 'Ensinando o som de cada letra (método fônico)' },
      { range: 'Dias 15 – 19', title: 'Juntando letras para formar as primeiras sílabas' },
      { range: 'Dias 20 – 25', title: 'Leitura de palavras simples (método da aproximação)' },
      { range: 'Dias 26 – 27', title: 'Sílabas complexas (dígrafos e encontros consonantais)' },
      { range: 'Dias 28 – 30', title: 'Leitura de palavras mais longas e pequenas frases' },
    ],
    features: [
      { emoji: '📝', text: 'Passo a passo diário pronto pra aplicar' },
      { emoji: '⏱️', text: 'Apenas 15 a 20 minutos por dia' },
      { emoji: '📵', text: 'Sem telas — materiais físicos imprimíveis' },
      { emoji: '🧠', text: 'Baseado em neurociência e método fônico' },
      { emoji: '💪', text: 'Fim da desmotivação com os estudos' },
      { emoji: '🔓', text: 'Desbloqueia a alfabetização em ritmo acelerado' },
    ],
    cta: 'Quero liberar o plano agora',
  },
];

export function stepIndexBySlug(slug: string): number {
  return steps.findIndex((s) => s.slug === slug);
}

export function nextStepSlug(current: string): string | null {
  const idx = stepIndexBySlug(current);
  if (idx < 0 || idx >= steps.length - 1) return null;
  return steps[idx + 1].slug;
}
