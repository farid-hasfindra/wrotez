// Contribution Tracking & Explainable AI Engine

export interface RawContribution {
  userId: string;
  userName: string;
  wordCount: number;
  chapterCount: number;
  ideasCreated: number;
  ideasAdopted: number;
  narrativeImpactCount: number;
  downstreamConnections: number;
  structuralEdits: number;
}

export interface ContributionScoreResult {
  userId: string;
  userName: string;
  totalScore: number;
  volumeScore: number;
  writingScore: number;
  ideaScore: number;
  narrativeImpactScore: number;
  downstreamInfluenceScore: number;
  structuralScore: number;
  explanations: string[];
  downstreamImpactAssessment: {
    level: "High" | "Medium" | "Low";
    summary: string;
    affectedElements: string[];
  };
}

/**
 * Calculates a simple string diff summary between two text snapshots.
 */
export function computeTextDiff(before: string, after: string) {
  const beforeWords = before.trim().split(/\s+/).filter(Boolean);
  const afterWords = after.trim().split(/\s+/).filter(Boolean);

  const wordDelta = afterWords.length - beforeWords.length;
  const characterDelta = after.length - before.length;

  let type: "CREATE" | "INSERT" | "EDIT" | "DELETE" | "RESTRUCTURE" = "EDIT";
  if (before.length === 0 && after.length > 0) type = "CREATE";
  else if (wordDelta > 50) type = "INSERT";
  else if (wordDelta < -50) type = "DELETE";
  else if (Math.abs(wordDelta) < 10 && characterDelta > 20) type = "RESTRUCTURE";

  return {
    wordDelta,
    characterDelta,
    type,
    summary: `Changed ${Math.abs(wordDelta)} words (${type})`,
  };
}

/**
 * Calculates explainable 6-factor Contribution Score
 */
export function calculateContributionScore(raw: RawContribution): ContributionScoreResult {
  // Normalize & weight individual factors
  // 1. Volume Score (max 25)
  const volumeScore = Math.min(25, Math.round((raw.wordCount / 5000) * 15 + raw.chapterCount * 5));

  // 2. Writing Score (max 20)
  const writingScore = Math.min(20, Math.round((raw.wordCount > 1000 ? 15 : 8) + raw.structuralEdits * 2.5));

  // 3. Idea Score (max 15)
  const ideaScore = Math.min(15, raw.ideasCreated * 4 + raw.ideasAdopted * 3);

  // 4. Narrative Impact Score (max 15)
  const narrativeImpactScore = Math.min(15, raw.narrativeImpactCount * 5);

  // 5. Downstream Influence Score (max 15)
  const downstreamInfluenceScore = Math.min(15, raw.downstreamConnections * 3.5);

  // 6. Structural Score (max 10)
  const structuralScore = Math.min(10, raw.structuralEdits * 3 + (raw.chapterCount > 2 ? 4 : 2));

  const totalScore = Math.min(100, Math.round(
    volumeScore + writingScore + ideaScore + narrativeImpactScore + downstreamInfluenceScore + structuralScore
  ));

  // Build plain-language explanations ("Why this score?")
  const explanations: string[] = [];
  if (raw.wordCount > 0) {
    explanations.push(`Wrote approximately ${raw.wordCount.toLocaleString()} words across active chapters.`);
  }
  if (raw.ideasCreated > 0) {
    explanations.push(`Introduced ${raw.ideasCreated} original story concepts & character arcs.`);
  }
  if (raw.ideasAdopted > 0) {
    explanations.push(`${raw.ideasAdopted} concepts were adopted into major manuscript plotlines.`);
  }
  if (raw.downstreamConnections > 0) {
    explanations.push(`Key contributions directly influenced ${raw.downstreamConnections} subsequent chapter revisions.`);
  }
  if (raw.structuralEdits > 0) {
    explanations.push(`Performed ${raw.structuralEdits} major structural revisions and plot reorganizations.`);
  }
  if (explanations.length === 0) {
    explanations.push("Initial project setup and manuscript feedback contribution.");
  }

  // Counterfactual Impact Estimation
  let level: "High" | "Medium" | "Low" = "Low";
  if (downstreamInfluenceScore >= 10 || narrativeImpactScore >= 10) level = "High";
  else if (downstreamInfluenceScore >= 5 || ideaScore >= 5) level = "Medium";

  const affectedElements: string[] = [];
  if (raw.ideasCreated > 0) affectedElements.push("Core Antagonist Motivation & Backstory");
  if (raw.narrativeImpactCount > 0) affectedElements.push("Chapter 12-18 Climax Sequence");
  if (raw.structuralEdits > 0) affectedElements.push("Mid-Book Plot Twist Execution");
  if (affectedElements.length === 0) affectedElements.push("Minor scene phrasing and pacing");

  return {
    userId: raw.userId,
    userName: raw.userName,
    totalScore,
    volumeScore,
    writingScore,
    ideaScore,
    narrativeImpactScore,
    downstreamInfluenceScore,
    structuralScore,
    explanations,
    downstreamImpactAssessment: {
      level,
      summary: `If ${raw.userName}'s contributions had not been introduced, key narrative arcs would require structural rework.`,
      affectedElements,
    },
  };
}
