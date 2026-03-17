<?php
function isPrime($n) {
    if ($n === 2 || $n === 3) return true;
    if ($n < 2 || $n % 2 === 0) return false;
    for ($i = 3; $i <= sqrt($n); $i += 2) {
        if ($n % $i === 0) return false;
    }
    return true;
}

$start = microtime(true);
$count = 0;
for ($i = 2; $i < 5000000; $i++) {
    if (isPrime($i)) {
        $count++;
    }
}
$end = microtime(true);

echo "Found $count primes\n";
echo "Execution Time: " . round($end - $start, 4) . "s\n";
