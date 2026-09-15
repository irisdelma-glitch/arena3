import { Achievement } from '../types';

export const INITIAL_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first_blood',
    title: 'Primeiro Disparo',
    description: 'Acertou o primeiro alvo com precisão gramatical.',
    icon: '🎯',
    isUnlocked: false,
  },
  {
    id: 'streak_3',
    title: 'Sequência Tática',
    description: 'Alcançou um combo de 3 acertos consecutivos.',
    icon: '🔥',
    isUnlocked: false,
  },
  {
    id: 'streak_5',
    title: 'Operador Implacável',
    description: 'Alcançou um combo insano de 5 acertos seguidos.',
    icon: '⚡',
    isUnlocked: false,
  },
  {
    id: 'shield_hero',
    title: 'Blindagem Tática',
    description: 'Absorveu dano inimigo utilizando um Colete Kevlar.',
    icon: '🛡️',
    isUnlocked: false,
  },
  {
    id: 'radar_master',
    title: 'Visão Holográfica',
    description: 'Utilizou a Mira Laser 50/50 para limpar alternativas erradas.',
    icon: '📡',
    isUnlocked: false,
  },
  {
    id: 'medic_touch',
    title: 'Médico de Combate',
    description: 'Recuperou vida na arena utilizando o Kit Médico.',
    icon: '🩹',
    isUnlocked: false,
  },
  {
    id: 'crase_sniper',
    title: 'Sniper da Crase',
    description: 'Acertou um desafio complexo de crase ou pontuação.',
    icon: '🔭',
    isUnlocked: false,
  },
  {
    id: 'high_score',
    title: 'Mestre da Arena',
    description: 'Superou a marca militar de 1.500 pontos de XP.',
    icon: '🎖️',
    isUnlocked: false,
  },
  {
    id: 'invictus',
    title: 'Sobrevivente Invicto',
    description: 'Chegou ao Pódio Final com 3 corações de vida intactos.',
    icon: '👑',
    isUnlocked: false,
  },
  {
    id: 'help_guardian',
    title: 'Anjo da Guarda',
    description: 'Atuou na Rede de Ajuda prestando suporte tático ou retornou à arena após um Desafio de Recuperação.',
    icon: '🤝',
    isUnlocked: false,
  },
];
