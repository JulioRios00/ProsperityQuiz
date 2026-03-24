// Pythagorean numerology table
const PYTHAGOREAN: Record<string, number> = {
  a:1,b:2,c:3,d:4,e:5,f:6,g:7,h:8,i:9,
  j:1,k:2,l:3,m:4,n:5,o:6,p:7,q:8,r:9,
  s:1,t:2,u:3,v:4,w:5,x:6,y:7,z:8,
};

function reduceToDigit(n: number): number {
  while (n > 9 && n !== 11 && n !== 22) {
    n = String(n).split('').reduce((acc, d) => acc + parseInt(d), 0);
  }
  return n;
}

// Destiny number from birth date string "YYYY-MM-DD" or "DD/MM/YYYY"
export function calcDestinyNumber(birthDate: string): number {
  const digits = birthDate.replace(/\D/g, '');
  const sum = digits.split('').reduce((acc, d) => acc + parseInt(d), 0);
  return reduceToDigit(sum);
}

// Expression number from full name
export function calcExpressionNumber(name: string): number {
  const sum = name.toLowerCase().split('').reduce((acc, ch) => {
    return acc + (PYTHAGOREAN[ch] ?? 0);
  }, 0);
  return reduceToDigit(sum);
}

// Prosperity block type (0-4)
export function calcProsperityBlock(destiny: number, expression: number): number {
  return (destiny + expression) % 5;
}

export const PROSPERITY_BLOCK_LABELS = [
  'Autossabotagem',
  'Ciclo de Escassez',
  'Desvalorização',
  'Medo da Abundância',
  'Padrão Familiar',
];

// Real-time expression number as user types (for animation)
export function calcExpressionLive(name: string): number {
  if (!name.trim()) return 0;
  const sum = name.toLowerCase().split('').reduce((acc, ch) => {
    return acc + (PYTHAGOREAN[ch] ?? 0);
  }, 0);
  return reduceToDigit(sum);
}
