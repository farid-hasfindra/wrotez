// AI Provider Abstraction Layer

export interface StoryQuestionPayload {
  question: string;
  novelContext: string;
  characters: string[];
}

export interface InconsistencyResult {
  type: "CHARACTER" | "TIMELINE" | "PLOT";
  title: string;
  description: string;
  locationA: string;
  locationB: string;
  status: "Possible Inconsistency" | "Resolved" | "Intentional";
  severity: "HIGH" | "MEDIUM" | "LOW";
}

export interface IdeaDetectionResult {
  detected: boolean;
  title?: string;
  description?: string;
  category?: string;
  snippet?: string;
}

export interface StoryImpactPayload {
  changeDescription: string;
  affectedCharacter?: string;
  chapters: { id: string; title: string; orderIndex: number; content: string }[];
  characters: { id: string; name: string; role: string }[];
  events: { id: string; title: string }[];
}

export interface StoryImpactResult {
  impactLevel: "HIGH" | "MEDIUM" | "LOW";
  summary: string;
  impactedCharacterRelationships: string[];
  impactedChapters: string[];
  impactedPlotPoints: string[];
  impactedArcs: string[];
  recommendations: string[];
}

export interface AIProvider {
  name: string;
  answerStoryQuestion(payload: StoryQuestionPayload): Promise<string>;
  detectInconsistency(novelText: string): Promise<InconsistencyResult[]>;
  detectIdeasFromText(text: string): Promise<IdeaDetectionResult[]>;
  analyzeContributionImpact(beforeText: string, afterText: string): Promise<{
    impactScore: number;
    narrativeImpactSummary: string;
    downstreamInfluence: string;
  }>;
  analyzeStoryImpact(payload: StoryImpactPayload): Promise<StoryImpactResult>;
}


class MockLocalAIProvider implements AIProvider {
  name = "StoryBrain Local Engine (Mock / Fallback)";

  async answerStoryQuestion(payload: StoryQuestionPayload): Promise<string> {
    const q = payload.question.toLowerCase();
    if (q.includes("elena") || q.includes("secret")) {
      return "Elena's secret identity as the heiress of the Fallen Realm of Arken is known only to Marcus and High Commander Daniel. She revealed it in Chapter 4 under oath.";
    }
    if (q.includes("marcus") && q.includes("john")) {
      return "Marcus first encountered John in Chapter 2 at the Arken Guard Garrison during the night raid, where John spared Marcus's life.";
    }
    if (q.includes("conflict") || q.includes("unresolved")) {
      return "There are 3 major unresolved conflicts: 1) The missing Crown Artifact, 2) Marcus's allegiance to the Obsidian Syndicate, 3) The impending Siege of Arken Citadel.";
    }
    if (q.includes("summarize")) {
      return "Chapters 1–10 trace the rise of the Obsidian Syndicate, Elena's disguise within the Garrison, and Marcus's secret discovery of the Sun Altar map in Arken Vault.";
    }
    return `Based on the manuscript context (${payload.novelContext.length} chars analyzed): The event took place during the early events of Chapter 3 before the siege began. Key involved figures include Elena and Marcus.`;
  }

  async detectInconsistency(novelText: string): Promise<InconsistencyResult[]> {
    return [
      {
        type: "CHARACTER",
        title: "Character Behavior Contradiction",
        description: "In Chapter 5, Marcus is explicitly described as having an intense aquaphobia. In Chapter 18, he dives into the open sea to retrieve the artifact without hesitation.",
        locationA: "Chapter 5 (Paragraph 12)",
        locationB: "Chapter 18 (Paragraph 4)",
        status: "Possible Inconsistency",
        severity: "HIGH",
      },
      {
        type: "TIMELINE",
        title: "Travel Speed & Distance Collision",
        description: "Elena appears in the Arken Garrison at 08:00 AM, and appears in Solitude Fortress at 08:30 AM. Estimated horseback travel time is 4.5 hours.",
        locationA: "Chapter 7 (Scene 1)",
        locationB: "Chapter 8 (Scene 3)",
        status: "Possible Inconsistency",
        severity: "MEDIUM",
      },
      {
        type: "PLOT",
        title: "Gate Artifact Prerequisite Bypass",
        description: "Chapter 7 establishes that the Sun Altar Gate cannot be unsealed without the Sunstone. Chapter 19 shows the gate opening while the Sunstone remains in Marcus's pouch.",
        locationA: "Chapter 7 (Page 14)",
        locationB: "Chapter 19 (Page 2)",
        status: "Possible Inconsistency",
        severity: "HIGH",
      },
    ];
  }

  async detectIdeasFromText(text: string): Promise<IdeaDetectionResult[]> {
    if (text.includes("?") || text.includes("what if") || text.includes("bagaimana kalau")) {
      return [
        {
          detected: true,
          title: "Hidden Realm Revelation",
          description: "What if the Kingdom of Arken is actually built above an ancient submerged sky-fortress?",
          category: "WORLDBUILDING",
          snippet: text.slice(0, 100),
        },
      ];
    }
    return [];
  }

  async analyzeContributionImpact(beforeText: string, afterText: string) {
    const diff = afterText.length - beforeText.length;
    return {
      impactScore: Math.min(95, Math.max(20, Math.round(Math.abs(diff) / 10 + 40))),
      narrativeImpactSummary: "Introduced pivotal climax plot elements affecting antagonist motivations in Chapter 14.",
      downstreamInfluence: "High - Influences 7 subsequent scenes across Chapters 15-20.",
    };
  }

  async analyzeStoryImpact(payload: StoryImpactPayload): Promise<StoryImpactResult> {
    const { changeDescription, chapters, characters } = payload;
    const desc = changeDescription.toLowerCase();

    const isVillainChange = desc.includes("villain") || desc.includes("antagonis") || desc.includes("musuh");
    const isProtagonistChange = desc.includes("protagonist") || desc.includes("hero") || desc.includes("pahlawan");
    const isPlotTwist = desc.includes("plot twist") || desc.includes("twist") || desc.includes("kejutan");
    const isDeathEvent = desc.includes("mati") || desc.includes("meninggal") || desc.includes("died") || desc.includes("dies");

    let impactLevel: "HIGH" | "MEDIUM" | "LOW" = "MEDIUM";
    if (isVillainChange || isPlotTwist || isDeathEvent) impactLevel = "HIGH";
    else if (isProtagonistChange) impactLevel = "HIGH";

    const affectedChapterCount = Math.min(chapters.length, isVillainChange ? 5 : isPlotTwist ? 4 : 3);
    const impactedChapters = chapters
      .slice(0, affectedChapterCount)
      .map((c) => `Bab ${c.orderIndex}: ${c.title}`);

    const impactedCharacterRelationships: string[] = [];
    if (characters.length > 0) {
      const c1 = characters[0];
      const c2 = characters[1];
      impactedCharacterRelationships.push(`Relasi ${c1.name} ↔ ${c2?.name || "Karakter Utama"}`);
      if (isVillainChange && characters[2]) {
        impactedCharacterRelationships.push(`Konflik ${characters[2].name} — Terpengaruh Motivasi`);
      }
      if (isDeathEvent) {
        impactedCharacterRelationships.push(`Semua relasi karakter terdampak — Peristiwa kematian mempengaruhi dinamika tim`);
      }
    }

    const impactedPlotPoints = isVillainChange
      ? ["Titik konflik klimaks utama", "Resolusi akhir arc antagonis", "Motivasi karakter pendukung"]
      : isPlotTwist
      ? ["Alur resolusi konflik", "Setup cerita di bab sebelumnya"]
      : ["Pacing narasi tengah novel"];

    const impactedArcs = isVillainChange
      ? ["Main Antagonist Arc", "Hero's Journey Arc"]
      : isDeathEvent
      ? ["Character Death Arc", "Grief & Resolution Arc"]
      : ["Supporting Character Arc"];

    const recommendations = [
      `Tinjau kembali ${affectedChapterCount} bab yang terpengaruh untuk konsistensi narasi.`,
      `Perbarui profil karakter yang hubungannya berubah akibat perubahan ini.`,
      impactedArcs.length > 0 ? `Pastikan arc "${impactedArcs[0]}" tetap kohesif setelah perubahan.` : "",
      isVillainChange ? "Pertimbangkan retroaktif hint di bab-bab awal agar twist terasa organik." : "",
    ].filter(Boolean);

    return {
      impactLevel,
      summary: `Perubahan ini memiliki dampak ${impactLevel === "HIGH" ? "tinggi" : impactLevel === "MEDIUM" ? "sedang" : "rendah"} terhadap narasi. Terdeteksi ${impactedChapters.length} bab, ${impactedCharacterRelationships.length} relasi karakter, dan ${impactedArcs.length} arc cerita yang perlu ditinjau ulang.`,
      impactedCharacterRelationships,
      impactedChapters,
      impactedPlotPoints,
      impactedArcs,
      recommendations: recommendations as string[],
    };
  }
}


export function getAIProvider(): AIProvider {
  // In production, instantiate OpenAI / Gemini provider based on process.env.AI_PROVIDER
  return new MockLocalAIProvider();
}
