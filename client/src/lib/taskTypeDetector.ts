/**
 * Smart task type detector - analyzes task text to determine if it's:
 * - 'grind': work/school/productivity tasks
 * - 'housework': home/chores/cleaning tasks
 * - 'self-care': health/wellness/relaxation tasks
 */

export type TaskType = 'grind' | 'housework' | 'self-care';

const GRIND_KEYWORDS = [
  'homework', 'study', 'exam', 'project', 'work', 'email', 'meeting', 'code', 'write', 'report',
  'presentation', 'deadline', 'assignment', 'class', 'lecture', 'research', 'analyze', 'design',
  'develop', 'build', 'debug', 'test', 'review', 'document', 'proposal', 'pitch', 'client',
  'task', 'job', 'career', 'professional', 'business', 'office', 'desk', 'computer', 'spreadsheet',
  'database', 'api', 'backend', 'frontend', 'full-stack', 'learning', 'course', 'training',
  'certification', 'skill', 'practice', 'drill', 'exercise', 'problem', 'solve', 'calculate'
];

const HOUSEWORK_KEYWORDS = [
  'clean', 'dishes', 'laundry', 'vacuum', 'sweep', 'mop', 'dust', 'organize', 'tidy', 'declutter',
  'kitchen', 'bathroom', 'bedroom', 'living room', 'floor', 'window', 'trash', 'garbage', 'trash can',
  'dishes', 'sink', 'stove', 'oven', 'fridge', 'freezer', 'pantry', 'closet', 'drawer', 'shelf',
  'bed', 'sheets', 'pillow', 'blanket', 'couch', 'sofa', 'chair', 'table', 'desk', 'counter',
  'wipe', 'scrub', 'polish', 'wash', 'rinse', 'dry', 'fold', 'hang', 'put away', 'organize',
  'home', 'house', 'apartment', 'room', 'chore', 'chores', 'housework', 'errands', 'grocery',
  'shopping', 'cook', 'meal prep', 'bake', 'garden', 'yard', 'lawn', 'plants', 'water'
];

const SELF_CARE_KEYWORDS = [
  'shower', 'bath', 'bathe', 'wash', 'brush teeth', 'floss', 'skincare', 'moisturize', 'sunscreen',
  'meditation', 'yoga', 'stretch', 'exercise', 'workout', 'run', 'walk', 'bike', 'swim', 'gym',
  'sleep', 'nap', 'rest', 'relax', 'unwind', 'chill', 'netflix', 'movie', 'read', 'book',
  'music', 'listen', 'podcast', 'journal', 'write', 'draw', 'paint', 'art', 'craft', 'hobby',
  'massage', 'spa', 'sauna', 'steam', 'therapy', 'counseling', 'mental health', 'mindfulness',
  'breathing', 'tea', 'coffee', 'drink water', 'hydrate', 'eat', 'snack', 'meal', 'lunch',
  'breakfast', 'dinner', 'self-care', 'wellness', 'health', 'doctor', 'appointment', 'checkup',
  'vitamin', 'supplement', 'medicine', 'medication', 'therapy', 'healing', 'recovery'
];

export function detectTaskType(taskText: string): TaskType {
  const text = taskText.toLowerCase();
  
  // Count keyword matches for each category
  const grindMatches = GRIND_KEYWORDS.filter(keyword => text.includes(keyword)).length;
  const houseworkMatches = HOUSEWORK_KEYWORDS.filter(keyword => text.includes(keyword)).length;
  const selfCareMatches = SELF_CARE_KEYWORDS.filter(keyword => text.includes(keyword)).length;
  
  // Return the category with the most matches
  if (grindMatches > houseworkMatches && grindMatches > selfCareMatches) {
    return 'grind';
  } else if (houseworkMatches > selfCareMatches) {
    return 'housework';
  } else if (selfCareMatches > 0) {
    return 'self-care';
  }
  
  // Default to 'grind' if no matches
  return 'grind';
}

export function getOutfitForTaskType(taskType: TaskType): string {
  const outfits = {
    'grind': 'https://files.manuscdn.com/user_upload_by_module/session_file/310419663026756998/TsbgRVUjpEqLJbkj.png',
    'housework': 'https://files.manuscdn.com/user_upload_by_module/session_file/310419663026756998/qpbpHPRRVGrsAMSD.png',
    'self-care': 'https://files.manuscdn.com/user_upload_by_module/session_file/310419663026756998/pYYZotmgorSkYGWg.png'
  };
  return outfits[taskType];
}
