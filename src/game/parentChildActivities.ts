import { Scenario } from './types';

// These are positive parent-child bonding scenarios that appear frequently at young ages (0-12)
// They give mostly positive stats and strengthen relationship + happiness

export const PARENT_CHILD_ACTIVITIES: Scenario[] = [
  // 🟢 Everyday bonding
  {
    id: 'pc_watch_movie',
    title: 'Movie Night',
    description: 'Your parents suggest watching a movie together tonight.',
    minAge: 3, maxAge: 12,
    condition: (p) => p.parents.some(par => !par.isDead && par.relationship > 30),
    options: [
      { text: 'Watch together!', effect: (p) => ({ happiness: Math.min(100, p.happiness + 8), parents: p.parents.map(par => ({ ...par, relationship: Math.min(100, par.relationship + 3) })) }), message: 'You cuddled up and watched a great movie together.' },
      { text: 'Pick the movie', effect: (p) => ({ happiness: Math.min(100, p.happiness + 10) }), message: 'You got to choose the movie! It was awesome.' },
      { text: 'Fall asleep during it', effect: (p) => ({ happiness: Math.min(100, p.happiness + 5), health: Math.min(100, p.health + 2) }), message: 'You fell asleep on the couch. Your parent carried you to bed.' }
    ]
  },
  {
    id: 'pc_family_dinner',
    title: 'Family Dinner',
    description: 'The whole family sits down for dinner together.',
    minAge: 2, maxAge: 12,
    condition: (p) => p.parents.some(par => !par.isDead && par.relationship > 20),
    options: [
      { text: 'Enjoy the meal', effect: (p) => ({ happiness: Math.min(100, p.happiness + 6), parents: p.parents.map(par => ({ ...par, relationship: Math.min(100, par.relationship + 4) })) }), message: 'You had a wonderful family dinner. Everyone was laughing.' },
      { text: 'Talk about your day', effect: (p) => ({ happiness: Math.min(100, p.happiness + 8), smarts: Math.min(100, p.smarts + 1) }), message: 'You shared stories from your day. Your parents listened carefully.' },
      { text: 'Help set the table', effect: (p) => ({ happiness: Math.min(100, p.happiness + 4), parents: p.parents.map(par => ({ ...par, relationship: Math.min(100, par.relationship + 5) })) }), message: 'Your parents were proud of you for helping out.' }
    ]
  },
  {
    id: 'pc_grocery_shopping',
    title: 'Grocery Shopping',
    description: 'Your parent takes you grocery shopping.',
    minAge: 3, maxAge: 10,
    condition: (p) => p.parents.some(par => !par.isDead),
    options: [
      { text: 'Help pick items', effect: (p) => ({ smarts: Math.min(100, p.smarts + 2), parents: p.parents.map(par => ({ ...par, relationship: Math.min(100, par.relationship + 3) })) }), message: 'You helped find everything on the list. Your parent was impressed!' },
      { text: 'Push the cart', effect: (p) => ({ happiness: Math.min(100, p.happiness + 5), health: Math.min(100, p.health + 1) }), message: 'You pushed the cart like a race car driver!' },
      { text: 'Ask for a treat', effect: (p) => ({ happiness: Math.min(100, p.happiness + 8) }), message: 'Your parent got you a special treat. What a day!' }
    ]
  },
  {
    id: 'pc_help_cook',
    title: 'Cooking Together',
    description: 'Your parent invites you to help cook dinner.',
    minAge: 4, maxAge: 12,
    condition: (p) => p.parents.some(par => !par.isDead && par.relationship > 30),
    options: [
      { text: 'Help stir the pot', effect: (p) => ({ smarts: Math.min(100, p.smarts + 3), parents: p.parents.map(par => ({ ...par, relationship: Math.min(100, par.relationship + 5) })) }), message: 'You learned how to make a delicious meal together!' },
      { text: 'Taste test everything', effect: (p) => ({ happiness: Math.min(100, p.happiness + 8) }), message: 'You tasted everything and gave your expert opinion.' },
      { text: 'Try to flip a pancake', effect: (p) => ({ happiness: Math.min(100, p.happiness + 10), smarts: Math.min(100, p.smarts + 1) }), message: 'You flipped a pancake! Well... most of it stayed in the pan.' }
    ]
  },
  {
    id: 'pc_clean_house',
    title: 'Cleaning Together',
    description: 'Your parent asks you to help clean the house.',
    minAge: 4, maxAge: 12,
    condition: (p) => p.parents.some(par => !par.isDead),
    options: [
      { text: 'Help happily', effect: (p) => ({ parents: p.parents.map(par => ({ ...par, relationship: Math.min(100, par.relationship + 6) })), karma: Math.min(100, p.karma + 3) }), message: 'You cleaned together and the house looks amazing!' },
      { text: 'Race to finish first', effect: (p) => ({ happiness: Math.min(100, p.happiness + 5), health: Math.min(100, p.health + 1) }), message: 'You turned cleaning into a race and had fun!' },
      { text: 'Do a half-hearted job', effect: (p) => ({ parents: p.parents.map(par => ({ ...par, relationship: Math.min(100, par.relationship + 2) })) }), message: 'You did what you could. At least you tried!' }
    ]
  },
  {
    id: 'pc_bedtime_story',
    title: 'Bedtime Story',
    description: 'Your parent reads you a bedtime story.',
    minAge: 0, maxAge: 8,
    condition: (p) => p.parents.some(par => !par.isDead && par.relationship > 30),
    options: [
      { text: 'Listen carefully', effect: (p) => ({ smarts: Math.min(100, p.smarts + 3), happiness: Math.min(100, p.happiness + 5), parents: p.parents.map(par => ({ ...par, relationship: Math.min(100, par.relationship + 4) })) }), message: 'Your parent read you a beautiful story. You drifted off to sleep with a smile.' },
      { text: 'Ask for another one', effect: (p) => ({ smarts: Math.min(100, p.smarts + 4), happiness: Math.min(100, p.happiness + 3) }), message: 'You convinced them to read one more story!' },
      { text: 'Fall asleep quickly', effect: (p) => ({ health: Math.min(100, p.health + 3), happiness: Math.min(100, p.happiness + 2) }), message: 'The story was so soothing you fell right asleep.' }
    ]
  },
  {
    id: 'pc_board_games',
    title: 'Board Game Night',
    description: 'The family breaks out a board game.',
    minAge: 4, maxAge: 12,
    condition: (p) => p.parents.some(par => !par.isDead && par.relationship > 20),
    options: [
      { text: 'Play to win!', effect: (p) => ({ happiness: Math.min(100, p.happiness + 8), smarts: Math.min(100, p.smarts + 2) }), message: 'You played your heart out and had a blast!' },
      { text: 'Help the youngest player', effect: (p) => ({ karma: Math.min(100, p.karma + 5), happiness: Math.min(100, p.happiness + 5) }), message: 'You helped your younger sibling and everyone had fun.' },
      { text: 'Make up silly rules', effect: (p) => ({ happiness: Math.min(100, p.happiness + 10), parents: p.parents.map(par => ({ ...par, relationship: Math.min(100, par.relationship + 3) })) }), message: 'Everyone was laughing at your crazy rules!' }
    ]
  },
  {
    id: 'pc_homework_help',
    title: 'Homework Help',
    description: 'Your parent sits down to help you with homework.',
    minAge: 6, maxAge: 12,
    condition: (p) => p.parents.some(par => !par.isDead && par.relationship > 30),
    options: [
      { text: 'Focus and learn', effect: (p) => ({ smarts: Math.min(100, p.smarts + 5), parents: p.parents.map(par => ({ ...par, relationship: Math.min(100, par.relationship + 3) })) }), message: 'Your parent explained it perfectly. You understand now!' },
      { text: 'Ask lots of questions', effect: (p) => ({ smarts: Math.min(100, p.smarts + 4), happiness: Math.min(100, p.happiness + 3) }), message: 'Your curiosity impressed your parent.' },
      { text: 'Get frustrated', effect: (p) => ({ smarts: Math.min(100, p.smarts + 2), happiness: Math.min(100, p.happiness + 2) }), message: 'It was tough, but your parent was patient and you got through it.' }
    ]
  },
  {
    id: 'pc_walk_together',
    title: 'Walk Together',
    description: 'Your parent takes you for a walk around the neighborhood.',
    minAge: 2, maxAge: 10,
    condition: (p) => p.parents.some(par => !par.isDead),
    options: [
      { text: 'Chat along the way', effect: (p) => ({ health: Math.min(100, p.health + 3), happiness: Math.min(100, p.happiness + 4), parents: p.parents.map(par => ({ ...par, relationship: Math.min(100, par.relationship + 3) })) }), message: 'You had a nice walk and a great conversation.' },
      { text: 'Explore the area', effect: (p) => ({ health: Math.min(100, p.health + 4), smarts: Math.min(100, p.smarts + 2) }), message: 'You discovered a new path and saw some cool things!' },
      { text: 'Race your parent', effect: (p) => ({ health: Math.min(100, p.health + 5), happiness: Math.min(100, p.happiness + 6) }), message: 'You raced your parent to the end of the block!' }
    ]
  },
  // 🟡 Fun activities
  {
    id: 'pc_park',
    title: 'Day at the Park',
    description: 'Your parent takes you to the park!',
    minAge: 2, maxAge: 10,
    condition: (p) => p.parents.some(par => !par.isDead),
    options: [
      { text: 'Play on the swings', effect: (p) => ({ happiness: Math.min(100, p.happiness + 10), health: Math.min(100, p.health + 3) }), message: 'You swung so high you felt like you were flying!' },
      { text: 'Make new friends', effect: (p) => ({ happiness: Math.min(100, p.happiness + 8), popularity: Math.min(100, p.popularity + 2) }), message: 'You made a new friend at the park!' },
      { text: 'Have a picnic', effect: (p) => ({ happiness: Math.min(100, p.happiness + 7), parents: p.parents.map(par => ({ ...par, relationship: Math.min(100, par.relationship + 4) })) }), message: 'You had a lovely picnic together.' }
    ]
  },
  {
    id: 'pc_beach',
    title: 'Beach Day',
    description: 'The family goes to the beach!',
    minAge: 2, maxAge: 12,
    condition: (p) => p.parents.some(par => !par.isDead && par.relationship > 30),
    options: [
      { text: 'Build a sandcastle', effect: (p) => ({ happiness: Math.min(100, p.happiness + 10), smarts: Math.min(100, p.smarts + 1) }), message: 'You built an epic sandcastle!' },
      { text: 'Splash in the waves', effect: (p) => ({ happiness: Math.min(100, p.happiness + 12), health: Math.min(100, p.health + 3) }), message: 'You had a blast splashing in the waves!' },
      { text: 'Collect seashells', effect: (p) => ({ happiness: Math.min(100, p.happiness + 7), smarts: Math.min(100, p.smarts + 2) }), message: 'You found some beautiful seashells to bring home.' }
    ]
  },
  {
    id: 'pc_zoo',
    title: 'Visit to the Zoo',
    description: 'Your parents take you to the zoo!',
    minAge: 2, maxAge: 10,
    condition: (p) => p.parents.some(par => !par.isDead),
    options: [
      { text: 'See all the animals', effect: (p) => ({ smarts: Math.min(100, p.smarts + 4), happiness: Math.min(100, p.happiness + 10) }), message: 'You saw lions, elephants, and penguins! So cool!' },
      { text: 'Feed the giraffes', effect: (p) => ({ happiness: Math.min(100, p.happiness + 12), parents: p.parents.map(par => ({ ...par, relationship: Math.min(100, par.relationship + 3) })) }), message: 'A giraffe ate right from your hand!' },
      { text: 'Learn animal facts', effect: (p) => ({ smarts: Math.min(100, p.smarts + 5), happiness: Math.min(100, p.happiness + 5) }), message: 'You learned so many cool facts about animals!' }
    ]
  },
  {
    id: 'pc_amusement_park',
    title: 'Amusement Park',
    description: 'Your family goes to an amusement park!',
    minAge: 4, maxAge: 12,
    condition: (p) => p.parents.some(par => !par.isDead && par.relationship > 40),
    options: [
      { text: 'Ride the roller coaster', effect: (p) => ({ happiness: Math.min(100, p.happiness + 15), health: Math.min(100, p.health + 1) }), message: 'That was the best ride ever! You screamed the whole way!' },
      { text: 'Win a stuffed animal', effect: (p) => ({ happiness: Math.min(100, p.happiness + 10), parents: p.parents.map(par => ({ ...par, relationship: Math.min(100, par.relationship + 5) })) }), message: 'Your parent won you a huge stuffed animal!' },
      { text: 'Eat cotton candy', effect: (p) => ({ happiness: Math.min(100, p.happiness + 12) }), message: 'Cotton candy is the best thing in the world!' }
    ]
  },
  {
    id: 'pc_bike_ride',
    title: 'Bike Ride',
    description: 'Your parent suggests going for a bike ride together.',
    minAge: 5, maxAge: 12,
    condition: (p) => p.parents.some(par => !par.isDead),
    options: [
      { text: 'Race them!', effect: (p) => ({ health: Math.min(100, p.health + 5), happiness: Math.min(100, p.happiness + 8) }), message: 'You raced your parent and almost won!' },
      { text: 'Explore new trails', effect: (p) => ({ health: Math.min(100, p.health + 4), smarts: Math.min(100, p.smarts + 2) }), message: 'You discovered a cool new trail together.' },
      { text: 'Stop for ice cream', effect: (p) => ({ happiness: Math.min(100, p.happiness + 10), parents: p.parents.map(par => ({ ...par, relationship: Math.min(100, par.relationship + 3) })) }), message: 'You stopped for ice cream on the way home. Perfect day!' }
    ]
  },
  {
    id: 'pc_sports',
    title: 'Playing Sports',
    description: 'Your parent wants to play sports with you in the backyard.',
    minAge: 4, maxAge: 12,
    condition: (p) => p.parents.some(par => !par.isDead),
    options: [
      { text: 'Play catch', effect: (p) => ({ health: Math.min(100, p.health + 4), happiness: Math.min(100, p.happiness + 6), parents: p.parents.map(par => ({ ...par, relationship: Math.min(100, par.relationship + 4) })) }), message: 'You played catch and your throws are getting better!' },
      { text: 'Play soccer', effect: (p) => ({ health: Math.min(100, p.health + 5), happiness: Math.min(100, p.happiness + 7) }), message: 'You scored a goal against your parent!' },
      { text: 'Just run around', effect: (p) => ({ health: Math.min(100, p.health + 6), happiness: Math.min(100, p.happiness + 5) }), message: 'You ran around until you were exhausted and happy.' }
    ]
  },
  {
    id: 'pc_camping',
    title: 'Family Camping Trip',
    description: 'The family goes on a camping trip!',
    minAge: 5, maxAge: 12,
    condition: (p) => p.parents.some(par => !par.isDead && par.relationship > 40),
    options: [
      { text: 'Tell campfire stories', effect: (p) => ({ happiness: Math.min(100, p.happiness + 12), parents: p.parents.map(par => ({ ...par, relationship: Math.min(100, par.relationship + 6) })) }), message: 'You told scary stories around the campfire and everyone loved it!' },
      { text: 'Go stargazing', effect: (p) => ({ happiness: Math.min(100, p.happiness + 10), smarts: Math.min(100, p.smarts + 3) }), message: 'You looked at the stars and your parent taught you constellations.' },
      { text: 'Go on a hike', effect: (p) => ({ health: Math.min(100, p.health + 5), happiness: Math.min(100, p.happiness + 8) }), message: 'You hiked through the forest and saw beautiful scenery.' }
    ]
  },
  {
    id: 'pc_build_lego',
    title: 'Building Together',
    description: 'Your parent suggests building something together.',
    minAge: 3, maxAge: 10,
    condition: (p) => p.parents.some(par => !par.isDead),
    options: [
      { text: 'Build a LEGO set', effect: (p) => ({ smarts: Math.min(100, p.smarts + 4), happiness: Math.min(100, p.happiness + 7) }), message: 'You completed an amazing LEGO build together!' },
      { text: 'Build a blanket fort', effect: (p) => ({ happiness: Math.min(100, p.happiness + 10), parents: p.parents.map(par => ({ ...par, relationship: Math.min(100, par.relationship + 5) })) }), message: 'You built the best blanket fort ever!' },
      { text: 'Build with cardboard', effect: (p) => ({ smarts: Math.min(100, p.smarts + 3), happiness: Math.min(100, p.happiness + 6) }), message: 'You made a cardboard spaceship! To infinity and beyond!' }
    ]
  },
  {
    id: 'pc_fishing',
    title: 'Gone Fishing',
    description: 'Your parent takes you fishing at the lake.',
    minAge: 4, maxAge: 12,
    condition: (p) => p.parents.some(par => !par.isDead && par.relationship > 30),
    options: [
      { text: 'Be patient', effect: (p) => ({ happiness: Math.min(100, p.happiness + 8), parents: p.parents.map(par => ({ ...par, relationship: Math.min(100, par.relationship + 5) })) }), message: 'You waited patiently and caught a big fish!' },
      { text: 'Skip rocks instead', effect: (p) => ({ happiness: Math.min(100, p.happiness + 6), health: Math.min(100, p.health + 2) }), message: 'You skipped rocks across the water. Fun!' },
      { text: 'Just enjoy nature', effect: (p) => ({ happiness: Math.min(100, p.happiness + 7), health: Math.min(100, p.health + 2) }), message: 'You sat by the lake and enjoyed the peaceful nature.' }
    ]
  },
  {
    id: 'pc_family_movie_night',
    title: 'Family Movie Night',
    description: 'Everyone gathers for a family movie night with popcorn!',
    minAge: 3, maxAge: 12,
    condition: (p) => p.parents.some(par => !par.isDead),
    options: [
      { text: 'Watch and laugh', effect: (p) => ({ happiness: Math.min(100, p.happiness + 8), parents: p.parents.map(par => ({ ...par, relationship: Math.min(100, par.relationship + 3) })) }), message: 'Everyone laughed at the funny parts together!' },
      { text: 'Make popcorn together', effect: (p) => ({ happiness: Math.min(100, p.happiness + 6), smarts: Math.min(100, p.smarts + 1) }), message: 'You helped make the popcorn and it was perfectly buttery.' },
      { text: 'Cuddle up on the couch', effect: (p) => ({ happiness: Math.min(100, p.happiness + 10) }), message: 'You snuggled up with the family. Warm and happy.' }
    ]
  },
  // 🔵 Learning & growth
  {
    id: 'pc_learn_bike',
    title: 'Learning to Ride a Bike',
    description: 'Your parent is teaching you to ride a bike!',
    minAge: 4, maxAge: 7,
    condition: (p) => p.parents.some(par => !par.isDead && par.relationship > 30),
    options: [
      { text: 'Keep trying!', effect: (p) => ({ health: Math.min(100, p.health + 5), happiness: Math.min(100, p.happiness + 10), parents: p.parents.map(par => ({ ...par, relationship: Math.min(100, par.relationship + 5) })) }), message: 'You did it! You rode without training wheels!' },
      { text: 'Take it slow', effect: (p) => ({ health: Math.min(100, p.health + 3), happiness: Math.min(100, p.happiness + 5) }), message: 'You took it at your own pace and made great progress.' },
      { text: 'Fall but get back up', effect: (p) => ({ health: Math.min(100, p.health + 2), happiness: Math.min(100, p.happiness + 8), karma: Math.min(100, p.karma + 3) }), message: 'You fell a few times but never gave up. Your parent was so proud!' }
    ]
  },
  {
    id: 'pc_learn_swim',
    title: 'Swimming Lessons',
    description: 'Your parent takes you to learn how to swim.',
    minAge: 3, maxAge: 8,
    condition: (p) => p.parents.some(par => !par.isDead),
    options: [
      { text: 'Jump right in!', effect: (p) => ({ health: Math.min(100, p.health + 5), happiness: Math.min(100, p.happiness + 8) }), message: 'You cannonballed into the pool and started swimming!' },
      { text: 'Start in the shallow end', effect: (p) => ({ health: Math.min(100, p.health + 4), smarts: Math.min(100, p.smarts + 2) }), message: 'You started slow and learned proper technique.' },
      { text: 'Hold your parent\'s hand', effect: (p) => ({ health: Math.min(100, p.health + 3), parents: p.parents.map(par => ({ ...par, relationship: Math.min(100, par.relationship + 4) })) }), message: 'Your parent held you as you learned to float. You feel safe.' }
    ]
  },
  {
    id: 'pc_learn_cook',
    title: 'Learning to Cook',
    description: 'Your parent teaches you a simple recipe.',
    minAge: 6, maxAge: 12,
    condition: (p) => p.parents.some(par => !par.isDead && par.relationship > 30),
    options: [
      { text: 'Follow the recipe', effect: (p) => ({ smarts: Math.min(100, p.smarts + 4), parents: p.parents.map(par => ({ ...par, relationship: Math.min(100, par.relationship + 4) })) }), message: 'You made a meal from scratch! It was delicious!' },
      { text: 'Add your own twist', effect: (p) => ({ smarts: Math.min(100, p.smarts + 3), happiness: Math.min(100, p.happiness + 5) }), message: 'You added extra cheese and it was even better!' },
      { text: 'Make a mess', effect: (p) => ({ happiness: Math.min(100, p.happiness + 8) }), message: 'The kitchen was a disaster but you had so much fun!' }
    ]
  },
  {
    id: 'pc_museum',
    title: 'Museum Visit',
    description: 'Your parent takes you to a museum.',
    minAge: 4, maxAge: 12,
    condition: (p) => p.parents.some(par => !par.isDead),
    options: [
      { text: 'Ask lots of questions', effect: (p) => ({ smarts: Math.min(100, p.smarts + 5), happiness: Math.min(100, p.happiness + 4) }), message: 'You asked about everything and learned so much!' },
      { text: 'Draw what you see', effect: (p) => ({ smarts: Math.min(100, p.smarts + 3), happiness: Math.min(100, p.happiness + 5) }), message: 'You sketched the dinosaur bones. Not bad!' },
      { text: 'Buy a souvenir', effect: (p) => ({ happiness: Math.min(100, p.happiness + 8) }), message: 'You got a cool museum gift to remember the day!' }
    ]
  },
  {
    id: 'pc_library',
    title: 'Library Visit',
    description: 'Your parent takes you to the library.',
    minAge: 3, maxAge: 12,
    condition: (p) => p.parents.some(par => !par.isDead),
    options: [
      { text: 'Find new books', effect: (p) => ({ smarts: Math.min(100, p.smarts + 4), happiness: Math.min(100, p.happiness + 3) }), message: 'You found amazing new books to take home!' },
      { text: 'Listen to storytime', effect: (p) => ({ smarts: Math.min(100, p.smarts + 3), happiness: Math.min(100, p.happiness + 5) }), message: 'The librarian told an enchanting story.' },
      { text: 'Get a library card', effect: (p) => ({ smarts: Math.min(100, p.smarts + 5), happiness: Math.min(100, p.happiness + 4) }), message: 'You got your very own library card! You feel so grown up.' }
    ]
  },
  {
    id: 'pc_practice_reading',
    title: 'Reading Practice',
    description: 'Your parent sits with you to practice reading.',
    minAge: 3, maxAge: 8,
    condition: (p) => p.parents.some(par => !par.isDead && par.relationship > 30),
    options: [
      { text: 'Read out loud', effect: (p) => ({ smarts: Math.min(100, p.smarts + 5), parents: p.parents.map(par => ({ ...par, relationship: Math.min(100, par.relationship + 3) })) }), message: 'You read a whole page by yourself! Amazing!' },
      { text: 'Sound out the words', effect: (p) => ({ smarts: Math.min(100, p.smarts + 4), happiness: Math.min(100, p.happiness + 3) }), message: 'You struggled with some words but kept going.' },
      { text: 'Read together', effect: (p) => ({ smarts: Math.min(100, p.smarts + 3), happiness: Math.min(100, p.happiness + 5), parents: p.parents.map(par => ({ ...par, relationship: Math.min(100, par.relationship + 4) })) }), message: 'You and your parent took turns reading. It was cozy.' }
    ]
  },
  {
    id: 'pc_learn_hobby',
    title: 'New Hobby',
    description: 'Your parent introduces you to a new hobby.',
    minAge: 5, maxAge: 12,
    condition: (p) => p.parents.some(par => !par.isDead && par.relationship > 30),
    options: [
      { text: 'Try it with enthusiasm', effect: (p) => ({ happiness: Math.min(100, p.happiness + 10), smarts: Math.min(100, p.smarts + 2) }), message: 'You love this new hobby! You want to do it every day.' },
      { text: 'Learn the basics', effect: (p) => ({ smarts: Math.min(100, p.smarts + 4), happiness: Math.min(100, p.happiness + 5) }), message: 'You\'re a natural! Your parent was impressed.' },
      { text: 'Ask to do it together', effect: (p) => ({ happiness: Math.min(100, p.happiness + 8), parents: p.parents.map(par => ({ ...par, relationship: Math.min(100, par.relationship + 5) })) }), message: 'It became your thing to do together.' }
    ]
  },
  {
    id: 'pc_science_experiment',
    title: 'Science Experiment',
    description: 'Your parent sets up a science experiment at home.',
    minAge: 5, maxAge: 12,
    condition: (p) => p.parents.some(par => !par.isDead && par.relationship > 30),
    options: [
      { text: 'Make a volcano', effect: (p) => ({ smarts: Math.min(100, p.smarts + 5), happiness: Math.min(100, p.happiness + 10) }), message: 'The baking soda volcano erupted! So cool!' },
      { text: 'Grow crystals', effect: (p) => ({ smarts: Math.min(100, p.smarts + 4), happiness: Math.min(100, p.happiness + 6) }), message: 'You grew beautiful crystals over a few days!' },
      { text: 'Mix colors', effect: (p) => ({ smarts: Math.min(100, p.smarts + 3), happiness: Math.min(100, p.happiness + 7) }), message: 'You learned how colors mix together. Science is fun!' }
    ]
  },
  {
    id: 'pc_build_project',
    title: 'Building a Project',
    description: 'Your parent helps you build something for school.',
    minAge: 6, maxAge: 12,
    condition: (p) => p.parents.some(par => !par.isDead),
    options: [
      { text: 'Work hard on it', effect: (p) => ({ smarts: Math.min(100, p.smarts + 5), parents: p.parents.map(par => ({ ...par, relationship: Math.min(100, par.relationship + 4) })) }), message: 'Your project turned out incredible! Teacher was impressed.' },
      { text: 'Get creative', effect: (p) => ({ smarts: Math.min(100, p.smarts + 3), happiness: Math.min(100, p.happiness + 8) }), message: 'You added creative touches that made it unique!' },
      { text: 'Learn new skills', effect: (p) => ({ smarts: Math.min(100, p.smarts + 4), happiness: Math.min(100, p.happiness + 4) }), message: 'Your parent taught you how to use tools safely.' }
    ]
  },
  {
    id: 'pc_life_skills',
    title: 'Life Skills',
    description: 'Your parent teaches you important life skills.',
    minAge: 6, maxAge: 12,
    condition: (p) => p.parents.some(par => !par.isDead && par.relationship > 40),
    options: [
      { text: 'Learn to tie shoes', effect: (p) => ({ smarts: Math.min(100, p.smarts + 3), happiness: Math.min(100, p.happiness + 5) }), message: 'You finally mastered shoe-tying!' },
      { text: 'Learn to do laundry', effect: (p) => ({ smarts: Math.min(100, p.smarts + 2), parents: p.parents.map(par => ({ ...par, relationship: Math.min(100, par.relationship + 4) })) }), message: 'You helped with laundry. Growing up!' },
      { text: 'Learn about money', effect: (p) => ({ smarts: Math.min(100, p.smarts + 5), happiness: Math.min(100, p.happiness + 3) }), message: 'Your parent taught you about saving and spending wisely.' }
    ]
  },
  // 🟣 Emotional / bonding moments
  {
    id: 'pc_comfort_sad',
    title: 'Parent Comforts You',
    description: 'You\'re feeling sad and your parent notices.',
    minAge: 2, maxAge: 12,
    condition: (p) => p.happiness < 60 && p.parents.some(par => !par.isDead && par.relationship > 40),
    options: [
      { text: 'Let them comfort you', effect: (p) => ({ happiness: Math.min(100, p.happiness + 15), parents: p.parents.map(par => ({ ...par, relationship: Math.min(100, par.relationship + 5) })) }), message: 'Your parent held you and told you everything would be okay. You feel so much better.' },
      { text: 'Talk about it', effect: (p) => ({ happiness: Math.min(100, p.happiness + 12), smarts: Math.min(100, p.smarts + 1) }), message: 'You opened up about your feelings and your parent really listened.' },
      { text: 'Get a warm hug', effect: (p) => ({ happiness: Math.min(100, p.happiness + 10), parents: p.parents.map(par => ({ ...par, relationship: Math.min(100, par.relationship + 4) })) }), message: 'A warm hug from your parent made everything feel better.' }
    ]
  },
  {
    id: 'pc_birthday',
    title: 'Your Birthday!',
    description: 'It\'s your birthday! Your parents planned a celebration.',
    minAge: 1, maxAge: 12,
    condition: (p) => p.parents.some(par => !par.isDead && par.relationship > 30),
    options: [
      { text: 'Open presents!', effect: (p) => ({ happiness: Math.min(100, p.happiness + 15), parents: p.parents.map(par => ({ ...par, relationship: Math.min(100, par.relationship + 3) })) }), message: 'You got amazing presents! Best birthday ever!' },
      { text: 'Eat birthday cake', effect: (p) => ({ happiness: Math.min(100, p.happiness + 12) }), message: 'The cake was SO good. You had two slices!' },
      { text: 'Party with friends', effect: (p) => ({ happiness: Math.min(100, p.happiness + 15), popularity: Math.min(100, p.popularity + 3) }), message: 'All your friends came and you had an incredible party!' }
    ]
  },
  {
    id: 'pc_parent_birthday',
    title: 'Parent\'s Birthday',
    description: 'It\'s your parent\'s birthday. You want to do something special.',
    minAge: 4, maxAge: 12,
    condition: (p) => p.parents.some(par => !par.isDead),
    options: [
      { text: 'Make a card', effect: (p) => ({ parents: p.parents.map(par => ({ ...par, relationship: Math.min(100, par.relationship + 8) })), happiness: Math.min(100, p.happiness + 5) }), message: 'Your parent was so touched by your homemade card!' },
      { text: 'Give a big hug', effect: (p) => ({ parents: p.parents.map(par => ({ ...par, relationship: Math.min(100, par.relationship + 6) })), happiness: Math.min(100, p.happiness + 5) }), message: 'You gave them the biggest hug ever!' },
      { text: 'Help with chores', effect: (p) => ({ parents: p.parents.map(par => ({ ...par, relationship: Math.min(100, par.relationship + 7) })), karma: Math.min(100, p.karma + 3) }), message: 'You did all the chores so they could relax. They were so grateful!' }
    ]
  },
  {
    id: 'pc_talk_feelings',
    title: 'Heart-to-Heart',
    description: 'Your parent sits down to talk about feelings with you.',
    minAge: 4, maxAge: 12,
    condition: (p) => p.parents.some(par => !par.isDead && par.relationship > 40),
    options: [
      { text: 'Open up', effect: (p) => ({ happiness: Math.min(100, p.happiness + 10), parents: p.parents.map(par => ({ ...par, relationship: Math.min(100, par.relationship + 6) })) }), message: 'You shared how you\'ve been feeling. Your parent understood completely.' },
      { text: 'Listen to their advice', effect: (p) => ({ smarts: Math.min(100, p.smarts + 3), happiness: Math.min(100, p.happiness + 7) }), message: 'Your parent gave you wise advice that really helped.' },
      { text: 'Say "I love you"', effect: (p) => ({ happiness: Math.min(100, p.happiness + 12), parents: p.parents.map(par => ({ ...par, relationship: Math.min(100, par.relationship + 8) })) }), message: 'You told your parent you love them. They teared up with joy.' }
    ]
  },
  {
    id: 'pc_praised',
    title: 'Getting Praised',
    description: 'Your parent praises you for something you did well.',
    minAge: 2, maxAge: 12,
    condition: (p) => p.parents.some(par => !par.isDead && par.relationship > 30),
    options: [
      { text: 'Feel proud', effect: (p) => ({ happiness: Math.min(100, p.happiness + 12), smarts: Math.min(100, p.smarts + 2) }), message: 'You beamed with pride! Your parent told you how great you are.' },
      { text: 'Say thank you', effect: (p) => ({ happiness: Math.min(100, p.happiness + 8), parents: p.parents.map(par => ({ ...par, relationship: Math.min(100, par.relationship + 4) })) }), message: 'You said thank you and it made your parent smile.' },
      { text: 'Try even harder next time', effect: (p) => ({ smarts: Math.min(100, p.smarts + 4), happiness: Math.min(100, p.happiness + 6) }), message: 'You were motivated to do even better next time!' }
    ]
  },
  {
    id: 'pc_hug',
    title: 'Big Hug',
    description: 'Your parent gives you a big hug for no reason.',
    minAge: 0, maxAge: 12,
    condition: (p) => p.parents.some(par => !par.isDead && par.relationship > 40),
    options: [
      { text: 'Hug back', effect: (p) => ({ happiness: Math.min(100, p.happiness + 10), parents: p.parents.map(par => ({ ...par, relationship: Math.min(100, par.relationship + 4) })) }), message: 'You hugged each other tight. You feel so loved.' },
      { text: 'Hold on tight', effect: (p) => ({ happiness: Math.min(100, p.happiness + 12) }), message: 'You didn\'t want to let go. Moments like these are everything.' },
      { text: 'Smile', effect: (p) => ({ happiness: Math.min(100, p.happiness + 8) }), message: 'You smiled and felt warm inside.' }
    ]
  },
  {
    id: 'pc_family_photo',
    title: 'Family Photo',
    description: 'The family takes a photo together.',
    minAge: 1, maxAge: 12,
    condition: (p) => p.parents.some(par => !par.isDead),
    options: [
      { text: 'Make a silly face', effect: (p) => ({ happiness: Math.min(100, p.happiness + 8) }), message: 'Everyone laughed at your silly face!' },
      { text: 'Pose nicely', effect: (p) => ({ happiness: Math.min(100, p.happiness + 5), parents: p.parents.map(par => ({ ...par, relationship: Math.min(100, par.relationship + 2) })) }), message: 'It turned out to be a beautiful family photo.' },
      { text: 'Photobomb!', effect: (p) => ({ happiness: Math.min(100, p.happiness + 10) }), message: 'You jumped into the frame at the last second. Classic!' }
    ]
  },
  {
    id: 'pc_school_stress',
    title: 'School Stress Support',
    description: 'You\'re stressed about school and your parent helps you through it.',
    minAge: 6, maxAge: 12,
    condition: (p) => p.parents.some(par => !par.isDead && par.relationship > 40),
    options: [
      { text: 'Accept their help', effect: (p) => ({ happiness: Math.min(100, p.happiness + 10), smarts: Math.min(100, p.smarts + 3), stress: Math.max(0, (p.stress || 0) - 15) }), message: 'Your parent helped you study and you feel so much better.' },
      { text: 'Talk about what\'s wrong', effect: (p) => ({ happiness: Math.min(100, p.happiness + 8), stress: Math.max(0, (p.stress || 0) - 20) }), message: 'Just talking about it made you feel less overwhelmed.' },
      { text: 'Take a break together', effect: (p) => ({ happiness: Math.min(100, p.happiness + 7), stress: Math.max(0, (p.stress || 0) - 10), parents: p.parents.map(par => ({ ...par, relationship: Math.min(100, par.relationship + 4) })) }), message: 'You took a break and played a game together. Stress gone!' }
    ]
  },
  {
    id: 'pc_encouragement',
    title: 'Words of Encouragement',
    description: 'Your parent tells you they believe in you.',
    minAge: 3, maxAge: 12,
    condition: (p) => p.parents.some(par => !par.isDead && par.relationship > 40),
    options: [
      { text: 'Feel motivated', effect: (p) => ({ happiness: Math.min(100, p.happiness + 10), smarts: Math.min(100, p.smarts + 2) }), message: 'Their words filled you with determination!' },
      { text: 'Hug them', effect: (p) => ({ happiness: Math.min(100, p.happiness + 8), parents: p.parents.map(par => ({ ...par, relationship: Math.min(100, par.relationship + 5) })) }), message: 'You hugged your parent and thanked them.' },
      { text: 'Promise to try your best', effect: (p) => ({ happiness: Math.min(100, p.happiness + 7), karma: Math.min(100, p.karma + 3) }), message: 'You promised to always do your best. They were so proud.' }
    ]
  },
  {
    id: 'pc_family_tradition',
    title: 'Family Tradition',
    description: 'Your family does something special that you do every year.',
    minAge: 3, maxAge: 12,
    condition: (p) => p.parents.some(par => !par.isDead && par.relationship > 30),
    options: [
      { text: 'Join in happily', effect: (p) => ({ happiness: Math.min(100, p.happiness + 10), parents: p.parents.map(par => ({ ...par, relationship: Math.min(100, par.relationship + 5) })) }), message: 'The family tradition brought everyone closer together.' },
      { text: 'Add something new', effect: (p) => ({ happiness: Math.min(100, p.happiness + 8), smarts: Math.min(100, p.smarts + 1) }), message: 'You added a new twist to the tradition and everyone loved it!' },
      { text: 'Take photos', effect: (p) => ({ happiness: Math.min(100, p.happiness + 7) }), message: 'You captured the memories forever.' }
    ]
  },
  // 🟠 Special moments
  {
    id: 'pc_family_vacation',
    title: 'Family Vacation',
    description: 'Your family goes on vacation!',
    minAge: 3, maxAge: 12,
    condition: (p) => p.parents.some(par => !par.isDead && par.relationship > 40),
    options: [
      { text: 'Explore everything!', effect: (p) => ({ happiness: Math.min(100, p.happiness + 15), smarts: Math.min(100, p.smarts + 3), parents: p.parents.map(par => ({ ...par, relationship: Math.min(100, par.relationship + 5) })) }), message: 'You explored every corner. It was the best vacation ever!' },
      { text: 'Swim and play', effect: (p) => ({ happiness: Math.min(100, p.happiness + 12), health: Math.min(100, p.health + 5) }), message: 'You swam every day and had the time of your life!' },
      { text: 'Take souvenirs home', effect: (p) => ({ happiness: Math.min(100, p.happiness + 10) }), message: 'You brought back amazing souvenirs to remember the trip.' }
    ]
  },
  {
    id: 'pc_travel_abroad',
    title: 'Traveling Abroad',
    description: 'Your family goes on an international trip!',
    minAge: 5, maxAge: 12,
    condition: (p) => p.parents.some(par => !par.isDead && par.relationship > 50),
    options: [
      { text: 'Learn about the culture', effect: (p) => ({ happiness: Math.min(100, p.happiness + 12), smarts: Math.min(100, p.smarts + 5) }), message: 'You learned about a completely different way of life!' },
      { text: 'Try new food', effect: (p) => ({ happiness: Math.min(100, p.happiness + 10), smarts: Math.min(100, p.smarts + 2) }), message: 'You tried new foods and found a new favorite dish!' },
      { text: 'Make international friends', effect: (p) => ({ happiness: Math.min(100, p.happiness + 8), popularity: Math.min(100, p.popularity + 3) }), message: 'You made friends with kids from another country!' }
    ]
  },
  {
    id: 'pc_get_gift',
    title: 'Surprise Gift',
    description: 'Your parent surprises you with a gift!',
    minAge: 2, maxAge: 12,
    condition: (p) => p.parents.some(par => !par.isDead && par.relationship > 40),
    options: [
      { text: 'Open it excitedly', effect: (p) => ({ happiness: Math.min(100, p.happiness + 12) }), message: 'You ripped open the wrapping paper. It was exactly what you wanted!' },
      { text: 'Say thank you', effect: (p) => ({ happiness: Math.min(100, p.happiness + 10), parents: p.parents.map(par => ({ ...par, relationship: Math.min(100, par.relationship + 5) })) }), message: 'You thanked your parent from the bottom of your heart.' },
      { text: 'Share it with siblings', effect: (p) => ({ happiness: Math.min(100, p.happiness + 8), karma: Math.min(100, p.karma + 5) }), message: 'You shared your new gift. Everyone had fun!' }
    ]
  },
  {
    id: 'pc_surprise_day',
    title: 'Surprise Day Out',
    description: 'Your parent has a surprise planned for you today!',
    minAge: 3, maxAge: 12,
    condition: (p) => p.parents.some(par => !par.isDead && par.relationship > 40),
    options: [
      { text: 'Follow along eagerly', effect: (p) => ({ happiness: Math.min(100, p.happiness + 15), parents: p.parents.map(par => ({ ...par, relationship: Math.min(100, par.relationship + 5) })) }), message: 'The surprise was incredible! You\'ll never forget this day.' },
      { text: 'Try to guess what it is', effect: (p) => ({ happiness: Math.min(100, p.happiness + 12), smarts: Math.min(100, p.smarts + 1) }), message: 'You guessed wrong but the real surprise was even better!' },
      { text: 'Enjoy every moment', effect: (p) => ({ happiness: Math.min(100, p.happiness + 13) }), message: 'You soaked up every moment of this special day.' }
    ]
  },
  {
    id: 'pc_holiday',
    title: 'Holiday Celebration',
    description: 'The family celebrates a holiday together.',
    minAge: 1, maxAge: 12,
    condition: (p) => p.parents.some(par => !par.isDead),
    options: [
      { text: 'Join the festivities', effect: (p) => ({ happiness: Math.min(100, p.happiness + 12), parents: p.parents.map(par => ({ ...par, relationship: Math.min(100, par.relationship + 4) })) }), message: 'The holiday celebration was magical!' },
      { text: 'Help decorate', effect: (p) => ({ happiness: Math.min(100, p.happiness + 8), smarts: Math.min(100, p.smarts + 1) }), message: 'You helped decorate and everything looked beautiful.' },
      { text: 'Open gifts', effect: (p) => ({ happiness: Math.min(100, p.happiness + 15) }), message: 'Opening gifts with the family was the best part!' }
    ]
  },
  {
    id: 'pc_visit_relatives',
    title: 'Visiting Relatives',
    description: 'The family visits relatives for the weekend.',
    minAge: 2, maxAge: 12,
    condition: (p) => p.parents.some(par => !par.isDead),
    options: [
      { text: 'Play with cousins', effect: (p) => ({ happiness: Math.min(100, p.happiness + 10), popularity: Math.min(100, p.popularity + 2) }), message: 'You had a blast playing with your cousins!' },
      { text: 'Hear family stories', effect: (p) => ({ smarts: Math.min(100, p.smarts + 3), happiness: Math.min(100, p.happiness + 5) }), message: 'Grandma told amazing stories about the old days.' },
      { text: 'Eat grandma\'s cooking', effect: (p) => ({ happiness: Math.min(100, p.happiness + 12), health: Math.min(100, p.health + 2) }), message: 'Nobody cooks like grandma! You ate until you were stuffed.' }
    ]
  },
  {
    id: 'pc_first_day_support',
    title: 'First Day of School',
    description: 'It\'s your first day at a new school and your parent is there for you.',
    minAge: 5, maxAge: 8,
    condition: (p) => p.parents.some(par => !par.isDead && par.relationship > 30),
    options: [
      { text: 'Walk in bravely', effect: (p) => ({ happiness: Math.min(100, p.happiness + 8), smarts: Math.min(100, p.smarts + 2) }), message: 'You walked in with confidence. Your parent waved from the door.' },
      { text: 'Hold their hand to the door', effect: (p) => ({ happiness: Math.min(100, p.happiness + 6), parents: p.parents.map(par => ({ ...par, relationship: Math.min(100, par.relationship + 4) })) }), message: 'Your parent walked you in and gave you a big hug goodbye.' },
      { text: 'Feel nervous but try', effect: (p) => ({ happiness: Math.min(100, p.happiness + 5), smarts: Math.min(100, p.smarts + 3) }), message: 'You were nervous but your parent\'s encouragement helped. You made it!' }
    ]
  },
  {
    id: 'pc_teach_driving',
    title: 'Driving Lessons',
    description: 'Your parent teaches you to drive!',
    minAge: 15, maxAge: 17,
    condition: (p) => p.parents.some(par => !par.isDead && par.relationship > 30),
    options: [
      { text: 'Focus and learn', effect: (p) => ({ smarts: Math.min(100, p.smarts + 3), skills: { ...p.skills, driving: Math.min(100, p.skills.driving + 15) }, parents: p.parents.map(par => ({ ...par, relationship: Math.min(100, par.relationship + 3) })) }), message: 'You drove carefully and learned a lot!' },
      { text: 'Parallel park', effect: (p) => ({ smarts: Math.min(100, p.smarts + 2), skills: { ...p.skills, driving: Math.min(100, p.skills.driving + 10) } }), message: 'Parallel parking is hard but you\'re getting better!' },
      { text: 'Go on the highway', effect: (p) => ({ happiness: Math.min(100, p.happiness + 8), skills: { ...p.skills, driving: Math.min(100, p.skills.driving + 20) } }), message: 'You drove on the highway for the first time! What a thrill!' }
    ]
  },
  {
    id: 'pc_celebrate_achievement',
    title: 'Celebrating an Achievement',
    description: 'You did something great and your parents celebrate with you!',
    minAge: 4, maxAge: 12,
    condition: (p) => p.parents.some(par => !par.isDead && par.relationship > 30),
    options: [
      { text: 'Feel proud', effect: (p) => ({ happiness: Math.min(100, p.happiness + 15), smarts: Math.min(100, p.smarts + 2) }), message: 'Your parents cheered for you. You feel on top of the world!' },
      { text: 'Thank your parents', effect: (p) => ({ happiness: Math.min(100, p.happiness + 10), parents: p.parents.map(par => ({ ...par, relationship: Math.min(100, par.relationship + 6) })) }), message: 'You thanked your parents for always supporting you.' },
      { text: 'Celebrate with the family', effect: (p) => ({ happiness: Math.min(100, p.happiness + 12), parents: p.parents.map(par => ({ ...par, relationship: Math.min(100, par.relationship + 4) })) }), message: 'The whole family celebrated together!' }
    ]
  },
  {
    id: 'pc_parent_helps_succeed',
    title: 'Parent Helps You Succeed',
    description: 'Your parent goes above and beyond to help you with something important.',
    minAge: 5, maxAge: 12,
    condition: (p) => p.parents.some(par => !par.isDead && par.relationship > 50),
    options: [
      { text: 'Accept their help', effect: (p) => ({ happiness: Math.min(100, p.happiness + 12), smarts: Math.min(100, p.smarts + 3), health: Math.min(100, p.health + 2), parents: p.parents.map(par => ({ ...par, relationship: Math.min(100, par.relationship + 6) })) }), message: 'With your parent\'s help, you achieved something amazing!' },
      { text: 'Learn from them', effect: (p) => ({ smarts: Math.min(100, p.smarts + 5), happiness: Math.min(100, p.happiness + 8) }), message: 'Your parent taught you valuable lessons that will last a lifetime.' },
      { text: 'Make them proud', effect: (p) => ({ happiness: Math.min(100, p.happiness + 10), karma: Math.min(100, p.karma + 5), parents: p.parents.map(par => ({ ...par, relationship: Math.min(100, par.relationship + 8) })) }), message: 'You made your parent incredibly proud. They couldn\'t stop smiling.' }
    ]
  }
];
