import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const pool = mysql.createPool({
  host: process.env.DATABASE_URL?.split('@')[1]?.split(':')[0] || 'localhost',
  user: process.env.DATABASE_URL?.split('://')[1]?.split(':')[0] || 'root',
  password: process.env.DATABASE_URL?.split(':')[2]?.split('@')[0] || '',
  database: process.env.DATABASE_URL?.split('/')[3]?.split('?')[0] || 'dopamine_dasher',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  ssl: 'amazon',
});

// Task templates with activation energy and dopamine menu categories
const taskTemplates = [
  // MAIL HANDLING SEQUENCE - Appetizers to Entrées
  {
    title: 'Open all mail and discard junk',
    description: 'Go through mail pile and throw away obvious junk/spam',
    durationMinutes: 2,
    activationEnergy: 'micro',
    dopamineMenuCategory: 'appetizer',
    sequenceGroup: 'mail_handling',
    sequenceOrder: 1,
    recommendedState: 'squirrel',
    baseRewardPoints: 5,
  },
  {
    title: 'Read through and categorize mail',
    description: 'Sort remaining mail into: bills, personal, action needed',
    durationMinutes: 5,
    activationEnergy: 'easy',
    dopamineMenuCategory: 'appetizer',
    sequenceGroup: 'mail_handling',
    sequenceOrder: 2,
    recommendedState: 'squirrel',
    baseRewardPoints: 10,
  },
  {
    title: 'Address 3-5 mail items (bills, responses, shredding)',
    description: 'Pay bills, respond to letters, shred confidential documents',
    durationMinutes: 10,
    activationEnergy: 'medium',
    dopamineMenuCategory: 'entree',
    sequenceGroup: 'mail_handling',
    sequenceOrder: 3,
    recommendedState: 'squirrel',
    baseRewardPoints: 20,
  },

  // QUICK CLEANING - Appetizers
  {
    title: 'Quick tidy - put items away',
    description: 'Put visible items back where they belong (5 min max)',
    durationMinutes: 3,
    activationEnergy: 'micro',
    dopamineMenuCategory: 'appetizer',
    sequenceGroup: 'quick_clean',
    sequenceOrder: 1,
    recommendedState: 'squirrel',
    baseRewardPoints: 5,
  },
  {
    title: 'Wipe down one surface',
    description: 'Clean kitchen counter, desk, or table',
    durationMinutes: 5,
    activationEnergy: 'easy',
    dopamineMenuCategory: 'appetizer',
    sequenceGroup: 'quick_clean',
    sequenceOrder: 2,
    recommendedState: 'tired',
    baseRewardPoints: 10,
  },

  // DEEPER CLEANING - Entrées
  {
    title: 'Sweep kitchen',
    description: 'Quick sweep of kitchen floor',
    durationMinutes: 8,
    activationEnergy: 'easy',
    dopamineMenuCategory: 'entree',
    sequenceGroup: 'deeper_clean',
    sequenceOrder: 1,
    recommendedState: 'tired',
    baseRewardPoints: 15,
  },
  {
    title: 'Mop floors',
    description: 'Mop kitchen and/or bathroom floors',
    durationMinutes: 20,
    activationEnergy: 'medium',
    dopamineMenuCategory: 'entree',
    sequenceGroup: 'deeper_clean',
    sequenceOrder: 2,
    recommendedState: 'focused',
    baseRewardPoints: 30,
  },
  {
    title: 'Deep clean bathroom',
    description: 'Scrub toilet, sink, shower/tub',
    durationMinutes: 30,
    activationEnergy: 'medium',
    dopamineMenuCategory: 'entree',
    sequenceGroup: 'deeper_clean',
    sequenceOrder: 3,
    recommendedState: 'focused',
    baseRewardPoints: 40,
  },

  // WORK/PRODUCTIVITY - Appetizers to Deep Work
  {
    title: 'Check emails',
    description: 'Quick scan of inbox, flag urgent items',
    durationMinutes: 5,
    activationEnergy: 'easy',
    dopamineMenuCategory: 'appetizer',
    sequenceGroup: 'work_flow',
    sequenceOrder: 1,
    recommendedState: 'tired',
    baseRewardPoints: 10,
  },
  {
    title: 'Respond to urgent messages',
    description: 'Reply to 3-5 time-sensitive emails/messages',
    durationMinutes: 10,
    activationEnergy: 'medium',
    dopamineMenuCategory: 'entree',
    sequenceGroup: 'work_flow',
    sequenceOrder: 2,
    recommendedState: 'focused',
    baseRewardPoints: 20,
  },
  {
    title: 'Deep work on project',
    description: 'Focused work on main project/task',
    durationMinutes: 45,
    activationEnergy: 'deep',
    dopamineMenuCategory: 'entree',
    sequenceGroup: 'work_flow',
    sequenceOrder: 3,
    recommendedState: 'focused',
    baseRewardPoints: 50,
  },

  // SELF-CARE APPETIZERS
  {
    title: 'Stretch for 2 minutes',
    description: 'Quick full-body stretch',
    durationMinutes: 2,
    activationEnergy: 'micro',
    dopamineMenuCategory: 'appetizer',
    sequenceGroup: 'self_care',
    sequenceOrder: 1,
    recommendedState: 'tired',
    baseRewardPoints: 5,
  },
  {
    title: 'Drink water and take a break',
    description: 'Hydrate and step away from screen',
    durationMinutes: 3,
    activationEnergy: 'micro',
    dopamineMenuCategory: 'appetizer',
    sequenceGroup: 'self_care',
    sequenceOrder: 1,
    recommendedState: 'hurting',
    baseRewardPoints: 5,
  },
  {
    title: 'Listen to favorite song',
    description: 'Play one song you love',
    durationMinutes: 3,
    activationEnergy: 'micro',
    dopamineMenuCategory: 'appetizer',
    sequenceGroup: 'self_care',
    sequenceOrder: 1,
    recommendedState: 'squirrel',
    baseRewardPoints: 5,
  },

  // SELF-CARE ENTRÉES
  {
    title: 'Take a warm shower',
    description: 'Relaxing shower with favorite soap/shampoo',
    durationMinutes: 15,
    activationEnergy: 'easy',
    dopamineMenuCategory: 'entree',
    sequenceGroup: 'self_care',
    sequenceOrder: 2,
    recommendedState: 'hurting',
    baseRewardPoints: 20,
  },
  {
    title: 'Go for a walk',
    description: 'Walk around the block or nearby park',
    durationMinutes: 15,
    activationEnergy: 'easy',
    dopamineMenuCategory: 'entree',
    sequenceGroup: 'self_care',
    sequenceOrder: 2,
    recommendedState: 'tired',
    baseRewardPoints: 20,
  },
  {
    title: 'Journaling session',
    description: 'Free-write thoughts and feelings',
    durationMinutes: 15,
    activationEnergy: 'easy',
    dopamineMenuCategory: 'entree',
    sequenceGroup: 'self_care',
    sequenceOrder: 2,
    recommendedState: 'focused',
    baseRewardPoints: 20,
  },

  // DOPAMINE MENU SIDES (Accompaniments)
  {
    title: 'Put on upbeat music',
    description: 'Play energizing playlist while working',
    durationMinutes: 0,
    activationEnergy: 'micro',
    dopamineMenuCategory: 'side',
    sequenceGroup: 'accompaniments',
    sequenceOrder: 1,
    recommendedState: 'tired',
    baseRewardPoints: 0,
  },
  {
    title: 'Start a podcast/audiobook',
    description: 'Play interesting audio while doing boring task',
    durationMinutes: 0,
    activationEnergy: 'micro',
    dopamineMenuCategory: 'side',
    sequenceGroup: 'accompaniments',
    sequenceOrder: 1,
    recommendedState: 'squirrel',
    baseRewardPoints: 0,
  },
  {
    title: 'Set a timer challenge',
    description: 'Race against the clock to complete task',
    durationMinutes: 0,
    activationEnergy: 'micro',
    dopamineMenuCategory: 'side',
    sequenceGroup: 'accompaniments',
    sequenceOrder: 1,
    recommendedState: 'squirrel',
    baseRewardPoints: 0,
  },

  // DOPAMINE MENU DESSERTS (High-stimulation, use sparingly)
  {
    title: 'Play favorite video game',
    description: 'Quick gaming session (set time limit!)',
    durationMinutes: 15,
    activationEnergy: 'easy',
    dopamineMenuCategory: 'dessert',
    sequenceGroup: 'high_stimulation',
    sequenceOrder: 1,
    recommendedState: 'squirrel',
    baseRewardPoints: 0,
  },
  {
    title: 'Social media break',
    description: 'Check social media (5 min max)',
    durationMinutes: 5,
    activationEnergy: 'micro',
    dopamineMenuCategory: 'dessert',
    sequenceGroup: 'high_stimulation',
    sequenceOrder: 1,
    recommendedState: 'squirrel',
    baseRewardPoints: 0,
  },
  {
    title: 'Watch favorite show',
    description: 'One episode of comfort show',
    durationMinutes: 30,
    activationEnergy: 'easy',
    dopamineMenuCategory: 'dessert',
    sequenceGroup: 'high_stimulation',
    sequenceOrder: 1,
    recommendedState: 'hurting',
    baseRewardPoints: 0,
  },
];

async function seedTasks() {
  const connection = await pool.getConnection();

  try {
    console.log('Seeding task templates...');

    for (const task of taskTemplates) {
      const query = `
        INSERT INTO tasks (
          title, description, durationMinutes, activationEnergy, 
          dopamineMenuCategory, sequenceGroup, sequenceOrder, 
          recommendedState, baseRewardPoints, userId
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

      const values = [
        task.title,
        task.description,
        task.durationMinutes,
        task.activationEnergy,
        task.dopamineMenuCategory,
        task.sequenceGroup,
        task.sequenceOrder,
        task.recommendedState,
        task.baseRewardPoints,
        null, // userId - null means these are templates
      ];

      try {
        await connection.execute(query, values);
        console.log(`✓ Created: ${task.title}`);
      } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
          console.log(`⊘ Already exists: ${task.title}`);
        } else {
          console.error(`✗ Error creating ${task.title}:`, error.message);
        }
      }
    }

    console.log('\n✅ Task template seeding complete!');
  } catch (error) {
    console.error('Fatal error:', error);
  } finally {
    await connection.release();
    await pool.end();
  }
}

seedTasks();
