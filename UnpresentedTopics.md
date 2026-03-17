Appendix
===================
<!-- end_slide -->

<!-- end_slide -->
PHP 5.3 (2009)
===================
<!-- pause -->
# Namespaces
```php +exec
<?php
namespace {
    class Zend_Controller_Front
    {
        public function __construct() { echo __CLASS__.PHP_EOL; }
    }
}
//became
namespace Zend\Controller {
    class FrontController
    {
        public function __construct() { echo __CLASS__.PHP_EOL; }
    }
}
namespace MyNamespace {
    use Zend\Controller\FrontController;

    $class1 = new \Zend_Controller_Front();
    $class2 = new FrontController();
}
```

<!-- end_slide -->
PHP 5.4 (2012)
===================
<!-- pause -->
# Traits
```php +exec
<?php
trait Logger {
    public function log ($message) { echo "Log: ".$message.PHP_EOL; }
}

class Thingy {
    use Logger;

    public function __construct($id)
    {
        if (isset($GLOBALS['debug'])) {
            $this->log('A Thingy was made: '.$id);
        }
    }
}

$thingy = new Thingy(1);
$debug = true;
$thingy2 = new Thingy(2);
```

<!-- end_slide -->
PHP 5.4 (2012)
===================
<!-- pause -->
# Built-in webserver
```bash +exec
echo "<h1>Hello World from <?= __FILE__;?>!</h1>" > index.php
php -S localhost:8888&
curl -s localhost:8888
kill %1
```

<!-- end_slide -->
PHP 5.5 (2013)
===================
<!-- pause -->
# Generators
```php +exec
<?php
function testGenerator() {
    yield 1;
    yield 2;
    yield 3;
}

foreach (testGenerator() as $value) {
    echo $value.PHP_EOL;
}
```

<!-- end_slide -->
PHP 5.5 (2013)
===================
# Generators
<!-- column_layout: [1, 1] -->
<!-- column: 0 -->
```php +exec
<?php
function sleepAndReadTime()
{
    $cmd = proc_open(
        'bash -c "sleep 1; date"',
        [1 => ['pipe', 'w']],
        $pipes
    );
    echo fread($pipes[1], 1024);
    proc_close($cmd);
}

sleepAndReadTime();
sleepAndReadTime();
```
<!-- pause -->
<!-- column: 1 -->

```php +exec
<?php
function sleepAndReadTime()
{
    $cmd = proc_open(
        'bash -c "sleep 1; date"',
        [1 => ['pipe', 'w']],
        $pipes
    );
    yield;
    echo fread($pipes[1], 1024);
    proc_close($cmd);
}

$generator1 = sleepAndReadTime();
$generator2 = sleepAndReadTime();

$generator1->current(); // start
$generator2->current(); // start

$generator1->send(null); // resolve
$generator2->send(null); // resolve
```

<!-- end_slide -->
PHP 5.6 (2014)
===================
# Variadic functions
<!-- column_layout: [1, 1] -->
<!-- column: 0 -->
```php +exec
<?php
function cillaAsk()
{
    $args = func_get_args();
    $name = array_shift($args);
    $place = implode(', ', $args);
    echo "I'm ".$name.' from '.$place;
}
cillaAsk("Scott", "Bradford", "West Yorkshire");
```
<!-- pause -->
<!-- column: 1 -->
```php +exec
<?php
function cillaAsk($name, ...$place)
{
    $place = implode(', ', $place);
    echo "I'm ".$name.' from '.$place;
}
cillaAsk("Scott", "Bradford", "West Yorkshire");


<!-- end_slide -->
PHP 7.0 (2015)
===================
# Null coalescing operator
```php +exec
<?php
$username = isset($_GET['user']) ? $_GET['user'] : 'nobody';
echo $username.PHP_EOL;

$username = isset($_GET['user']) ? $_GET['user'] : (isset($_POST['user']) ? $_POST['user'] : 'nobody');
echo $username.PHP_EOL;
```
<!-- pause -->
```php +exec
<?php
$username = $username = $_GET['user'] ?? 'nobody';
echo $username.PHP_EOL;

$username = $username = $_GET['user'] ?? $_POST['user'] ?? 'nobody';
echo $username.PHP_EOL;
```


<!-- end_slide -->
PHP 8.0 (2020)
===================
# Constructor Property Promotion
<!-- column_layout: [1, 1] -->
<!-- column: 0 -->
```php +exec
<?php
class Person
{
    public string $name;
    public string $location;

    public function __construct(
        string $name,
        string $location
    ) {
        $this->name = $name;
        $this->location = $location;
    }
}

$person = new Person("Scott", "Bradford");
echo $person->name;
```

<!-- pause -->
<!-- column: 1 -->
```php +exec
<?php
class Person
{
    public function __construct(
        public string $name,
        public string $location
    ) {
    }
}

$person = new Person("Scott", "Bradford");
echo $person->name;
```


<!-- end_slide -->
PHP 8.0 (2020)
===================
# Null Safe Operator
<!-- column_layout: [1, 1] -->
<!-- column: 0 -->
```php +exec
<?php
/// class Repo
/// {
///     public function getUser(string $id): ?stdClass {
///         $user = new stdClass;
///         $user->name = "Scott";
///         return $user;
///     }
/// }

function getUserName(string $id) {
    $repo = new Repo();
    $user = $repo->getUser('ajhiIUyifs');
    if ($user === null) {
        return null;
    }
    return $user->name;
}
echo getUserName("akdaljkad");

```

<!-- pause -->
<!-- column: 1 -->
```php +exec
<?php
/// class Repo
/// {
///     public function getUser(string $id): ?stdClass {
///         $user = new stdClass;
///         $user->name = "Scott";
///         return $user;
///     }
/// }

function getUserName(string $id) {
    $repo = new Repo();
    return $repo->getUser('ajhiIUyifs')?->name;
}
echo getUserName("akdaljkad");
```


<!-- end_slide -->
PHP 8.0 (2020)
===================
# Match expression
<!-- column_layout: [1, 1] -->
<!-- column: 0 -->
```php +exec
<?php

$value = "Scott";
$type = match (gettype($value)) {
    "string" => "word",
    "int" => "number",
    "float" => "number",
    "bool" => "boolean",
};
echo "This is a ".$type.PHP_EOL;

$value = 1;
$type = match (gettype($value)) {
    "string" => "word",
    "integer", "float" => "number",
    "bool" => "boolean",
};
echo "This is a ".$type.PHP_EOL;
```
<!-- pause -->
<!-- column: 1 -->
```php +exec
<?php

$age = 3;
$ticketType = match (true) {
    $age < 5 => "free",
    $age < 18 => "child",
    $age >= 18 => "adult",
};
echo "This is a ".$ticketType." ticket".PHP_EOL;

```
<!-- pause -->
```php +exec
<?php

$value = 1;
$type = match (gettype($value)) {
    "string" => "string",
};
echo "This is a ".$type.PHP_EOL;

```
