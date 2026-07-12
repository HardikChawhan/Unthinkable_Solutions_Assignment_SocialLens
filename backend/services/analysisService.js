'use strict';

const config = require('../config');
const { log } = require('../utils/logger');

// ---------------------------------------------------------------------------
// Sentiment word lists with weights (-2 to +2)
// ---------------------------------------------------------------------------
const SENTIMENT_WORDS = {
  // Strongly positive (+2)
  amazing: 2, incredible: 2, outstanding: 2, exceptional: 2, brilliant: 2,
  fantastic: 2, wonderful: 2, superb: 2, excellent: 2, phenomenal: 2,
  revolutionary: 2, groundbreaking: 2, transformative: 2, extraordinary: 2,
  magnificent: 2, spectacular: 2, thrilled: 2, ecstatic: 2, euphoric: 2,
  overjoyed: 2,

  // Positive (+1)
  good: 1, great: 1, happy: 1, love: 1, best: 1, beautiful: 1, nice: 1,
  awesome: 1, perfect: 1, enjoy: 1, excited: 1, proud: 1, glad: 1,
  pleased: 1, delighted: 1, grateful: 1, thankful: 1, helpful: 1,
  positive: 1, successful: 1, effective: 1, innovative: 1, creative: 1,
  inspiring: 1, motivated: 1, passionate: 1, dedicated: 1, committed: 1,
  achieve: 1, win: 1, grow: 1, improve: 1, progress: 1, opportunity: 1,
  benefit: 1, valuable: 1, powerful: 1, strong: 1, confident: 1,

  // Negative (-1)
  bad: -1, sad: -1, hate: -1, terrible: -1, awful: -1, poor: -1,
  disappointing: -1, frustrating: -1, annoying: -1, difficult: -1,
  problem: -1, issue: -1, fail: -1, lose: -1, wrong: -1, boring: -1,
  slow: -1, weak: -1, worried: -1, concerned: -1, uncomfortable: -1,
  confused: -1, complicated: -1, expensive: -1, risky: -1, unsafe: -1,

  // Strongly negative (-2)
  horrible: -2, disgusting: -2, catastrophic: -2, disastrous: -2,
  devastating: -2, worthless: -2, terrible: -2, dreadful: -2,
  atrocious: -2, appalling: -2,
};

// ---------------------------------------------------------------------------
// Call-to-action action verbs
// ---------------------------------------------------------------------------
const CTA_VERBS = new Set([
  'click', 'share', 'comment', 'follow', 'subscribe', 'buy', 'get', 'try',
  'join', 'learn', 'discover', 'explore', 'start', 'sign', 'register',
  'download', 'grab', 'claim', 'unlock', 'access', 'visit', 'check',
  'watch', 'read', 'listen', 'apply', 'book', 'schedule', 'contact',
  'reach', 'connect', 'like', 'save', 'tag', 'dm', 'message', 'vote',
  'participate', 'contribute', 'support', 'donate', 'shop', 'order',
  'reserve', 'register', 'enroll', 'rsvp', 'retweet', 'repost', 'pin',
]);

// ---------------------------------------------------------------------------
// Emoji unicode regex (covers all standard emoji ranges)
// ---------------------------------------------------------------------------
const EMOJI_REGEX =
  /(\p{Emoji_Presentation}|\p{Extended_Pictographic})/gu;

// ---------------------------------------------------------------------------
// Syllable counting heuristic (Flesch-Kincaid approximation)
// ---------------------------------------------------------------------------
function countSyllables(word) {
  const w = word.toLowerCase().replace(/[^a-z]/g, '');
  if (!w.length) return 0;
  if (w.length <= 3) return 1;

  // Remove silent trailing 'e'
  const cleaned = w.replace(/(?:[^aeiou])e$/, '');
  // Count vowel groups as syllable nuclei
  const matches = cleaned.match(/[aeiouy]+/g);
  return Math.max(1, matches ? matches.length : 1);
}

// ---------------------------------------------------------------------------
// Platform inference
// ---------------------------------------------------------------------------
function inferPlatform(text, hashtagCount) {
  const len = text.length;
  const mentionCount = (text.match(/@\w+/g) || []).length;
  const hashtagDensity = hashtagCount / Math.max(1, len / 100);

  if (len <= 280 && hashtagCount <= 2) return 'twitter';
  if (hashtagCount >= 5 && hashtagDensity > 0.5) return 'instagram';
  if (len > 700 && mentionCount > 0) return 'linkedin';
  if (len > 300 && len <= 700) return 'facebook';
  if (len > 700) return 'linkedin';
  return 'general';
}

// ---------------------------------------------------------------------------
// Grade from score
// ---------------------------------------------------------------------------
function getGrade(score) {
  if (score >= 92) return 'A+';
  if (score >= 82) return 'A';
  if (score >= 72) return 'B+';
  if (score >= 60) return 'B';
  if (score >= 45) return 'C';
  return 'D';
}

// ---------------------------------------------------------------------------
// Core rule-based analysis
// ---------------------------------------------------------------------------
function ruleBasedAnalyze(text) {
  const trimmed = text.trim();

  // --- Basic counts ---
  const words = trimmed.split(/\s+/).filter(Boolean);
  const wordCount = words.length;
  const charCount = trimmed.length;

  // Sentences: split by . ! ? (followed by space or end)
  const sentences = trimmed
    .split(/[.!?]+(?:\s|$)/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
  const sentenceCount = Math.max(1, sentences.length);
  const avgWordsPerSentence = Math.round((wordCount / sentenceCount) * 10) / 10;

  // Reading time: ~200 wpm for social media
  const readingMinutes = wordCount / 200;
  const estimatedReadingTime =
    readingMinutes < 1 ? '< 1 min' : `${Math.round(readingMinutes)} min`;

  // --- Hashtags ---
  const hashtags = trimmed.match(/#\w+/g) || [];
  const hashtagCount = hashtags.length;
  // Optimal: 3-10 hashtags
  let hashtagScore;
  if (hashtagCount === 0) hashtagScore = 20;
  else if (hashtagCount >= 3 && hashtagCount <= 10) hashtagScore = 90;
  else if (hashtagCount >= 1 && hashtagCount < 3) hashtagScore = 60;
  else if (hashtagCount > 10 && hashtagCount <= 15) hashtagScore = 55;
  else hashtagScore = 30; // >15 looks spammy

  // --- Emojis ---
  const emojis = trimmed.match(EMOJI_REGEX) || [];
  const emojiCount = emojis.length;
  // Optimal: 1-5 emojis
  let emojiScore;
  if (emojiCount === 0) emojiScore = 35;
  else if (emojiCount >= 1 && emojiCount <= 5) emojiScore = 95;
  else if (emojiCount <= 8) emojiScore = 70;
  else emojiScore = 40;

  // --- Sentiment ---
  const lowerWords = words.map((w) => w.replace(/[^a-zA-Z]/g, '').toLowerCase());
  let sentimentRaw = 0;
  for (const word of lowerWords) {
    if (SENTIMENT_WORDS[word] !== undefined) {
      sentimentRaw += SENTIMENT_WORDS[word];
    }
  }
  // Normalize to -1 … +1
  const maxPossible = Math.max(1, wordCount * 0.15); // assume 15% of words could be sentiment
  const sentimentScore = Math.max(-1, Math.min(1, sentimentRaw / maxPossible));
  let sentimentLabel;
  if (sentimentScore > 0.15) sentimentLabel = 'Positive';
  else if (sentimentScore < -0.15) sentimentLabel = 'Negative';
  else sentimentLabel = 'Neutral';

  // --- CTA detection ---
  const firstCTA = lowerWords.find((w) => CTA_VERBS.has(w));
  const ctaCount = lowerWords.filter((w) => CTA_VERBS.has(w)).length;
  let ctaScore;
  if (ctaCount === 0) ctaScore = 10;
  else if (ctaCount === 1) ctaScore = 80;
  else if (ctaCount <= 3) ctaScore = 65;
  else ctaScore = 45; // too many CTAs feel pushy

  // --- Hook strength (first sentence) ---
  const firstSentence = sentences[0] || '';
  let hookStrength = 30; // baseline
  if (/\?/.test(firstSentence)) hookStrength += 25;        // question hook
  if (/^\d+/.test(firstSentence.trim())) hookStrength += 20; // number hook
  if (/!/.test(firstSentence)) hookStrength += 10;          // exclamation
  // emotional trigger words
  const hookTriggers = ['secret', 'truth', 'never', 'always', 'why', 'how', 'what', 'stop', 'start', 'must', 'you', 'your'];
  const firstWordLower = firstSentence.trim().split(/\s+/)[0]?.toLowerCase() || '';
  if (hookTriggers.includes(firstWordLower)) hookStrength += 20;
  // Bold claim: superlative or strong adjective in first 10 words
  const firstTenWords = firstSentence.split(/\s+/).slice(0, 10).join(' ').toLowerCase();
  if (/best|worst|only|ever|never|secret|reveal|proven|guaranteed/.test(firstTenWords)) hookStrength += 15;
  hookStrength = Math.min(100, hookStrength);

  // --- Readability (Flesch-Kincaid approximation) ---
  const totalSyllables = words.reduce((acc, w) => acc + countSyllables(w), 0);
  const avgSyllablesPerWord = totalSyllables / Math.max(1, wordCount);
  // FK Reading Ease: 206.835 - 1.015*(words/sentences) - 84.6*(syllables/words)
  const fleschRaw =
    206.835 - 1.015 * avgWordsPerSentence - 84.6 * avgSyllablesPerWord;
  const readabilityScore = Math.max(0, Math.min(100, Math.round(fleschRaw)));

  // --- Grammar heuristics ---
  let grammarDeductions = 0;
  if (/  +/.test(trimmed)) grammarDeductions += 15;             // double spaces
  if (/[A-Z]{5,}/.test(trimmed)) grammarDeductions += 20;      // excessive ALL CAPS
  if (/([.!?,]){2,}/.test(trimmed)) grammarDeductions += 10;   // repeated punctuation
  if (!/[.!?]$/.test(trimmed.replace(/#\w+/g, '').trim())) grammarDeductions += 10; // no ending punctuation
  if (/\bi\b/.test(trimmed)) grammarDeductions += 5;            // lowercase 'i'
  const grammarScore = Math.max(0, 100 - grammarDeductions);

  // --- Clarity score (based on sentence length and word complexity) ---
  let clarityScore = 100;
  if (avgWordsPerSentence > 30) clarityScore -= 30;
  else if (avgWordsPerSentence > 20) clarityScore -= 15;
  if (avgSyllablesPerWord > 2.5) clarityScore -= 20;
  else if (avgSyllablesPerWord > 1.8) clarityScore -= 10;
  clarityScore = Math.max(0, Math.min(100, clarityScore));

  // --- Engagement score (weighted sub-score average) ---
  const engagementScore = Math.round(
    ctaScore * 0.30 +
    hookStrength * 0.25 +
    emojiScore * 0.20 +
    hashtagScore * 0.15 +
    (sentimentScore > 0 ? sentimentScore * 100 : 0) * 0.10
  );

  // --- Overall score ---
  const overallScore = Math.min(
    100,
    Math.round(
      engagementScore * 0.35 +
      readabilityScore * 0.25 +
      clarityScore * 0.20 +
      grammarScore * 0.20
    )
  );

  // --- Platform inference ---
  const platform = inferPlatform(trimmed, hashtagCount);

  // --- Strengths ---
  const strengths = [];
  if (hookStrength >= 70) strengths.push('Strong opening hook that grabs attention immediately.');
  if (ctaScore >= 70) strengths.push('Clear and compelling call-to-action that drives engagement.');
  if (readabilityScore >= 70) strengths.push('Excellent readability — easy for your audience to absorb.');
  if (hashtagScore >= 80) strengths.push('Well-optimised hashtag usage for discoverability.');
  if (emojiScore >= 80) strengths.push('Effective emoji usage that enhances visual appeal.');
  if (sentimentScore > 0.3) strengths.push('Positive and uplifting tone that resonates with audiences.');
  if (grammarScore >= 85) strengths.push('Clean grammar and punctuation add professionalism.');
  if (clarityScore >= 80) strengths.push('Concise, clear sentences that are easy to scan.');
  // Ensure at least 2
  if (strengths.length < 2) {
    if (!strengths.some((s) => s.includes('readability'))) {
      strengths.push('Content covers the topic with reasonable depth.');
    }
    if (strengths.length < 2) {
      strengths.push('Text has been formatted consistently throughout.');
    }
  }

  // --- Weaknesses ---
  const weaknesses = [];
  if (hookStrength < 50) weaknesses.push('Opening line lacks a strong hook to capture attention.');
  if (ctaScore < 40) weaknesses.push('No clear call-to-action — readers don\'t know what to do next.');
  if (hashtagScore < 50) weaknesses.push(
    hashtagCount === 0
      ? 'No hashtags used — missing discoverability opportunities.'
      : 'Hashtag count is outside the optimal range (3–10).'
  );
  if (emojiScore < 50) weaknesses.push(
    emojiCount === 0
      ? 'No emojis used — the post may feel dry or impersonal.'
      : 'Overuse of emojis can make the post look unprofessional.'
  );
  if (readabilityScore < 50) weaknesses.push('Sentences are too long or use complex vocabulary — harder to read quickly.');
  if (grammarScore < 70) weaknesses.push('Grammar or formatting issues detected that reduce credibility.');
  if (clarityScore < 50) weaknesses.push('Content clarity can be improved — aim for shorter, punchier sentences.');
  // Ensure at least 2
  if (weaknesses.length < 2) {
    weaknesses.push('Content could benefit from more specific examples or data points.');
    if (weaknesses.length < 2) {
      weaknesses.push('The post could be made more platform-specific for higher reach.');
    }
  }

  // --- Suggestions ---
  const suggestions = [];
  let suggestionId = 1;

  if (ctaScore < 60) {
    suggestions.push({
      id: suggestionId++,
      category: 'Engagement',
      priority: 'high',
      title: 'Add a clear Call-to-Action',
      description:
        'Every post should tell the reader exactly what to do next. A strong CTA dramatically increases interaction rates.',
      example:
        '💬 Drop your thoughts in the comments below! | 🔗 Click the link in bio to get started.',
    });
  }

  if (hookStrength < 60) {
    suggestions.push({
      id: suggestionId++,
      category: 'Hook',
      priority: 'high',
      title: 'Strengthen your opening line',
      description:
        'The first 1-2 lines determine whether someone reads on. Use a question, surprising statistic, or bold statement.',
      example: '"Did you know 80% of social posts are never read past the first line? Here\'s how to change that..."',
    });
  }

  if (hashtagCount === 0) {
    suggestions.push({
      id: suggestionId++,
      category: 'Discoverability',
      priority: 'high',
      title: 'Add relevant hashtags',
      description: 'Hashtags are the primary discovery mechanism on most platforms. Use 3-10 targeted hashtags.',
      example: '#ContentMarketing #SocialMediaTips #DigitalMarketing',
    });
  } else if (hashtagCount > 10) {
    suggestions.push({
      id: suggestionId++,
      category: 'Discoverability',
      priority: 'medium',
      title: 'Reduce hashtag count',
      description:
        'More than 10 hashtags can look spammy and may reduce algorithmic reach. Aim for 3-10 highly relevant tags.',
      example: 'Remove generic hashtags and keep only the most specific ones.',
    });
  }

  if (emojiCount === 0) {
    suggestions.push({
      id: suggestionId++,
      category: 'Visual Appeal',
      priority: 'medium',
      title: 'Add 1-3 relevant emojis',
      description: 'Emojis increase engagement by up to 25% on average. They also help break up text visually.',
      example: '🚀 for excitement, 💡 for tips, ✅ for lists, 🔥 for trending topics.',
    });
  }

  if (readabilityScore < 60) {
    suggestions.push({
      id: suggestionId++,
      category: 'Readability',
      priority: 'medium',
      title: 'Shorten your sentences',
      description:
        'Social media audiences skim content. Aim for sentences under 20 words and use simple, everyday vocabulary.',
      example: 'Break: "The implementation of this strategy..." → "Use this strategy..."',
    });
  }

  if (sentimentScore < 0) {
    suggestions.push({
      id: suggestionId++,
      category: 'Tone',
      priority: 'medium',
      title: 'Shift to a more positive tone',
      description:
        'Positive framing performs significantly better across all platforms. Reframe negatives as opportunities.',
      example: 'Instead of "Don\'t miss out" → "Be the first to experience"',
    });
  }

  if (grammarScore < 75) {
    suggestions.push({
      id: suggestionId++,
      category: 'Professionalism',
      priority: 'low',
      title: 'Fix grammar and formatting',
      description: 'Check for double spaces, inconsistent capitalisation, and repeated punctuation.',
      example: 'Run through Grammarly or Hemingway App before posting.',
    });
  }

  if (wordCount < 30 && platform !== 'twitter') {
    suggestions.push({
      id: suggestionId++,
      category: 'Depth',
      priority: 'low',
      title: 'Add more context or story',
      description:
        'Short posts can lack the depth needed to build trust. Consider adding a brief story, data point, or explanation.',
      example: 'Expand on WHY this matters to your audience.',
    });
  }

  // Limit to 6 suggestions
  const finalSuggestions = suggestions.slice(0, 6);

  // --- Improved version (rule-based rewrite) ---
  const improvedVersion = generateImprovedVersion(trimmed, {
    ctaScore,
    hookStrength,
    hashtagCount,
    emojiCount,
    sentimentScore,
    platform,
    wordCount,
  });

  return {
    overallScore,
    grade: getGrade(overallScore),
    metrics: {
      wordCount,
      charCount,
      sentenceCount,
      avgWordsPerSentence,
      estimatedReadingTime,
      engagementScore,
      readabilityScore,
      sentimentScore: Math.round(sentimentScore * 100) / 100,
      sentimentLabel,
      ctaScore,
      hashtagScore,
      hookStrength,
      emojiUsage: { count: emojiCount, score: emojiScore },
      clarityScore,
      grammarScore,
    },
    strengths: strengths.slice(0, 4),
    weaknesses: weaknesses.slice(0, 4),
    suggestions: finalSuggestions,
    improvedVersion,
    platform,
  };
}

// ---------------------------------------------------------------------------
// Improved version generator
// ---------------------------------------------------------------------------
function generateImprovedVersion(text, metrics) {
  let improved = text;

  // Fix double spaces
  improved = improved.replace(/  +/g, ' ');

  // Fix lowercase 'i'
  improved = improved.replace(/\bi\b/g, 'I');

  // Add hook if weak
  let prefix = '';
  if (metrics.hookStrength < 50) {
    const hookOptions = [
      '🔥 Here\'s something you need to know:',
      '💡 Quick insight for you:',
      '✨ This changed everything for me:',
      '👇 Read this before you scroll:',
    ];
    prefix = hookOptions[Math.floor(Math.random() * hookOptions.length)] + '\n\n';
  }

  // Add CTA if missing
  let suffix = '';
  if (metrics.ctaScore < 40) {
    const ctaByPlatform = {
      instagram: '\n\n💬 Share your thoughts in the comments below!\n👆 Save this post for later.',
      twitter: '\n\nWhat do you think? Reply below! 👇',
      linkedin: '\n\nI\'d love to hear your perspective — drop a comment below! 🙏',
      facebook: '\n\n👍 Like if this resonates with you, and share with someone who needs to see this!',
      general: '\n\n💬 What are your thoughts? Let me know in the comments!',
    };
    suffix = ctaByPlatform[metrics.platform] || ctaByPlatform.general;
  }

  // Add emojis to line starts if none used
  if (metrics.emojiCount === 0 && metrics.wordCount > 10) {
    const lines = improved.split('\n').filter(Boolean);
    const emojiMap = ['✅', '🔑', '💡', '🚀', '🎯', '⚡'];
    if (lines.length > 1) {
      improved = lines
        .map((line, i) => {
          if (line.startsWith('#') || line.startsWith('@')) return line;
          return `${emojiMap[i % emojiMap.length]} ${line}`;
        })
        .join('\n');
    } else {
      improved = `🚀 ${improved}`;
    }
  }

  // Add hashtags if none present and platform supports them
  let hashtagSuffix = '';
  if (metrics.hashtagCount === 0 && metrics.platform !== 'twitter') {
    hashtagSuffix = '\n\n#ContentStrategy #SocialMediaMarketing #DigitalGrowth';
  }

  return `${prefix}${improved}${suffix}${hashtagSuffix}`.trim();
}

// ---------------------------------------------------------------------------
// OpenAI path
// ---------------------------------------------------------------------------
async function openAIAnalyze(text) {
  const { default: OpenAI } = await import('openai');
  const client = new OpenAI({ apiKey: config.openaiApiKey });

  const systemPrompt = `You are SocialLens, an expert social media content analyst. 
Analyze the given social media post and return a detailed JSON analysis.

You MUST return ONLY valid JSON matching this exact schema (no markdown, no explanation):
{
  "overallScore": <0-100 integer>,
  "grade": <"A+" | "A" | "B+" | "B" | "C" | "D">,
  "metrics": {
    "wordCount": <integer>,
    "charCount": <integer>,
    "sentenceCount": <integer>,
    "avgWordsPerSentence": <float>,
    "estimatedReadingTime": <"< 1 min" or "X min">,
    "engagementScore": <0-100>,
    "readabilityScore": <0-100>,
    "sentimentScore": <-1.0 to 1.0 float>,
    "sentimentLabel": <"Positive" | "Neutral" | "Negative">,
    "ctaScore": <0-100>,
    "hashtagScore": <0-100>,
    "hookStrength": <0-100>,
    "emojiUsage": { "count": <integer>, "score": <0-100> },
    "clarityScore": <0-100>,
    "grammarScore": <0-100>
  },
  "strengths": [<2-4 specific strength strings>],
  "weaknesses": [<2-4 specific weakness strings>],
  "suggestions": [
    {
      "id": <integer>,
      "category": <string>,
      "priority": <"high" | "medium" | "low">,
      "title": <string>,
      "description": <string>,
      "example": <string>
    }
  ],
  "improvedVersion": <string — a rewritten version of the post applying all suggestions>,
  "platform": <"twitter" | "instagram" | "linkedin" | "facebook" | "general">
}

Be thorough, specific, and actionable. The improvedVersion should be a genuinely better post.`;

  const response = await client.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      { role: 'system', content: systemPrompt },
      {
        role: 'user',
        content: `Analyze this social media post:\n\n${text}`,
      },
    ],
    temperature: 0.3, // Low temperature for consistent structured output
    max_tokens: 2000,
    response_format: { type: 'json_object' },
  });

  const raw = response.choices[0]?.message?.content || '{}';
  return JSON.parse(raw);
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Analyzes a social media post text.
 * Uses OpenAI GPT-4o-mini when OPENAI_API_KEY is set, otherwise falls back
 * to the comprehensive rule-based analyzer.
 *
 * @param {string} text - The social media post text to analyze.
 * @returns {Promise<object>} Analysis result matching the schema above.
 */
async function analyze(text) {
  if (config.openaiApiKey) {
    try {
      log.info('Running OpenAI analysis...');
      const result = await openAIAnalyze(text);
      log.info('OpenAI analysis complete.');
      return result;
    } catch (err) {
      log.warn(`OpenAI analysis failed (${err.message}), falling back to rule-based analyzer.`);
    }
  }

  log.info('Running rule-based analysis...');
  const result = ruleBasedAnalyze(text);
  log.info(`Rule-based analysis complete. Score: ${result.overallScore}`);
  return result;
}

module.exports = { analyze };
