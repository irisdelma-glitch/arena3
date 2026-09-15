import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  AccessibilitySettings,
  GameSettings,
  Player,
  Question,
  SectorStat,
  Achievement,
  MatchHistoryEntry,
  CharacterType,
} from './types';
import { BR_CHARACTERS } from './data/characters';
import { LEVELS_DATA } from './data/questions';
import { INITIAL_ACHIEVEMENTS } from './data/achievements';
import {
  playHitSound,
  playDamageSound,
  playShieldBreakSound,
  playPowerupSound,
  playLaserScanSound,
  playRespawnSound,
  playTickSound,
  speakTacticalVoice,
  cancelVoice,
} from './utils/audio';
import { Radio, RotateCcw, AlertTriangle, ArrowLeft } from 'lucide-react';

import { AccessibilityPanel } from './components/AccessibilityPanel';
import { TacticalHud } from './components/TacticalHud';
import { ArenaPlayers } from './components/ArenaPlayers';
import { QuestionCard } from './components/QuestionCard';
import { TacticalLootDrawer } from './components/TacticalLootDrawer';
import { LevelBriefingModal } from './components/LevelBriefingModal';
import { PodiumScreen } from './components/PodiumScreen';
import { LobbySetup } from './components/LobbySetup';
import { HelpNetworkModal } from './components/HelpNetworkModal';

export default function App() {
  // Screen Flow: 'lobby' | 'briefing' | 'game' | 'podium'
  const [gameState, setGameState] = useState<'lobby' | 'briefing' | 'game' | 'podium'>('lobby');

  // Accessibility Settings
  const [accessibility, setAccessibility] = useState<AccessibilitySettings>({
    highContrast: false,
    fontSize: 'normal',
    colorblindMode: 'none',
    autoSpeakQuestions: false,
    soundEnabled: true,
    soundVolume: 0.6,
    voicePitch: 1.0,
    voiceRate: 1.05,
    reducedMotion: false,
    keyboardShortcutsEnabled: true,
    showVisualCaptions: true,
  });

  const [isAccPanelOpen, setIsAccPanelOpen] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Game Settings
  const [gameSettings, setGameSettings] = useState<GameSettings>({
    turnTimeLimit: 0,
    startingLives: 3,
    enablePowerups: true,
    enableBots: false,
    difficulty: 'todas',
  });

  // Lobby Operators Setup
  const [playerCount, setPlayerCount] = useState<number>(5);
  const [playerNames, setPlayerNames] = useState<string[]>(
    BR_CHARACTERS.map((c) => c.defaultName)
  );
  const [playerCharacters, setPlayerCharacters] = useState<CharacterType[]>(
    BR_CHARACTERS.map((c) => c.type)
  );

  // Active Game State
  const [players, setPlayers] = useState<Player[]>([]);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState<number>(0);
  const [currentLevelIndex, setCurrentLevelIndex] = useState<number>(0);
  const [roundNumber, setRoundNumber] = useState<number>(1);
  const [availableQuestions, setAvailableQuestions] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);

  // Question resolution states
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [eliminatedOptions, setEliminatedOptions] = useState<string[]>([]);

  // Timer & Elimination
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [eliminatedRank, setEliminatedRank] = useState<Player[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>(INITIAL_ACHIEVEMENTS);
  const [matchHistory, setMatchHistory] = useState<MatchHistoryEntry[]>([]);
  const [announcement, setAnnouncement] = useState<string>('');

  // Rede de Ajuda & Voltar states
  const [isHelpNetworkOpen, setIsHelpNetworkOpen] = useState<boolean>(false);
  const [showExitConfirm, setShowExitConfirm] = useState<boolean>(false);
  const [supportBannerMessage, setSupportBannerMessage] = useState<string | null>(null);

  // Pedagogical Sector Statistics
  const [sectorStats, setSectorStats] = useState<SectorStat[]>([
    { sector: 'Nível 1: Ortografia/Acentuação', category: 'Ortografia', total: 0, correct: 0 },
    { sector: 'Nível 2: Concordância/Regência', category: 'Concordância', total: 0, correct: 0 },
    { sector: 'Nível 3: Crase/Pontuação', category: 'Crase', total: 0, correct: 0 },
    { sector: 'Nível 4: Morfossintaxe/Coesão', category: 'Morfossintaxe', total: 0, correct: 0 },
  ]);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Update single accessibility property
  const handleUpdateAccessibility = (newSettings: Partial<AccessibilitySettings>) => {
    setAccessibility((prev) => ({ ...prev, ...newSettings }));
  };

  const handleUpdateGameSettings = (newSettings: Partial<GameSettings>) => {
    setGameSettings((prev) => ({ ...prev, ...newSettings }));
  };

  // Announce messages to screen readers and live regions
  const triggerAnnouncement = (msg: string) => {
    setAnnouncement(msg);
  };

  // Unlock Achievement helper
  const unlockAchievement = useCallback((id: string) => {
    setAchievements((prev) =>
      prev.map((ach) => {
        if (ach.id === id && !ach.isUnlocked) {
          triggerAnnouncement(`Conquista Militar Desbloqueada: ${ach.title}`);
          return { ...ach, isUnlocked: true, unlockedAt: new Date().toLocaleTimeString() };
        }
        return ach;
      })
    );
  }, []);

  // Initialize Match from Lobby
  const handleStartGame = () => {
    cancelVoice();
    const newPlayers: Player[] = [];
    for (let i = 0; i < playerCount; i++) {
      const charType = playerCharacters[i] || BR_CHARACTERS[i % BR_CHARACTERS.length].type;
      const name = playerNames[i] || BR_CHARACTERS[i % BR_CHARACTERS.length].defaultName;
      const isBot = gameSettings.enableBots && i > 0;

      newPlayers.push({
        id: i,
        name: isBot ? `${name} [BOT]` : name,
        type: charType,
        lives: gameSettings.startingLives,
        maxLives: gameSettings.startingLives,
        shields: 0,
        eliminated: false,
        score: 0,
        streak: 0,
        maxStreak: 0,
        correctAnswers: 0,
        totalAnswers: 0,
        inventory: {
          shield: 1,
          radar5050: 1,
          medkit: 1,
          doubleXp: 1,
        },
        isBot,
      });
    }

    setPlayers(newPlayers);
    setCurrentPlayerIndex(0);
    setCurrentLevelIndex(0);
    setRoundNumber(1);
    setEliminatedRank([]);
    setMatchHistory([]);
    setSectorStats([
      { sector: 'Nível 1: Ortografia/Acentuação', category: 'Ortografia', total: 0, correct: 0 },
      { sector: 'Nível 2: Concordância/Regência', category: 'Concordância', total: 0, correct: 0 },
      { sector: 'Nível 3: Crase/Pontuação', category: 'Crase', total: 0, correct: 0 },
      { sector: 'Nível 4: Morfossintaxe/Coesão', category: 'Morfossintaxe', total: 0, correct: 0 },
    ]);

    setGameState('briefing');
  };

  // Start specific level questions
  const handleStartLevelQuestions = useCallback(() => {
    cancelVoice();
    const levelObj = LEVELS_DATA[currentLevelIndex] || LEVELS_DATA[0];
    const shuffled = [...levelObj.questions].sort(() => Math.random() - 0.5);

    setAvailableQuestions(shuffled);
    setGameState('game');

    // Pick first question
    if (shuffled.length > 0) {
      setCurrentQuestion(shuffled[0]);
      setSelectedOption(null);
      setIsAnswered(false);
      setIsCorrect(null);
      setEliminatedOptions([]);

      if (gameSettings.turnTimeLimit > 0) {
        setTimeLeft(gameSettings.turnTimeLimit);
      } else {
        setTimeLeft(null);
      }
    }
  }, [currentLevelIndex, gameSettings.turnTimeLimit]);

  // Read current question using SpeechSynthesis with A, B, C, D
  const handleSpeakQuestion = useCallback(() => {
    if (!currentQuestion) return;
    setIsSpeaking(true);
    const letters = ['A', 'B', 'C', 'D', 'E'];
    const optionsSpeech = currentQuestion.options
      .map((opt, i) => `Alternativa ${letters[i] || i + 1}: ${opt}`)
      .join('. ');
    const textToSpeak = `${currentQuestion.text}. As alternativas são: ${optionsSpeech}`;
    speakTacticalVoice(textToSpeak, {
      pitch: accessibility.voicePitch,
      rate: accessibility.voiceRate,
      onEnd: () => setIsSpeaking(false),
    });
  }, [currentQuestion, accessibility.voicePitch, accessibility.voiceRate]);

  // Read briefing using SpeechSynthesis
  const handleSpeakBriefing = useCallback(() => {
    const levelObj = LEVELS_DATA[currentLevelIndex] || LEVELS_DATA[0];
    setIsSpeaking(true);
    speakTacticalVoice(levelObj.audioText, {
      pitch: accessibility.voicePitch,
      rate: accessibility.voiceRate,
      onEnd: () => setIsSpeaking(false),
    });
  }, [currentLevelIndex, accessibility.voicePitch, accessibility.voiceRate]);

  // Autoplay voice on question if enabled
  useEffect(() => {
    if (gameState === 'game' && currentQuestion && accessibility.autoSpeakQuestions && !isAnswered) {
      handleSpeakQuestion();
    }
  }, [gameState, currentQuestion, accessibility.autoSpeakQuestions, isAnswered, handleSpeakQuestion]);

  // Process User Answer
  const handleProcessAnswer = useCallback(
    (chosenOption: string) => {
      if (isAnswered || !currentQuestion) return;

      if (timerRef.current) {
        clearInterval(timerRef.current);
      }

      const activePlayer = players[currentPlayerIndex];
      const correct = chosenOption === currentQuestion.answer;

      setSelectedOption(chosenOption);
      setIsAnswered(true);
      setIsCorrect(correct);

      // Save match history entry
      setMatchHistory((prev) => [
        ...prev,
        {
          question: currentQuestion.text,
          playerName: activePlayer.name,
          chosen: chosenOption,
          correct: currentQuestion.answer,
          isCorrect: correct,
          explanation: currentQuestion.explanation,
          level: currentLevelIndex + 1,
        },
      ]);

      // Update Sector Statistics
      setSectorStats((prev) =>
        prev.map((s, idx) => {
          if (idx === currentLevelIndex) {
            return {
              ...s,
              total: s.total + 1,
              correct: correct ? s.correct + 1 : s.correct,
            };
          }
          return s;
        })
      );

      // Handle correctness
      if (correct) {
        if (accessibility.soundEnabled) playHitSound(accessibility.soundVolume);
        speakTacticalVoice('Alvo atingido!', {
          pitch: accessibility.voicePitch,
          rate: accessibility.voiceRate,
        });

        unlockAchievement('first_blood');

        const newStreak = activePlayer.streak + 1;
        if (newStreak >= 3) unlockAchievement('streak_3');
        if (newStreak >= 5) unlockAchievement('streak_5');

        const multiplier = 1 + newStreak * 0.2;
        const baseScore = currentQuestion.difficulty === 'difícil' ? 150 : currentQuestion.difficulty === 'médio' ? 100 : 60;
        const earnedScore = Math.round(baseScore * multiplier);

        setPlayers((prev) =>
          prev.map((p, i) => {
            if (i === currentPlayerIndex) {
              const updatedScore = p.score + earnedScore;
              if (updatedScore >= 1500) unlockAchievement('high_score');
              return {
                ...p,
                score: updatedScore,
                streak: newStreak,
                maxStreak: Math.max(p.maxStreak, newStreak),
                correctAnswers: p.correctAnswers + 1,
                totalAnswers: p.totalAnswers + 1,
              };
            }
            return p;
          })
        );

        if (currentLevelIndex === 2) {
          unlockAchievement('crase_sniper');
        }

        triggerAnnouncement(`Alvo atingido! ${currentQuestion.explanation}`);
      } else {
        // Incorrect answer
        speakTacticalVoice('Dano sofrido!', {
          pitch: accessibility.voicePitch,
          rate: accessibility.voiceRate,
        });

        // Check if shield is equipped
        if (activePlayer.shields > 0) {
          if (accessibility.soundEnabled) playShieldBreakSound(accessibility.soundVolume);
          unlockAchievement('shield_hero');

          setPlayers((prev) =>
            prev.map((p, i) =>
              i === currentPlayerIndex
                ? { ...p, shields: 0, streak: 0, totalAnswers: p.totalAnswers + 1 }
                : p
            )
          );

          triggerAnnouncement(
            `Dano sofrido! O Colete Kevlar de ${activePlayer.name} absorveu o impacto. Resposta correta: ${currentQuestion.answer}`
          );
        } else {
          // Takes actual damage
          if (accessibility.soundEnabled) playDamageSound(accessibility.soundVolume);

          const newLives = activePlayer.lives - 1;
          const isElim = newLives <= 0;

          setPlayers((prev) =>
            prev.map((p, i) => {
              if (i === currentPlayerIndex) {
                return {
                  ...p,
                  lives: Math.max(0, newLives),
                  eliminated: isElim,
                  inHelpNetwork: isElim,
                  streak: 0,
                  totalAnswers: p.totalAnswers + 1,
                };
              }
              return p;
            })
          );

          if (isElim) {
            setEliminatedRank((prev) => [...prev, activePlayer]);
            triggerAnnouncement(
              `Dano sofrido! Operador ${activePlayer.name} perdeu as vidas e entrou na Rede de Ajuda como Espectador Ativo!`
            );
            setSupportBannerMessage(
              `📡 ${activePlayer.name} entrou na Rede de Ajuda! Desafios de Recuperação e Suporte ao Esquadrão liberados.`
            );
          } else {
            triggerAnnouncement(
              `Dano sofrido por ${activePlayer.name}! Resposta correta: ${currentQuestion.answer}`
            );
          }
        }
      }
    },
    [
      isAnswered,
      currentQuestion,
      players,
      currentPlayerIndex,
      currentLevelIndex,
      accessibility.soundEnabled,
      accessibility.soundVolume,
      unlockAchievement,
    ]
  );

  // Advance to Next Turn
  const handleNextTurn = useCallback(() => {
    cancelVoice();
    setRoundNumber((r) => r + 1);
    setSupportBannerMessage(null);

    // Filter alive players
    const active = players.filter((p) => !p.eliminated);
    if (active.length === 0) {
      // Game Over -> Podium
      setGameState('podium');
      return;
    }

    // Check if level questions are exhausted
    const remainingQuestions = availableQuestions.slice(1);
    if (remainingQuestions.length === 0) {
      if (currentLevelIndex < LEVELS_DATA.length - 1) {
        setCurrentLevelIndex((prev) => prev + 1);
        setGameState('briefing');
        return;
      } else {
        // Finished all levels -> Podium
        setGameState('podium');
        return;
      }
    }

    // If only 1 player remains and no other players in game
    if (active.length === 1 && players.length === 1) {
      // Solo match continues through all questions
    }

    // Next alive player
    let nextIdx = (currentPlayerIndex + 1) % players.length;
    while (players[nextIdx].eliminated) {
      nextIdx = (nextIdx + 1) % players.length;
    }

    setCurrentPlayerIndex(nextIdx);
    setAvailableQuestions(remainingQuestions);
    setCurrentQuestion(remainingQuestions[0]);
    setSelectedOption(null);
    setIsAnswered(false);
    setIsCorrect(null);
    setEliminatedOptions([]);

    if (gameSettings.turnTimeLimit > 0) {
      setTimeLeft(gameSettings.turnTimeLimit);
    } else {
      setTimeLeft(null);
    }
  }, [players, availableQuestions, currentLevelIndex, currentPlayerIndex, gameSettings.turnTimeLimit]);

  // Rede de Ajuda: Respawn challenge completed successfully
  const handleRespawnPlayer = useCallback(
    (playerId: number) => {
      const respawned = players.find((p) => p.id === playerId);
      setPlayers((prev) =>
        prev.map((p) =>
          p.id === playerId
            ? {
                ...p,
                eliminated: false,
                lives: 1,
                inHelpNetwork: false,
                respawnCount: (p.respawnCount || 0) + 1,
                score: p.score + 100,
              }
            : p
        )
      );
      setEliminatedRank((prev) => prev.filter((p) => p.id !== playerId));
      unlockAchievement('help_guardian');
      if (accessibility.soundEnabled) playRespawnSound(accessibility.soundVolume);
      triggerAnnouncement(
        `OPERADOR RECOLOCADO: ${respawned?.name || 'Operador'} acertou o desafio e voltou ao combate com 1 vida!`
      );
      setSupportBannerMessage(
        `🎉 REFORÇO CONFIRMADO: ${respawned?.name || 'Operador'} realizou o Respawn Gramatical e está de volta à Arena!`
      );
    },
    [players, accessibility.soundEnabled, accessibility.soundVolume, unlockAchievement]
  );

  // Rede de Ajuda: Helper eliminates 2 options for active player
  const handleSupportEliminateOptions = useCallback(
    (helperName: string) => {
      if (!currentQuestion) return;
      const wrong = currentQuestion.options.filter((o) => o !== currentQuestion.answer);
      setEliminatedOptions(wrong.slice(0, 2));
      if (accessibility.soundEnabled) playLaserScanSound(accessibility.soundVolume);
      unlockAchievement('help_guardian');
      setPlayers((prev) =>
        prev.map((p) =>
          p.name === helperName
            ? { ...p, score: p.score + 50, assistedCount: (p.assistedCount || 0) + 1 }
            : p
        )
      );
      triggerAnnouncement(
        `Suporte da Rede de Ajuda: ${helperName} eliminou duas alternativas incorretas para o colega!`
      );
      setSupportBannerMessage(
        `📡 MIRA TÁTICA 50/50: ${helperName} descartou 2 opções incorretas para apoiar o esquadrão!`
      );
    },
    [currentQuestion, accessibility.soundEnabled, accessibility.soundVolume, unlockAchievement]
  );

  // Rede de Ajuda: Helper donates a shield to active player
  const handleSupportGiveShield = useCallback(
    (helperName: string) => {
      const activeName = players[currentPlayerIndex]?.name || 'colega';
      setPlayers((prev) =>
        prev.map((p, i) => {
          if (i === currentPlayerIndex) {
            return { ...p, shields: Math.min(2, p.shields + 1) };
          }
          if (p.name === helperName) {
            return { ...p, score: p.score + 50, assistedCount: (p.assistedCount || 0) + 1 };
          }
          return p;
        })
      );
      if (accessibility.soundEnabled) playPowerupSound(accessibility.soundVolume);
      unlockAchievement('help_guardian');
      triggerAnnouncement(
        `Suporte da Rede de Ajuda: ${helperName} equipou um Colete Protetor em ${activeName}!`
      );
      setSupportBannerMessage(
        `🛡️ BLINDAGEM SOLIDÁRIA: ${helperName} protegeu ${activeName} com um Colete Kevlar!`
      );
    },
    [currentPlayerIndex, players, accessibility.soundEnabled, accessibility.soundVolume, unlockAchievement]
  );

  // Rede de Ajuda: Helper broadcasts hint
  const handleSupportGiveTip = useCallback(
    (helperName: string) => {
      unlockAchievement('help_guardian');
      setPlayers((prev) =>
        prev.map((p) =>
          p.name === helperName
            ? { ...p, score: p.score + 35, assistedCount: (p.assistedCount || 0) + 1 }
            : p
        )
      );
      triggerAnnouncement(`Suporte da Rede de Ajuda: ${helperName} transmitiu uma dica pedagógica!`);
      setSupportBannerMessage(
        `💡 DICA DE CAMPO: ${helperName} transmitiu orientações da norma culta para o esquadrão!`
      );
    },
    [unlockAchievement]
  );

  // Timer Tick Handling
  useEffect(() => {
    if (gameState !== 'game' || isAnswered || timeLeft === null) return;

    if (timeLeft <= 0) {
      // Time ran out -> counts as error
      if (currentQuestion) {
        const wrongOption = currentQuestion.options.find((o) => o !== currentQuestion.answer) || currentQuestion.options[0];
        handleProcessAnswer(wrongOption);
      }
      return;
    }

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev === null) return null;
        if (prev <= 4 && prev > 1 && accessibility.soundEnabled) {
          playTickSound(accessibility.soundVolume);
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [gameState, isAnswered, timeLeft, currentQuestion, accessibility.soundEnabled, accessibility.soundVolume, handleProcessAnswer]);

  // Bot Simulation Logic
  useEffect(() => {
    if (gameState !== 'game' || isAnswered || !currentQuestion) return;

    const activePlayer = players[currentPlayerIndex];
    if (activePlayer && activePlayer.isBot) {
      const botTimer = setTimeout(() => {
        // Bot has 75% chance of picking correct answer
        const isBotCorrect = Math.random() < 0.75;
        if (isBotCorrect) {
          handleProcessAnswer(currentQuestion.answer);
        } else {
          const wrongOpts = currentQuestion.options.filter((o) => o !== currentQuestion.answer);
          const chosen = wrongOpts[Math.floor(Math.random() * wrongOpts.length)] || currentQuestion.options[0];
          handleProcessAnswer(chosen);
        }
      }, 2000);

      return () => clearTimeout(botTimer);
    }
  }, [gameState, isAnswered, currentQuestion, players, currentPlayerIndex, handleProcessAnswer]);

  // Tactical Power-ups handlers
  const handleUseShield = () => {
    const p = players[currentPlayerIndex];
    if (p.inventory.shield <= 0 || p.shields > 0) return;
    if (accessibility.soundEnabled) playPowerupSound(accessibility.soundVolume);

    setPlayers((prev) =>
      prev.map((player, i) =>
        i === currentPlayerIndex
          ? {
              ...player,
              shields: 1,
              inventory: { ...player.inventory, shield: player.inventory.shield - 1 },
            }
          : player
      )
    );
    triggerAnnouncement(`${p.name} equipou um Colete Kevlar de proteção!`);
  };

  const handleUseRadar = () => {
    const p = players[currentPlayerIndex];
    if (!currentQuestion || p.inventory.radar5050 <= 0) return;
    if (accessibility.soundEnabled) playLaserScanSound(accessibility.soundVolume);
    unlockAchievement('radar_master');

    const wrongOptions = currentQuestion.options.filter((o) => o !== currentQuestion.answer);
    const toEliminate = wrongOptions.slice(0, 2);

    setEliminatedOptions(toEliminate);
    setPlayers((prev) =>
      prev.map((player, i) =>
        i === currentPlayerIndex
          ? {
              ...player,
              inventory: { ...player.inventory, radar5050: player.inventory.radar5050 - 1 },
            }
          : player
      )
    );
    triggerAnnouncement(`Mira Holográfica ativada! Duas alternativas incorretas foram eliminadas.`);
  };

  const handleUseMedkit = () => {
    const p = players[currentPlayerIndex];
    if (p.inventory.medkit <= 0 || p.lives >= p.maxLives) return;
    if (accessibility.soundEnabled) playPowerupSound(accessibility.soundVolume);
    unlockAchievement('medic_touch');

    setPlayers((prev) =>
      prev.map((player, i) =>
        i === currentPlayerIndex
          ? {
              ...player,
              lives: Math.min(player.maxLives, player.lives + 1),
              inventory: { ...player.inventory, medkit: player.inventory.medkit - 1 },
            }
          : player
      )
    );
    triggerAnnouncement(`${p.name} utilizou um Kit Médico e recuperou 1 coração de vida!`);
  };

  const handleUseDoubleXp = () => {
    const p = players[currentPlayerIndex];
    if (p.inventory.doubleXp <= 0) return;
    if (accessibility.soundEnabled) playPowerupSound(accessibility.soundVolume);

    setPlayers((prev) =>
      prev.map((player, i) =>
        i === currentPlayerIndex
          ? {
              ...player,
              streak: player.streak + 2,
              inventory: { ...player.inventory, doubleXp: player.inventory.doubleXp - 1 },
            }
          : player
      )
    );
    triggerAnnouncement(`Foco Duplo ativado! Multiplicador de XP aumentado.`);
  };

  // Keyboard Navigation Listener (1-4 for options, Space for next, L for speak, Alt+A for acc)
  useEffect(() => {
    if (!accessibility.keyboardShortcutsEnabled) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger shortcuts if user is typing into an input field
      if (
        document.activeElement?.tagName === 'INPUT' ||
        document.activeElement?.tagName === 'SELECT' ||
        document.activeElement?.tagName === 'TEXTAREA'
      ) {
        return;
      }

      // Alt+A: Toggle Accessibility Panel
      if (e.altKey && (e.key === 'a' || e.key === 'A')) {
        e.preventDefault();
        setIsAccPanelOpen((prev) => !prev);
        return;
      }

      // Escape: Close open modals
      if (e.key === 'Escape') {
        if (isHelpNetworkOpen) {
          setIsHelpNetworkOpen(false);
          return;
        }
        if (showExitConfirm) {
          setShowExitConfirm(false);
          return;
        }
        if (isAccPanelOpen) {
          setIsAccPanelOpen(false);
          return;
        }
      }

      // L: Listen to Question / Briefing
      if (e.key === 'l' || e.key === 'L') {
        e.preventDefault();
        if (gameState === 'game') {
          handleSpeakQuestion();
        } else if (gameState === 'briefing') {
          handleSpeakBriefing();
        }
        return;
      }

      // R or H: Open Rede de Ajuda / Modo Espectador
      if ((e.key === 'r' || e.key === 'R' || e.key === 'h' || e.key === 'H') && gameState === 'game') {
        const hasEliminated = players.some((p) => p.eliminated);
        if (hasEliminated) {
          e.preventDefault();
          setIsHelpNetworkOpen((prev) => !prev);
          return;
        }
      }

      // In Game State
      if (gameState === 'game') {
        // Space / Enter: Advance next round if answered
        if (e.key === ' ' || e.key === 'Enter') {
          if (isAnswered) {
            e.preventDefault();
            handleNextTurn();
          }
        }

        // A, B, C, D or 1, 2, 3, 4: Select Option
        if (!isAnswered && currentQuestion) {
          let optionIdx = -1;
          const kLower = e.key.toLowerCase();
          if (kLower === 'a') optionIdx = 0;
          else if (kLower === 'b') optionIdx = 1;
          else if (kLower === 'c') optionIdx = 2;
          else if (kLower === 'd') optionIdx = 3;
          else {
            const keyNum = parseInt(e.key, 10);
            if (keyNum >= 1 && keyNum <= currentQuestion.options.length) {
              optionIdx = keyNum - 1;
            }
          }

          if (optionIdx >= 0 && optionIdx < currentQuestion.options.length) {
            e.preventDefault();
            const option = currentQuestion.options[optionIdx];
            if (!eliminatedOptions.includes(option)) {
              handleProcessAnswer(option);
            }
          }
        }

        // U: Use Shield
        if (e.key === 'u' || e.key === 'U') {
          e.preventDefault();
          handleUseShield();
        }
      }

      // In Briefing State
      if (gameState === 'briefing' && (e.key === 'Enter' || e.key === ' ')) {
        e.preventDefault();
        handleStartLevelQuestions();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    accessibility.keyboardShortcutsEnabled,
    isAccPanelOpen,
    gameState,
    isAnswered,
    currentQuestion,
    eliminatedOptions,
    handleSpeakQuestion,
    handleSpeakBriefing,
    handleNextTurn,
    handleProcessAnswer,
    handleStartLevelQuestions,
  ]);

  // Ranking calculation for Podium
  const activeSurvivors = [...players.filter((p) => !p.eliminated)].sort(
    (a, b) => b.score - a.score || b.lives - a.lives
  );
  const finalRanking = [...activeSurvivors, ...[...eliminatedRank].reverse()];
  const unlockedBadgesCount = achievements.filter((a) => a.isUnlocked).length;

  const currentLevelData = LEVELS_DATA[currentLevelIndex] || LEVELS_DATA[0];
  const activePlayer = players[currentPlayerIndex] || players[0];

  return (
    <div
      className={`min-h-screen flex flex-col items-center justify-between p-3 sm:p-6 transition-colors ${
        accessibility.highContrast
          ? 'bg-black text-yellow-100 font-sans'
          : 'bg-slate-950 text-slate-100 font-sans'
      }`}
    >
      {/* Screen Reader ARIA Live Announcer */}
      <div
        role="status"
        aria-live="assertive"
        aria-atomic="true"
        className="sr-only"
      >
        {announcement}
      </div>

      {/* Main Container */}
      <main className="w-full max-w-6xl mx-auto flex-1 flex flex-col justify-start space-y-4 sm:space-y-6">
        {/* LOBBY SCREEN */}
        {gameState === 'lobby' && (
          <LobbySetup
            playerCount={playerCount}
            onPlayerCountChange={setPlayerCount}
            playerNames={playerNames}
            onPlayerNameChange={(idx, name) => {
              const updated = [...playerNames];
              updated[idx] = name;
              setPlayerNames(updated);
            }}
            playerCharacters={playerCharacters}
            onPlayerCharacterChange={(idx, type) => {
              const updated = [...playerCharacters];
              updated[idx] = type;
              setPlayerCharacters(updated);
            }}
            settings={accessibility}
            gameSettings={gameSettings}
            onUpdateGameSettings={handleUpdateGameSettings}
            onOpenAccessibility={() => setIsAccPanelOpen(true)}
            onToggleSound={() =>
              handleUpdateAccessibility({ soundEnabled: !accessibility.soundEnabled })
            }
            onStartGame={handleStartGame}
          />
        )}

        {/* BRIEFING MODAL */}
        {gameState === 'briefing' && (
          <LevelBriefingModal
            level={currentLevelData}
            isOpen={true}
            settings={accessibility}
            onStartLevel={handleStartLevelQuestions}
            onSpeakBriefing={handleSpeakBriefing}
            isSpeaking={isSpeaking}
            onBackToLobby={() => setGameState('lobby')}
          />
        )}

        {/* GAME ARENA SCREEN */}
        {gameState === 'game' && activePlayer && (
          <div className="w-full space-y-4 sm:space-y-5 animate-fade-in">
            {/* Top Tactical HUD */}
            <TacticalHud
              currentLevelTitle={currentLevelData.title}
              currentSector={currentLevelData.sectorName}
              activePlayer={activePlayer}
              roundNumber={roundNumber}
              timeLeft={timeLeft}
              settings={accessibility}
              onOpenAccessibility={() => setIsAccPanelOpen(true)}
              onToggleSound={() =>
                handleUpdateAccessibility({ soundEnabled: !accessibility.soundEnabled })
              }
              onOpenAchievements={() => setIsAccPanelOpen(true)}
              unlockedBadgesCount={unlockedBadgesCount}
              onBackToLobby={() => setShowExitConfirm(true)}
              onOpenHelpNetwork={() => setIsHelpNetworkOpen(true)}
              helpNetworkCount={players.filter((p) => p.eliminated).length}
            />

            {/* Support Alert / Notification Banner */}
            {supportBannerMessage && (
              <div className="p-3 rounded-xl bg-cyan-950/80 border border-cyan-400 text-cyan-200 text-xs sm:text-sm font-semibold flex items-center justify-between gap-3 shadow-lg shadow-cyan-900/30 animate-fade-in">
                <div className="flex items-center gap-2">
                  <Radio className="w-4 h-4 text-cyan-400 animate-pulse shrink-0" />
                  <span>{supportBannerMessage}</span>
                </div>
                <button
                  onClick={() => setSupportBannerMessage(null)}
                  className="text-xs text-cyan-400 hover:text-white uppercase font-bold px-2 py-0.5"
                >
                  OK
                </button>
              </div>
            )}

            {/* Rede de Ajuda Quick Bar when any player is eliminated */}
            {players.some((p) => p.eliminated) && (
              <div className="p-3 rounded-xl bg-slate-900/90 border border-cyan-500/40 flex flex-wrap items-center justify-between gap-3 text-xs animate-fade-in">
                <div className="flex items-center gap-2.5">
                  <Radio className="w-4 h-4 text-cyan-400 animate-pulse shrink-0" />
                  <div>
                    <span className="font-bold text-cyan-300">Rede de Ajuda Conectada: </span>
                    <span className="text-slate-300">
                      {players
                        .filter((p) => p.eliminated)
                        .map((p) => p.name)
                        .join(', ')}{' '}
                      (Modo Espectador Ativo com Desafios de Respawn e Assistências ao Esquadrão)
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setIsHelpNetworkOpen(true)}
                  className="px-3.5 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-black font-black uppercase tracking-wider text-xs transition-colors flex items-center gap-1.5 shadow-md shadow-cyan-500/20"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Abrir Central de Ajuda</span>
                </button>
              </div>
            )}

            {/* Players Grid */}
            <ArenaPlayers
              players={players}
              currentPlayerIndex={currentPlayerIndex}
              settings={accessibility}
              onOpenHelpNetwork={() => setIsHelpNetworkOpen(true)}
            />

            {/* Main Question Card */}
            {currentQuestion && (
              <QuestionCard
                question={currentQuestion}
                eliminatedOptions={eliminatedOptions}
                selectedOption={selectedOption}
                isAnswered={isAnswered}
                isCorrect={isCorrect}
                settings={accessibility}
                onSelectOption={handleProcessAnswer}
                onNextTurn={handleNextTurn}
                onSpeakQuestion={handleSpeakQuestion}
                isSpeaking={isSpeaking}
                activePlayerName={activePlayer.name}
              />
            )}

            {/* Tactical Loot Drawer */}
            <TacticalLootDrawer
              player={activePlayer}
              isAnswered={isAnswered}
              onUseShield={handleUseShield}
              onUseRadar={handleUseRadar}
              onUseMedkit={handleUseMedkit}
              onUseDoubleXp={handleUseDoubleXp}
              settings={accessibility}
            />
          </div>
        )}

        {/* PODIUM & POST-COMBAT DIAGNOSTIC REPORT */}
        {gameState === 'podium' && (
          <PodiumScreen
            finalRanking={finalRanking}
            sectorStats={sectorStats}
            achievements={achievements}
            matchHistory={matchHistory}
            settings={accessibility}
            onRestartGame={() => setGameState('lobby')}
          />
        )}
      </main>

      {/* Rede de Ajuda / Active Spectator Mode Modal */}
      <HelpNetworkModal
        isOpen={isHelpNetworkOpen}
        onClose={() => setIsHelpNetworkOpen(false)}
        eliminatedPlayers={players.filter((p) => p.eliminated)}
        activePlayer={activePlayer || players[0]}
        currentQuestion={currentQuestion}
        settings={accessibility}
        onRespawnPlayer={handleRespawnPlayer}
        onSupportEliminateOptions={handleSupportEliminateOptions}
        onSupportGiveShield={handleSupportGiveShield}
        onSupportGiveTip={handleSupportGiveTip}
      />

      {/* Confirmation Modal to Exit/Voltar ao Lobby during Game */}
      {showExitConfirm && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="exit-confirm-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fade-in"
        >
          <div className="w-full max-w-md rounded-2xl bg-slate-900 border border-slate-700 p-6 space-y-4 shadow-2xl text-slate-100">
            <div className="flex items-center gap-2.5 text-amber-400">
              <AlertTriangle className="w-5 h-5" />
              <h3 id="exit-confirm-title" className="font-bold font-['Chakra_Petch'] text-base uppercase">
                Retornar ao Lobby?
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Tem certeza de que deseja sair da batalha atual? O combate em andamento será encerrado e você retornará à tela de configuração.
            </p>
            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                onClick={() => setShowExitConfirm(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold uppercase transition-colors"
              >
                Continuar na Arena
              </button>
              <button
                onClick={() => {
                  setShowExitConfirm(false);
                  cancelVoice();
                  if (timerRef.current) clearInterval(timerRef.current);
                  setGameState('lobby');
                }}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold uppercase transition-colors flex items-center gap-1.5"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Sim, Voltar ao Lobby</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Accessibility Modal Drawer */}
      <AccessibilityPanel
        isOpen={isAccPanelOpen}
        onClose={() => setIsAccPanelOpen(false)}
        settings={accessibility}
        onUpdateSettings={handleUpdateAccessibility}
      />

      {/* Persistent Accessible Quick Bar Footer */}
      <footer className="w-full max-w-6xl mx-auto pt-4 mt-6 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          <span>Arena Battle Royale de Língua Portuguesa • Norma Culta & Gamificação Tática</span>
        </div>
        <div className="flex items-center gap-3">
          <span>Atalhos: [A-D ou 1-4] Alternativas • [Espaço] Avançar • [L] Ouvir • [R] Rede de Ajuda • [Alt+A] Acessibilidade</span>
        </div>
      </footer>
    </div>
  );
}
