/**
 * Scoring Service — Phase 3 Assessment Engine (Req 25-26)
 * Calculates overall, section, and topic scores from assessment attempts.
 */

export const calculateScore = (questions, answers) => {
  const results = {
    totalQuestions: questions.length,
    attempted: 0,
    correct: 0,
    incorrect: 0,
    skipped: 0,
    score: 0,
    percentage: 0,
    topicScores: {},
    sectionScores: {}
  };

  questions.forEach(q => {
    const userAnswer = answers[q._id || q.id];
    const topic = q.topic || 'General';
    const section = q.section || 'General';

    if (!results.topicScores[topic]) {
      results.topicScores[topic] = { attempted: 0, correct: 0, total: 0 };
    }
    if (!results.sectionScores[section]) {
      results.sectionScores[section] = { attempted: 0, correct: 0, total: 0 };
    }

    results.topicScores[topic].total++;
    results.sectionScores[section].total++;

    if (userAnswer === undefined || userAnswer === null || userAnswer === '') {
      results.skipped++;
      return;
    }

    results.attempted++;
    results.topicScores[topic].attempted++;
    results.sectionScores[section].attempted++;

    const isCorrect = Array.isArray(q.correctAnswer)
      ? JSON.stringify([...userAnswer].sort()) === JSON.stringify([...q.correctAnswer].sort())
      : String(userAnswer) === String(q.correctAnswer);

    if (isCorrect) {
      results.correct++;
      results.topicScores[topic].correct++;
      results.sectionScores[section].correct++;
    } else {
      results.incorrect++;
    }
  });

  results.score = results.correct;
  results.percentage = results.totalQuestions > 0
    ? Math.round((results.correct / results.totalQuestions) * 100)
    : 0;

  return results;
};

export const classifyTopics = (topicScores) => {
  const strong = [];
  const moderate = [];
  const weak = [];

  Object.entries(topicScores).forEach(([topic, data]) => {
    if (data.total === 0) return;
    const pct = data.total > 0 ? Math.round((data.correct / data.total) * 100) : 0;
    const entry = { topic, score: pct, correct: data.correct, total: data.total };

    if (pct >= 75) strong.push(entry);
    else if (pct >= 40) moderate.push(entry);
    else weak.push(entry);
  });

  return { strong, moderate, weak };
};

export const generateImprovementSuggestions = (weakTopics) => {
  const suggestions = {
    'Data Structures': 'Practice arrays, linked lists, trees, and graphs on LeetCode.',
    'Algorithms': 'Study sorting, searching, and dynamic programming fundamentals.',
    'Databases': 'Practice SQL queries and review MongoDB aggregation pipelines.',
    'Web Development': 'Build small projects covering HTML, CSS, JavaScript, and a framework.',
    'Operating Systems': 'Review process management, memory management, and file systems.',
    'Computer Networks': 'Study TCP/IP, HTTP, DNS, and network security basics.',
    'Machine Learning': 'Start with supervised learning basics, then explore scikit-learn.',
    'Cloud Computing': 'Explore AWS/GCP free tier with hands-on labs.',
    'Cybersecurity': 'Study OWASP Top 10 and practice on TryHackMe.',
    'Verbal Reasoning': 'Read regularly and practice comprehension exercises.',
    'Quantitative Aptitude': 'Practice arithmetic, percentage, and ratio problems daily.',
    'Logical Reasoning': 'Solve puzzles and pattern recognition problems.',
    'Communication': 'Practice structured speaking using the STAR method.',
    'Teamwork': 'Participate in group projects and document collaboration experiences.',
    'Problem Solving': 'Work through case studies and algorithmic challenges.',
    'Leadership': 'Take initiative in team settings and document leadership experiences.'
  };

  return weakTopics.map(({ topic, score }) => ({
    topic,
    score,
    suggestion: suggestions[topic] || `Focus on ${topic} fundamentals and practice with real examples.`
  }));
};

export default { calculateScore, classifyTopics, generateImprovementSuggestions };
