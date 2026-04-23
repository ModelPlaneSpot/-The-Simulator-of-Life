import { Activity, Player } from './types';

export const CRIMES: Activity[] = [
  {
    id: 'shoplift',
    name: 'Shoplift',
    cost: 0,
    isAvailable: (player) => player.age >= 10,
    effect: (player) => {
      const successChance = 0.7 + (player.smarts / 200);
      if (Math.random() < successChance) {
        const stolenAmount = Math.floor(Math.random() * 100) + 10;
        return {
          money: player.money + stolenAmount,
          karma: Math.max(0, player.karma - 5),
          happiness: Math.min(100, player.happiness + 2)
        };
      } else {
        return {
          karma: Math.max(0, player.karma - 10),
          happiness: Math.max(0, player.happiness - 20),
          inPrison: Math.random() < 0.3,
          prisonYearsLeft: 1
        };
      }
    },
    message: (player, result) => {
      if (result.money && result.money > player.money) {
        return `You successfully shoplifted $${result.money - player.money} worth of items!`;
      } else if (result.inPrison) {
        return 'You were caught shoplifting and sent to juvenile detention/prison for 1 year!';
      } else {
        return 'You were caught shoplifting but managed to run away. That was close!';
      }
    }
  },
  {
    id: 'pickpocket',
    name: 'Pickpocket',
    cost: 0,
    isAvailable: (player) => player.age >= 12,
    effect: (player) => {
      const successChance = 0.6 + (player.smarts / 200);
      if (Math.random() < successChance) {
        const stolenAmount = Math.floor(Math.random() * 300) + 50;
        return {
          money: player.money + stolenAmount,
          karma: Math.max(0, player.karma - 8),
          happiness: Math.min(100, player.happiness + 5)
        };
      } else {
        return {
          karma: Math.max(0, player.karma - 15),
          happiness: Math.max(0, player.happiness - 25),
          inPrison: Math.random() < 0.4,
          prisonYearsLeft: 1
        };
      }
    },
    message: (player, result) => {
      if (result.money && result.money > player.money) {
        return `You successfully pickpocketed $${result.money - player.money}!`;
      } else if (result.inPrison) {
        return 'You were caught pickpocketing and sent to prison for 1 year!';
      } else {
        return 'You were caught pickpocketing and got beaten up by the victim.';
      }
    }
  },
  {
    id: 'rob_house',
    name: 'Rob House',
    cost: 500,
    isAvailable: (player) => player.age >= 16,
    effect: (player) => {
      if (player.money < 500) return {};
      const successChance = 0.5 + (player.smarts / 200);
      if (Math.random() < successChance) {
        const stolenAmount = Math.floor(Math.random() * 45000) + 5000;
        return {
          money: player.money - 500 + stolenAmount,
          karma: Math.max(0, player.karma - 20),
          happiness: Math.min(100, player.happiness + 10)
        };
      } else {
        return {
          money: player.money - 500,
          karma: Math.max(0, player.karma - 30),
          happiness: Math.max(0, player.happiness - 40),
          inPrison: Math.random() < 0.6,
          prisonYearsLeft: 3
        };
      }
    },
    message: (player, result) => {
      if (result.money && result.money > player.money - 500) {
        return `You successfully robbed a house and fenced the goods for $${result.money - (player.money - 500)}!`;
      } else if (result.inPrison) {
        return 'You were caught robbing a house and sent to prison for 3 years!';
      } else {
        return 'The homeowner was awake! You barely escaped with your life, losing your $500 tools.';
      }
    }
  },
  {
    id: 'bank_robbery',
    name: 'Bank Robbery',
    cost: 5000,
    isAvailable: (player) => player.age >= 18,
    effect: (player) => {
      if (player.money < 5000) return {};
      const successChance = 0.2 + (player.smarts / 200);
      if (Math.random() < successChance) {
        const stolenAmount = Math.floor(Math.random() * 900000) + 100000;
        return {
          money: player.money - 5000 + stolenAmount,
          karma: Math.max(0, player.karma - 50),
          happiness: Math.min(100, player.happiness + 50),
          fame: Math.min(100, player.fame + 20)
        };
      } else {
        return {
          money: player.money - 5000,
          karma: Math.max(0, player.karma - 50),
          happiness: Math.max(0, player.happiness - 80),
          inPrison: true,
          prisonYearsLeft: 15
        };
      }
    },
    message: (player, result) => {
      if (result.money && result.money > player.money - 5000) {
        return `You pulled off the heist of the century! You stole $${(result.money - (player.money - 5000)).toLocaleString()}!`;
      } else {
        return 'The SWAT team surrounded the bank. You were arrested and sentenced to 15 years in federal prison.';
      }
    }
  },
  {
    id: 'scam_online',
    name: 'Scam People Online',
    cost: 0,
    isAvailable: (player) => player.age >= 14,
    effect: (player) => {
      const successChance = 0.6 + (player.smarts / 200);
      if (Math.random() < successChance) {
        const stolenAmount = Math.floor(Math.random() * 5000) + 100;
        return {
          money: player.money + stolenAmount,
          karma: Math.max(0, player.karma - 15)
        };
      } else {
        return {
          karma: Math.max(0, player.karma - 20),
          inPrison: Math.random() < 0.2,
          prisonYearsLeft: 2
        };
      }
    },
    message: (player, result) => {
      if (result.money && result.money > player.money) {
        return `Your phishing scam worked! You made $${result.money - player.money}.`;
      } else if (result.inPrison) {
        return 'The cyber police tracked your IP. You were arrested for wire fraud and sentenced to 2 years.';
      } else {
        return 'Nobody fell for your scam.';
      }
    }
  },
  {
    id: 'car_theft',
    name: 'Grand Theft Auto',
    cost: 0,
    isAvailable: (player) => player.age >= 16,
    effect: (player) => {
      const successChance = 0.5 + (player.smarts / 200);
      if (Math.random() < successChance) {
        const stolenAmount = Math.floor(Math.random() * 40000) + 10000;
        return {
          money: player.money + stolenAmount,
          karma: Math.max(0, player.karma - 25)
        };
      } else {
        return {
          karma: Math.max(0, player.karma - 30),
          inPrison: Math.random() < 0.5,
          prisonYearsLeft: 4
        };
      }
    },
    message: (player, result) => {
      if (result.money && result.money > player.money) {
        return `You stole a car and sold it to a chop shop for $${result.money - player.money}.`;
      } else if (result.inPrison) {
        return 'You were pulled over in a stolen vehicle and sentenced to 4 years in prison.';
      } else {
        return 'You couldn\'t hotwire the car and had to run when the alarm went off.';
      }
    }
  },
  {
    id: 'blackmail',
    name: 'Blackmail Someone',
    cost: 0,
    isAvailable: (player) => player.age >= 18 && player.smarts > 50,
    effect: (player) => {
      const successChance = 0.4 + (player.smarts / 200);
      if (Math.random() < successChance) {
        const stolenAmount = Math.floor(Math.random() * 20000) + 5000;
        return {
          money: player.money + stolenAmount,
          karma: Math.max(0, player.karma - 30)
        };
      } else {
        return {
          karma: Math.max(0, player.karma - 40),
          health: Math.max(0, player.health - 30), // Beaten up
          inPrison: Math.random() < 0.3,
          prisonYearsLeft: 3
        };
      }
    },
    message: (player, result) => {
      if (result.money && result.money > player.money) {
        return `Your blackmail succeeded! They paid you $${result.money - player.money} to keep quiet.`;
      } else if (result.inPrison) {
        return 'Your victim went to the police. You were arrested for extortion (3 years).';
      } else {
        return 'Your victim hired thugs to beat you up instead of paying.';
      }
    }
  },
  {
    id: 'drug_dealing',
    name: 'Deal Drugs',
    cost: 2000,
    isAvailable: (player) => player.age >= 18,
    effect: (player) => {
      if (player.money < 2000) return {};
      const successChance = 0.5;
      if (Math.random() < successChance) {
        const stolenAmount = Math.floor(Math.random() * 15000) + 5000;
        return {
          money: player.money - 2000 + stolenAmount,
          karma: Math.max(0, player.karma - 20)
        };
      } else {
        return {
          money: player.money - 2000,
          karma: Math.max(0, player.karma - 30),
          inPrison: Math.random() < 0.6,
          prisonYearsLeft: 5
        };
      }
    },
    message: (player, result) => {
      if (result.money && result.money > player.money - 2000) {
        return `You successfully moved the product and made a profit of $${result.money - player.money}.`;
      } else if (result.inPrison) {
        return 'You sold to an undercover cop. 5 years in prison for distribution.';
      } else {
        return 'You got robbed by a rival gang and lost your product.';
      }
    }
  },
  {
    id: 'hacking',
    name: 'Hack Corporate Database',
    cost: 500,
    isAvailable: (player) => player.age >= 16 && player.smarts > 70,
    effect: (player) => {
      if (player.money < 500) return {};
      const successChance = 0.3 + (player.smarts / 200);
      if (Math.random() < successChance) {
        const stolenAmount = Math.floor(Math.random() * 100000) + 20000;
        return {
          money: player.money - 500 + stolenAmount,
          karma: Math.max(0, player.karma - 25)
        };
      } else {
        return {
          money: player.money - 500,
          karma: Math.max(0, player.karma - 30),
          inPrison: Math.random() < 0.5,
          prisonYearsLeft: 5
        };
      }
    },
    message: (player, result) => {
      if (result.money && result.money > player.money - 500) {
        return `You successfully hacked a corporation and stole $${(result.money - (player.money - 500)).toLocaleString()}!`;
      } else if (result.inPrison) {
        return 'The FBI traced your hack. You were sentenced to 5 years for cybercrimes.';
      } else {
        return 'You tripped their firewall and had to abort the hack, losing your setup costs.';
      }
    }
  },
  {
    id: 'identity_theft',
    name: 'Identity Theft',
    cost: 1000,
    isAvailable: (player) => player.age >= 18 && player.smarts > 60,
    effect: (player) => {
      if (player.money < 1000) return {};
      const successChance = 0.4 + (player.smarts / 200);
      if (Math.random() < successChance) {
        const stolenAmount = Math.floor(Math.random() * 50000) + 10000;
        return {
          money: player.money - 1000 + stolenAmount,
          karma: Math.max(0, player.karma - 35)
        };
      } else {
        return {
          money: player.money - 1000,
          karma: Math.max(0, player.karma - 40),
          inPrison: Math.random() < 0.4,
          prisonYearsLeft: 4
        };
      }
    },
    message: (player, result) => {
      if (result.money && result.money > player.money - 1000) {
        return `You stole someone's identity and maxed out their credit cards for $${(result.money - (player.money - 1000)).toLocaleString()}!`;
      } else if (result.inPrison) {
        return 'You were caught using a stolen identity and sentenced to 4 years in prison.';
      } else {
        return 'The bank flagged your transactions as fraudulent. You lost your initial investment.';
      }
    }
  },
  {
    id: 'fraud_scheme',
    name: 'Fraud Scheme',
    cost: 5000,
    isAvailable: (player) => player.age >= 18 && player.smarts > 70,
    effect: (player) => {
      if (player.money < 5000) return {};
      const successChance = 0.3 + (player.smarts / 200);
      if (Math.random() < successChance) {
        const stolenAmount = Math.floor(Math.random() * 250000) + 50000;
        return {
          money: player.money - 5000 + stolenAmount,
          karma: Math.max(0, player.karma - 40)
        };
      } else {
        return {
          money: player.money - 5000,
          karma: Math.max(0, player.karma - 50),
          inPrison: Math.random() < 0.5,
          prisonYearsLeft: 8
        };
      }
    },
    message: (player, result) => {
      if (result.money && result.money > player.money - 5000) {
        return `Your Ponzi scheme paid off! You made $${(result.money - (player.money - 5000)).toLocaleString()}.`;
      } else if (result.inPrison) {
        return 'The SEC caught onto your scheme. You were sentenced to 8 years in prison.';
      } else {
        return 'Your scheme collapsed before you could cash out.';
      }
    }
  },
  {
    id: 'smuggling',
    name: 'Smuggling',
    cost: 10000,
    isAvailable: (player) => player.age >= 18,
    effect: (player) => {
      if (player.money < 10000) return {};
      const successChance = 0.4 + (player.smarts / 200);
      if (Math.random() < successChance) {
        const stolenAmount = Math.floor(Math.random() * 100000) + 20000;
        return {
          money: player.money - 10000 + stolenAmount,
          karma: Math.max(0, player.karma - 30)
        };
      } else {
        return {
          money: player.money - 10000,
          karma: Math.max(0, player.karma - 40),
          inPrison: Math.random() < 0.5,
          prisonYearsLeft: 6
        };
      }
    },
    message: (player, result) => {
      if (result.money && result.money > player.money - 10000) {
        return `You successfully smuggled contraband across the border for $${(result.money - (player.money - 10000)).toLocaleString()}.`;
      } else if (result.inPrison) {
        return 'Customs found the contraband. You were sentenced to 6 years in prison.';
      } else {
        return 'You had to dump the cargo to avoid the coast guard.';
      }
    }
  },
  {
    id: 'illegal_gambling',
    name: 'Underground Casino',
    cost: 1000,
    isAvailable: (player) => player.age >= 18,
    effect: (player) => {
      if (player.money < 1000) return {};
      const successChance = 0.4;
      if (Math.random() < successChance) {
        const wonAmount = Math.floor(Math.random() * 10000) + 1000;
        return {
          money: player.money - 1000 + wonAmount,
          happiness: Math.min(100, player.happiness + 10)
        };
      } else {
        return {
          money: player.money - 1000,
          happiness: Math.max(0, player.happiness - 10)
        };
      }
    },
    message: (player, result) => {
      if (result.money && result.money > player.money - 1000) {
        return `You won big at the underground casino! +$${(result.money - (player.money - 1000)).toLocaleString()}`;
      } else {
        return 'You lost your $1,000 buy-in at the underground casino.';
      }
    }
  },
  {
    id: 'insider_trading',
    name: 'Insider Trading',
    cost: 50000,
    isAvailable: (player) => player.age >= 18 && player.smarts > 80 && player.money >= 50000,
    effect: (player) => {
      if (player.money < 50000) return {};
      const successChance = 0.5 + (player.smarts / 200);
      if (Math.random() < successChance) {
        const wonAmount = Math.floor(Math.random() * 500000) + 100000;
        return {
          money: player.money - 50000 + wonAmount,
          karma: Math.max(0, player.karma - 40)
        };
      } else {
        return {
          money: player.money - 50000,
          karma: Math.max(0, player.karma - 50),
          inPrison: Math.random() < 0.6,
          prisonYearsLeft: 5
        };
      }
    },
    message: (player, result) => {
      if (result.money && result.money > player.money - 50000) {
        return `You used insider info to make a killing on the stock market! +$${(result.money - (player.money - 50000)).toLocaleString()}`;
      } else if (result.inPrison) {
        return 'The SEC noticed your suspicious trades. You were sentenced to 5 years for insider trading.';
      } else {
        return 'The tip was bad and you lost your $50,000 investment.';
      }
    }
  },
  {
    id: 'pirating_software',
    name: 'Pirate Software',
    cost: 0,
    isAvailable: (player) => player.age >= 12,
    effect: (player) => {
      const successChance = 0.8 + (player.smarts / 200);
      if (Math.random() < successChance) {
        return {
          money: player.money + 500,
          karma: Math.max(0, player.karma - 2),
          happiness: Math.min(100, player.happiness + 5)
        };
      } else {
        return {
          karma: Math.max(0, player.karma - 5),
          happiness: Math.max(0, player.happiness - 10),
          money: Math.max(0, player.money - 1000) // Fined
        };
      }
    },
    message: (player, result) => {
      if (result.money && result.money > player.money) {
        return `You pirated some expensive software, saving $500!`;
      } else {
        return 'Your ISP caught you pirating and fined you $1,000.';
      }
    }
  },
  {
    id: 'vandalism',
    name: 'Vandalism',
    cost: 0,
    isAvailable: (player) => player.age >= 10 && player.age <= 25,
    effect: (player) => {
      const successChance = 0.7;
      if (Math.random() < successChance) {
        return {
          karma: Math.max(0, player.karma - 10),
          happiness: Math.min(100, player.happiness + 15)
        };
      } else {
        return {
          karma: Math.max(0, player.karma - 15),
          happiness: Math.max(0, player.happiness - 20),
          money: Math.max(0, player.money - 500) // Fined
        };
      }
    },
    message: (player, result) => {
      if (result.happiness && result.happiness > player.happiness) {
        return 'You spray-painted a building. It was a thrill!';
      } else {
        return 'You were caught vandalizing and had to pay a $500 fine.';
      }
    }
  },
  {
    id: 'embezzlement',
    name: 'Embezzlement',
    cost: 0,
    isAvailable: (player) => player.age >= 18 && player.job !== null && player.job.salary > 50000,
    effect: (player) => {
      const successChance = 0.4 + (player.smarts / 200);
      if (Math.random() < successChance) {
        const stolenAmount = Math.floor(Math.random() * 100000) + 20000;
        return {
          money: player.money + stolenAmount,
          karma: Math.max(0, player.karma - 40)
        };
      } else {
        return {
          karma: Math.max(0, player.karma - 50),
          inPrison: Math.random() < 0.6,
          prisonYearsLeft: 5,
          job: null // Lose job
        };
      }
    },
    message: (player, result) => {
      if (result.money && result.money > player.money) {
        return `You successfully embezzled $${(result.money - player.money).toLocaleString()} from your company!`;
      } else if (result.inPrison) {
        return 'You were caught embezzling funds. You lost your job and were sentenced to 5 years in prison.';
      } else {
        return 'You were caught embezzling funds and fired from your job.';
      }
    }
  },
  {
    id: 'tax_evasion',
    name: 'Tax Evasion',
    cost: 0,
    isAvailable: (player) => player.age >= 18 && player.money > 100000,
    effect: (player) => {
      const successChance = 0.5 + (player.smarts / 200);
      if (Math.random() < successChance) {
        const savedAmount = Math.floor(player.money * 0.1); // Save 10% of wealth
        return {
          money: player.money + savedAmount,
          karma: Math.max(0, player.karma - 30)
        };
      } else {
        const fineAmount = Math.floor(player.money * 0.2); // Fined 20% of wealth
        return {
          money: Math.max(0, player.money - fineAmount),
          karma: Math.max(0, player.karma - 40),
          inPrison: Math.random() < 0.3,
          prisonYearsLeft: 3
        };
      }
    },
    message: (player, result) => {
      if (result.money && result.money > player.money) {
        return `You hid your assets in offshore accounts, saving $${(result.money - player.money).toLocaleString()} in taxes!`;
      } else if (result.inPrison) {
        return `The IRS audited you. You were fined $${(player.money - (result.money || 0)).toLocaleString()} and sentenced to 3 years in prison.`;
      } else {
        return `The IRS audited you. You were fined $${(player.money - (result.money || 0)).toLocaleString()}.`;
      }
    }
  },
  {
    id: 'arson',
    name: 'Arson',
    cost: 100,
    isAvailable: (player) => player.age >= 14,
    effect: (player) => {
      if (player.money < 100) return {};
      const successChance = 0.6;
      if (Math.random() < successChance) {
        return {
          money: player.money - 100,
          karma: Math.max(0, player.karma - 50),
          happiness: Math.min(100, player.happiness + 20)
        };
      } else {
        return {
          money: player.money - 100,
          karma: Math.max(0, player.karma - 60),
          inPrison: true,
          prisonYearsLeft: 10
        };
      }
    },
    message: (player, result) => {
      if (result.happiness && result.happiness > player.happiness) {
        return 'You burned down an abandoned warehouse. The flames were mesmerizing.';
      } else {
        return 'You were caught committing arson and sentenced to 10 years in prison.';
      }
    }
  },
  {
    id: 'counterfeiting',
    name: 'Counterfeiting',
    cost: 5000,
    isAvailable: (player) => player.age >= 18 && player.smarts > 70,
    effect: (player) => {
      if (player.money < 5000) return {};
      const successChance = 0.4 + (player.smarts / 200);
      if (Math.random() < successChance) {
        const fakeMoney = Math.floor(Math.random() * 100000) + 20000;
        return {
          money: player.money - 5000 + fakeMoney,
          karma: Math.max(0, player.karma - 40)
        };
      } else {
        return {
          money: player.money - 5000,
          karma: Math.max(0, player.karma - 50),
          inPrison: Math.random() < 0.7,
          prisonYearsLeft: 7
        };
      }
    },
    message: (player, result) => {
      if (result.money && result.money > player.money - 5000) {
        return `Your counterfeit operation was a success! You printed $${(result.money - (player.money - 5000)).toLocaleString()} in fake bills.`;
      } else if (result.inPrison) {
        return 'The Secret Service raided your operation. You were sentenced to 7 years in prison.';
      } else {
        return 'Your fake bills were too obvious and you had to destroy them.';
      }
    }
  },
  {
    id: 'extortion',
    name: 'Extortion',
    cost: 0,
    isAvailable: (player) => player.age >= 16,
    effect: (player) => {
      const successChance = 0.5 + (player.looks / 200); // Intimidation factor
      if (Math.random() < successChance) {
        const extortedAmount = Math.floor(Math.random() * 10000) + 1000;
        return {
          money: player.money + extortedAmount,
          karma: Math.max(0, player.karma - 30)
        };
      } else {
        return {
          karma: Math.max(0, player.karma - 40),
          inPrison: Math.random() < 0.4,
          prisonYearsLeft: 3
        };
      }
    },
    message: (player, result) => {
      if (result.money && result.money > player.money) {
        return `You successfully extorted a local business for $${(result.money - player.money).toLocaleString()}.`;
      } else if (result.inPrison) {
        return 'The business owner called the cops. You were sentenced to 3 years in prison.';
      } else {
        return 'The business owner refused to pay and chased you off.';
      }
    }
  }
];

export const ACTIVITIES: Activity[] = [
  {
    id: 'report_parents',
    name: 'Report Parents to CPS',
    cost: 0,
    isAvailable: (player) => player.age < 18 && player.parents && player.parents.length > 0 && !player.inGroupHome,
    effect: (player) => {
      const neglectCount = player.parentalNeglectCount || 0;
      // Base chance 10%, +15% per neglect count
      const successChance = 0.1 + (neglectCount * 0.15);
      
      if (Math.random() < successChance) {
        // Success
        const updates: Partial<Player> = { 
          parents: [], // Removed from parents
          happiness: Math.max(0, player.happiness - 20),
          stress: Math.max(0, (player.stress || 0) + 30)
        };
        
        // Check for relatives
        const livingGrandparents = player.grandparents?.filter(gp => !gp.isDead) || [];
        const livingAuntsUncles = player.auntsAndUncles?.filter(au => !au.isDead) || [];
        
        const hasGrandparents = livingGrandparents.length > 0;
        const hasAuntsUncles = livingAuntsUncles.length > 0;
        
        if (hasGrandparents || hasAuntsUncles) {
          updates.inGroupHome = false;
          let possibleGuardians: {name: string, type: string}[] = [];
          if (hasGrandparents) {
            possibleGuardians.push(...livingGrandparents.map(gp => ({ name: gp.name, type: 'grandparent' })));
          }
          if (hasAuntsUncles) {
            possibleGuardians.push(...livingAuntsUncles.map(au => ({ name: au.name, type: 'aunt/uncle' })));
          }
          const chosenGuardian = possibleGuardians[Math.floor(Math.random() * possibleGuardians.length)];
          updates.guardianName = `${chosenGuardian.type} ${chosenGuardian.name}`;
        } else {
          updates.inGroupHome = true;
          updates.guardianName = 'the group home';
        }
        return updates;
      } else {
        // Failure
        const updatedParents = player.parents.map(p => ({ ...p, relationship: 0 }));
        return { 
          parents: updatedParents, 
          happiness: Math.max(0, player.happiness - 30),
          stress: Math.max(0, (player.stress || 0) + 40)
        };
      }
    },
    message: (player, result) => {
      if (result && result.parents && result.parents.length === 0) {
        if (result.inGroupHome) {
          return 'CPS investigated and removed you from your parents. You had no living relatives to take you in, so you were placed in a group home.';
        } else {
          return `CPS investigated and removed you from your parents. You were placed in the care of your ${result.guardianName}.`;
        }
      } else {
        return 'CPS investigated but found insufficient evidence of neglect. Your parents found out you reported them and are furious.';
      }
    },
    limitPerYear: 1,
  },
  {
    id: 'travel_local',
    name: 'Local Vacation',
    cost: 1500,
    effect: (player) => ({ happiness: Math.min(100, player.happiness + 10), stress: Math.max(0, (player.stress || 0) - 15) }),
    message: 'You took a nice local vacation and relaxed.',
    limitPerYear: 2,
  },
  {
    id: 'travel_international',
    name: 'International Vacation',
    cost: 5000,
    effect: (player) => ({ happiness: Math.min(100, player.happiness + 25), smarts: Math.min(100, player.smarts + 2), stress: Math.max(0, (player.stress || 0) - 30) }),
    message: 'You traveled abroad and experienced a new culture!',
    limitPerYear: 1,
  },
  {
    id: 'travel_luxury',
    name: 'Luxury World Tour',
    cost: 25000,
    effect: (player) => ({ happiness: Math.min(100, player.happiness + 50), fame: player.fame + 5, stress: 0 }),
    message: 'You went on a luxury world tour! It was incredible.',
    limitPerYear: 1,
  },
  {
    id: 'golf',
    name: 'Play Golf',
    cost: 150,
    effect: (player) => ({ happiness: Math.min(100, player.happiness + 3), stress: Math.max(0, (player.stress || 0) - 5), popularity: Math.min(100, player.popularity + 1) }),
    message: 'You played a round of golf and networked with some locals.',
    limitPerYear: 12,
  },
  {
    id: 'yacht_party',
    name: 'Host Yacht Party',
    cost: 10000,
    isAvailable: (player) => player.assets.some(a => a.type === 'Boat' && a.value >= 150000),
    effect: (player) => ({ happiness: Math.min(100, player.happiness + 15), popularity: Math.min(100, player.popularity + 10), fame: player.fame + 2 }),
    message: 'You hosted an incredible yacht party! Everyone is talking about it.',
    limitPerYear: 2,
  },
  {
    id: 'charity_gala',
    name: 'Attend Charity Gala',
    cost: 5000,
    effect: (player) => ({ karma: Math.min(100, player.karma + 10), popularity: Math.min(100, player.popularity + 5), fame: player.fame + 1 }),
    message: 'You attended a charity gala and donated to a good cause.',
    limitPerYear: 2,
  },
  {
    id: 'concert',
    name: 'Attend a Concert',
    cost: 200,
    effect: (player) => ({ happiness: Math.min(100, player.happiness + 8), stress: Math.max(0, (player.stress || 0) - 10) }),
    message: 'You attended an amazing concert!',
    limitPerYear: 5,
  },
  {
    id: 'museum',
    name: 'Go to a Museum',
    cost: 30,
    effect: (player) => ({ happiness: Math.min(100, player.happiness + 4), smarts: Math.min(100, player.smarts + 1) }),
    message: 'You visited a museum and learned some new things.',
    limitPerYear: 5,
  },
  {
    id: 'cooking_class',
    name: 'Take a Cooking Class',
    cost: 150,
    effect: (player) => ({ happiness: Math.min(100, player.happiness + 5), smarts: Math.min(100, player.smarts + 2) }),
    message: 'You took a cooking class and made a delicious meal.',
    limitPerYear: 3,
  },
  {
    id: 'doctor',
    name: 'Doctor Visit',
    cost: 500,
    effect: (player) => {
      const updates: Partial<Player> = { health: Math.min(100, player.health + 2) };
      if (player.illnesses && player.illnesses.length > 0) {
        if (Math.random() < 0.3) {
          updates.illnesses = player.illnesses.slice(1);
          updates.health = Math.min(100, player.health + 10);
        }
      }
      return updates;
    },
    message: 'You visited the doctor and feel slightly better.',
    limitPerYear: 3,
  },
  {
    id: 'er',
    name: 'Emergency Room',
    cost: 10000,
    effect: (player) => {
      const updates: Partial<Player> = { health: Math.min(100, player.health + 25) };
      if (player.illnesses && player.illnesses.length > 0) {
        if (Math.random() < 0.6) {
          updates.illnesses = player.illnesses.slice(1);
          updates.health = Math.min(100, player.health + 40);
        }
      }
      return updates;
    },
    message: 'You went to the ER and received major treatment.',
  },
  {
    id: 'gym',
    name: 'Go to the Gym',
    cost: 100,
    effect: (player) => ({ 
      health: Math.min(100, player.health + 1),
      happiness: Math.min(100, player.happiness + 2),
      looks: Math.min(100, player.looks + 1),
      stress: Math.max(0, (player.stress || 0) - 5)
    }),
    message: 'You had a good workout at the gym.',
    limitPerYear: 10,
  },
  {
    id: 'walk',
    name: 'Go for a Walk',
    cost: 0,
    effect: (player) => ({ health: Math.min(100, player.health + 1), stress: Math.max(0, (player.stress || 0) - 2) }),
    message: 'You went for a refreshing walk.',
  },
  {
    id: 'meditate',
    name: 'Meditate',
    cost: 0,
    effect: (player) => ({ happiness: Math.min(100, player.happiness + 2), stress: Math.max(0, (player.stress || 0) - 10) }),
    message: 'You meditated and feel more at peace.',
    limitPerYear: 5,
  },
  {
    id: 'therapy',
    name: 'Therapy',
    cost: 800,
    effect: (player) => ({ happiness: Math.min(100, player.happiness + 5), stress: Math.max(0, (player.stress || 0) - 20) }),
    message: 'You talked through some issues in therapy.',
    limitPerYear: 5,
  },
  {
    id: 'spa',
    name: 'Spa Day',
    cost: 1500,
    effect: (player) => ({ 
      happiness: Math.min(100, player.happiness + 8),
      looks: Math.min(100, player.looks + 2),
      stress: Math.max(0, (player.stress || 0) - 15)
    }),
    message: 'You had a relaxing spa day.',
    limitPerYear: 3,
  },
  {
    id: 'friends',
    name: 'Hang out with friends',
    cost: 50,
    effect: (player) => ({ happiness: Math.min(100, player.happiness + 4) }),
    message: 'You hung out with friends and had a good time.',
  },
  {
    id: 'party',
    name: 'Go to a party',
    cost: 100,
    effect: (player) => ({ happiness: Math.min(100, player.happiness + 6) }),
    message: 'You partied hard!',
  },
  {
    id: 'movie',
    name: 'Go to a movie',
    cost: 40,
    effect: (player) => ({ happiness: Math.min(100, player.happiness + 3) }),
    message: 'You enjoyed a movie.',
  },
  {
    id: 'vacation',
    name: 'Travel vacation',
    cost: 2000,
    effect: (player) => ({ happiness: Math.min(100, player.happiness + 15) }),
    message: 'You went on a wonderful vacation.',
  },
  {
    id: 'casino',
    name: 'Casino',
    cost: 200,
    effect: (player) => {
      const win = Math.random() > 0.6;
      if (win) {
        return { money: player.money + 500, happiness: Math.min(100, player.happiness + 5) };
      } else {
        return { happiness: Math.max(0, player.happiness - 5) };
      }
    },
    message: 'You visited the casino.',
  },
  {
    id: 'street_racing',
    name: 'Street Racing',
    cost: 500,
    effect: (player) => {
      const crash = Math.random() > 0.8;
      if (crash) {
        return { health: Math.max(0, player.health - 50), happiness: Math.max(0, player.happiness - 20) };
      } else {
        return { money: player.money + 1000, happiness: Math.min(100, player.happiness + 10) };
      }
    },
    message: 'You participated in a street race.',
  },
  {
    id: 'plastic_surgery',
    name: 'Plastic Surgery',
    cost: 15000,
    effect: (player) => {
      const botched = Math.random() > 0.9;
      if (botched) {
        return { looks: Math.max(0, player.looks - 30), health: Math.max(0, player.health - 10), happiness: Math.max(0, player.happiness - 30) };
      } else {
        return { looks: Math.min(100, player.looks + 25), happiness: Math.min(100, player.happiness + 10) };
      }
    },
    message: 'You got plastic surgery.',
  },
  {
    id: 'library',
    name: 'Visit the Library',
    cost: 0,
    effect: (player) => ({ smarts: Math.min(100, player.smarts + 1) }),
    message: 'You read some interesting books at the library.',
    limitPerYear: 3,
  },
  {
    id: 'read_book',
    name: 'Read a Book',
    cost: 20,
    effect: (player) => ({ smarts: Math.min(100, player.smarts + 2) }),
    message: 'You finished reading a great book.',
    limitPerYear: 3,
  },
  {
    id: 'online_course',
    name: 'Take an Online Course',
    cost: 200,
    effect: (player) => ({ smarts: Math.min(100, player.smarts + 5) }),
    message: 'You completed an online course and learned a lot.',
    limitPerYear: 3,
  },
  {
    id: 'hire_tutor',
    name: 'Hire a Tutor',
    cost: 1000,
    effect: (player) => ({ smarts: Math.min(100, player.smarts + 10) }),
    message: 'You had an intensive study session with a tutor.',
    limitPerYear: 3,
  }
];
