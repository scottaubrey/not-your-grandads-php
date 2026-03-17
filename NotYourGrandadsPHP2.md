---
title: Not your Grandad's PHP
sub_title: PHP Runtime System
theme:
  name: gruvbox-dark
---

History of PHP
===================
## PHP
<!-- pause -->
- (2017) PHP 7.2 **Sodium library**, trailing commas, type widening
- (2018) PHP 7.3 array destructuring, trailing commas, FPM
- (2019) PHP 7.4 Type properties, **arrow (short) functions**, **preloading**
- (2020) PHP 8.0 **Jit compiler**, union type, **named arguments**
- (2021) PHP 8.1 Enums, readonly properties, Fibers
- (2022) PHP 8.2 readonly classes, null, false and true
- (2023) PHP 8.3 Typed constants
- (2024) PHP 8.4 **property hooks**, **asymmetric visibility for properties**, and **lazy objects**
- (2025) PHP 8.5 **pipe operator**
- (*2026*) PHP 8.6 **partial function applications**


<!-- end_slide -->
PHP 7.2 (2017)
===================
# Sodium library

> PHP is the first programming language to commit to modern cryptography in its standard library, coming in version 7.2.0.
>
> _- Scott Arciszewski_

> Sodium is a modern, easy-to-use software library for encryption, decryption, signatures, password hashing and more. Its goal is to provide all of the core operations needed to build higher-level cryptographic tools. 

```php +exec
<?php
$plaintext = "Hello World";
var_dump($plaintext);

$key = sodium_crypto_secretbox_keygen();
$nonce = random_bytes(SODIUM_CRYPTO_SECRETBOX_NONCEBYTES);
$ciphertext = sodium_crypto_secretbox($plaintext, $nonce, $key);

var_dump(bin2hex($ciphertext));
// The same nonce and key are required to decrypt the $ciphertext
var_dump(sodium_crypto_secretbox_open($ciphertext, $nonce, $key));

```

<!-- end_slide -->
PHP 7.4 (2019)
===================
# Short closures
```php +exec
<?php

function named_function($name) { return "Hello {$name}"; }

$closure = function ($name) { return "Hello {$name}"; };

$short_closure = fn($name) => "Hello {$name}";


echo named_function("Scott").PHP_EOL;
echo $closure("Scott").PHP_EOL;
echo $short_closure("Scott").PHP_EOL;
```

<!-- end_slide -->
PHP 7.4 (2019)
===================
# Short closures
```php +exec
<?php

$name = "Scott";
function named_function() { return "Hello {$name}"; }

$closure = function () use ($name) { return "Hello {$name}"; };

$short_closure = fn() => "Hello {$name}";


echo $closure().PHP_EOL;
echo $short_closure().PHP_EOL;
echo named_function().PHP_EOL;
```


<!-- end_slide -->
PHP 7.4 (2019)
===================
# Preloading
<!-- column_layout: [2, 2] -->
<!-- column: 0 -->
```bash +exec
echo "No preloading..."
php -d "opcache.enable_cli=On" -r 'new TestClass();'
```
```bash +exec
echo "Preloading..."
echo '<?php class TestClass { public function __construct() { echo "Preloaded Class"; } }' > preload.php
php -d "opcache.enable_cli=On" -d "opcache.preload=preload.php" -r 'new TestClass();'
```
<!-- pause -->
<!-- column: 1 -->
```bash +exec
echo '<?php $name = "Scott";' > preload.php

echo "As a pre-run script..."
php -d "opcache.enable_cli=On" -r 'require "preload.php"; echo "hello {$name}" . PHP_EOL;'
```
```bash +exec
echo '<?php $name = "Scott";' > preload.php

echo "As a preload..."
php -d "opcache.enable_cli=On" -d "opcache.preload=preload.php" -r 'echo "hello {$name}" . PHP_EOL;'
```


<!-- end_slide -->
PHP 8.0 (2020)
===================
# Named arguments

<!-- column_layout: [1, 1, 1] -->
<!-- column: 0 -->
```php +exec
<?php
var_dump(
  range(
    5, 
    20, 
    5,
  )
);
```
<!-- pause -->
<!-- column: 1 -->
```php +exec
<?php
var_dump(
  range(
    start: 5, 
    end: 20, 
    step: 5,
  )
);
```
<!-- pause -->
<!-- column: 2 -->
```php +exec
<?php
var_dump(
  range(
    step: 5,
    start: 5, 
    end: 20, 
  )
);
```
<!-- end_slide -->

PHP 8.0 (2020)
===================
# Named arguments
<!-- column_layout: [1, 1] -->
<!-- column: 0 -->
```php +exec +id:named
<?php
function runTests(
    ?string $filter = null,
    int $timeLimit = 5000,
) {
    var_dump(["filter" => $filter, "timeLimit" => $timeLimit]);
}

runTests();
runTests("parser");
runTests(null, 20000);
runTests(null, timeLimit: 20000);
runTests(timeLimit: 20000);
```
<!-- column: 1 --> 
<!-- snippet_output: named -->

<!-- end_slide -->


PHP 8.0 (2020)
===================
# JIT

```php 
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
```

```bash +exec
php -d opcache.enable_cli=1 -d opcache.jit=tracing -d opcache.jit_buffer_size=0 jit_bench.php
php -d opcache.enable_cli=1 -d opcache.jit=tracing -d opcache.jit_buffer_size=100M jit_bench.php
```

<!-- end_slide -->
PHP 8.1 (2021)
===================
# Fibers
<!-- column_layout: [2, 1] -->
<!-- column: 0 -->

```php +exec +id:fibers1
<?php

$fiber1 = new Fiber(function (): void {
    echo "F1: Do async call...\n";
    Fiber::suspend('Fiber 1 is taking a nap.');
    echo "F1: async call finished!\n";
});

$fiber2 = new Fiber(function (): void {
    echo "F2: Do some data processing...\n";
    Fiber::suspend('Fiber 2 is taking a break.');
    echo "F2: Processing complete!\n";
});

echo "--- Starting Loop ---\n";
$value1 = $fiber1->start();
$value2 = $fiber2->start();

echo "Main: Suspended with message: '$value1'\n";
echo "Main: Suspended with message: '$value2'\n";
echo "Main: Do work with fibers paused.\n";

echo "--- Resuming Fibers ---\n";
$fiber1->resume();
$fiber2->resume();

echo "Main: Work finished.\n";
```
<!-- column: 1 -->

<!-- snippet_output: fibers1 -->
<!-- end_slide -->
PHP 8.1 (2021)
===================
# Fibers

```php 
<?php

class AsyncProcess {
    public $fiber;
    private $process;
    private $pipes;
    public function __construct(string $command) {
        $this->fiber = new Fiber(function() use ($command) {
            $descriptors = [1 => ["pipe", "w"], 2 => ["pipe", "w"]];
            $this->process = proc_open($command, $descriptors, $this->pipes);
            stream_set_blocking($this->pipes[1], false);
            
            // Loop inside the fiber: check if done, otherwise pause
            while (true) {
                $status = proc_get_status($this->process);
                if (!$status['running']) {
                    break;
                }
                // STOP HERE: Give control back to the main loop
                Fiber::suspend();
            }
            
            $output = stream_get_contents($this->pipes[1]);
            fclose($this->pipes[1]);
            fclose($this->pipes[2]);
            proc_close($this->process);
            return trim($output);
        });
    }
}
```

<!-- end_slide -->
PHP 8.1 (2021)
===================
# Fibers
<!-- column_layout: [2, 1] -->
<!-- column: 0 -->
```php +exec +id:fibers
<?php
/// class AsyncProcess {
///     public $fiber;
///     private $process;
///     private $pipes;
///     public function __construct(string $command) {
///         $this->fiber = new Fiber(function() use ($command) {
///             $descriptors = [1 => ["pipe", "w"], 2 => ["pipe", "w"]];
///             $this->process = proc_open($command, $descriptors, $this->pipes);
///             stream_set_blocking($this->pipes[1], false);
///             // Loop inside the fiber: check if done, otherwise pause
///             while (true) {
///                 $status = proc_get_status($this->process);
///                 if (!$status['running']) {
///                     break;
///                 }
///                 // STOP HERE: Give control back to the main loop
///                 Fiber::suspend();
///             }
///             $output = stream_get_contents($this->pipes[1]);
///             fclose($this->pipes[1]);
///             fclose($this->pipes[2]);
///             proc_close($this->process);
///             return trim($output);
///         });
///     }
/// }
// --- The "Scheduler" ---
$tasks = [
    new AsyncProcess("sleep 3 && echo 'Task A finished'"),
    new AsyncProcess("sleep 2 && echo 'Task B finished'"),
    new AsyncProcess("sleep 1 && echo 'Task C finished'"),
];

foreach ($tasks as $task) {
    $task->fiber->start();
}

echo "Main: All tasks started. Polling for results...\n";

do {
    $allFinished = true;
    
    foreach ($tasks as $index => $task) {
        if (!$task->fiber->isTerminated()) {
            $allFinished = false;
            $task->fiber->resume();
        } else {
            if (isset($tasks[$index])) {
                echo "Main: result: " . $task->fiber->getReturn() . "\n";
                unset($tasks[$index]); // Remove finished task
            }
        }
    }
} while (!$allFinished);

echo "Main: Everything done!\n";
```
<!-- column: 1 -->
<!-- snippet_output: fibers -->

<!-- end_slide -->
PHP 8.1 (2021)
===================
# First Class Callables

```php +exec +line_numbers
<?php
$uppercase1 = 'ucfirst';
echo $uppercase1("scott aubrey").PHP_EOL;
```
<!-- pause -->
```php +exec +line_numbers
<?php
class TestClass { 
  public static function ucfirst($string) { return ucfirst($string); } 
}
$uppercase2 = [TestClass::class, 'ucfirst'];

echo $uppercase2("scott aubrey").PHP_EOL;
```
<!-- pause -->

<!-- end_slide -->
PHP 8.1 (2021)
===================
# First Class Callables

```php +exec +line_numbers
<?php
class TestClass { 
  private static function ucfirst($string) { return ucfirst($string); } 
  public static function get_callable_ucfirst() { return [self::class, 'ucfirst']; }
  public static function call_ucfirst($string) { 
      return self::get_callable_ucfirst()($string);
  }
}
$uppercase2 = TestClass::get_callable_ucfirst();

echo TestClass::call_ucfirst("scott aubrey").PHP_EOL;
echo $uppercase2("scott aubrey").PHP_EOL;
```
<!-- pause -->
<!-- end_slide -->
PHP 8.1 (2021)
===================
# First Class Callables

```php +exec +line_numbers
<?php
// $uppercase1 = 'ucfirst';
$uppercase1 = ucfirst(...);
echo $uppercase1("scott aubrey").PHP_EOL;
```
<!-- pause -->
```php +exec +line_numbers
<?php
class TestClass { 
  private static function ucfirst($string) { return ucfirst($string); } 
  public static function get_callable_ucfirst() { return self::ucfirst(...); }
  public static function call_ucfirst($string) { 
      return self::get_callable_ucfirst()($string);
  }
}
$uppercase2 = TestClass::get_callable_ucfirst();

echo TestClass::call_ucfirst("scott aubrey").PHP_EOL;
echo $uppercase2("scott aubrey").PHP_EOL;
```

<!-- end_slide -->
PHP 8.1 (2021)
===================
# First Class Callables
```php +exec  +line_numbers
<?php
$uppercase = ucfirst(...);
$uppercaseArray = array_map($uppercase, ...);
$wordToArray = explode(" ", ...);
$arrayToWords = implode(" ", ...);

$names = $wordToArray("scott aubrey");
$names = $uppercaseArray($names);
$name = $arrayToWords($names);
echo $name;
```
<!-- end_slide -->

PHP 8.4 (2024)
===================
# lazy objects
<!-- column_layout: [2, 1] -->
<!-- column: 0 -->
```php +exec +id:lazy1
<?php
class Group  {
    public function __construct(
        public int $id,
        public string $name,
    ) {}
}
class User {  
    public function __construct(
        public int $id,
        public string $name,
        /** @var $groups Group[] */
        public array $groups
    ) {}
}

/// function getUserFromSource($id) {
///     return [
///         "id" => 1,
///         "name" => "Scott",
///         "groups" => [1, 2],
///     ];
/// }
/// function getGroupFromSource($id) {
///     return [
///         "id" => $id,
///         "name" => "Group".$id,
///     ];
/// }

function getUser(string $id): User { 
    $userData = getUserFromSource($id);
    return new User(
        $userData['id'],
        $userData['name'],
        array_map(fn($groupId) => getGroupFromSource($groupId), $userData['groups']),
    ); 
}

var_dump(getUser(1));
```

<!-- column: 1 -->

<!-- snippet_output: lazy1-->
<!-- end_slide -->

PHP 8.4 (2024)
===================
# lazy objects
<!-- column_layout: [2, 1] -->
<!-- column: 0 -->
```php +exec +id:lazy +line_numbers
<?php
/// class Group  {
///     public function __construct(
///         public int $id,
///         public string $name,
///     ) {}
/// }
/// class User {  
///     public function __construct(
///         public int $id,
///         public string $name,
///         /** @var $groups Group[] */
///         public array $groups
///     ) {}
/// }

/// function getUserFromSource($id) {
///     return [
///         "id" => 1,
///         "name" => "Scott",
///         "groups" => [1, 2],
///     ];
/// }
/// function getGroupFromSource($id) {
///     return [
///         "id" => $id,
///         "name" => "Group".$id,
///     ];
/// }

function getUser(string $id): User { 
    $groupClassReflection = new ReflectionClass(Group::class);
    
    $userData = getUserFromSource($id);
    return new User(
        $userData['id'],
        $userData['name'],
        array_map(
            fn($groupId) => $groupClassReflection->newLazyGhost(
                function($group) use ($groupId) {
                    $groupData = getGroupFromSource($groupId);
                    $group->id = $groupId;
                    $group->name = $groupData['name'];
                }
            ), 
            $userData['groups']
        ),
    ); 
}

$user = getUser(1);
var_dump($user);
var_dump($user->groups[1]->name);
var_dump($user);
```

<!-- column: 1 -->
<!-- snippet_output: lazy -->
<!-- end_slide -->

PHP 8.4 (2024)
===================

# Asymmetric visibility for properties
<!-- column_layout: [1, 1] -->
<!-- column: 0 -->
```php +exec
<?php
class User  {
    public function __construct(
        public int $id,
        public string $name,
    ) {}
}

$user = new User(1, "Scott");
$user->name = "Sctt";
var_dump($user->name);
```
<!-- column: 1 -->
```php +exec
<?php
class User  {
    public function __construct(
        private int $id,
        private string $name,
    ) {}
}

$user = new User(1, "Scott");
var_dump($user->name);
```
<!-- end_slide -->

PHP 8.4 (2024)
===================

# Asymmetric visibility for properties
```php +exec
<?php
class User  {
    public function __construct(
        public private(set) int $id,
        public private(set) string $name,
    ) {}
}

$user = new User(1, "Scott");
var_dump($user->name);
$user->name = "NotAllowed";
```
<!-- end_slide -->

PHP 8.4 (2024)
===================

# Property hooks

```php +exec
<?php
class User  {
    public function __construct(
        public private(set) int $id,
        public private(set) string $name {
            set (string $name) {
                $this->name = ucfirst($name);
            }
            get => lcfirst($this->name);
        },
    ) {}
}

$user = new User(1, "scott");
var_dump($user, $user->name);
$user->name = "NotAllowed";
```
<!-- end_slide -->


PHP 8.5 (2025)
===================
# pipe operator

```php +exec
<?php
$name = "scott aubrey"
    |> explode(" ", ...)
    |> array_map(ucfirst(...), ...)
    |> implode(" ", ...);
echo $name;
```

<!-- end_slide -->
PHP 8.6 (later in 2026)
===================
# Partial function application

<!-- column_layout: [1, 1] -->
<!-- column: 0 -->

```php +exec
<?php
$name = "scott aubrey"
    |> explode(" ", ...)
    |> array_map(ucfirst(...), ...)
    |> implode(" ", ...);
echo $name;
```

```php +exec
<?php
$name = "scott aubrey"
    |> explode(" ", ?)
    |> array_map(ucfirst(?), ?)
    |> implode(" ", ?);
echo $name;
```

<!-- pause -->
<!-- column: 1 -->

```php 
<?php

$name = "scott aubrey"
    |> str_pad(..., 20, " ")
    |> substr(..., 0, 20);
var_dump($name);
```

```bash +exec
/opt/homebrew/opt/php@8.5/bin/php -d "display_errors=0" -r 'var_dump("scott aubrey" |> str_pad(..., 20, " ") |> substr(..., 0, 20));'
echo ""
/opt/homebrew/opt/php@8.6/bin/php -d "display_errors=0" -r 'var_dump("scott aubrey" |> str_pad(..., 20, " ") |> substr(..., 0, 20));'
```
<!-- end_slide -->
PHP 8.6 (later in 2026)
===================
# Partial function application
```php +exec
<?php

$name = "scott aubrey"
    |> str_pad(?, 20, " ")
    |> substr(?, 0, 20);
var_dump($name);
```
<!-- pause -->
```php +exec
<?php

$name = "scott aubrey"
    |> str_pad(?, ?, " ")(?, 20)
    |> substr(?, 0, ?)(?, 20);
var_dump($name);

$name = "scott aubrey"
    |> str_pad(?, ?, " ")(?, length: 20)
    |> substr(?, 0, ?)(?, length: 20);
var_dump($name);

$name = "scott aubrey"
    |> str_pad(?, ?, " ")(length: 20, ...)
    |> substr(?, 0, ?)(length: 20, ...);
var_dump($name);
```
<!-- end_slide -->
