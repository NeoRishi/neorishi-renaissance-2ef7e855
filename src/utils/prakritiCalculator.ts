import { PrakritiResult } from '@/types/prakriti';

export function calculatePrakritiResult(answers: Record<string, string>): PrakritiResult {
  console.log('Calculating result with answers:', answers);

  // Initialize scores
  let vataCount = 0;
  let pittaCount = 0;
  let kaphaCount = 0;

  // Count answers for each dosha
  Object.values(answers).forEach(answer => {
    console.log('Processing answer:', answer);
    if (answer === 'Vata') {
      vataCount++;
    } else if (answer === 'Pitta') {
      pittaCount++;
    } else if (answer === 'Kapha') {
      kaphaCount++;
    }
  });

  console.log('Raw counts:', { vataCount, pittaCount, kaphaCount });

  // Calculate percentages
  const totalQuestions = Object.keys(answers).length;
  console.log('Total questions:', totalQuestions);

  if (totalQuestions === 0) {
    console.error('No answers provided');
    return {
      vata: 0,
      pitta: 0,
      kapha: 0,
      dominantDosha: 'Vata',
      secondaryDosha: 'Pitta',
      constitution: 'Vata'
    };
  }

  const vata = Math.round((vataCount / totalQuestions) * 100);
  const pitta = Math.round((pittaCount / totalQuestions) * 100);
  const kapha = Math.round((kaphaCount / totalQuestions) * 100);

  console.log('Percentages:', { vata, pitta, kapha });

  // Determine dominant and secondary doshas
  const scores = [
    { dosha: 'Vata' as const, score: vata },
    { dosha: 'Pitta' as const, score: pitta },
    { dosha: 'Kapha' as const, score: kapha }
  ].sort((a, b) => b.score - a.score);

  console.log('Sorted scores:', scores);

  const dominantDosha = scores[0].dosha;
  const secondaryDosha = scores[1].dosha;

  // Determine constitution type
  let constitution: PrakritiResult['constitution'];
  if (scores[0].score - scores[1].score <= 5) {
    // If top two scores are within 5% of each other, it's a dual type
    constitution = `${dominantDosha}-${secondaryDosha}` as PrakritiResult['constitution'];
  } else {
    constitution = dominantDosha;
  }

  console.log('Final result:', {
    vata,
    pitta,
    kapha,
    dominantDosha,
    secondaryDosha,
    constitution
  });

  return {
    vata,
    pitta,
    kapha,
    dominantDosha,
    secondaryDosha,
    constitution
  };
}
