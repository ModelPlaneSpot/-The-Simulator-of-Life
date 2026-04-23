import { Scenario } from './types';

import { CHILDHOOD_SCENARIOS } from './childhoodScenarios';
import { PARENT_CHILD_ACTIVITIES } from './parentChildActivities';

export const SCENARIOS: Scenario[] = [
  ...CHILDHOOD_SCENARIOS,
  ...PARENT_CHILD_ACTIVITIES,
  // Toxic Parent Scenarios
  {
    id: 'toxic_parents_allowance',
    title: 'Stolen Allowance',
    description: 'Your parents demand you give them the allowance you saved up, claiming they "need it for bills" but you saw them buy luxury items.',
    minAge: 8,
    maxAge: 16,
    condition: (player) => player.parents.some(p => p.relationship < 40 && !p.isDead),
    options: [
      {
        text: 'Give it to them',
        effect: (player) => ({ money: Math.max(0, player.money - 50), happiness: Math.max(0, (player.happiness || 0) - 15) }),
        message: 'You handed over your money. They didn\'t even say thank you.'
      },
      {
        text: 'Refuse and hide it',
        effect: (player) => ({ 
          happiness: Math.max(0, (player.happiness || 0) - 10),
          parents: player.parents.map(p => ({ ...p, relationship: Math.max(0, p.relationship - 10) }))
        }),
        message: 'You hid your money. They screamed at you for being selfish.'
      }
    ]
  },
  {
    id: 'toxic_parents_comparison',
    title: 'Unfair Comparison',
    description: 'Your parents spend dinner comparing you to your cousin, asking why you can\'t be more like them.',
    minAge: 10,
    maxAge: 18,
    condition: (player) => player.parents.some(p => p.relationship < 40 && !p.isDead),
    options: [
      {
        text: 'Stay silent and take it',
        effect: (player) => ({ happiness: Math.max(0, (player.happiness || 0) - 15), stress: Math.min(100, (player.stress || 0) + 10) }),
        message: 'You stared at your plate while they insulted you.'
      },
      {
        text: 'Argue back',
        effect: (player) => ({ 
          happiness: Math.max(0, (player.happiness || 0) - 5),
          parents: player.parents.map(p => ({ ...p, relationship: Math.max(0, p.relationship - 15) }))
        }),
        message: 'You defended yourself, which turned into a massive screaming match.'
      }
    ]
  },
  {
    id: 'toxic_parents_privacy',
    title: 'Invaded Privacy',
    description: 'You come home from school to find your parents reading your private diary and mocking what you wrote.',
    minAge: 12,
    maxAge: 17,
    condition: (player) => player.parents.some(p => p.relationship < 40 && !p.isDead),
    options: [
      {
        text: 'Snatch it back and yell',
        effect: (player) => ({ 
          happiness: Math.max(0, (player.happiness || 0) - 10),
          parents: player.parents.map(p => ({ ...p, relationship: Math.max(0, p.relationship - 20) }))
        }),
        message: 'You grabbed your diary. They grounded you for "disrespect".'
      },
      {
        text: 'Cry and run away',
        effect: (player) => ({ happiness: Math.max(0, (player.happiness || 0) - 20) }),
        message: 'You ran to your room in tears, feeling completely violated.'
      }
    ]
  },
  {
    id: 'toxic_parents_missing_event',
    title: 'Empty Seats',
    description: 'You look out into the audience at your school play. Your parents promised they would come, but their seats are empty.',
    minAge: 7,
    maxAge: 15,
    condition: (player) => player.parents.some(p => p.relationship < 40 && !p.isDead),
    options: [
      {
        text: 'Perform anyway',
        effect: (player) => ({ smarts: Math.min(100, (player.smarts || 0) + 5), happiness: Math.max(0, (player.happiness || 0) - 15) }),
        message: 'You did your best, but your heart wasn\'t in it.'
      },
      {
        text: 'Refuse to go on stage',
        effect: (player) => ({ happiness: Math.max(0, (player.happiness || 0) - 20), popularity: Math.max(0, (player.popularity || 0) - 10) }),
        message: 'You hid backstage crying. The teacher had to skip your part.'
      }
    ]
  },
  {
    id: 'toxic_parents_blame',
    title: 'Scapegoat',
    description: 'Your parents broke an expensive vase, but they are blaming you for it to avoid taking responsibility.',
    minAge: 6,
    maxAge: 16,
    condition: (player) => player.parents.some(p => p.relationship < 40 && !p.isDead),
    options: [
      {
        text: 'Take the blame',
        effect: (player) => ({ happiness: Math.max(0, (player.happiness || 0) - 15), karma: Math.min(100, (player.karma || 0) + 5) }),
        message: 'You accepted the punishment to keep the peace.'
      },
      {
        text: 'Tell the truth',
        effect: (player) => ({ 
          happiness: Math.max(0, (player.happiness || 0) - 10),
          parents: player.parents.map(p => ({ ...p, relationship: Math.max(0, p.relationship - 15) }))
        }),
        message: 'You called them out. They punished you double for "lying".'
      }
    ]
  },
  {
    id: 'toxic_parents_demand_money',
    title: 'Financial Leech',
    description: 'Your toxic parents call you out of the blue. They aren\'t checking in on you; they just want you to "lend" them $5,000.',
    minAge: 20,
    condition: (player) => player.money >= 5000 && player.parents.some(p => p.relationship < 40 && !p.isDead),
    options: [
      {
        text: 'Give them the money',
        effect: (player) => ({ 
          money: player.money - 5000, 
          parents: player.parents.map(p => ({ ...p, relationship: Math.min(100, p.relationship + 10) }))
        }),
        message: 'You transferred the money. You know you\'ll never see it again.'
      },
      {
        text: 'Refuse',
        effect: (player) => ({ 
          happiness: Math.min(100, (player.happiness || 0) + 5),
          parents: player.parents.map(p => ({ ...p, relationship: Math.max(0, p.relationship - 20) }))
        }),
        message: 'You said no. They called you ungrateful and hung up.'
      }
    ]
  },
  {
    id: 'toxic_parents_meet_kids',
    title: 'Grandparent Rights?',
    description: 'Your toxic parents, who you barely speak to, are demanding to meet your children and play "happy grandparents".',
    minAge: 22,
    condition: (player) => player.kids.length > 0 && player.parents.some(p => p.relationship < 30 && !p.isDead),
    options: [
      {
        text: 'Let them visit',
        effect: (player) => ({ 
          happiness: Math.max(0, (player.happiness || 0) - 15),
          stress: Math.min(100, (player.stress || 0) + 20)
        }),
        message: 'The visit was a disaster. They criticized your parenting the whole time.'
      },
      {
        text: 'Protect your kids (Refuse)',
        effect: (player) => ({ 
          happiness: Math.min(100, (player.happiness || 0) + 10),
          parents: player.parents.map(p => ({ ...p, relationship: Math.max(0, p.relationship - 20) }))
        }),
        message: 'You refused to let their toxicity near your children. You feel empowered.'
      }
    ]
  },
  {
    id: 'toxic_parents_uninvited',
    title: 'Uninvited Guests',
    description: 'Your toxic parents show up at your house unannounced, demanding to stay for the weekend.',
    minAge: 19,
    condition: (player) => player.parents.some(p => p.relationship < 40 && !p.isDead),
    options: [
      {
        text: 'Let them in',
        effect: (player) => ({ 
          happiness: Math.max(0, (player.happiness || 0) - 20),
          stress: Math.min(100, (player.stress || 0) + 25)
        }),
        message: 'They stayed for the weekend and complained about everything in your house.'
      },
      {
        text: 'Turn them away',
        effect: (player) => ({ 
          happiness: Math.min(100, (player.happiness || 0) + 5),
          parents: player.parents.map(p => ({ ...p, relationship: Math.max(0, p.relationship - 30) }))
        }),
        message: 'You closed the door in their faces. They threw a tantrum on your lawn.'
      }
    ]
  },
  {
    id: 'toxic_parents_cut_off',
    title: 'The Final Straw',
    description: 'After years of emotional abuse and manipulation, you are considering cutting your toxic parents out of your life completely.',
    minAge: 18,
    condition: (player) => player.parents.some(p => p.relationship < 20 && !p.isDead),
    options: [
      {
        text: 'Go No Contact',
        effect: (player) => ({ 
          happiness: Math.min(100, (player.happiness || 0) + 30),
          stress: Math.max(0, (player.stress || 0) - 30),
          parents: player.parents.map(p => ({ ...p, relationship: 0, isDead: true, name: p.name + ' (Estranged)' }))
        }),
        message: 'You blocked their numbers and cut them off. A massive weight has been lifted from your shoulders.'
      },
      {
        text: 'Keep trying to fix them',
        effect: (player) => ({ 
          happiness: Math.max(0, (player.happiness || 0) - 20),
          stress: Math.min(100, (player.stress || 0) + 20)
        }),
        message: 'You keep trying, but they just keep hurting you.'
      }
    ]
  },
  {
    id: 'toxic_parents_guilt_trip',
    title: 'Elder Care Guilt',
    description: 'Your toxic parents are getting older. They are guilt-tripping you, saying you "owe" them for raising you and must take care of them.',
    minAge: 35,
    condition: (player) => player.parents.some(p => p.age > 65 && p.relationship < 40 && !p.isDead),
    options: [
      {
        text: 'Move them in',
        effect: (player) => ({ 
          happiness: Math.max(0, (player.happiness || 0) - 30),
          stress: Math.min(100, (player.stress || 0) + 40)
        }),
        message: 'You moved them in. Your life is now a living hell of constant demands and complaints.'
      },
      {
        text: 'Put them in a cheap home',
        effect: (player) => ({ 
          money: Math.max(0, player.money - 10000),
          parents: player.parents.map(p => ({ ...p, relationship: Math.max(0, p.relationship - 20) }))
        }),
        message: 'You paid for a basic care facility. They complain about it constantly.'
      },
      {
        text: 'Tell them they are on their own',
        effect: (player) => ({ 
          happiness: Math.min(100, (player.happiness || 0) + 10),
          parents: player.parents.map(p => ({ ...p, relationship: 0 }))
        }),
        message: 'You reminded them that actions have consequences. They are fending for themselves.'
      }
    ]
  },
  // Child Scenarios (0-12)
  {
    id: 'playground_bully',
    title: 'Playground Bully',
    description: 'A bigger kid pushes you off the swings and calls you a name.',
    minAge: 4,
    maxAge: 12,
    options: [
      {
        text: 'Tell a teacher',
        effect: (player) => ({ smarts: Math.min(100, (player.smarts || 0) + 5), happiness: Math.min(100, (player.happiness || 0) + 5) }),
        message: 'The teacher handled it and you got to swing again.'
      },
      {
        text: 'Push them back',
        effect: (player) => ({ karma: Math.max(0, (player.karma || 0) - 5), popularity: Math.min(100, (player.popularity || 0) + 5) }),
        message: 'You stood up for yourself, but got a timeout.'
      },
      {
        text: 'Run away crying',
        effect: (player) => ({ happiness: Math.max(0, (player.happiness || 0) - 10) }),
        message: 'You went home feeling sad.'
      }
    ]
  },
  {
    id: 'lost_toy',
    title: 'Lost Toy',
    description: 'You can\'t find your favorite toy anywhere.',
    minAge: 2,
    maxAge: 8,
    options: [
      {
        text: 'Ask parents for help',
        effect: (player) => ({ happiness: Math.min(100, (player.happiness || 0) + 5) }),
        message: 'Your parents found it under the couch!'
      },
      {
        text: 'Throw a tantrum',
        effect: (player) => ({ happiness: Math.max(0, (player.happiness || 0) - 5), karma: Math.max(0, (player.karma || 0) - 5) }),
        message: 'You cried for an hour and got sent to your room.'
      },
      {
        text: 'Play with something else',
        effect: (player) => ({ smarts: Math.min(100, (player.smarts || 0) + 2) }),
        message: 'You used your imagination and had fun anyway.'
      }
    ]
  },
  {
    id: 'vegetables',
    title: 'Eat Your Veggies',
    description: 'Your parents put broccoli on your plate. You hate broccoli.',
    minAge: 2,
    maxAge: 10,
    options: [
      {
        text: 'Eat it',
        effect: (player) => ({ health: Math.min(100, (player.health || 0) + 5), happiness: Math.max(0, (player.happiness || 0) - 2) }),
        message: 'You ate it. It wasn\'t that bad, and you feel healthy.'
      },
      {
        text: 'Hide it in your napkin',
        effect: (player) => ({ smarts: Math.min(100, (player.smarts || 0) + 2), karma: Math.max(0, (player.karma || 0) - 5) }),
        message: 'You successfully hid it, but you missed out on nutrients.'
      },
      {
        text: 'Refuse to eat',
        effect: (player) => ({ happiness: Math.max(0, (player.happiness || 0) - 5) }),
        message: 'You went to bed hungry.'
      }
    ]
  },

  // Teen Scenarios (13-18)
  {
    id: 'surprise_test',
    title: 'Surprise Test',
    description: 'Your teacher announces a pop quiz that you haven\'t studied for at all.',
    minAge: 10,
    maxAge: 18,
    options: [
      {
        text: 'Try your best',
        effect: (player) => ({ smarts: Math.min(100, (player.smarts || 0) + 2), happiness: Math.max(0, (player.happiness || 0) - 5) }),
        message: 'You did your best, but it was stressful.'
      },
      {
        text: 'Peek at your neighbor\'s paper',
        effect: (player) => ({ smarts: Math.min(100, (player.smarts || 0) + 5), karma: Math.max(0, (player.karma || 0) - 10) }),
        message: 'You copied some answers. You got a good grade but your conscience is heavy.'
      },
      {
        text: 'Fake a stomach ache',
        effect: (player) => ({ health: Math.max(0, (player.health || 0) - 5), happiness: Math.min(100, (player.happiness || 0) + 2) }),
        message: 'You went to the nurse\'s office and avoided the test.'
      }
    ]
  },
  {
    id: 'curfew',
    title: 'Curfew Trouble',
    description: 'You are hanging out with friends, but your curfew is in 10 minutes and you are 20 minutes away from home.',
    minAge: 13,
    maxAge: 17,
    options: [
      {
        text: 'Run home as fast as you can',
        effect: (player) => ({ health: Math.min(100, (player.health || 0) + 2), happiness: Math.max(0, (player.happiness || 0) - 5) }),
        message: 'You were late, but your parents appreciated the effort.'
      },
      {
        text: 'Stay out late anyway',
        effect: (player) => ({ popularity: Math.min(100, (player.popularity || 0) + 5), karma: Math.max(0, (player.karma || 0) - 10) }),
        message: 'You had fun, but got grounded for a week.'
      },
      {
        text: 'Call parents and explain',
        effect: (player) => ({ smarts: Math.min(100, (player.smarts || 0) + 5) }),
        message: 'They were annoyed but glad you communicated.'
      }
    ]
  },
  {
    id: 'crush',
    title: 'School Crush',
    description: 'Your crush drops their books in the hallway right in front of you.',
    minAge: 12,
    maxAge: 18,
    options: [
      {
        text: 'Help them pick up the books',
        effect: (player) => ({ karma: Math.min(100, (player.karma || 0) + 5), happiness: Math.min(100, (player.happiness || 0) + 10) }),
        message: 'You helped them and had a nice conversation!'
      },
      {
        text: 'Walk past awkwardly',
        effect: (player) => ({ happiness: Math.max(0, (player.happiness || 0) - 5) }),
        message: 'You panicked and ignored them. You feel stupid.'
      },
      {
        text: 'Make a joke about it',
        effect: (player) => {
          const success = Math.random() > 0.5;
          return success ? { popularity: Math.min(100, (player.popularity || 0) + 10) } : { popularity: Math.max(0, (player.popularity || 0) - 10) };
        },
        message: 'You made a joke. It was a gamble.'
      }
    ]
  },

  // Adult Scenarios (18+)
  {
    id: 'office_gossip',
    title: 'Office Gossip',
    description: 'During your lunch break, coworkers start spreading rumors about your manager.',
    minAge: 18,
    options: [
      {
        text: 'Join in the gossip',
        effect: (player) => ({ popularity: Math.min(100, (player.popularity || 0) + 10), karma: Math.max(0, (player.karma || 0) - 5) }),
        message: 'You joined the gossip. Your coworkers liked it, but it wasn\'t very nice.'
      },
      {
        text: 'Defend your manager',
        effect: (player) => ({ popularity: Math.max(0, (player.popularity || 0) - 5), karma: Math.min(100, (player.karma || 0) + 10) }),
        message: 'You stood up for your manager. Some coworkers rolled their eyes.'
      },
      {
        text: 'Walk away quietly',
        effect: () => ({}),
        message: 'You minded your own business and finished your lunch.'
      }
    ]
  },
  {
    id: 'gym_membership',
    title: 'Gym Membership',
    description: 'A local gym is offering a huge discount for a yearly membership, but it requires a commitment.',
    minAge: 16,
    options: [
      {
        text: 'Sign up and go regularly',
        effect: (player) => ({ money: player.money - 300, health: Math.min(100, (player.health || 0) + 15), happiness: Math.max(0, (player.happiness || 0) - 5) }),
        message: 'You signed up and started working out. You feel healthier but have less free time.'
      },
      {
        text: 'Sign up but rarely go',
        effect: (player) => ({ money: player.money - 300, happiness: Math.max(0, (player.happiness || 0) - 2) }),
        message: 'You paid for the membership but never went. What a waste of money.'
      },
      {
        text: 'Ignore the offer',
        effect: () => ({}),
        message: 'You threw the flyer in the trash.'
      }
    ]
  },
  {
    id: 'lottery_ticket',
    title: 'Lottery Ticket',
    description: 'You see a shiny scratch-off lottery ticket at the convenience store counter.',
    minAge: 18,
    options: [
      {
        text: 'Buy one for $10',
        effect: (player) => {
          const win = Math.random() > 0.7;
          return win 
            ? { money: player.money - 10 + 50, happiness: Math.min(100, (player.happiness || 0) + 5) }
            : { money: player.money - 10, happiness: Math.max(0, (player.happiness || 0) - 2) };
        },
        message: 'You bought a ticket.'
      },
      {
        text: 'Buy five for $50',
        effect: (player) => {
          const win = Math.random() > 0.9;
          return win 
            ? { money: player.money - 50 + 500, happiness: Math.min(100, (player.happiness || 0) + 15) }
            : { money: player.money - 50, happiness: Math.max(0, (player.happiness || 0) - 5) };
        },
        message: 'You bought five tickets.'
      },
      {
        text: 'Save your money',
        effect: () => ({}),
        message: 'You decided not to gamble.'
      }
    ]
  },
  {
    id: 'investment_opportunity',
    title: 'Investment Opportunity',
    description: 'A friend pitches you a startup idea and asks for seed funding.',
    minAge: 21,
    options: [
      {
        text: 'Invest heavily',
        effect: (player) => {
          const success = Math.random() > 0.8;
          return success 
            ? { money: player.money - 5000 + 15000, happiness: Math.min(100, (player.happiness || 0) + 20) }
            : { money: player.money - 5000, happiness: Math.max(0, (player.happiness || 0) - 10) };
        },
        message: 'You took a big risk on your friend\'s startup...'
      },
      {
        text: 'Invest a little',
        effect: (player) => {
          const success = Math.random() > 0.8;
          return success 
            ? { money: player.money - 500 + 1000, happiness: Math.min(100, (player.happiness || 0) + 5) }
            : { money: player.money - 500 };
        },
        message: 'You gave them a small amount of seed money...'
      },
      {
        text: 'Decline the offer',
        effect: () => ({}),
        message: 'You decided it was too risky.'
      }
    ]
  },
  {
    id: 'overtime',
    title: 'Overtime Request',
    description: 'Your boss asks you to work overtime this weekend.',
    minAge: 18,
    options: [
      {
        text: 'Accept',
        effect: (player) => ({ money: player.money + 2000, happiness: Math.max(0, (player.happiness || 0) - 5) }),
        message: 'You worked the overtime and made some extra cash, but you are tired.'
      },
      {
        text: 'Refuse',
        effect: (player) => ({ happiness: Math.min(100, (player.happiness || 0) + 5) }),
        message: 'You refused the overtime and enjoyed your weekend.'
      },
      {
        text: 'Ask for a promotion instead',
        effect: (player) => {
          if (Math.random() > 0.7) {
            return { happiness: Math.min(100, (player.happiness || 0) + 10), money: player.money + 5000 };
          }
          return { happiness: Math.max(0, (player.happiness || 0) - 10) };
        },
        message: 'You asked for a promotion. Your boss will think about it.'
      }
    ]
  },
  {
    id: 'work_mistake',
    title: 'Major Mistake',
    description: 'You realize you made a huge mistake on a project that will cost the company money.',
    minAge: 18,
    options: [
      { text: 'Admit it to your boss immediately', effect: (player) => ({ karma: Math.min(100, (player.karma || 0) + 15), happiness: Math.max(0, (player.happiness || 0) - 10) }), message: 'You confessed. Your boss was angry but appreciated your honesty.' },
      { text: 'Try to fix it secretly', effect: (player) => { const success = Math.random() > 0.6; return success ? { smarts: Math.min(100, (player.smarts || 0) + 5) } : { karma: Math.max(0, (player.karma || 0) - 20), happiness: Math.max(0, (player.happiness || 0) - 20) }; }, message: 'You tried to cover it up...' },
      { text: 'Blame it on a coworker', effect: (player) => ({ karma: Math.max(0, (player.karma || 0) - 30), popularity: Math.max(0, (player.popularity || 0) - 20) }), message: 'You blamed someone else. You kept your job, but everyone hates you.' }
    ]
  },
  {
    id: 'unexpected_bill',
    title: 'Unexpected Bill',
    description: 'You receive a massive medical bill in the mail that you weren\'t expecting.',
    minAge: 18,
    options: [
      { text: 'Pay it in full', effect: (player) => ({ money: player.money - 2000, happiness: Math.max(0, (player.happiness || 0) - 10) }), message: 'You drained your savings to pay the bill.' },
      { text: 'Call and negotiate', effect: (player) => { const success = Math.random() > 0.5; return success ? { money: player.money - 500, smarts: Math.min(100, (player.smarts || 0) + 5) } : { money: player.money - 2000, happiness: Math.max(0, (player.happiness || 0) - 15) }; }, message: 'You spent hours on the phone...' },
      { text: 'Ignore it', effect: (player) => ({ happiness: Math.max(0, (player.happiness || 0) - 5) }), message: 'You threw the bill away. It will probably go to collections.' }
    ]
  },
  {
    id: 'crypto_tip',
    title: 'Hot Crypto Tip',
    description: 'A coworker tells you about a new cryptocurrency that is "guaranteed to moon".',
    minAge: 18,
    options: [
      {
        text: 'Invest $1000',
        effect: (player) => {
          const success = Math.random() > 0.5;
          if (success) {
            return { money: player.money + 4000, happiness: Math.min(100, (player.happiness || 0) + 10) };
          } else {
            return { money: player.money - 1000, happiness: Math.max(0, (player.happiness || 0) - 10) };
          }
        },
        message: 'You invested in the crypto.'
      },
      {
        text: 'Ignore them',
        effect: () => ({}),
        message: 'You ignored the tip. It was probably a scam anyway.'
      },
      {
        text: 'Report them to HR',
        effect: (player) => ({ karma: Math.max(0, (player.karma || 0) - 5), popularity: Math.max(0, (player.popularity || 50) - 5) }),
        message: 'You reported your coworker. They got in trouble, but people think you are a snitch.'
      }
    ]
  },

  // All Ages Scenarios
  {
    id: 'found_wallet',
    title: 'Found a Wallet',
    description: 'While walking down the street, you notice a wallet lying on the sidewalk with cash inside.',
    minAge: 8,
    options: [
      {
        text: 'Return it to the owner',
        effect: (player) => ({ karma: Math.min(100, (player.karma || 0) + 10) }),
        message: 'You returned the wallet to its rightful owner. They were very thankful.'
      },
      {
        text: 'Keep the money',
        effect: (player) => ({ money: player.money + 200, karma: Math.max(0, (player.karma || 0) - 8) }),
        message: 'You pocketed the cash and threw the wallet away. You feel a bit guilty.'
      },
      {
        text: 'Leave it where it is',
        effect: () => ({}),
        message: 'You decided not to get involved and kept walking.'
      }
    ]
  },
  {
    id: 'family_argument',
    title: 'Family Argument',
    description: 'A heated argument breaks out during a family dinner over politics.',
    minAge: 12,
    options: [
      {
        text: 'Try to mediate the fight',
        effect: (player) => ({ karma: Math.min(100, (player.karma || 0) + 5), happiness: Math.max(0, (player.happiness || 0) - 5) }),
        message: 'You tried to calm everyone down. It was exhausting.'
      },
      {
        text: 'Take a side',
        effect: (player) => ({ karma: Math.max(0, (player.karma || 0) - 10), popularity: Math.min(100, (player.popularity || 0) + 5) }),
        message: 'You jumped into the argument. Half the family is mad at you.'
      },
      {
        text: 'Excuse yourself from the table',
        effect: (player) => ({ happiness: Math.min(100, (player.happiness || 0) + 2) }),
        message: 'You quietly left the room and enjoyed some peace.'
      }
    ]
  },
  {
    id: 'charity_drive',
    title: 'Charity Drive',
    description: 'A local charity is asking for donations to help build a new community center.',
    minAge: 16,
    options: [
      {
        text: 'Donate a large amount',
        effect: (player) => ({ money: player.money - 500, karma: Math.min(100, (player.karma || 0) + 20), happiness: Math.min(100, (player.happiness || 0) + 5) }),
        message: 'You made a generous donation. You feel great about helping the community.'
      },
      {
        text: 'Donate a small amount',
        effect: (player) => ({ money: player.money - 50, karma: Math.min(100, (player.karma || 0) + 5) }),
        message: 'You chipped in what you could.'
      },
      {
        text: 'Politely decline',
        effect: (player) => ({ karma: Math.max(0, (player.karma || 0) - 2) }),
        message: 'You said you couldn\'t afford it right now.'
      }
    ]
  },
  {
    id: 'strange_rash',
    title: 'Strange Rash',
    description: 'You wake up with a strange, itchy rash on your arm that won\'t go away.',
    minAge: 5,
    options: [
      {
        text: 'See a doctor',
        effect: (player) => {
          if (player.age < 18) {
            const parentsPay = Math.random() < 0.5;
            if (parentsPay) {
              return { health: Math.min(100, (player.health || 0) + 10) };
            } else {
              return { money: player.money - 200, health: Math.min(100, (player.health || 0) + 10), parentalNeglectCount: (player.parentalNeglectCount || 0) + 1 };
            }
          }
          return { money: player.money - 200, health: Math.min(100, (player.health || 0) + 10) };
        },
        message: (player, effectResult) => {
          if (player.age < 18) {
            if (effectResult && effectResult.money === undefined) {
              return 'Your parents paid for the doctor. The doctor prescribed a cream and the rash cleared up quickly.';
            } else {
              const negativeResponses = [
                "Your parents said they didn't care and made you pay for it.",
                "Your parents told you to rub some dirt on it, so you had to pay yourself.",
                "Your parents refused to pay, saying it builds character."
              ];
              const response = negativeResponses[Math.floor(Math.random() * negativeResponses.length)];
              return `${response} The doctor prescribed a cream and the rash cleared up quickly.`;
            }
          }
          return 'The doctor prescribed a cream and the rash cleared up quickly.';
        }
      },
      {
        text: 'Buy over-the-counter cream',
        effect: (player) => ({ money: player.money - 20, health: Math.min(100, (player.health || 0) + 5) }),
        message: 'The cheap cream helped a little bit.'
      },
      {
        text: 'Let it heal naturally',
        effect: (player) => ({ health: Math.max(0, (player.health || 0) - 10), happiness: Math.max(0, (player.happiness || 0) - 5) }),
        message: 'The rash got worse and was very annoying for weeks.'
      }
    ]
  },
  {
    id: 'online_troll',
    title: 'Online Troll',
    description: 'Someone leaves a very mean comment on your recent social media post.',
    minAge: 13,
    options: [
      {
        text: 'Reply angrily',
        effect: (player) => ({ happiness: Math.max(0, (player.happiness || 0) - 10), karma: Math.max(0, (player.karma || 0) - 5) }),
        message: 'You got into a huge online argument. It ruined your day.'
      },
      {
        text: 'Delete and block',
        effect: (player) => ({ happiness: Math.min(100, (player.happiness || 0) + 5) }),
        message: 'You blocked the troll and moved on with your life.'
      },
      {
        text: 'Ignore it completely',
        effect: (player) => ({ smarts: Math.min(100, (player.smarts || 0) + 2) }),
        message: 'You didn\'t let it bother you.'
      }
    ]
  },
  {
    id: 'sick',
    title: 'Feeling Sick',
    description: 'You wake up feeling terrible with a high fever.',
    minAge: 5,
    options: [
      {
        text: 'Go to the doctor ($500)',
        effect: (player) => {
          if (player.age < 18) {
            const parentsPay = Math.random() < 0.5;
            if (parentsPay) {
              return { health: Math.min(100, (player.health || 0) + 10) };
            } else {
              return { money: player.money - 500, health: Math.min(100, (player.health || 0) + 10), parentalNeglectCount: (player.parentalNeglectCount || 0) + 1 };
            }
          }
          return { money: player.money - 500, health: Math.min(100, (player.health || 0) + 10) };
        },
        message: (player, effectResult) => {
          if (player.age < 18) {
            if (effectResult && effectResult.money === undefined) {
              return 'Your parents paid for the doctor. The doctor gave you some medicine and you feel better.';
            } else {
              const negativeResponses = [
                "Your parents said they didn't care and made you pay for it.",
                "Your parents told you to walk it off, so you had to pay yourself.",
                "Your parents refused to pay, saying it builds character."
              ];
              const response = negativeResponses[Math.floor(Math.random() * negativeResponses.length)];
              return `${response} The doctor gave you some medicine and you feel better.`;
            }
          }
          return 'The doctor gave you some medicine and you feel better.';
        }
      },
      {
        text: 'Ignore it',
        effect: (player) => ({ health: Math.max(0, (player.health || 0) - 15) }),
        message: 'You ignored the illness and it got worse.'
      },
      {
        text: 'Go to the ER ($10,000)',
        effect: (player) => {
          if (player.age < 18) {
            const parentsPay = Math.random() < 0.3; // Lower chance for ER
            if (parentsPay) {
              return { health: Math.min(100, (player.health || 0) + 25) };
            }
          }
          return { money: player.money - 10000, health: Math.min(100, (player.health || 0) + 25) };
        },
        message: (player, effectResult) => {
          if (player.age < 18) {
            if (effectResult && effectResult.money === undefined) {
              return 'Your parents paid the massive ER bill. They fixed you up quickly.';
            } else {
              const negativeResponses = [
                "Your parents said they didn't care and made you pay the massive bill.",
                "Your parents were furious about the cost and refused to pay.",
                "Your parents said you should have just taken an aspirin, forcing you to pay."
              ];
              const response = negativeResponses[Math.floor(Math.random() * negativeResponses.length)];
              return `${response} You went to the ER. It was expensive, but they fixed you up quickly.`;
            }
          }
          return 'You went to the ER. It was expensive, but they fixed you up quickly.';
        }
      }
    ]
  },
  {
    id: 'party_invite',
    title: 'Party Invitation',
    description: 'A friend invites you to a wild party.',
    minAge: 16,
    options: [
      {
        text: 'Go to the party',
        effect: (player) => ({ happiness: Math.min(100, (player.happiness || 0) + 10), health: Math.max(0, (player.health || 0) - 5) }),
        message: 'You went to the party and had a blast, but you are hungover.'
      },
      {
        text: 'Stay home',
        effect: () => ({}),
        message: 'You stayed home and had a quiet night.'
      },
      {
        text: 'Study/Work',
        effect: (player) => ({ smarts: Math.min(100, (player.smarts || 0) + 2), happiness: Math.max(0, (player.happiness || 0) - 2) }),
        message: 'You stayed in to study and work. You feel smarter but a bit bored.'
      }
    ]
  },
  {
    id: 'stray_animal',
    title: 'Stray Animal',
    description: 'You find a stray dog wandering the streets.',
    minAge: 8,
    options: [
      {
        text: 'Take it to a shelter',
        effect: (player) => ({ happiness: Math.min(100, (player.happiness || 0) + 2) }),
        message: 'You took the dog to a shelter. You hope it finds a good home.'
      },
      {
        text: 'Adopt it',
        effect: (player) => ({ happiness: Math.min(100, (player.happiness || 0) + 15), money: player.money - 500 }),
        message: 'You adopted the dog! It costs money to care for, but brings you joy.'
      },
      {
        text: 'Ignore it',
        effect: (player) => ({ happiness: Math.max(0, (player.happiness || 0) - 5) }),
        message: 'You walked past the dog. You feel a little guilty.'
      }
    ]
  },
  {
    id: 'lost_wallet_2',
    title: 'Misplaced Wallet',
    description: 'You realize your wallet is missing after a busy day of shopping.',
    minAge: 16,
    options: [
      { text: 'Cancel all your cards immediately', effect: (player) => ({ money: player.money - 50, happiness: Math.max(0, (player.happiness || 0) - 10) }), message: 'You cancelled your cards. It was a hassle, but you are safe.' },
      { text: 'Retrace your steps', effect: (player) => { const found = Math.random() > 0.5; return found ? { happiness: Math.min(100, (player.happiness || 0) + 10) } : { money: player.money - 200, happiness: Math.max(0, (player.happiness || 0) - 15) }; }, message: 'You searched everywhere...' },
      { text: 'Wait and see if someone returns it', effect: (player) => { const returned = Math.random() > 0.7; return returned ? { karma: Math.min(100, (player.karma || 0) + 10), happiness: Math.min(100, (player.happiness || 0) + 20) } : { money: player.money - 300, happiness: Math.max(0, (player.happiness || 0) - 20) }; }, message: 'You waited...' }
    ]
  },
  {
    id: 'stray_kitten',
    title: 'Meowing in the Rain',
    description: 'You hear a tiny kitten crying in the bushes during a heavy rainstorm.',
    minAge: 6,
    options: [
      { text: 'Rescue it and keep it', effect: (player) => ({ happiness: Math.min(100, (player.happiness || 0) + 20), money: player.money - 200 }), message: 'You brought the kitten home. It\'s your new best friend!' },
      { text: 'Take it to an animal rescue', effect: (player) => ({ karma: Math.min(100, (player.karma || 0) + 10), happiness: Math.min(100, (player.happiness || 0) + 5) }), message: 'You made sure the kitten was safe and dry.' },
      { text: 'Walk away', effect: (player) => ({ karma: Math.max(0, (player.karma || 0) - 15), happiness: Math.max(0, (player.happiness || 0) - 10) }), message: 'You left the kitten in the cold. You feel terrible.' }
    ]
  },
  {
    id: 'concert_tickets',
    title: 'Sold Out Show',
    description: 'Your favorite band is playing tonight, but tickets are sold out and scalpers are charging a fortune.',
    minAge: 14,
    options: [
      { text: 'Buy from a scalper ($500)', effect: (player) => ({ money: player.money - 500, happiness: Math.min(100, (player.happiness || 0) + 15) }), message: 'You paid a ridiculous amount, but the concert was amazing.' },
      { text: 'Try to sneak in', effect: (player) => { const success = Math.random() > 0.8; return success ? { happiness: Math.min(100, (player.happiness || 0) + 25) } : { karma: Math.max(0, (player.karma || 0) - 10), happiness: Math.max(0, (player.happiness || 0) - 15) }; }, message: 'You tried to sneak past security...' },
      { text: 'Stay home and listen to their album', effect: (player) => ({ happiness: Math.min(100, (player.happiness || 0) + 2) }), message: 'You saved your money and had a chill night in.' }
    ]
  },
  {
    id: 'diet_fad',
    title: 'New Diet Trend',
    description: 'Everyone is trying a new extreme juice cleanse diet.',
    minAge: 18,
    options: [
      { text: 'Try it for a week', effect: (player) => ({ health: Math.max(0, (player.health || 0) - 5), happiness: Math.max(0, (player.happiness || 0) - 10) }), message: 'You were starving and miserable the whole week.' },
      { text: 'Stick to your normal meals', effect: (player) => ({ health: Math.min(100, (player.health || 0) + 2) }), message: 'You ate a balanced diet and felt fine.' },
      { text: 'Bring donuts to share', effect: (player) => ({ popularity: Math.min(100, (player.popularity || 0) + 10), money: player.money - 20 }), message: 'You ruined everyone\'s diet, but they loved the donuts.' }
    ]
  },
  {
    id: 'car_trouble',
    title: 'Flat Tire',
    description: 'You get a flat tire on the highway during rush hour.',
    minAge: 16,
    options: [
      { text: 'Change it yourself', effect: (player) => ({ smarts: Math.min(100, (player.smarts || 0) + 5), health: Math.max(0, (player.health || 0) - 2) }), message: 'You got dirty, but you changed the tire successfully.' },
      { text: 'Call roadside assistance', effect: (player) => ({ money: player.money - 100, happiness: Math.max(0, (player.happiness || 0) - 5) }), message: 'You waited an hour, but they fixed it for you.' },
      { text: 'Drive on the rim to the next exit', effect: (player) => ({ money: player.money - 800, smarts: Math.max(0, (player.smarts || 0) - 10) }), message: 'You destroyed your wheel and had to pay for a tow anyway.' }
    ]
  },
  {
    id: 'found_usb',
    title: 'Mysterious USB Drive',
    description: 'You find a USB drive sitting on a table at the local coffee shop.',
    minAge: 13,
    options: [
      { text: 'Plug it into your computer', effect: (player) => { const virus = Math.random() > 0.3; return virus ? { money: player.money - 300, smarts: Math.max(0, (player.smarts || 0) - 10) } : { money: player.money + 500 }; }, message: 'You plugged it in...' },
      { text: 'Give it to the barista', effect: (player) => ({ karma: Math.min(100, (player.karma || 0) + 5) }), message: 'You handed it to the staff in case the owner returns.' },
      { text: 'Throw it in the trash', effect: () => ({}), message: 'You didn\'t want to risk a virus, so you tossed it.' }
    ]
  },
  {
    id: 'awkward_date',
    title: 'Blind Date Disaster',
    description: 'Your friend sets you up on a blind date, but the person is incredibly rude to the waiter.',
    minAge: 18,
    options: [
      { text: 'Call them out on their behavior', effect: (player) => ({ karma: Math.min(100, (player.karma || 0) + 15), popularity: Math.max(0, (player.popularity || 0) - 5) }), message: 'You told them they were being rude. The date ended early.' },
      { text: 'Apologize to the waiter secretly and overtip', effect: (player) => ({ money: player.money - 40, karma: Math.min(100, (player.karma || 0) + 10) }), message: 'You left a huge tip to make up for your date\'s behavior.' },
      { text: 'Fake an emergency and leave', effect: (player) => ({ happiness: Math.min(100, (player.happiness || 0) + 5) }), message: 'You pretended your roommate was locked out and escaped.' }
    ]
  },
  {
    id: 'gym_intimidation',
    title: 'Gym Intimidation',
    description: 'A very muscular person is hogging the machine you want to use at the gym.',
    minAge: 16,
    options: [
      { text: 'Ask if you can work in', effect: (player) => ({ popularity: Math.min(100, (player.popularity || 0) + 5), health: Math.min(100, (player.health || 0) + 5) }), message: 'They were actually very nice and let you share the machine.' },
      { text: 'Stare at them angrily', effect: (player) => ({ happiness: Math.max(0, (player.happiness || 0) - 5) }), message: 'You glared at them, but they ignored you.' },
      { text: 'Do a different workout', effect: (player) => ({ health: Math.min(100, (player.health || 0) + 2) }), message: 'You avoided confrontation and used free weights instead.' }
    ]
  },
  {
    id: 'phone_scam',
    title: 'Suspicious Phone Call',
    description: 'You get a call from someone claiming to be the IRS, saying you owe them money immediately.',
    minAge: 18,
    options: [
      { text: 'Hang up immediately', effect: (player) => ({ smarts: Math.min(100, (player.smarts || 0) + 5) }), message: 'You recognized the scam and hung up.' },
      { text: 'Mess with the scammer', effect: (player) => ({ happiness: Math.min(100, (player.happiness || 0) + 10) }), message: 'You wasted their time for 20 minutes. It was hilarious.' },
      { text: 'Give them your credit card info', effect: (player) => ({ money: player.money - 1500, smarts: Math.max(0, (player.smarts || 0) - 15) }), message: 'You fell for the scam and lost a lot of money.' }
    ]
  },
  {
    id: 'spilled_secret',
    title: 'Spilled Secret',
    description: 'You accidentally overhear your friend\'s partner talking about buying an engagement ring.',
    minAge: 18,
    options: [
      { text: 'Tell your friend immediately', effect: (player) => ({ karma: Math.max(0, (player.karma || 0) - 10), popularity: Math.max(0, (player.popularity || 0) - 10) }), message: 'You ruined the surprise. They were both upset with you.' },
      { text: 'Keep your mouth shut', effect: (player) => ({ karma: Math.min(100, (player.karma || 0) + 5) }), message: 'You kept the secret and the proposal was beautiful.' },
      { text: 'Drop subtle hints to your friend', effect: (player) => ({ happiness: Math.min(100, (player.happiness || 0) + 5) }), message: 'You teased your friend without giving it away entirely.' }
    ]
  },
  {
    id: 'rainy_day',
    title: 'Caught in the Rain',
    description: 'A sudden downpour starts while you are walking home, and you don\'t have an umbrella.',
    minAge: 5,
    options: [
      { text: 'Run as fast as you can', effect: (player) => ({ health: Math.min(100, (player.health || 0) + 2), happiness: Math.max(0, (player.happiness || 0) - 5) }), message: 'You sprinted home. You got soaked but got some cardio in.' },
      { text: 'Take shelter in a cafe', effect: (player) => ({ money: player.money - 10, happiness: Math.min(100, (player.happiness || 0) + 5) }), message: 'You bought a coffee and waited out the storm.' },
      { text: 'Walk slowly and enjoy the rain', effect: (player) => ({ health: Math.max(0, (player.health || 0) - 5), happiness: Math.min(100, (player.happiness || 0) + 10) }), message: 'You embraced the rain. You caught a slight cold, but felt alive.' }
    ]
  },
  {
    id: 'bad_service',
    title: 'Terrible Service',
    description: 'Your waiter at a restaurant is incredibly rude and ignores your table for an hour.',
    minAge: 16,
    options: [
      { text: 'Leave no tip', effect: (player) => ({ karma: Math.max(0, (player.karma || 0) - 5) }), message: 'You left exactly the bill amount and walked out.' },
      { text: 'Speak to the manager', effect: (player) => ({ money: player.money + 30, happiness: Math.min(100, (player.happiness || 0) + 5) }), message: 'The manager apologized and comped your meal.' },
      { text: 'Leave a 20% tip anyway', effect: (player) => ({ money: player.money - 20, karma: Math.min(100, (player.karma || 0) + 15) }), message: 'You tipped well, hoping they were just having a bad day.' }
    ]
  },
  {
    id: 'found_bird',
    title: 'Injured Bird',
    description: 'You find a small bird with a broken wing on your porch.',
    minAge: 5,
    options: [
      { text: 'Take it to a wildlife rehab center', effect: (player) => ({ karma: Math.min(100, (player.karma || 0) + 15), happiness: Math.min(100, (player.happiness || 0) + 5) }), message: 'You drove the bird to a sanctuary. They said it will recover.' },
      { text: 'Try to nurse it back to health yourself', effect: (player) => { const success = Math.random() > 0.7; return success ? { karma: Math.min(100, (player.karma || 0) + 20) } : { karma: Math.max(0, (player.karma || 0) - 5), happiness: Math.max(0, (player.happiness || 0) - 10) }; }, message: 'You tried your best to help the bird...' },
      { text: 'Leave it alone', effect: (player) => ({ karma: Math.max(0, (player.karma || 0) - 10) }), message: 'You let nature take its course.' }
    ]
  },
  {
    id: 'double_booked',
    title: 'Double Booked',
    description: 'You realize you accidentally scheduled a date and a dinner with your parents on the same night.',
    minAge: 16,
    options: [
      { text: 'Cancel the date', effect: (player) => ({ popularity: Math.max(0, (player.popularity || 0) - 10) }), message: 'You cancelled the date. They were disappointed.' },
      { text: 'Cancel on your parents', effect: (player) => ({ karma: Math.max(0, (player.karma || 0) - 10) }), message: 'You bailed on your parents. They were hurt.' },
      { text: 'Try to do both', effect: (player) => ({ happiness: Math.max(0, (player.happiness || 0) - 15), health: Math.max(0, (player.health || 0) - 5) }), message: 'You rushed between both dinners. It was incredibly stressful and everyone noticed.' }
    ]
  },
  {
    id: 'power_outage',
    title: 'Power Outage',
    description: 'The power goes out in your neighborhood for the entire evening.',
    minAge: 5,
    options: [
      { text: 'Light candles and read a book', effect: (player) => ({ smarts: Math.min(100, (player.smarts || 0) + 5), happiness: Math.min(100, (player.happiness || 0) + 10) }), message: 'You had a cozy, relaxing evening unplugged from the world.' },
      { text: 'Complain on your phone until it dies', effect: (player) => ({ happiness: Math.max(0, (player.happiness || 0) - 10) }), message: 'You spent the whole time annoyed in the dark.' },
      { text: 'Go to sleep early', effect: (player) => ({ health: Math.min(100, (player.health || 0) + 5) }), message: 'You got a great night\'s sleep.' }
    ]
  },
  {
    id: 'free_coffee',
    title: 'Pay It Forward',
    description: 'The person in front of you in the drive-thru pays for your coffee.',
    minAge: 16,
    options: [
      { text: 'Pay for the person behind you', effect: (player) => ({ money: player.money - 5, karma: Math.min(100, (player.karma || 0) + 10), happiness: Math.min(100, (player.happiness || 0) + 5) }), message: 'You kept the chain going. It felt great.' },
      { text: 'Just take the free coffee', effect: (player) => ({ happiness: Math.min(100, (player.happiness || 0) + 2) }), message: 'You enjoyed your free drink and drove off.' },
      { text: 'Give the barista a big tip instead', effect: (player) => ({ money: player.money - 5, karma: Math.min(100, (player.karma || 0) + 10) }), message: 'You tipped the barista the cost of your drink.' }
    ]
  },
  {
    id: 'lost_child',
    title: 'Lost Child',
    description: 'You see a small child crying in the grocery store, looking for their parents.',
    minAge: 13,
    options: [
      { text: 'Help them find their parents', effect: (player) => ({ karma: Math.min(100, (player.karma || 0) + 20), happiness: Math.min(100, (player.happiness || 0) + 10) }), message: 'You stayed with the child until their panicked mother found them.' },
      { text: 'Tell a store employee', effect: (player) => ({ karma: Math.min(100, (player.karma || 0) + 5) }), message: 'You alerted customer service and went back to shopping.' },
      { text: 'Ignore them', effect: (player) => ({ karma: Math.max(0, (player.karma || 0) - 20) }), message: 'You walked past the crying child. That was cold.' }
    ]
  },
  {
    id: 'gym_injury',
    title: 'Pushed Too Hard',
    description: 'You try to lift a weight that is way too heavy for you at the gym.',
    minAge: 16,
    options: [
      { text: 'Drop the weight and walk away', effect: (player) => ({ popularity: Math.max(0, (player.popularity || 0) - 5) }), message: 'It made a loud noise and everyone stared, but you are safe.' },
      { text: 'Try to push through the pain', effect: (player) => ({ health: Math.max(0, (player.health || 0) - 20), happiness: Math.max(0, (player.happiness || 0) - 10) }), message: 'You pulled a muscle in your back and can barely walk.' },
      { text: 'Ask someone for a spot', effect: (player) => ({ popularity: Math.min(100, (player.popularity || 0) + 5), health: Math.min(100, (player.health || 0) + 2) }), message: 'Someone helped you lift it safely.' }
    ]
  }
];
