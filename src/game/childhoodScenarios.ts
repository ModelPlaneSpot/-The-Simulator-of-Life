import { Scenario } from './types';

export const CHILDHOOD_SCENARIOS: Scenario[] = [
  // 0-2
  {
    id: 'baby_crying_all_night',
    title: 'Crying All Night',
    description: 'You won’t stop crying.',
    minAge: 0, maxAge: 2,
    options: [
      { text: 'Parents comfort you', effect: (p) => ({ happiness: Math.min(100, (p.happiness || 0) + 5) }), message: 'Your parents rocked you to sleep.' },
      { text: 'Parents ignore you', effect: (p) => ({ happiness: Math.max(0, (p.happiness || 0) - 5) }), message: 'You cried yourself to sleep.' },
      { text: 'Parents get stressed', effect: (p) => ({ parents: p.parents?.map(parent => ({ ...parent, relationship: Math.max(0, parent.relationship - 5) })) || [] }), message: 'Your crying stressed out your parents.' }
    ]
  },
  {
    id: 'baby_first_food',
    title: 'First Food',
    description: 'You try solid food for the first time.',
    minAge: 0, maxAge: 2,
    options: [
      { text: 'Eat happily', effect: (p) => ({ health: Math.min(100, (p.health || 0) + 2) }), message: 'You loved the mashed peas!' },
      { text: 'Spit it out', effect: (p) => ({ health: Math.max(0, (p.health || 0) - 1) }), message: 'Yuck! You spat it everywhere.' },
      { text: 'Make a mess', effect: (p) => ({ happiness: Math.min(100, (p.happiness || 0) + 1) }), message: 'You smeared food all over your face and laughed.' }
    ]
  },
  {
    id: 'baby_vaccination',
    title: 'Vaccination Day',
    description: 'You go to the doctor for your shots.',
    minAge: 0, maxAge: 2,
    options: [
      { text: 'Stay calm', effect: (p) => ({ health: Math.min(100, (p.health || 0) + 2) }), message: 'You took it like a champ.' },
      { text: 'Cry a lot', effect: (p) => ({ happiness: Math.max(0, (p.happiness || 0) - 2) }), message: 'It hurt so much!' },
      { text: 'Resist', effect: (p) => ({ health: Math.max(0, (p.health || 0) - 1) }), message: 'You squirmed and made it harder.' }
    ]
  },
  {
    id: 'baby_crawling',
    title: 'Learning to Crawl',
    description: 'You try moving around on your own.',
    minAge: 0, maxAge: 2,
    options: [
      { text: 'Try hard', effect: (p) => ({ health: Math.min(100, (p.health || 0) + 2) }), message: 'You made it across the rug!' },
      { text: 'Give up', effect: (p) => ({ health: Math.max(0, (p.health || 0) - 1) }), message: 'Too much effort. You just lay there.' },
      { text: 'Play instead', effect: (p) => ({ happiness: Math.min(100, (p.happiness || 0) + 2) }), message: 'You rolled over and played with your toes.' }
    ]
  },
  {
    id: 'baby_stranger',
    title: 'Stranger Picks You Up',
    description: 'Someone unfamiliar holds you.',
    minAge: 0, maxAge: 2,
    options: [
      { text: 'Stay calm', effect: (p) => ({ smarts: Math.min(100, (p.smarts || 0) + 1) }), message: 'You stared at them curiously.' },
      { text: 'Cry', effect: (p) => ({ happiness: Math.max(0, (p.happiness || 0) - 1) }), message: 'You wanted your parents!' },
      { text: 'Reach for parent', effect: (p) => ({ parents: p.parents?.map(parent => ({ ...parent, relationship: Math.min(100, parent.relationship + 2) })) || [] }), message: 'You reached out for safety.' }
    ]
  },
  {
    id: 'baby_favorite_toy',
    title: 'Favorite Toy',
    description: 'You have a favorite toy you love.',
    minAge: 0, maxAge: 2,
    options: [
      { text: 'Play with it', effect: (p) => ({ happiness: Math.min(100, (p.happiness || 0) + 2) }), message: 'You had a great time playing.' },
      { text: 'Throw it', effect: (p) => ({ smarts: Math.max(0, (p.smarts || 0) - 1) }), message: 'You threw it across the room.' },
      { text: 'Share', effect: (p) => ({ happiness: Math.min(100, (p.happiness || 0) + 2) }), message: 'You let someone else hold it.' }
    ]
  },
  {
    id: 'baby_sleep_schedule',
    title: 'Sleep Schedule',
    description: 'You won’t sleep properly.',
    minAge: 0, maxAge: 2,
    options: [
      { text: 'Parents fix routine', effect: (p) => ({ health: Math.min(100, (p.health || 0) + 2) }), message: 'You finally got some good rest.' },
      { text: 'Stay awake', effect: (p) => ({ health: Math.max(0, (p.health || 0) - 2) }), message: 'You stayed up all night.' },
      { text: 'Random sleep', effect: (p) => ({ happiness: Math.min(100, (p.happiness || 0) + 1) }), message: 'You slept whenever you felt like it.' }
    ]
  },
  {
    id: 'baby_bath_time',
    title: 'Bath Time',
    description: 'It is time for a bath.',
    minAge: 0, maxAge: 2,
    options: [
      { text: 'Enjoy', effect: (p) => ({ happiness: Math.min(100, (p.happiness || 0) + 2) }), message: 'You loved the warm water.' },
      { text: 'Cry', effect: (p) => ({ happiness: Math.max(0, (p.happiness || 0) - 2) }), message: 'You hated getting wet.' },
      { text: 'Splash', effect: (p) => ({ happiness: Math.min(100, (p.happiness || 0) + 1) }), message: 'You splashed water everywhere!' }
    ]
  },
  {
    id: 'baby_first_word',
    title: 'First Word Attempt',
    description: 'You try to speak.',
    minAge: 0, maxAge: 2,
    options: [
      { text: 'Try hard', effect: (p) => ({ smarts: Math.min(100, (p.smarts || 0) + 2) }), message: 'You managed to say a real word!' },
      { text: 'Stay quiet', effect: (p) => ({}), message: 'You decided not to speak yet.' },
      { text: 'Babble', effect: (p) => ({ happiness: Math.min(100, (p.happiness || 0) + 1) }), message: 'You made funny noises.' }
    ]
  },
  {
    id: 'baby_dropping_food',
    title: 'Dropping Food',
    description: 'You drop food repeatedly from your high chair.',
    minAge: 0, maxAge: 2,
    options: [
      { text: 'Laugh', effect: (p) => ({ happiness: Math.min(100, (p.happiness || 0) + 2) }), message: 'You found it hilarious.' },
      { text: 'Parent scolds', effect: (p) => ({ happiness: Math.max(0, (p.happiness || 0) - 2) }), message: 'Your parents were not amused.' },
      { text: 'Try to eat', effect: (p) => ({ health: Math.min(100, (p.health || 0) + 1) }), message: 'You managed to get some in your mouth.' }
    ]
  },
  {
    id: 'baby_teething',
    title: 'Teething Pain',
    description: 'Your new teeth are coming in and it hurts.',
    minAge: 0, maxAge: 2,
    options: [
      { text: 'Seek comfort', effect: (p) => ({ happiness: Math.min(100, (p.happiness || 0) + 1) }), message: 'Your parents gave you a teething ring.' },
      { text: 'Cry loudly', effect: (p) => ({ happiness: Math.max(0, (p.happiness || 0) - 2) }), message: 'It hurts so much!' },
      { text: 'Ignore it', effect: (p) => ({ health: Math.min(100, (p.health || 0) + 1) }), message: 'You powered through the pain.' }
    ]
  },
  {
    id: 'baby_loud_noise',
    title: 'Loud Noise',
    description: 'A sudden loud noise scares you.',
    minAge: 0, maxAge: 2,
    options: [
      { text: 'Hide', effect: (p) => ({ happiness: Math.max(0, (p.happiness || 0) - 1) }), message: 'You hid under a blanket.' },
      { text: 'Cry', effect: (p) => ({ happiness: Math.max(0, (p.happiness || 0) - 2) }), message: 'You burst into tears.' },
      { text: 'Stay calm', effect: (p) => ({ smarts: Math.min(100, (p.smarts || 0) + 1) }), message: 'You realized it was just a truck outside.' }
    ]
  },
  {
    id: 'baby_first_steps',
    title: 'First Steps',
    description: 'You try to walk on two legs.',
    minAge: 0, maxAge: 2,
    options: [
      { text: 'Try hard', effect: (p) => ({ health: Math.min(100, (p.health || 0) + 2) }), message: 'You took three steps before falling!' },
      { text: 'Fall and cry', effect: (p) => ({ happiness: Math.max(0, (p.happiness || 0) - 1) }), message: 'Ouch! That hurt.' },
      { text: 'Crawl instead', effect: (p) => ({ smarts: Math.min(100, (p.smarts || 0) + 1) }), message: 'Crawling is much faster anyway.' }
    ]
  },
  {
    id: 'baby_peekaboo',
    title: 'Playing Peekaboo',
    description: 'Someone is playing peekaboo with you.',
    minAge: 0, maxAge: 2,
    options: [
      { text: 'Laugh', effect: (p) => ({ happiness: Math.min(100, (p.happiness || 0) + 2) }), message: 'Where did they go? There they are!' },
      { text: 'Ignore', effect: (p) => ({ smarts: Math.min(100, (p.smarts || 0) + 1) }), message: 'You know they are just hiding behind their hands.' },
      { text: 'Cry', effect: (p) => ({ happiness: Math.max(0, (p.happiness || 0) - 1) }), message: 'They disappeared! You got scared.' }
    ]
  },
  {
    id: 'baby_parent_leaves',
    title: 'Parent Leaves Room',
    description: 'Your parent walks out of the room.',
    minAge: 0, maxAge: 2,
    options: [
      { text: 'Cry', effect: (p) => ({ happiness: Math.max(0, (p.happiness || 0) - 2) }), message: 'Don\'t leave me!' },
      { text: 'Wait patiently', effect: (p) => ({ smarts: Math.min(100, (p.smarts || 0) + 1) }), message: 'You knew they would come back.' },
      { text: 'Follow them', effect: (p) => ({ health: Math.min(100, (p.health || 0) + 1) }), message: 'You crawled after them as fast as you could.' }
    ]
  },
  {
    id: 'baby_sharing_toy',
    title: 'Sharing Toy',
    description: 'Another baby wants your toy.',
    minAge: 0, maxAge: 2,
    options: [
      { text: 'Share', effect: (p) => ({ happiness: Math.min(100, (p.happiness || 0) + 1) }), message: 'You let them play with it.' },
      { text: 'Grab it back', effect: (p) => ({ happiness: Math.min(100, (p.happiness || 0) + 1) }), message: 'Mine!' },
      { text: 'Cry', effect: (p) => ({ happiness: Math.max(0, (p.happiness || 0) - 1) }), message: 'You didn\'t know what to do, so you cried.' }
    ]
  },
  {
    id: 'baby_messy_diaper',
    title: 'Messy Diaper',
    description: 'You have a dirty diaper.',
    minAge: 0, maxAge: 2,
    options: [
      { text: 'Get cleaned', effect: (p) => ({ health: Math.min(100, (p.health || 0) + 1) }), message: 'Ah, much better.' },
      { text: 'Cry loudly', effect: (p) => ({ happiness: Math.max(0, (p.happiness || 0) - 1) }), message: 'Change me now!' },
      { text: 'Ignore it', effect: (p) => ({ health: Math.max(0, (p.health || 0) - 1) }), message: 'You sat in it for a while.' }
    ]
  },
  {
    id: 'baby_playing_pet',
    title: 'Playing with Pet',
    description: 'The family pet comes up to you.',
    minAge: 0, maxAge: 2,
    options: [
      { text: 'Be gentle', effect: (p) => ({ happiness: Math.min(100, (p.happiness || 0) + 2) }), message: 'You gently patted the pet.' },
      { text: 'Be rough', effect: (p) => ({ health: Math.max(0, (p.health || 0) - 1) }), message: 'You pulled its tail and it nipped you.' },
      { text: 'Be scared', effect: (p) => ({ happiness: Math.max(0, (p.happiness || 0) - 1) }), message: 'You cried and crawled away.' }
    ]
  },
  {
    id: 'baby_first_laugh',
    title: 'First Laugh',
    description: 'Something funny happens.',
    minAge: 0, maxAge: 2,
    options: [
      { text: 'Laugh out loud', effect: (p) => ({ happiness: Math.min(100, (p.happiness || 0) + 3) }), message: 'You let out a big belly laugh!' },
      { text: 'Stay quiet', effect: (p) => ({}), message: 'You just stared.' },
      { text: 'Look confused', effect: (p) => ({ smarts: Math.min(100, (p.smarts || 0) + 1) }), message: 'You didn\'t understand why everyone was laughing.' }
    ]
  },
  {
    id: 'baby_mirror',
    title: 'Mirror Reflection',
    description: 'You see yourself in the mirror.',
    minAge: 0, maxAge: 2,
    options: [
      { text: 'Smile at baby', effect: (p) => ({ happiness: Math.min(100, (p.happiness || 0) + 2) }), message: 'You made a new friend!' },
      { text: 'Look confused', effect: (p) => ({ smarts: Math.min(100, (p.smarts || 0) + 1) }), message: 'Who is that?' },
      { text: 'Cry', effect: (p) => ({ happiness: Math.max(0, (p.happiness || 0) - 1) }), message: 'The other baby scared you.' }
    ]
  },

  // Toddler 3-4
  {
    id: 'toddler_tantrum',
    title: 'Tantrum in Store',
    description: 'You want candy at the grocery store.',
    minAge: 3, maxAge: 4,
    options: [
      { text: 'Cry loudly', effect: (p) => ({ happiness: Math.min(100, (p.happiness || 0) + 2) }), message: 'You threw a massive fit.' },
      { text: 'Accept no', effect: (p) => ({ smarts: Math.min(100, (p.smarts || 0) + 2) }), message: 'You accepted that you couldn\'t have it.' },
      { text: 'Sneak candy', effect: (p) => ({ happiness: Math.min(100, (p.happiness || 0) + 3) }), message: 'You managed to eat some without them noticing.' }
    ]
  },
  {
    id: 'toddler_drawing_wall',
    title: 'Drawing on Wall',
    description: 'You drew a masterpiece on the living room wall.',
    minAge: 3, maxAge: 4,
    options: [
      { text: 'Admit it', effect: (p) => ({ smarts: Math.min(100, (p.smarts || 0) + 2) }), message: 'You confessed to your crime.' },
      { text: 'Blame sibling', effect: (p) => ({ happiness: Math.max(0, (p.happiness || 0) - 2) }), message: 'You blamed the dog/sibling.' },
      { text: 'Hide it', effect: (p) => ({ smarts: Math.max(0, (p.smarts || 0) - 1) }), message: 'You tried to cover it up with a pillow.' }
    ]
  },
  {
    id: 'toddler_sharing',
    title: 'Sharing Toys',
    description: 'Another child wants to play with your toy.',
    minAge: 3, maxAge: 4,
    options: [
      { text: 'Share', effect: (p) => ({ happiness: Math.min(100, (p.happiness || 0) + 2) }), message: 'You played together nicely.' },
      { text: 'Refuse', effect: (p) => ({ happiness: Math.max(0, (p.happiness || 0) - 1) }), message: 'Mine! You wouldn\'t let them touch it.' },
      { text: 'Trade', effect: (p) => ({ smarts: Math.min(100, (p.smarts || 0) + 2) }), message: 'You negotiated a fair trade.' }
    ]
  },
  {
    id: 'toddler_first_friend',
    title: 'First Friend',
    description: 'You meet a new kid at the park.',
    minAge: 3, maxAge: 4,
    options: [
      { text: 'Talk to them', effect: (p) => ({ happiness: Math.min(100, (p.happiness || 0) + 2) }), message: 'You said hello.' },
      { text: 'Ignore them', effect: (p) => ({ happiness: Math.max(0, (p.happiness || 0) - 1) }), message: 'You played by yourself.' },
      { text: 'Play together', effect: (p) => ({ happiness: Math.min(100, (p.happiness || 0) + 4) }), message: 'You had a blast playing tag.' }
    ]
  },
  {
    id: 'toddler_bedtime',
    title: 'Bedtime Refusal',
    description: 'You don’t want to go to sleep.',
    minAge: 3, maxAge: 4,
    options: [
      { text: 'Obey', effect: (p) => ({ health: Math.min(100, (p.health || 0) + 2) }), message: 'You went to sleep and felt rested.' },
      { text: 'Stay awake', effect: (p) => ({ health: Math.max(0, (p.health || 0) - 2) }), message: 'You were grumpy the next day.' },
      { text: 'Sneak play', effect: (p) => ({ happiness: Math.min(100, (p.happiness || 0) + 2) }), message: 'You played quietly in the dark.' }
    ]
  },
  {
    id: 'toddler_abcs',
    title: 'Learning ABCs',
    description: 'Your parents are trying to teach you the alphabet.',
    minAge: 3, maxAge: 4,
    options: [
      { text: 'Practice', effect: (p) => ({ smarts: Math.min(100, (p.smarts || 0) + 3) }), message: 'You learned a few letters!' },
      { text: 'Ignore', effect: (p) => ({ smarts: Math.max(0, (p.smarts || 0) - 1) }), message: 'You didn\'t pay attention.' },
      { text: 'Play instead', effect: (p) => ({ happiness: Math.min(100, (p.happiness || 0) + 2) }), message: 'You ran away to play with blocks.' }
    ]
  },
  {
    id: 'toddler_playground_fight',
    title: 'Playground Fight',
    description: 'Another kid pushes you at the playground.',
    minAge: 3, maxAge: 4,
    options: [
      { text: 'Fight back', effect: (p) => ({ health: Math.max(0, (p.health || 0) - 2) }), message: 'You got into a scuffle.' },
      { text: 'Tell adult', effect: (p) => ({ smarts: Math.min(100, (p.smarts || 0) + 1) }), message: 'The adult handled the situation.' },
      { text: 'Walk away', effect: (p) => ({ happiness: Math.min(100, (p.happiness || 0) + 1) }), message: 'You went to play somewhere else.' }
    ]
  },
  {
    id: 'toddler_picky_eating',
    title: 'Picky Eating',
    description: 'There are vegetables on your plate.',
    minAge: 3, maxAge: 4,
    options: [
      { text: 'Eat veggies', effect: (p) => ({ health: Math.min(100, (p.health || 0) + 2) }), message: 'You ate them and grew stronger.' },
      { text: 'Refuse', effect: (p) => ({ health: Math.max(0, (p.health || 0) - 1) }), message: 'You went to bed hungry.' },
      { text: 'Hide food', effect: (p) => ({ smarts: Math.min(100, (p.smarts || 0) + 1) }), message: 'You hid them under your napkin.' }
    ]
  },
  {
    id: 'toddler_helping',
    title: 'Helping Parent',
    description: 'Your parent is cleaning up.',
    minAge: 3, maxAge: 4,
    options: [
      { text: 'Help out', effect: (p) => ({ happiness: Math.min(100, (p.happiness || 0) + 1) }), message: 'You helped put away toys.' },
      { text: 'Refuse', effect: (p) => ({ happiness: Math.max(0, (p.happiness || 0) - 1) }), message: 'You kept playing.' },
      { text: 'Mess up', effect: (p) => ({ happiness: Math.max(0, (p.happiness || 0) - 1) }), message: 'You tried to help but made a bigger mess.' }
    ]
  },
  {
    id: 'toddler_toy_breaks',
    title: 'Toy Breaks',
    description: 'Your favorite toy breaks.',
    minAge: 3, maxAge: 4,
    options: [
      { text: 'Cry', effect: (p) => ({ happiness: Math.max(0, (p.happiness || 0) - 2) }), message: 'You were devastated.' },
      { text: 'Try to fix it', effect: (p) => ({ smarts: Math.min(100, (p.smarts || 0) + 2) }), message: 'You managed to snap the pieces back together.' },
      { text: 'Ignore it', effect: (p) => ({}), message: 'You moved on to another toy.' }
    ]
  },

  // Childhood 5-7
  {
    id: 'child_lost_toy',
    title: 'Lost Toy',
    description: 'You can’t find your favorite toy.',
    minAge: 5, maxAge: 7,
    options: [
      { text: 'Cry', effect: (p) => ({ happiness: Math.max(0, (p.happiness || 0) - 2) }), message: 'You cried until someone found it for you.' },
      { text: 'Search', effect: (p) => ({ smarts: Math.min(100, (p.smarts || 0) + 2) }), message: 'You retraced your steps and found it!' },
      { text: 'Blame sibling', effect: (p) => ({ happiness: Math.max(0, (p.happiness || 0) - 2) }), message: 'You got in trouble for falsely accusing them.' }
    ]
  },
  {
    id: 'child_first_day_school',
    title: 'First Day of School',
    description: 'You feel nervous on your first day.',
    minAge: 5, maxAge: 7,
    options: [
      { text: 'Talk to classmates', effect: (p) => ({ happiness: Math.min(100, (p.happiness || 0) + 3) }), message: 'You made some new friends!' },
      { text: 'Stay quiet', effect: (p) => ({ happiness: Math.max(0, (p.happiness || 0) - 1) }), message: 'You kept to yourself all day.' },
      { text: 'Sit with teacher', effect: (p) => ({ smarts: Math.min(100, (p.smarts || 0) + 1) }), message: 'You stayed close to the teacher for safety.' }
    ]
  },
  {
    id: 'child_sharing_snacks',
    title: 'Sharing Snacks',
    description: 'A classmate asks for your snack.',
    minAge: 5, maxAge: 7,
    options: [
      { text: 'Share', effect: (p) => ({ happiness: Math.min(100, (p.happiness || 0) + 2) }), message: 'You shared and felt good about it.' },
      { text: 'Refuse', effect: (p) => ({ happiness: Math.max(0, (p.happiness || 0) - 1) }), message: 'You kept it all for yourself.' },
      { text: 'Trade', effect: (p) => ({ smarts: Math.min(100, (p.smarts || 0) + 1) }), message: 'You traded for something even better.' }
    ]
  },
  {
    id: 'child_coloring',
    title: 'Coloring Outside the Lines',
    description: 'The teacher notices your messy drawing.',
    minAge: 5, maxAge: 7,
    options: [
      { text: 'Try again', effect: (p) => ({ smarts: Math.min(100, (p.smarts || 0) + 2) }), message: 'You practiced and got better.' },
      { text: 'Ignore', effect: (p) => ({ smarts: Math.max(0, (p.smarts || 0) - 1) }), message: 'You didn\'t care about staying in the lines.' },
      { text: 'Joke about it', effect: (p) => ({ happiness: Math.min(100, (p.happiness || 0) + 2) }), message: 'You said it was abstract art.' }
    ]
  },
  {
    id: 'child_playground_fall',
    title: 'Playground Fall',
    description: 'You fall while playing tag.',
    minAge: 5, maxAge: 7,
    options: [
      { text: 'Tell teacher', effect: (p) => ({ health: Math.min(100, (p.health || 0) + 2) }), message: 'They gave you a bandage.' },
      { text: 'Ignore it', effect: (p) => ({ health: Math.max(0, (p.health || 0) - 2) }), message: 'It got infected later.' },
      { text: 'Blame someone', effect: (p) => ({ happiness: Math.max(0, (p.happiness || 0) - 1) }), message: 'You lied and said someone pushed you.' }
    ]
  },

  // Growing Awareness 8-10
  {
    id: 'kid_bully',
    title: 'Bully Pushes You',
    description: 'A bully pushes you in the hallway.',
    minAge: 8, maxAge: 10,
    options: [
      { text: 'Fight back', effect: (p) => ({ health: Math.max(0, (p.health || 0) - 5), happiness: Math.max(0, (p.happiness || 0) - 5) }), message: 'You got into a fight and got suspended.' },
      { text: 'Tell a teacher', effect: (p) => ({ smarts: Math.min(100, (p.smarts || 0) + 2) }), message: 'The teacher handled the bully.' },
      { text: 'Ignore them', effect: (p) => ({ happiness: Math.max(0, (p.happiness || 0) - 2) }), message: 'You walked away, but felt bad.' }
    ]
  },
  {
    id: 'kid_homework',
    title: 'Homework Forgotten',
    description: 'You forgot to do your homework.',
    minAge: 8, maxAge: 10,
    options: [
      { text: 'Admit it', effect: (p) => ({ smarts: Math.min(100, (p.smarts || 0) + 1) }), message: 'You told the truth and took the zero.' },
      { text: 'Lie', effect: (p) => ({ happiness: Math.max(0, (p.happiness || 0) - 2) }), message: 'You got caught lying.' },
      { text: 'Copy a friend', effect: (p) => ({ smarts: Math.max(0, (p.smarts || 0) - 2) }), message: 'You copied, but didn\'t learn anything.' }
    ]
  },
  {
    id: 'kid_group_project',
    title: 'Group Project',
    description: 'You are assigned a group project.',
    minAge: 8, maxAge: 10,
    options: [
      { text: 'Lead the group', effect: (p) => ({ smarts: Math.min(100, (p.smarts || 0) + 3) }), message: 'You took charge and got an A!' },
      { text: 'Slack off', effect: (p) => ({ smarts: Math.max(0, (p.smarts || 0) - 2) }), message: 'Your group was mad at you.' },
      { text: 'Help others', effect: (p) => ({ happiness: Math.min(100, (p.happiness || 0) + 2) }), message: 'You were a great team player.' }
    ]
  },
  {
    id: 'kid_school_trip',
    title: 'School Trip',
    description: 'There is a school trip to the museum.',
    minAge: 8, maxAge: 10,
    options: [
      { text: 'Go and learn', effect: (p) => ({ smarts: Math.min(100, (p.smarts || 0) + 3) }), message: 'You learned a lot about dinosaurs.' },
      { text: 'Stay home', effect: (p) => ({ happiness: Math.max(0, (p.happiness || 0) - 2) }), message: 'You missed out on the fun.' },
      { text: 'Complain', effect: (p) => ({ happiness: Math.max(0, (p.happiness || 0) - 2) }), message: 'You ruined the trip for everyone.' }
    ]
  },
  {
    id: 'kid_friend_lies',
    title: 'Friend Lies',
    description: 'You catch your friend lying to the teacher.',
    minAge: 8, maxAge: 10,
    options: [
      { text: 'Confront them', effect: (p) => ({ smarts: Math.min(100, (p.smarts || 0) + 1) }), message: 'You told them they shouldn\'t lie.' },
      { text: 'Ignore it', effect: (p) => ({}), message: 'You minded your own business.' },
      { text: 'Tell others', effect: (p) => ({ happiness: Math.max(0, (p.happiness || 0) - 2) }), message: 'You started a rumor.' }
    ]
  },

  // Pre-Teen 11-13
  {
    id: 'preteen_crush',
    title: 'First Crush',
    description: 'You have a crush on someone in your class.',
    minAge: 11, maxAge: 13,
    options: [
      { text: 'Confess', effect: (p) => ({ happiness: Math.min(100, (p.happiness || 0) + 5) }), message: 'They liked you back!' },
      { text: 'Ignore feelings', effect: (p) => ({ happiness: Math.max(0, (p.happiness || 0) - 2) }), message: 'You kept it a secret.' },
      { text: 'Tease them', effect: (p) => ({ happiness: Math.max(0, (p.happiness || 0) - 2) }), message: 'They thought you were mean.' }
    ]
  },
  {
    id: 'preteen_social_pressure',
    title: 'Social Pressure',
    description: 'Your friends want you to sneak out.',
    minAge: 11, maxAge: 13,
    options: [
      { text: 'Follow friends', effect: (p) => ({ happiness: Math.max(0, (p.happiness || 0) - 5) }), message: 'You got caught and grounded.' },
      { text: 'Refuse', effect: (p) => ({ smarts: Math.min(100, (p.smarts || 0) + 2) }), message: 'You made the smart choice.' },
      { text: 'Leave', effect: (p) => ({ happiness: Math.max(0, (p.happiness || 0) - 2) }), message: 'You went home early.' }
    ]
  },
  {
    id: 'preteen_online_account',
    title: 'Online Account',
    description: 'Everyone is getting a new social media app.',
    minAge: 11, maxAge: 13,
    options: [
      { text: 'Create one', effect: (p) => ({ happiness: Math.min(100, (p.happiness || 0) + 2) }), message: 'You connected with friends.' },
      { text: 'Lie about age', effect: (p) => ({ smarts: Math.max(0, (p.smarts || 0) - 2) }), message: 'You got banned for lying.' },
      { text: 'Avoid it', effect: (p) => ({ smarts: Math.min(100, (p.smarts || 0) + 1) }), message: 'You stayed off the drama.' }
    ]
  },
  {
    id: 'preteen_argument',
    title: 'Argument with Parent',
    description: 'You got into a big fight with your parents.',
    minAge: 11, maxAge: 13,
    options: [
      { text: 'Apologize', effect: (p) => ({ happiness: Math.min(100, (p.happiness || 0) + 2) }), message: 'You made up.' },
      { text: 'Argue more', effect: (p) => ({ happiness: Math.max(0, (p.happiness || 0) - 5) }), message: 'You got grounded.' },
      { text: 'Ignore them', effect: (p) => ({ happiness: Math.max(0, (p.happiness || 0) - 2) }), message: 'Things were awkward for days.' }
    ]
  },
  {
    id: 'preteen_failing_test',
    title: 'Failing Test',
    description: 'You failed a major math test.',
    minAge: 11, maxAge: 13,
    options: [
      { text: 'Study harder', effect: (p) => ({ smarts: Math.min(100, (p.smarts || 0) + 5) }), message: 'You aced the retake!' },
      { text: 'Cheat next time', effect: (p) => ({ smarts: Math.max(0, (p.smarts || 0) - 5) }), message: 'You got caught cheating.' },
      { text: 'Give up', effect: (p) => ({ smarts: Math.max(0, (p.smarts || 0) - 2) }), message: 'Your grades slipped further.' }
    ]
  },

  // Teen 14-17
  {
    id: 'teen_party',
    title: 'Party Invitation',
    description: 'You are invited to a high school party.',
    minAge: 14, maxAge: 17,
    options: [
      { text: 'Go', effect: (p) => ({ happiness: Math.min(100, (p.happiness || 0) + 5) }), message: 'You had a great time!' },
      { text: 'Decline', effect: (p) => ({ smarts: Math.min(100, (p.smarts || 0) + 2) }), message: 'You stayed home and studied.' },
      { text: 'Sneak out', effect: (p) => ({ happiness: Math.max(0, (p.happiness || 0) - 5) }), message: 'You got caught sneaking back in.' }
    ]
  },
  {
    id: 'teen_cheating',
    title: 'Cheating Opportunity',
    description: 'Someone offers you the answers to the final exam.',
    minAge: 14, maxAge: 17,
    options: [
      { text: 'Cheat', effect: (p) => ({ smarts: Math.max(0, (p.smarts || 0) - 5) }), message: 'You got caught and failed the class.' },
      { text: 'Study instead', effect: (p) => ({ smarts: Math.min(100, (p.smarts || 0) + 5) }), message: 'You earned your good grade.' },
      { text: 'Skip exam', effect: (p) => ({ smarts: Math.max(0, (p.smarts || 0) - 10) }), message: 'You failed by default.' }
    ]
  },
  {
    id: 'teen_driving',
    title: 'Driving Lesson',
    description: 'It is time for your first driving lesson.',
    minAge: 14, maxAge: 17,
    options: [
      { text: 'Practice safely', effect: (p) => ({ smarts: Math.min(100, (p.smarts || 0) + 2) }), message: 'You did great!' },
      { text: 'Quit', effect: (p) => ({ happiness: Math.max(0, (p.happiness || 0) - 2) }), message: 'You decided not to learn.' },
      { text: 'Rush it', effect: (p) => ({ health: Math.max(0, (p.health || 0) - 5) }), message: 'You got into a fender bender.' }
    ]
  },
  {
    id: 'teen_job',
    title: 'Job Offer',
    description: 'You are offered a part-time job at a fast food place.',
    minAge: 14, maxAge: 17,
    options: [
      { text: 'Accept', effect: (p) => ({ money: (p.money || 0) + 500 }), message: 'You made some extra cash!' },
      { text: 'Decline', effect: (p) => ({ happiness: Math.min(100, (p.happiness || 0) + 2) }), message: 'You enjoyed your free time.' },
      { text: 'Negotiate', effect: (p) => ({ money: (p.money || 0) + 600 }), message: 'You managed to get a slightly higher wage.' }
    ]
  },
  {
    id: 'teen_relationship',
    title: 'Relationship Drama',
    description: 'Your partner is upset with you.',
    minAge: 14, maxAge: 17,
    condition: (p) => p.partner !== undefined,
    options: [
      { text: 'Fix it', effect: (p) => ({ happiness: Math.min(100, (p.happiness || 0) + 5) }), message: 'You talked it out and made up.' },
      { text: 'Argue', effect: (p) => ({ happiness: Math.max(0, (p.happiness || 0) - 5) }), message: 'Things got worse.' },
      { text: 'Break up', effect: (p) => ({ happiness: Math.max(0, (p.happiness || 0) - 10), partner: undefined }), message: 'You ended the relationship.' }
    ]
  }
];
