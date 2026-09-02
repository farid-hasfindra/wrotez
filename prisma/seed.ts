import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding novel-app database...");

  // Clean existing records
  await prisma.activityLog.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.plotPoint.deleteMany();
  await prisma.plot.deleteMany();
  await prisma.timelineEvent.deleteMany();
  await prisma.worldBuildingEntry.deleteMany();
  await prisma.characterRelationship.deleteMany();
  await prisma.character.deleteMany();
  await prisma.ideaContribution.deleteMany();
  await prisma.idea.deleteMany();
  await prisma.contributionEvent.deleteMany();
  await prisma.chapterVersion.deleteMany();
  await prisma.chapter.deleteMany();
  await prisma.projectMember.deleteMany();
  await prisma.project.deleteMany();
  await prisma.user.deleteMany();

  const passwordHash = await bcrypt.hash("password123", 10);

  // 1. Create Users
  const sarah = await prisma.user.create({
    data: {
      email: "sarah@novel.app",
      name: "Sarah Vance",
      passwordHash,
      avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150",
    },
  });

  const daniel = await prisma.user.create({
    data: {
      email: "daniel@novel.app",
      name: "Daniel Sterling",
      passwordHash,
      avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
    },
  });

  const andi = await prisma.user.create({
    data: {
      email: "andi@novel.app",
      name: "Andi Pratama",
      passwordHash,
      avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150",
    },
  });

  const michael = await prisma.user.create({
    data: {
      email: "michael@novel.app",
      name: "Michael Ross",
      passwordHash,
      avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
    },
  });

  // 2. Create Main Novel Project
  const project = await prisma.project.create({
    data: {
      title: "The Last Kingdom of Arken",
      description: "An epic high-fantasy saga exploring ancient sky-fortresses, forgotten sacred vows, and the struggle for the Sun Altar.",
      genre: "Fantasy",
      language: "English",
      targetWordCount: 80000,
      writingStyle: "Third-Person Omniscient",
      members: {
        create: [
          { userId: sarah.id, role: "OWNER" },
          { userId: daniel.id, role: "CO_AUTHOR" },
          { userId: andi.id, role: "CO_AUTHOR" },
          { userId: michael.id, role: "EDITOR" },
        ],
      },
    },
  });

  // 3. Create Chapters
  const ch1 = await prisma.chapter.create({
    data: {
      projectId: project.id,
      title: "Chapter 1: The Whispering Towers",
      orderIndex: 1,
      wordCount: 3850,
      status: "COMPLETED",
      content: `The wind over the Citadel of Arken did not merely blow; it whispered in ancient dialects forgotten by mortal men. High Commander Marcus stood upon the obsidian ramparts, his gloved fingers tracing the sigils carved into the basalt guardrail. Below him, cloudbanks stretched like a silver ocean under the twin moons of Aethelgard.

"They say the Sun Altar stirs tonight," a quiet voice spoke from the shadow of the archway. Elena stepped into the moonlight, her dark cape shimmering with enchanted starlight thread.

Marcus did not turn. "The Altar has slept for three centuries, Elena. What makes tonight any different?"

"The bloodline," she replied softly. "Someone opened the Vault of Arken."`,
    },
  });

  const ch2 = await prisma.chapter.create({
    data: {
      projectId: project.id,
      title: "Chapter 2: Oath of the Garrison",
      orderIndex: 2,
      wordCount: 4200,
      status: "COMPLETED",
      content: `Torches flickered along the underground tunnels of the Obsidian Garrison. Two hundred steel-clad sentinels stood at attention as Commander Daniel raised his glowing sun-blade.

"Tonight we swear our lives to the Citadel," Daniel boomed, his voice echoing against the damp stone walls. "If the sky falls, Arken stands."

Among the recruits stood John, hiding his tremor behind a heavy steel shield. He knew the truth about the Vault—he had held the Sunstone just hours before.`,
    },
  });

  const ch3 = await prisma.chapter.create({
    data: {
      projectId: project.id,
      title: "Chapter 3: The Sunstone Awakening",
      orderIndex: 3,
      wordCount: 5100,
      status: "IN_PROGRESS",
      content: `The artifact throbbed with a rhythmic amber light. In the secluded sanctuary beneath the western spire, Marcus laid the Sunstone upon the golden pedestal.

Golden runes erupted across the floor tiles, illuminating the subterranean chamber. Elena watched from the balcony, her hand resting on the hilt of her dagger.

"It demands a blood sacrifice," Marcus whispered, reading the ancient glyphs. "Or a sacrifice of memory."`,
    },
  });

  const ch4 = await prisma.chapter.create({
    data: {
      projectId: project.id,
      title: "Chapter 4: Shadows Over the Ramparts",
      orderIndex: 4,
      wordCount: 4600,
      status: "REVIEW",
      content: `As dawn broke, black-sailed airships emerged from the cloudbank. The Obsidian Syndicate had arrived. Siren bells echoed through the inner courtyards.

"To the balistas!" Daniel shouted, drawing his claymore. "Hold the gates until Marcus seals the Altar!"`,
    },
  });

  // 4. Create Contribution Events
  await prisma.contributionEvent.createMany({
    data: [
      {
        userId: sarah.id,
        projectId: project.id,
        chapterId: ch1.id,
        type: "CREATE",
        beforeContent: "",
        afterContent: ch1.content,
        wordDelta: 3850,
        characterDelta: ch1.content.length,
      },
      {
        userId: daniel.id,
        projectId: project.id,
        chapterId: ch2.id,
        type: "INSERT",
        beforeContent: "Basic notes",
        afterContent: ch2.content,
        wordDelta: 4200,
        characterDelta: ch2.content.length,
      },
      {
        userId: andi.id,
        projectId: project.id,
        chapterId: ch3.id,
        type: "EDIT",
        beforeContent: "Short draft",
        afterContent: ch3.content,
        wordDelta: 5100,
        characterDelta: ch3.content.length,
      },
      {
        userId: michael.id,
        projectId: project.id,
        chapterId: ch4.id,
        type: "RESTRUCTURE",
        beforeContent: "Draft outline",
        afterContent: ch4.content,
        wordDelta: 4600,
        characterDelta: ch4.content.length,
      },
    ],
  });

  // 5. Create Ideas & Idea Provenance
  const idea1 = await prisma.idea.create({
    data: {
      projectId: project.id,
      authorId: andi.id,
      title: "Submerged Sky Fortress Concept",
      description: "The Citadel of Arken is not built on a mountain, but is actually an ancient sky fortress dormant in the cloud sea.",
      category: "WORLDBUILDING",
      status: "IMPLEMENTED",
      developments: {
        create: [
          { userId: sarah.id, type: "DEVELOPMENT", notes: "Expanded into Chapter 1 lore and obsidian ramparts setting." },
          { userId: daniel.id, type: "IMPLEMENTATION", notes: "Integrated airship invasion pathways in Chapter 4." },
        ],
      },
    },
  });

  const idea2 = await prisma.idea.create({
    data: {
      projectId: project.id,
      authorId: sarah.id,
      title: "Elena's Royal Heir Secrets",
      description: "Elena is secretly the last true heir of the Fallen Realm of Arken, disguising her bloodline within the guard.",
      category: "CHARACTER",
      status: "IN_DEVELOPMENT",
      developments: {
        create: [
          { userId: michael.id, type: "DEVELOPMENT", notes: "Reviewed character arc consistency for Chapter 3." },
        ],
      },
    },
  });

  // 6. Create Characters & Relationships
  const marcusChar = await prisma.character.create({
    data: {
      projectId: project.id,
      name: "Marcus Vance",
      role: "Protagonist",
      status: "ALIVE",
      description: "High Commander of the Citadel Garrison. Bound by honor yet torn between duty and the truth of the Sunstone.",
      personality: "Stoic, tactical, protective, carries a secret guilt.",
      motivation: "To protect the realm from the Obsidian Syndicate without sacrificing innocent lives.",
      secrets: "Holds the lost key to the Vault of Arken.",
      firstAppearance: "Chapter 1",
      lastAppearance: "Chapter 4",
      avatarUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150",
    },
  });

  const elenaChar = await prisma.character.create({
    data: {
      projectId: project.id,
      name: "Elena Arken",
      role: "Protagonist",
      status: "ALIVE",
      description: "Mysterious archivist with ancient bloodline abilities. Wields starlight thread magic.",
      personality: "Perceptive, cautious, fiercely loyal to her heritage.",
      motivation: "Reclaim the lost altar and uncover her family's betrayal.",
      secrets: "Is the last legitimate bloodline heir of Arken.",
      firstAppearance: "Chapter 1",
      lastAppearance: "Chapter 3",
      avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
    },
  });

  const danielChar = await prisma.character.create({
    data: {
      projectId: project.id,
      name: "Commander Daniel",
      role: "Supporting",
      status: "ALIVE",
      description: "Veteran leader of the Obsidian Garrison. Master swordsman.",
      personality: "Unforgiving, loyal, blunt.",
      motivation: "Defend the fortress at all costs.",
      firstAppearance: "Chapter 2",
      avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150",
    },
  });

  await prisma.characterRelationship.createMany({
    data: [
      {
        fromId: marcusChar.id,
        toId: elenaChar.id,
        type: "Ally",
        description: "Shared secret pact regarding the Vault of Arken.",
      },
      {
        fromId: danielChar.id,
        toId: marcusChar.id,
        type: "Ally",
        description: "Comrades in arms leading garrison forces.",
      },
    ],
  });

  // 7. Create Worldbuilding Entries
  await prisma.worldBuildingEntry.createMany({
    data: [
      {
        projectId: project.id,
        name: "Kingdom of Arken",
        category: "Kingdoms",
        description: "An ancient high-elevation realm suspended above cloud seas, protected by obsidian ramparts and sun-fire magic.",
        history: "Founded 800 years ago after the Great Dragon Wars.",
      },
      {
        projectId: project.id,
        name: "The Sun Altar",
        category: "Magic System",
        description: "A monumental golden nexus capable of generating forcefields around the entire citadel when activated by the Sunstone.",
      },
      {
        projectId: project.id,
        name: "Obsidian Syndicate",
        category: "Organizations",
        description: "A rogue coalition of airship armadas seeking to harvest Aetherial cores from Arken.",
      },
    ],
  });

  // 8. Create Timeline Events
  await prisma.timelineEvent.createMany({
    data: [
      {
        projectId: project.id,
        title: "Unsealing of the Vault",
        description: "John touches the Sunstone inside the sealed underground vault.",
        timeString: "Night of the Twin Moons - 02:00 AM",
        chapterRef: "Chapter 2",
        characters: JSON.stringify(["John", "Marcus"]),
      },
      {
        projectId: project.id,
        title: "Confrontation on the Ramparts",
        description: "Elena reveals the Altar awakening to Commander Marcus.",
        timeString: "Night of the Twin Moons - 03:30 AM",
        chapterRef: "Chapter 1",
        characters: JSON.stringify(["Marcus", "Elena"]),
      },
      {
        projectId: project.id,
        title: "Arrival of the Obsidian Fleet",
        description: "Black airships breach the cloud sea rim.",
        timeString: "Dawn - 06:00 AM",
        chapterRef: "Chapter 4",
        characters: JSON.stringify(["Daniel", "Marcus"]),
      },
    ],
  });

  // 9. Create Plot & Subplots
  const mainPlot = await prisma.plot.create({
    data: {
      projectId: project.id,
      title: "The Siege of Arken Citadel",
      type: "MAIN_PLOT",
      status: "IN_PROGRESS",
      description: "Defending the Citadel from the Syndicate while deciphering the Sun Altar's ancient demands.",
      points: {
        create: [
          { title: "Discovery of the Sunstone", description: "Artifact stirs in subterranean vault", orderIndex: 1, chapterRef: "Chapter 1" },
          { title: "Garrison Mobilization", description: "Commander Daniel rallies guardsmen", orderIndex: 2, chapterRef: "Chapter 2" },
          { title: "Airship Armada Siege", description: "Fleet opens fire on ramparts", orderIndex: 3, chapterRef: "Chapter 4" },
        ],
      },
    },
  });

  // 10. Log Initial Activity
  await prisma.activityLog.createMany({
    data: [
      { projectId: project.id, userId: sarah.id, action: "CREATED_NOVEL", details: "Created novel 'The Last Kingdom of Arken'" },
      { projectId: project.id, userId: andi.id, action: "CREATED_IDEA", details: "Proposed idea: Submerged Sky Fortress Concept" },
      { projectId: project.id, userId: daniel.id, action: "EDITED_CHAPTER", details: "Updated Chapter 2: Oath of the Garrison" },
    ],
  });

  console.log("Seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error("Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
