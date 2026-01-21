import mysql from 'mysql2/promise';

// Parse DATABASE_URL properly
const dbUrl = new URL(process.env.DATABASE_URL);
const connection = await mysql.createConnection({
  host: dbUrl.hostname,
  port: dbUrl.port,
  user: dbUrl.username,
  password: dbUrl.password,
  database: dbUrl.pathname.substring(1),
  ssl: {
    rejectUnauthorized: false,
  },
});

// Get a test user (or use user ID 1 if it exists)
const [users] = await connection.execute('SELECT id FROM users LIMIT 1');
if (users.length === 0) {
  console.log('No users found. Please create a user first.');
  await connection.end();
  process.exit(1);
}

const userId = users[0].id;
console.log(`Using user ID: ${userId}`);

// Create mail handling task sequence
const mailTasks = [
  {
    title: 'Open all mail and discard junk',
    type: 'quick',
    category: 'home',
    durationMinutes: 2,
    sequenceGroup: 'mail-handling',
    sequenceOrder: 1,
    xpReward: 10,
    coinReward: 5,
  },
  {
    title: 'Read through and categorize mail',
    type: 'quick',
    category: 'home',
    durationMinutes: 5,
    sequenceGroup: 'mail-handling',
    sequenceOrder: 2,
    xpReward: 15,
    coinReward: 8,
  },
  {
    title: 'Address 3-5 items (bills, responses, shredding)',
    type: 'quick',
    category: 'home',
    durationMinutes: 10,
    sequenceGroup: 'mail-handling',
    sequenceOrder: 3,
    xpReward: 25,
    coinReward: 15,
  },
];

for (const task of mailTasks) {
  const query = `
    INSERT INTO tasks (userId, title, type, category, durationMinutes, sequenceGroup, sequenceOrder, xpReward, coinReward, completed)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 0)
  `;
  
  const values = [
    userId,
    task.title,
    task.type,
    task.category,
    task.durationMinutes,
    task.sequenceGroup,
    task.sequenceOrder,
    task.xpReward,
    task.coinReward,
  ];
  
  try {
    await connection.execute(query, values);
    console.log(`✓ Created task: "${task.title}" (${task.durationMinutes} min)`);
  } catch (error) {
    console.error(`✗ Failed to create task "${task.title}":`, error.message);
  }
}

await connection.end();
console.log('\n✅ Mail handling task sequence created successfully!');
