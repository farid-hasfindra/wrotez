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
}

export function getAIProvider(): AIProvider {
  // In production, instantiate OpenAI / Gemini provider based on process.env.AI_PROVIDER
  return new MockLocalAIProvider();
}
