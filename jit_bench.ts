function isPrime(n: number): boolean {
    if (n === 2 || n === 3) return true;
    if (n < 2 || n % 2 === 0) return false;
    for (let i = 3; i <= Math.sqrt(n); i += 2) {
        if (n % i === 0) return false;
    }
    return true;
}

const start = performance.now() / 1000;
let count = 0;
for (let i = 2; i < 5000000; i++) {
    if (isPrime(i)) {
        count++;
    }
}
const end = performance.now() / 1000;

console.log(`Found ${count} primes`);
console.log(`Execution Time: ${(end - start).toFixed(4)}s`);
