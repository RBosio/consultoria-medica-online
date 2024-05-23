export function validCBU(cbu: string): boolean {
    if (cbu.length !== 22) return false;

    const weights1 = [7, 1, 3, 9, 7, 1, 3];
    const weights2 = [3, 9, 7, 1, 3, 9, 7, 1, 3, 9, 7, 1, 3];

    const checkDigit = (digits: number[], weights: number[]): number => {
        const sum = digits.reduce((acc, digit, i) => acc + digit * weights[i], 0);
        return (10 - (sum % 10)) % 10;
    };

    const digits = cbu.split('').map(Number);

    const validPart1 = checkDigit(digits.slice(0, 7), weights1) === digits[7];
    const validPart2 = checkDigit(digits.slice(8, 21), weights2) === digits[21];

    return validPart1 && validPart2;
};