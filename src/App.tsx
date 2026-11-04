import React, { useEffect, useMemo, useState } from 'react';
import {
  AlertTriangle,
  BadgeCheck,
  Building2,
  Camera,
  ChevronDown,
  ChevronRight,
  ClipboardList,
  Coins,
  FileText,
  Home,
  LandPlot,
  Map,
  MapPinned,
  Megaphone,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  UserRound,
  Wallet,
} from 'lucide-react';

type Tab = 'home' | 'mapa' | 'cidadao' | 'prefeitura' | 'canvas' | 'faq';
type TerrenoStatus = 'verde' | 'amarelo' | 'vermelho';
type DenunciaStatus = 'Pendente' | 'Em Análise' | 'Em Fiscalização' | 'Resolvida';

type Terreno = {
  id: string;
  endereco: string;
  bairro: string;
  status: TerrenoStatus;
  historicoNotificacoes: number;
  coordenadasSimuladas: { x: number; y: number };
};

type Denuncia = {
  id: string;
  terrenoId: string;
  bairro: string;
  residuo: string;
  descricao: string;
  status: DenunciaStatus;
  data: string;
};

type Recompensa = {
  id: string;
  nome: string;
  custo: number;
  descricao: string;
};

type FaqItem = {
  pergunta: string;
  resposta: string;
};

const tabs: Array<{ id: Tab; label: string; icon: any }> = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'mapa', label: 'Mapa', icon: Map },
  { id: 'cidadao', label: 'Cidadão', icon: UserRound },
  { id: 'prefeitura', label: 'Prefeitura', icon: Building2 },
  { id: 'canvas', label: 'Canvas', icon: ClipboardList },
  { id: 'faq', label: 'FAQ', icon: ShieldCheck },
];

const terrenosIniciais: Terreno[] = [
  { id: 'T-101', endereco: 'Rua das Flores, 240', bairro: 'Jardins Santa Casa', status: 'verde', historicoNotificacoes: 1, coordenadasSimuladas: { x: 20, y: 26 } },
  { id: 'T-204', endereco: 'Avenida Brasil, 1440', bairro: 'Victória', status: 'amarelo', historicoNotificacoes: 3, coordenadasSimuladas: { x: 48, y: 34 } },
  { id: 'T-305', endereco: 'Rua Pio XII, 82', bairro: 'Cidade Alta II', status: 'vermelho', historicoNotificacoes: 5, coordenadasSimuladas: { x: 71, y: 23 } },
  { id: 'T-407', endereco: 'Travessa das Acácias, 29', bairro: 'Novo Centro', status: 'verde', historicoNotificacoes: 1, coordenadasSimuladas: { x: 62, y: 62 } },
  { id: 'T-510', endereco: 'Alameda das Orquídeas, 510', bairro: 'Jardim Laura', status: 'amarelo', historicoNotificacoes: 2, coordenadasSimuladas: { x: 32, y: 68 } },
  { id: 'T-612', endereco: 'Rua Paraná, 698', bairro: 'Centro', status: 'verde', historicoNotificacoes: 0, coordenadasSimuladas: { x: 53, y: 75 } },
];

const denunciasIniciais: Denuncia[] = [
  { id: 'D-1042', terrenoId: 'T-204', bairro: 'Victória', residuo: 'Entulho de Construção', descricao: 'Acúmulo de blocos e restos de obra em frente ao lote vazio.', status: 'Pendente', data: '2026-11-02' },
  { id: 'D-1048', terrenoId: 'T-305', bairro: 'Cidade Alta II', residuo: 'Móveis Velhos', descricao: 'Sofá, colchão e armário abandonados no terreno.', status: 'Em Fiscalização', data: '2026-11-01' },
];

const recompensas: Recompensa[] = [
  { id: 'bronze', nome: 'Benefício Bronze', custo: 100, descricao: 'Brinde básico local e descontos em parceria comercial.' },
  { id: 'prata', nome: 'Desconto Prata', custo: 300, descricao: '10% de desconto em estabelecimento parceiro.' },
  { id: 'ouro', nome: 'Benefício Ouro', custo: 500, descricao: 'Benefício exclusivo da rede varejista local.' },
  { id: 'especial', nome: 'Recompensa Especial', custo: 1000, descricao: 'Premiação especial do programa ecológico urbano.' },
];

const faqItems: FaqItem[] = [
  {
    pergunta: 'Como o sistema impede que cidadãos criem denúncias falsas ou duplicadas apenas para inflar pontos e burlar o sistema?',
    resposta: 'A concessão de pontos nunca é automatizada no ato do envio. O sistema conta com validações em múltiplas etapas: análise obrigatória de imagem anexada pela triagem pública, cruzamento inteligente de geolocalização e raio de distância por ID do terreno para unificar denúncias duplicadas no mesmo lote e validação em campo pela fiscalização oficial antes da liberação do saldo de recompensas.',
  },
  {
    pergunta: 'Se a Prefeitura de Campo Mourão já possui a Ouvidoria e o canal telefônico 156, por que investir em uma nova ferramenta como o Terreno Limpo?',
    resposta: 'O Terreno Limpo não veio para substituir os canais tradicionais de atendimento, mas sim atuar de forma complementar e especializada. O diferencial está na conexão direta do ambiente físico ao digital pelo QR Code posicionado no lote problemático, eliminando barreiras de identificação geográfica pelo morador, unificando o histórico de reincidência de um lote específico e gerando engajamento ativo contínuo através de recompensas, algo que as ouvidorias tradicionais e genéricas não possuem estrutura para executar.',
  },
  {
    pergunta: 'O projeto exige obrigatoriamente a publicação de aplicativos nativos nas lojas digitais (Google Play / App Store)?',
    resposta: 'Não. O Terreno Limpo foi projetado e desenvolvido arquitetonicamente como uma Plataforma Web Responsiva otimizada para navegadores mobile. Isso remove completamente as barreiras de entrada para o cidadão, eliminando o atrito de precisar fazer download, gastar armazenamento do aparelho ou criar logins complexos na rua; basta apontar a câmera do celular para o QR Code da placa e a interface de denúncia abre instantaneamente.',
  },
  {
    pergunta: 'Qual o teto ético e comercial de promessas que o projeto assume perante os avaliadores e gestores municipais?',
    resposta: 'Adotamos um posicionamento realista, profissional e técnico. O Terreno Limpo não promete erradicar 100% o descarte de lixo urbano de forma milagrosa, estimar valores exatos de economia financeira sem auditoria prévia de custos operacionais internos ou garantir engajamento total da população. Nosso compromisso técnico é fornecer à prefeitura uma ferramenta capaz de mitigar significativamente a reincidência do descarte irregular, otimizar de forma inteligente as rotas de fiscalização e fomentar a cultura de dados preventivos dentro do ecossistema municipal de Campo Mourão.',
  },
];

const getStatusColor = (status: TerrenoStatus) => {
  if (status === 'verde') return 'bg-emerald-500 text-white';
  if (status === 'amarelo') return 'bg-amber-500 text-white';
  return 'bg-red-500 text-white';
};

const getStatusLabel = (status: TerrenoStatus) => {
  if (status === 'verde') return ' Verde  Regular';
  if (status === 'amarelo') return ' Amarelo  Atenção';
  return ' Vermelho — Descarte Recorrente';
};

const getDenunciaStatusClasses = (status: DenunciaStatus) => {
  if (status === 'Pendente') return 'bg-slate-200 text-slate-700';
  if (status === 'Em Análise') return 'bg-sky-100 text-sky-700';
  if (status === 'Em Fiscalização') return 'bg-amber-100 text-amber-700';
  return 'bg-emerald-100 text-emerald-700';
};

const formatDate = (date: string) =>
  new Date(date).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

const generateCouponCode = () => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = 'TLM-';
  for (let i = 0; i < 6; i += 1) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
};

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('home');
  const [terrenos, setTerrenos] = useState<Terreno[]>(terrenosIniciais);
  const [userPoints, setUserPoints] = useState<number>(150);
  const [denuncias, setDenuncias] = useState<Denuncia[]>(denunciasIniciais);
  const [selectedTerrenoId, setSelectedTerrenoId] = useState<string>('T-204');
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [couponHistory, setCouponHistory] = useState<Array<{ code: string; reward: string; value: number }>>([]);
  const [denunciaForm, setDenunciaForm] = useState({
    residuo: 'Entulho de Construção',
    descricao: '',
    terrenoId: 'T-204',
    terrenoLabel: 'Avenida Brasil, 1440  Victória',
    fotoNome: '',
  });

  useEffect(() => {
    document.title = 'Terreno Limpo - Campo Mourão';
  }, []);

  const statsResumo = useMemo(() => {
    const ativos = denuncias.filter((item) => item.status !== 'Resolvida').length;
    const resolvidos = denuncias.filter((item) => item.status === 'Resolvida').length;
    const terrenosVerdes = terrenos.filter((item) => item.status === 'verde').length;
    const terrenosAmarelos = terrenos.filter((item) => item.status === 'amarelo').length;
    const terrenosVermelhos = terrenos.filter((item) => item.status === 'vermelho').length;
    return { ativos, resolvidos, terrenosVerdes, terrenosAmarelos, terrenosVermelhos };
  }, [denuncias, terrenos]);

  const terrenoSelecionado = useMemo(
    () => terrenos.find((item) => item.id === selectedTerrenoId) ?? terrenos[0],
    [selectedTerrenoId, terrenos],
  );

  const avancarDenuncia = (id: string) => {
    let award = false;
    setDenuncias((prev) => {
      const atualizadas: Denuncia[] = prev.map((item) => {
        if (item.id !== id) return item;

        let nextStatus: DenunciaStatus = item.status;
        if (item.status === 'Pendente') {
          nextStatus = 'Em Análise';
        } else if (item.status === 'Em Análise') {
          nextStatus = 'Em Fiscalização';
        } else if (item.status === 'Em Fiscalização') {
          nextStatus = 'Resolvida';
          award = true;
        }

        return { ...item, status: nextStatus };
      });

      return atualizadas;
    });

    if (award) {
      setUserPoints((points) => points + 100);
      const denunciaResolvida = denuncias.find((item) => item.id === id);
      if (denunciaResolvida) {
        setTerrenos((lista) =>
          lista.map((terreno) =>
            terreno.id === denunciaResolvida.terrenoId
              ? { ...terreno, status: 'verde', historicoNotificacoes: Math.max(0, terreno.historicoNotificacoes - 1) }
              : terreno,
          ),
        );
      }
    }
  };

  const handleDenunciaSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!denunciaForm.descricao.trim()) return;

    const terrenoAlvo =
      terrenos.find((item) => item.id === denunciaForm.terrenoId) ??
      terrenos.find(
        (item) =>
          item.endereco.toLowerCase().includes(denunciaForm.terrenoLabel.toLowerCase()) ||
          item.bairro.toLowerCase().includes(denunciaForm.terrenoLabel.toLowerCase()),
      ) ??
      terrenos[0];

    const novaDenuncia: Denuncia = {
      id: `D-${Math.floor(Math.random() * 9000 + 1000)}`,
      terrenoId: terrenoAlvo.id,
      bairro: terrenoAlvo.bairro,
      residuo: denunciaForm.residuo,
      descricao: denunciaForm.descricao.trim(),
      status: 'Pendente',
      data: new Date().toISOString().slice(0, 10),
    };

    setDenuncias((prev) => [novaDenuncia, ...prev]);
    setTerrenos((prev) =>
      prev.map((terreno) =>
        terreno.id === terrenoAlvo.id
          ? { ...terreno, status: 'amarelo', historicoNotificacoes: terreno.historicoNotificacoes + 1 }
          : terreno,
      ),
    );
    setSelectedTerrenoId(terrenoAlvo.id);
    setDenunciaForm({
      residuo: 'Entulho de Construção',
      descricao: '',
      terrenoId: terrenoAlvo.id,
      terrenoLabel: `${terrenoAlvo.endereco}  ${terrenoAlvo.bairro}`,
      fotoNome: '',
    });
    setActiveTab('cidadao');
  };

  const handleRedeemCoupon = (reward: Recompensa) => {
    if (userPoints < reward.custo) return;
    const codigo = generateCouponCode();
    setUserPoints((points) => points - reward.custo);
    setCouponHistory((prev) => [{ code: codigo, reward: reward.nome, value: reward.custo }, ...prev]);
  };

  const handleMapQrRedirect = (terrenoId: string) => {
    const terreno = terrenos.find((item) => item.id === terrenoId) ?? terrenos[0];
    setSelectedTerrenoId(terrenoId);
    setDenunciaForm((prev) => ({
      ...prev,
      terrenoId: terreno.id,
      terrenoLabel: `${terreno.endereco}  ${terreno.bairro}`,
    }));
    setActiveTab('cidadao');
  };

  const statusFlow: DenunciaStatus[] = ['Pendente', 'Em Análise', 'Em Fiscalização', 'Resolvida'];
  const statusAtual = denuncias[0]?.status ?? 'Pendente';
  const statusIndexAtual = statusFlow.indexOf(statusAtual);

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800">
      <div className="mx-auto max-w-7xl px-3 pb-10 pt-4 sm:px-4 lg:px-6">
        <header className="mb-5 rounded-2xl border border-emerald-100 bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500 p-4 text-white shadow-soft sm:p-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-emerald-100">Campo Mourão  PR</p>
              <h1 className="mt-2 text-2xl font-bold sm:text-3xl">Terreno Limpo</h1>
            </div>
            <div className="flex items-center gap-2 rounded-full bg-white/10 px-3 py-2 text-sm font-medium backdrop-blur-sm">
              <Coins size={16} />
              {userPoints} pontos
            </div>
          </div>
        </header>

        <div className="mb-5">
          <div className="flex flex-wrap items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white/80 p-2 shadow-sm backdrop-blur-sm">
            {tabs.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                type="button"
                onClick={() => setActiveTab(id)}
                className={`flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition-all ${
                  activeTab === id ? 'bg-emerald-600 text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <Icon size={16} />
                {label}
              </button>
            ))}
          </div>
        </div>

        {activeTab === 'home' && (
          <div className="space-y-6">
            <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
              <div className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr] lg:items-center">
                <div>
                  <p className="mb-3 inline-flex rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-emerald-700">Monitoramento inteligente e participação cidadã</p>
                  <h2 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">Terreno Limpo - Campo Mourão</h2>
                  <p className="mt-4 text-lg font-medium text-emerald-700">Denunciar, acompanhar e ser recompensado.</p>
                  <div className="mt-5 flex flex-wrap gap-3">
                    <button type="button" onClick={() => setActiveTab('cidadao')} className="rounded-xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-500">Registrar denúncia</button>
                    <button type="button" onClick={() => setActiveTab('mapa')} className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-100">Ver monitoramento</button>
                  </div>
                </div>
                <div className="rounded-2xl bg-slate-900 p-5 text-white shadow-soft">
                  <div className="mb-3 flex items-center justify-between">
                    <span className="text-sm uppercase tracking-[0.18em] text-slate-300">Indicadores</span>
                    <Sparkles className="text-emerald-400" size={18} />
                  </div>
                  <div className="space-y-4">
                    <div className="rounded-xl bg-slate-800 p-3">
                      <p className="text-xs uppercase text-slate-400">Terrenos ativos</p>
                      <p className="mt-2 text-2xl font-bold">{statsResumo.ativos}</p>
                    </div>
                    <div className="rounded-xl bg-slate-800 p-3">
                      <p className="text-xs uppercase text-slate-400">Alertas críticos</p>
                      <p className="mt-2 text-2xl font-bold text-amber-300">{statsResumo.terrenosVermelhos}</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
              <div className="mb-4 flex items-center gap-3">
                <div className="rounded-xl bg-emerald-100 p-2 text-emerald-700"><TrendingUp size={18} /></div>
                <h3 className="text-xl font-bold text-slate-900">O verdadeiro foco</h3>
              </div>
              <div className="grid gap-4 lg:grid-cols-[1fr_1.1fr]">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <p className="mb-3 text-sm font-semibold uppercase tracking-[0.14em] text-slate-500">Tradicional</p>
                  <div className="space-y-3 text-slate-600">
                    <p className="rounded-xl bg-red-50 p-3 text-sm font-medium text-red-700">Limpamos só depois do problema aparecer.</p>
                    <p className="rounded-xl bg-amber-50 p-3 text-sm font-medium text-amber-700">Nova ocorrência = nova operação reativa.</p>
                  </div>
                </div>
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
                  <p className="mb-3 text-sm font-semibold uppercase tracking-[0.14em] text-emerald-700">Terreno Limpo</p>
                  <div className="space-y-3 text-emerald-800">
                    <p className="rounded-xl bg-white/80 p-3 text-sm font-medium">MONITORAMENTO + PARTICIPAÇÃO + PREVENÇÃO</p>
                    <p className="rounded-xl bg-white/80 p-3 text-sm font-medium">Foco na reincidência: mapear dados e agir antes que o descarte se repita.</p>
                  </div>
                </div>
              </div>
              <div className="mt-5 rounded-2xl border border-emerald-100 bg-emerald-50 p-4">
                <p className="text-lg font-semibold text-emerald-900">Nosso diferencial é transformar a denúncia em participação contínua: o cidadão identifica o problema, denuncia, acompanha a solução e é reconhecido por contribuir com a cidade.</p>
              </div>
            </section>

            <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <ImpactCard icon={<Sparkles size={20} />} color="bg-emerald-100 text-emerald-700" title="Impacto Ambiental" body="Redução do descarte irregular, contenção de vetores e animais peçonhentos, além da preservação ecológica do entorno urbano." />
              <ImpactCard icon={<UserRound size={20} />} color="bg-sky-100 text-sky-700" title="Impacto Social" body="Fortalece a inovação social, a conscientização comunitária e o senso de pertencimento ao bairro." />
              <ImpactCard icon={<LandPlot size={20} />} color="bg-violet-100 text-violet-700" title="Impacto Público" body="Organiza dados em mapas de calor e históricos para fiscalização inteligente e planejamento urbano." />
              <ImpactCard icon={<Wallet size={20} />} color="bg-amber-100 text-amber-700" title="Impacto Econômico" body="Reduz gastos cíclicos com limpezas e fiscalizações reativas nos mesmos pontos de maior recorrência." />
            </section>
          </div>
        )}

        {activeTab === 'mapa' && (
          <div className="grid gap-5 lg:grid-cols-[1.3fr_0.7fr]">
            <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Mapa urbano</p>
                  <h3 className="text-xl font-bold text-slate-900">Monitoramento de terrenos em Campo Mourão</h3>
                </div>
                <button type="button" className="rounded-full bg-slate-100 p-2 text-slate-600"><MapPinned size={16} /></button>
              </div>
              <div className="relative h-[440px] overflow-hidden rounded-2xl border border-slate-200 bg-[radial-gradient(circle_at_top,_#ecfeff,_#f8fafc_54%,_#e2e8f0)]">
                <div className="absolute inset-0 grid grid-cols-6 grid-rows-6 gap-2 p-4 opacity-40">
                  {Array.from({ length: 36 }, (_, index) => (
                    <div key={index} className="rounded-lg border border-slate-200 bg-white/60" />
                  ))}
                </div>
                <div className="absolute inset-0">
                  {terrenos.map((terreno) => (
                    <button
                      key={terreno.id}
                      type="button"
                      onClick={() => setSelectedTerrenoId(terreno.id)}
                      className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-full border-4 border-white p-2 shadow-lg transition ${
                        terreno.status === 'verde' ? 'bg-emerald-500' : terreno.status === 'amarelo' ? 'bg-amber-500' : 'bg-red-500'
                      }`}
                      style={{ left: `${terreno.coordenadasSimuladas.x}%`, top: `${terreno.coordenadasSimuladas.y}%` }}
                      title={`${terreno.endereco}  ${terreno.bairro}`}
                    >
                      <span className="block h-2.5 w-2.5 rounded-full bg-white/80" />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <aside className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="mb-4 flex items-center gap-2 text-slate-800">
                <MapPinned size={18} className="text-emerald-600" />
                <h3 className="text-xl font-bold">Detalhes do lote</h3>
              </div>
              {terrenoSelecionado && (
                <div className="space-y-4">
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <p className="text-sm uppercase tracking-[0.16em] text-slate-500">Endereço</p>
                    <p className="mt-2 text-lg font-bold text-slate-900">{terrenoSelecionado.endereco}</p>
                    <p className="text-sm text-slate-600">{terrenoSelecionado.bairro}</p>
                  </div>
                  <div className="rounded-2xl border border-slate-200 p-4">
                    <p className="text-sm uppercase tracking-[0.14em] text-slate-500">Classificação</p>
                    <div className="mt-2 inline-flex rounded-full px-3 py-1 text-xs font-semibold text-white shadow-sm">
                      <span className={getStatusColor(terrenoSelecionado.status)}>{getStatusLabel(terrenoSelecionado.status)}</span>
                    </div>
                  </div>
                  <div className="rounded-2xl border border-slate-200 p-4 text-sm text-slate-700">
                    <p><strong>Histórico administrativo:</strong> Notificações enviadas nos últimos 12 meses: {terrenoSelecionado.historicoNotificacoes} | Reincidências no trimestre: {Math.max(1, Math.round(terrenoSelecionado.historicoNotificacoes / 2))}</p>
                  </div>
                  <button type="button" onClick={() => handleMapQrRedirect(terrenoSelecionado.id)} className="w-full rounded-xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-500">Simular Leitura de QR Code Físico</button>
                </div>
              )}
            </aside>
          </div>
        )}

        {activeTab === 'cidadao' && (
          <div className="space-y-6">
            <section className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
              <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="mb-4 flex items-center gap-3">
                  <div className="rounded-xl bg-slate-900 p-2 text-white"><Camera size={18} /></div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.16em] text-slate-500">Placa urbana</p>
                    <h3 className="text-xl font-bold text-slate-900">Este terreno é monitorado</h3>
                  </div>
                </div>
                <div className="rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 p-4 text-center">
                  <div className="mx-auto mb-3 flex h-20 w-20 items-center justify-center rounded-2xl bg-white shadow-sm">
                    <div className="grid grid-cols-3 gap-1 rounded-lg border border-slate-300 bg-white p-2">
                      {Array.from({ length: 9 }, (_, index) => (
                        <div key={index} className={`h-3 w-3 rounded-sm ${index % 2 === 0 ? 'bg-slate-900' : 'bg-slate-200'}`} />
                      ))}
                    </div>
                  </div>
                  <p className="text-base font-semibold text-slate-800">Não jogue lixo.</p>
                  <p className="mt-1 text-sm text-slate-600">Encontrou um problema? Aponte a câmera para o QR Code.</p>
                </div>
              </div>

              <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="mb-4 flex items-center gap-3">
                  <div className="rounded-xl bg-emerald-100 p-2 text-emerald-700"><FileText size={18} /></div>
                  <h3 className="text-xl font-bold text-slate-900">Denunciar ocorrência</h3>
                </div>
                <form onSubmit={handleDenunciaSubmit} className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className="block text-sm font-medium text-slate-700">
                      Tipo de resíduo
                      <select value={denunciaForm.residuo} onChange={(event) => setDenunciaForm((prev) => ({ ...prev, residuo: event.target.value }))} className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-emerald-400">
                        <option>Entulho de Construção</option>
                        <option>Lixo Doméstico</option>
                        <option>Móveis Velhos</option>
                        <option>Galhos/Poda</option>
                        <option>Outros</option>
                      </select>
                    </label>
                    <label className="block text-sm font-medium text-slate-700">
                      Identificação do terreno
                      <input value={denunciaForm.terrenoLabel} onChange={(event) => setDenunciaForm((prev) => ({ ...prev, terrenoLabel: event.target.value }))} placeholder="ID ou endereço do lote" className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-emerald-400" />
                    </label>
                  </div>
                  <label className="block text-sm font-medium text-slate-700">
                    Descrição da situação
                    <textarea value={denunciaForm.descricao} onChange={(event) => setDenunciaForm((prev) => ({ ...prev, descricao: event.target.value }))} rows={4} placeholder="Descreva o que foi encontrado no terreno..." className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-emerald-400" />
                  </label>
                  <label className="block">
                    <span className="text-sm font-medium text-slate-700">Anexar foto da ocorrência</span>
                    <div className="mt-1 flex items-center justify-between rounded-xl border border-dashed border-slate-300 bg-slate-50 px-3 py-3 text-sm text-slate-600">
                      <span>{denunciaForm.fotoNome || 'Nenhum arquivo selecionado'}</span>
                      <input type="file" accept="image/*" onChange={(event) => setDenunciaForm((prev) => ({ ...prev, fotoNome: event.target.files?.[0]?.name || '' }))} className="sr-only" id="foto-ocorrencia" />
                      <label htmlFor="foto-ocorrencia" className="cursor-pointer rounded-lg bg-slate-200 px-2 py-1 text-xs font-semibold text-slate-700">Selecionar</label>
                    </div>
                  </label>
                  <button type="submit" className="w-full rounded-xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-500">Enviar Denúncia</button>
                </form>
              </div>
            </section>

            <section className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
              <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="mb-4 flex items-center gap-3">
                  <div className="rounded-xl bg-sky-100 p-2 text-sky-700"><ClipboardList size={18} /></div>
                  <h3 className="text-xl font-bold text-slate-900">Linha do tempo</h3>
                </div>
                <div className="space-y-4">
                  {statusFlow.map((status, index) => {
                    const isCompleted = index < statusIndexAtual;
                    const isCurrent = status === statusAtual;
                    return (
                      <div key={status} className="flex items-center gap-3">
                        <div className={`flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold ${isCompleted || isCurrent ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-500'}`}>{index + 1}</div>
                        <div className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700">{status}</div>
                        {index < statusFlow.length - 1 && <ChevronRight size={16} className="text-slate-400" />}
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="mb-5 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="rounded-xl bg-amber-100 p-2 text-amber-700"><Coins size={18} /></div>
                    <h3 className="text-xl font-bold text-slate-900">Carteira de pontos</h3>
                  </div>
                  <div className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-semibold text-emerald-700">Saldo: {userPoints} pts</div>
                </div>
                <div className="mb-5 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">Para evitar abusos e denúncias falsas, os pontos só são concedidos após triagem, validação e resolução da ocorrência pela equipe da Prefeitura.</div>
                <div className="space-y-3">
                  {recompensas.map((recompensa) => (
                    <div key={recompensa.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-lg font-bold text-slate-900">{recompensa.nome}</p>
                          <p className="mt-1 text-sm text-slate-600">{recompensa.descricao}</p>
                        </div>
                        <span className="rounded-full bg-amber-100 px-2 py-1 text-xs font-bold text-amber-700">{recompensa.custo} pts</span>
                      </div>
                      <button type="button" onClick={() => handleRedeemCoupon(recompensa)} className={`mt-3 w-full rounded-xl px-3 py-2 text-sm font-semibold ${userPoints >= recompensa.custo ? 'bg-emerald-600 text-white hover:bg-emerald-500' : 'cursor-not-allowed bg-slate-200 text-slate-500'}`} disabled={userPoints < recompensa.custo}>Resgatar</button>
                    </div>
                  ))}
                </div>
                {couponHistory.length > 0 && (
                  <div className="mt-5 rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
                    <p className="text-sm font-semibold uppercase tracking-[0.14em] text-emerald-700">Cupom gerado</p>
                    <div className="mt-3 space-y-2">
                      {couponHistory.map((cupom, index) => (
                        <div key={`${cupom.code}-${index}`} className="rounded-xl bg-white p-3 text-sm text-slate-700 shadow-sm">
                          <p className="font-bold text-slate-900">{cupom.reward}</p>
                          <p className="mt-1 text-xs uppercase tracking-[0.16em] text-emerald-700">{cupom.code}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </section>
          </div>
        )}

        {activeTab === 'prefeitura' && (
          <div className="space-y-6">
            <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <StatCard title="1.743" subtitle="Notificações para limpeza de terrenos baldios" accent="bg-red-100 text-red-700" footer="Fonte: Prefeitura de Campo Mourão, Resposta ao Requerimento nº 036/2026, Ofício nº 12/2026  GAPRE, disponível no SAPL da Câmara Municipal" icon={<AlertTriangle size={18} />} />
              <StatCard title="640" subtitle="Terrenos urbanos pertencentes ao Município catalogados e monitorados" accent="bg-sky-100 text-sky-700" footer="Base municipal de mapeamento urbano e fiscalização territorial" icon={<Map size={18} />} />
              <StatCard title="47 | 7" subtitle="Autos de infração aplicados em 2025 e 2026" accent="bg-amber-100 text-amber-700" footer="Os autos refletem processos administrativos em diferentes fases de lançamento e recurso." icon={<ShieldCheck size={18} />} />
              <StatCard title="80 sacos" subtitle="Mutirão comunitário recolheu mais de 80 sacos de lixo em abril de 2026" accent="bg-emerald-100 text-emerald-700" footer="Ações da Secretaria de Saúde recolheram 210 sacos de 100 litros nas regiões Cidade Alta II, Jardim Laura e Pio XII." icon={<Megaphone size={18} />} />
            </section>

            <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="mb-5 flex items-center gap-3">
                <div className="rounded-xl bg-red-100 p-2 text-red-700"><TrendingUp size={18} /></div>
                <h3 className="text-xl font-bold text-slate-900">Índices de reincidência por bairro</h3>
              </div>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {[
                  { bairro: 'Jardins Santa Casa', valor: 72 },
                  { bairro: 'Victória', valor: 64 },
                  { bairro: 'Cidade Alta II', valor: 81 },
                  { bairro: 'Jardim Laura', valor: 58 },
                ].map((item) => (
                  <div key={item.bairro} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <div className="mb-2 flex items-center justify-between text-sm font-medium text-slate-600">
                      <span>{item.bairro}</span>
                      <span>{item.valor}%</span>
                    </div>
                    <div className="h-3 overflow-hidden rounded-full bg-slate-200">
                      <div className="h-full rounded-full bg-gradient-to-r from-amber-400 via-orange-500 to-red-500" style={{ width: `${item.valor}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="mb-4 flex items-center gap-3">
                <div className="rounded-xl bg-sky-100 p-2 text-sky-700"><BadgeCheck size={18} /></div>
                <h3 className="text-xl font-bold text-slate-900">Inbox de triagem</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
                  <thead className="bg-slate-50 text-slate-600">
                    <tr>
                      <th className="px-3 py-3 font-semibold">Ocorrência</th>
                      <th className="px-3 py-3 font-semibold">Terreno</th>
                      <th className="px-3 py-3 font-semibold">Resíduo</th>
                      <th className="px-3 py-3 font-semibold">Status</th>
                      <th className="px-3 py-3 font-semibold">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 bg-white">
                    {denuncias.map((denuncia) => (
                      <tr key={denuncia.id}>
                        <td className="px-3 py-4 align-top">
                          <div className="font-semibold text-slate-800">{denuncia.id}</div>
                          <div className="text-xs text-slate-500">{formatDate(denuncia.data)}</div>
                        </td>
                        <td className="px-3 py-4 align-top text-slate-700">
                          {denuncia.bairro}
                          <div className="text-xs text-slate-500">{denuncia.terrenoId}</div>
                        </td>
                        <td className="px-3 py-4 align-top text-slate-700">{denuncia.residuo}</td>
                        <td className="px-3 py-4 align-top">
                          <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${getDenunciaStatusClasses(denuncia.status)}`}>{denuncia.status}</span>
                        </td>
                        <td className="px-3 py-4 align-top">
                          <div className="flex flex-col gap-2">
                            {denuncia.status !== 'Resolvida' && (
                              <button type="button" onClick={() => avancarDenuncia(denuncia.id)} className="rounded-lg bg-emerald-600 px-3 py-2 text-xs font-semibold text-white hover:bg-emerald-500">
                                {denuncia.status === 'Pendente' ? 'Validar Ocorrência' : denuncia.status === 'Em Análise' ? 'Avançar para Fiscalização' : 'Concluir Resolução'}
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </div>
        )}

        {activeTab === 'canvas' && (
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-5 flex items-center gap-3">
              <div className="rounded-xl bg-violet-100 p-2 text-violet-700"><ClipboardList size={18} /></div>
              <h3 className="text-xl font-bold text-slate-900">Quadro modelo de negócios</h3>
            </div>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              <BusinessCard title="Parceiros-Chave" color="bg-amber-100" items={['Prefeitura de Campo Mourão', 'Secretaria Municipal de Meio Ambiente e Bem-Estar Animal', 'Fiscais Municipais de Posturas e Obras', 'Ouvidoria 156 e WhatsApp institucional', 'Empresas comerciais locais parceiras']} />
              <BusinessCard title="Atividades-Chave" color="bg-emerald-100" items={['Fiscalização em campo de lotes denunciados', 'Monitoramento preditivo de pontos críticos', 'Manutenção da plataforma web responsiva', 'Triagem antifraude de ocorrências', 'Gestão operacional de pontos e cupons']} />
              <BusinessCard title="Proposta de Valor" color="bg-sky-100" items={['Combate cirúrgico à reincidência de descarte em lotes baldios', 'Canal de denúncia rápido via QR Code', 'Transparência no rastreamento de protocolos de limpeza', 'Gamificação e recompensas para engajar a população', 'Tomada de decisão baseada em dados']} />
              <BusinessCard title="Relacionamento com Usuários" color="bg-rose-100" items={['Engajamento comunitário contínuo', 'Transparência operacional via linha do tempo pública', 'Comunicação direta automatizada de progresso']} />
              <BusinessCard title="Canais de Acesso" color="bg-violet-100" items={['Placas físicas com QR Codes', 'Plataforma web responsiva mobile', 'Redes sociais e campanhas ambientais', 'Integração com Ouvidoria 156']} />
              <BusinessCard title="Segmentos de Usuários" color="bg-orange-100" items={['Moradores e cidadãos residentes', 'Gestores públicos e equipes de fiscalização', 'Proprietários de lotes urbanos', 'Comerciantes locais']} />
              <BusinessCard title="Estrutura de Custos" color="bg-cyan-100" items={['Desenvolvimento técnico e engenharia', 'Hospedagem em nuvem e banco de dados', 'Confecção e logística de placas com QR Codes', 'Campanhas de conscientização', 'Treinamento das equipes municipais']} />
              <BusinessCard title="Sustentabilidade / Fontes de Receita" color="bg-lime-100" items={['Dotação orçamentária municipal', 'Editais públicos estaduais/federais', 'PPPs e patrocínios comerciais institucionais']} />
              <BusinessCard title="Métricas de Sucesso" color="bg-indigo-100" items={['Tempo de resposta à ocorrência', 'Redução de reincidência por lote', 'Aderência do cidadão ao programa', 'Eficiência de fiscalização e limpeza']} />
            </div>
          </div>
        )}

        {activeTab === 'faq' && (
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-5 flex items-center gap-3">
              <div className="rounded-xl bg-emerald-100 p-2 text-emerald-700"><ShieldCheck size={18} /></div>
              <h3 className="text-xl font-bold text-slate-900">Sabatina para a banca examinadora</h3>
            </div>
            <div className="space-y-3">
              {faqItems.map((faq, index) => (
                <div key={faq.pergunta} className="rounded-2xl border border-slate-200 bg-slate-50">
                  <button type="button" onClick={() => setOpenFaq(openFaq === index ? null : index)} className="flex w-full items-center justify-between gap-4 px-4 py-4 text-left">
                    <span className="font-semibold text-slate-900">{faq.pergunta}</span>
                    <ChevronDown className={`transition ${openFaq === index ? 'rotate-180' : ''}`} size={18} />
                  </button>
                  {openFaq === index && <div className="border-t border-slate-200 px-4 py-4 text-sm leading-6 text-slate-600">{faq.resposta}</div>}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ title, subtitle, accent, footer, icon }: { title: string; subtitle: string; accent: string; footer: string; icon: React.ReactNode }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-2xl ${accent}`}>{icon}</div>
      <p className="text-3xl font-black tracking-tight text-slate-900">{title}</p>
      <p className="mt-2 text-base font-medium text-slate-700">{subtitle}</p>
      <p className="mt-4 text-xs leading-5 text-slate-500">{footer}</p>
    </div>
  );
}

function ImpactCard({ icon, color, title, body }: { icon: React.ReactNode; color: string; title: string; body: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className={`mb-3 flex h-10 w-10 items-center justify-center rounded-xl ${color}`}>{icon}</div>
      <h4 className="text-lg font-bold text-slate-900">{title}</h4>
      <p className="mt-2 text-sm text-slate-600">{body}</p>
    </div>
  );
}

function BusinessCard({ title, color, items }: { title: string; color: string; items: string[] }) {
  return (
    <div className={`${color} rounded-2xl border border-slate-200 p-4 shadow-sm`}>
      <h4 className="text-lg font-bold text-slate-900">{title}</h4>
      <ul className="mt-3 space-y-2 text-sm text-slate-700">
        {items.map((item) => (
          <li key={item} className="flex gap-2">
            <span className="mt-1 h-1.5 w-1.5 rounded-full bg-slate-700" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
