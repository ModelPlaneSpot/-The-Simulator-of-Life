export const REGIONAL_NAMES: Record<string, { male: string[], female: string[], last: string[] }> = {
  "United States": {
    male: ["James", "John", "Robert", "Michael", "William", "David", "Richard", "Joseph", "Thomas", "Charles"],
    female: ["Mary", "Patricia", "Jennifer", "Linda", "Elizabeth", "Barbara", "Susan", "Jessica", "Sarah", "Karen"],
    last: ["Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Rodriguez", "Martinez"]
  },
  "United Kingdom": {
    male: ["Oliver", "George", "Harry", "Noah", "Jack", "Leo", "Arthur", "Muhammad", "Oscar", "Charlie"],
    female: ["Olivia", "Amelia", "Isla", "Ava", "Mia", "Ivy", "Lily", "Isabella", "Rosie", "Sophia"],
    last: ["Smith", "Jones", "Taylor", "Williams", "Brown", "Davies", "Evans", "Wilson", "Thomas", "Roberts"]
  },
  "France": {
    male: ["Gabriel", "Leo", "Raphael", "Arthur", "Louis", "Jules", "Adam", "Mael", "Lucas", "Hugo"],
    female: ["Jade", "Louise", "Emma", "Alice", "Ambre", "Lina", "Rose", "Chloe", "Mia", "Lea"],
    last: ["Martin", "Bernard", "Thomas", "Petit", "Robert", "Richard", "Durand", "Dubois", "Moreau", "Laurent"]
  },
  "Germany": {
    male: ["Noah", "Matteo", "Elias", "Finn", "Leon", "Paul", "Emil", "Luca", "Felix", "Louis"],
    female: ["Emilia", "Mia", "Sophia", "Emma", "Hannah", "Lina", "Mila", "Ella", "Klara", "Marie"],
    last: ["Muller", "Schmidt", "Schneider", "Fischer", "Weber", "Meyer", "Wagner", "Becker", "Schulz", "Hoffmann"]
  },
  "Spain": {
    male: ["Martin", "Hugo", "Mateo", "Leo", "Lucas", "Manuel", "Daniel", "Alejandro", "Pablo", "Enzo"],
    female: ["Lucia", "Martina", "Sofia", "Maria", "Valeria", "Julia", "Paula", "Emma", "Daniela", "Carla"],
    last: ["Garcia", "Rodriguez", "Gonzalez", "Fernandez", "Lopez", "Martinez", "Sanchez", "Perez", "Gomez", "Martin"]
  },
  "Italy": {
    male: ["Leonardo", "Francesco", "Alessandro", "Lorenzo", "Mattia", "Andrea", "Gabriele", "Riccardo", "Tommaso", "Edoardo"],
    female: ["Sofia", "Aurora", "Giulia", "Ginevra", "Beatrice", "Alice", "Vittoria", "Emma", "Ludovica", "Matilde"],
    last: ["Rossi", "Russo", "Ferrari", "Esposito", "Bianchi", "Romano", "Colombo", "Ricci", "Marino", "Greco"]
  },
  "Japan": {
    male: ["Haruto", "Minato", "Haruki", "Sota", "Yuto", "Riku", "Yuuma", "Hinata", "Asahi", "Ren"],
    female: ["Himari", "Tsumugi", "Rin", "Mei", "Hina", "Aoi", "Yua", "Mio", "Ichika", "Sakura"],
    last: ["Sato", "Suzuki", "Takahashi", "Tanaka", "Watanabe", "Ito", "Yamamoto", "Nakamura", "Kobayashi", "Kato"]
  },
  "China": {
    male: ["Wei", "Hao", "Dong", "Ming", "Jian", "Cheng", "Qiang", "Jun", "Feng", "Yong"],
    female: ["Fang", "Jing", "Min", "Yan", "Wei", "Xia", "Hong", "Juan", "Li", "Qi"],
    last: ["Wang", "Li", "Zhang", "Liu", "Chen", "Yang", "Huang", "Zhao", "Wu", "Zhou"]
  },
  "India": {
    male: ["Aarav", "Vihaan", "Vivaan", "Ananya", "Diya", "Advik", "Kabir", "Ansh", "Arjun", "Sai"],
    female: ["Saanvi", "Aanya", "Aadhya", "Aaradhya", "Ananya", "Pari", "Diya", "Navya", "Myra", "Ira"],
    last: ["Kumar", "Singh", "Sharma", "Patel", "Shah", "Gupta", "Deshmukh", "Rao", "Reddy", "Chauhan"]
  },
  "Brazil": {
    male: ["Miguel", "Arthur", "Gael", "Heitor", "Theo", "Davi", "Gabriel", "Bernardo", "Samuel", "Joao Miguel"],
    female: ["Helena", "Alice", "Laura", "Maria Alice", "Valentina", "Heloisa", "Maria Clara", "Maria Cecilia", "Maria Julia", "Sophia"],
    last: ["Silva", "Santos", "Oliveira", "Souza", "Rodrigues", "Ferreira", "Alves", "Pereira", "Lima", "Gomes"]
  },
  "Russia": {
    male: ["Alexander", "Mikhail", "Maxim", "Artem", "Ivan", "Daniel", "Dmitry", "Ilya", "Kirill", "Egor"],
    female: ["Sofia", "Maria", "Anna", "Alisa", "Victoria", "Anastasia", "Polina", "Alexandra", "Elizaveta", "Daria"],
    last: ["Ivanov", "Smirnov", "Kuznetsov", "Popov", "Sokolov", "Lebedev", "Kozlov", "Novikov", "Morozov", "Petrov"]
  },
  "Mexico": {
    male: ["Santiago", "Mateo", "Sebastian", "Leonardo", "Matias", "Emiliano", "Diego", "Daniel", "Miguel Angel", "Alexander"],
    female: ["Sofia", "Maria Jose", "Valentina", "Regina", "Camila", "Valeria", "Ximena", "Maria Fernanda", "Victoria", "Renata"],
    last: ["Hernandez", "Garcia", "Martinez", "Lopez", "Gonzalez", "Perez", "Rodriguez", "Sanchez", "Ramirez", "Cruz"]
  },
  "Nigeria": {
    male: ["Abubakar", "Musa", "Ibrahim", "Umar", "Aliyu", "Hassan", "Sani", "Abdullahi", "Usman", "Mohammed"],
    female: ["Fatima", "Aisha", "Zainab", "Maryam", "Khadija", "Amina", "Hauwa", "Halima", "Rukayya", "Jamila"],
    last: ["Ibrahim", "Musa", "Abubakar", "Abdullahi", "Umar", "Usman", "Aliyu", "Hassan", "Sani", "Mohammed"]
  },
  "Egypt": {
    male: ["Muhammad", "Ahmed", "Mahmoud", "Mustafa", "Youssef", "Ali", "Omar", "Amr", "Tarek", "Hassan"],
    female: ["Fatma", "Aya", "Nour", "Mariam", "Habiba", "Salma", "Mona", "Heba", "Amira", "Nada"],
    last: ["Mohamed", "Ahmed", "Mahmoud", "Ali", "Hassan", "Ibrahim", "Mostafa", "Sayed", "Youssef", "Osama"]
  },
  "South Africa": {
    male: ["Junior", "Bandile", "Melusi", "Lethabo", "Siyabonga", "Thabiso", "Banele", "Samkelo", "Sanele", "Lubabalo"],
    female: ["Amahle", "Minenhle", "Thandolwethu", "Melokuhle", "Lesedi", "Siphesihle", "Lethabo", "Kamogelo", "Naledi", "Owami"],
    last: ["Dlamini", "Ndlovu", "Khumalo", "Sithole", "Mokoena", "Nkosi", "Zungu", "Mthembu", "Mkhize", "Mahlangu"]
  },
  "Australia": {
    male: ["Oliver", "Noah", "Jack", "William", "Leo", "Lucas", "Thomas", "Henry", "Charlie", "James"],
    female: ["Charlotte", "Amelia", "Olivia", "Isla", "Mia", "Ava", "Grace", "Willow", "Harper", "Chloe"],
    last: ["Smith", "Jones", "Williams", "Brown", "Wilson", "Taylor", "Johnson", "White", "Martin", "Anderson"]
  },
  "Canada": {
    male: ["Noah", "Liam", "Jackson", "Lucas", "Logan", "Benjamin", "Jacob", "William", "Oliver", "James"],
    female: ["Olivia", "Emma", "Charlotte", "Sophia", "Aria", "Ava", "Chloe", "Zoey", "Abigail", "Amelia"],
    last: ["Smith", "Brown", "Tremblay", "Martin", "Roy", "Gagnon", "Lee", "Wilson", "Johnson", "MacDonald"]
  }
};

export const DEFAULT_NAMES = {
  male: ["Liam", "Noah", "Oliver", "Elijah", "James", "William", "Benjamin", "Lucas", "Henry", "Theodore"],
  female: ["Olivia", "Emma", "Charlotte", "Amelia", "Ava", "Sophia", "Isabella", "Mia", "Evelyn", "Harper"],
  last: ["Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Rodriguez", "Martinez"]
};

export function getRandomName(country: string, gender: 'Male' | 'Female'): { first: string, last: string } {
  const region = REGIONAL_NAMES[country] || DEFAULT_NAMES;
  const firstNames = gender === 'Male' ? region.male : region.female;
  const lastNames = region.last;
  
  return {
    first: firstNames[Math.floor(Math.random() * firstNames.length)],
    last: lastNames[Math.floor(Math.random() * lastNames.length)]
  };
}
