export default defineEventHandler(async (event) => {
  return {
    "Hello World": hwCode,
    "Binary Tree": btCode,
    "Database": dbCode,
    "Fibonacci Sequence": fibCode,
    "Prime Number Finder": isPrime, 
    "Binary Stream Adder": adderCode,
    "Timeout Handler": timeoutHandler,
    "Basic Cancel": basicCancel

  }
})

const hwCode = `extern func printf(str s, ...) -> int; # Import printf

# Define the main program in the system. 
# - c is the name of the channel used by the program 
# - -int indicates that we have to send an int over the channel.
prog main :: c : -int {
  printf("Hello, World!\\n");
  c.send(0)
}`

const btCode = `extern func printf(str s, ...) -> int;

# Defines a struct that holds no value; used to simulate optionals
struct Empty {}

/* 
 * Defines a struct for each binary tree node
 * Members: 
 *  - value, the integer value stored at this node
 *  - lhs, an anonymous enum that is either empty, or a pointer to a binary tree node
 *  - rhs, an anonymous enum that is either empty, or a pointer to a binary tree node
 */
struct BinaryTree {
  int value; 
  (Empty + Box<BinaryTree>) lhs;  
  (Empty + Box<BinaryTree>) rhs; 
}

/* 
 * Function to insert a value into a binary tree. 
 * Parameters: 
 *  - root, a pointer to the binary tree to insert into
 *  - value, the integer value to insert to the tree
 * Returns: 
 *  - Unit/Nothing, as functions are synchronous and pass-by-reference, the parameter root will reflect the changes made. 
 */
func insertBT(Box<BinaryTree> root, int value) {
  BinaryTree bt := *root; # Get a pointer to the binary tree
  if bt.value < value {   # Check which side of the tree to insert into
    match bt.lhs {        # If the branch is empty, set it to be a new binary tree. Otherwise, recursively call insert. 
      Empty e => { 
        bt.lhs := Box<BinaryTree>::init(BinaryTree::init(value, Empty::init(), Empty::init()));
      }
      Box<BinaryTree> n => insertBT( n, value );
    }
  } else {
    match bt.rhs {
      Empty e => { 
        bt.rhs := Box<BinaryTree>::init(BinaryTree::init(value, Empty::init(), Empty::init()));
      }
      Box<BinaryTree> n => insertBT( n, value );
    }
  }
  *root := bt; # Update the pointer to the updated value
  return; 
}

# Helper function to print a number of spaces to the current line
func printSpaces(int chars) {
  int i := 0; 
  while i < chars {
    printf(" ");
    i := i + 1; 
  }
  return; 
}

# Function to print a binary tree node. 
func printBT(BinaryTree node) 
{
  printf("%u", node.value);
  printf("\\n");


  match node.lhs {
    Empty e => {}
    Box<BinaryTree> n => traversePreOrder(0, "├──", *n);
  }

  match node.rhs {
    Empty e => {}
    Box<BinaryTree> n => traversePreOrder(0, "└──", *n);
  }

  printf("\\n");
  return; 
}

func traversePreOrder(int padding, str prefix, BinaryTree node) {
  printSpaces(padding);
  printf(prefix);
  printf("%u", node.value);
  printf("\\n");

  match node.lhs {
    Empty e => {}
    Box<BinaryTree> n => traversePreOrder(padding + 3, "├──", *n);
  }

  match node.rhs {
    Empty e => {}
    Box<BinaryTree> n => traversePreOrder(padding + 3, "└──", *n);
  }
  
  return;
}

prog main :: c : -int {
  Box<BinaryTree> node := Box<BinaryTree>::init(BinaryTree::init(5, Empty::init(), Empty::init()));
  printBT( *node);
  insertBT(node, 6);
  printBT( *node);

  insertBT(node, 2);
  printBT( *node);

  insertBT(node, 3);
  printBT( *node);
  insertBT(node, 4);
  printBT( *node);

  insertBT(node, 7);
  printBT( *node);

  c.send(0)
}`

const dbCode = `extern func printf(str s, ...) -> int;

struct Value {int v;}
enum OptVal {Unit, Value}

# The Database program serves an external choice of 
# either: 
#   1. Receiving an integer key and returning an OptVal which 
#      stores either the Value corresponding to the key or Empty 
#      should the key be invalid. 
#   2. Receiving an integer key followed by a Value. This inserts the 
#      specified value into the database corresponding to the provided key. 
#   3. Receiving an integer key to lookup. If this key is in the database, 
#      then the current Value corresponding to the key is returned. Either way, 
#      the process then receives a new Value to store correlating to this key.  
prog Database :: c : !ExternalChoice<
                          get: +int;-OptVal,
                          set: +int;+Value,
                          lock: +int;InternalChoice<
                                    present: -Value;+Value,
                                    missing: +Value>> = {

  Value[10] data := [
    Value::init(10),
    Value::init(20),
    Value::init(30),
    Value::init(40),
    Value::init(50),
    Value::init(60),
    Value::init(70),
    Value::init(80),
    Value::init(90),
    Value::init(100)
  ];

  # Helper function to log the contents of the database
  func PrintDatabase(Value[10] data) {
      for(var i := 0; i < data.length; i := i + 1) {
        match data[i]
          | Value v => printf("%u, ", v.v);
          | Unit u => printf("*, ");
      }
      printf("\\n");
      return;
  }

  printf("Initial Database State:\\n");
  PrintDatabase(data); 

  accept(c) {
    offer c 
      | get => { 
          c.send(data[c.recv()]);
        }
      | set => {
            data[c.recv()] := c.recv();
        }
      | lock => {
          var k := c.recv();
          c[missing]
          data[k] := c.recv();
        }
    printf("Database Updated: \\n");
    PrintDatabase(data); 
  }
}

prog main :: c : -int {
    var db := exec Database;
    var rqs := exec requests;
    var setRq := exec writeRequest; 


    accept(rqs) {
      # Process each of the requests with high-priority requests taking precedence
      acceptIf(setRq, setRq.is_present()) {
        printf("AcceptIf Present!\\n");
        more(db); 
        db[set]
        db.send(setRq.recv())
        db.send(setRq.recv())
      }
      else 
      {
        printf("AcceptIf Not Present!\\n");
      }
   
      more(db)
      offer rqs 
        | +int;-OptVal => { 
            db[get] 
            db.send(rqs.recv())  
            var a := db.recv();
            rqs.send(a) 
          } 
        | +int;+Value => { 
            db[set] 
            db.send(rqs.recv()) 
            db.send(rqs.recv()) 
          }
        | +int;InternalChoice<-Value;+Value, +Value> => { 
            db[lock] 
            db.send(rqs.recv())
            offer db 
                | present => { rqs[-Value;+Value] rqs.send(db.recv()) db.send(rqs.recv())}
                | missing => { rqs[+Value] db.send(rqs.recv()) }
          }
  
    }
 

    accept(setRq) {
      more(db); 
      db[set]
      db.send(setRq.recv())
      db.send(setRq.recv())
    }

    weaken(db)
    c.send(0);
}


prog requests :: c : ?InternalChoice<
                      -int;+OptVal,
                      -int;-Value,
                      -int;ExternalChoice<
                                +Value;-Value,
                                -Value>> {

    
    more(c)
    c[-int;+OptVal]
    c.send(4)
    var opt := c.recv(); 

    printf("Read Request for 4 got: ");

    match opt
      | Unit e => { printf("empty\\n"); }
      | Value v => { printf("%u\\n", v.v); }

    more(c)
    c[-int;+OptVal]
    c.send(20)
    opt := c.recv(); 

    printf("Read Request for 20 got: ");

    match opt
      | Unit e => { printf("empty\\n"); }
      | Value v => { printf("%u\\n", v.v); }

    weaken(c)
}

prog writeRequest :: c : ?(-int;-Value) {
    more(c)
    c.send(4)
    c.send(Value::init(2))
    
    weaken(c)
}`

const fibCode = `extern func printf(str s,...) -> int;

prog fib :: c : +int;-int = {
  int n := c.recv(); 

  if(n == 0 || n == 1) {
    c.send(n) exit
  }

  Channel<-int;+int> f1 := exec fib; 
  Channel<-int;+int> f2 := exec fib; 

  f1.send(n - 1)
  f2.send(n - 2)

  int v1 := f1.recv(), v2 := f2.recv();

  c.send(v1 + v2)
}

prog main :: c : -int {
 var current := 1;        
 while current < 10 { 
    Channel<-int;+int> f := exec fib; 
    f.send(current)
    int i := f.recv();

   printf("The %dth fibonacci number is: %d\\n", current, i);
   current := current + 1; 
 }
  c.send(-1)
}`

const isPrime = `extern func printf(str s,...) -> int;

# Function version of isPrime
func isPrimeFunc(int n) -> boolean {
  var i := 3;
  while (i < n) { 
    if (n / i * i == n) { return false; } 
    i := i + 2;
  }
  return true;
}

# Program version of isPrime
prog isPrimeProg :: c : +int;-boolean {
  int n := c.recv();
  var i := 3, done := false, ans := true;

  while (!done && i < n) { 
    if (n / i * i == n) { 
      done := true; 
      ans := false; 
    }
    else  
    {
      i := i + 2;
    }
  }
  c.send(ans)
}

prog main :: c : -int {
  var current := 3;        
  int nPrimes := 2;
  while current < 100 { 
    Channel<-int; +boolean> c1 := exec isPrimeProg; 
    c1.send(current)
    boolean ans := c1.recv();

    if ans { 
      printf("%d is the %dth prime!\\n", current, nPrimes);
      nPrimes := nPrimes + 1;
    }
    current := current + 2;
  }
  c.send(nPrimes)
}`

const adderCode = `extern func printf(str s, ...) -> int;

# Main program 
# - Spawns a BinaryCounter and toDecimal process
# - Uses the getBinaryStreamFor function to get a binary stream 
#      representation of two numbers (7 and 5 by default). The 
#      resulting stream is sent to the BinaryCounter process.  
# - The output of the BinaryCounter process is sent to the toDecimal
#      process which converts the output binary stream into a decimal 
#      representation.
prog main :: c : -int {
  var addStream := exec BinaryCounter, printer := exec toDecimal;
  addStream.send(getBinaryStreamFor(7));
  addStream.send(getBinaryStreamFor(5));

  printer.send(addStream);
  c.send(0); 
}

# Receives two Channel<!+boolean> which each represent a stream of bits in 
# a binary number. We read both streams bit-by-bit and output the result 
# of adding them together. 
prog BinaryCounter :: c : +Channel<!+boolean>; +Channel<!+boolean>;?-boolean = {
    # Defines the local variables for each of the channels  
    var i1 := c.recv(), i2 := c.recv();

    # Tracks the remainder we have to carry to the next bit
    boolean carry := false; 
    accept(i1) {
        # Receive a boolean on i1, 
        boolean val := i1.recv(); 

        # Attempt to receive a single boolean on i2 (which could end before i1)
        boolean val2 := false; 
        acceptIf(i2, true) { val2 := i2.recv();}

        # Implements a full-adder to calculate the resulting sum and carry
        boolean xor := XOR(val, val2); 
        boolean sum := XOR(xor, carry); 
        carry := (xor && carry) || (val && val2);
        
        # Unfold one iteration of our output loop and send the sum over it
        more(c);
        c.send(sum);
    }

    # As it is possible that i1 ends before i2, we have to 
    # repeat the above process; however, only with i1. 
    accept(i2) {
        boolean val := i2.recv(); 
        more(c); 
        c.send(XOR(val, carry));
        carry := val && carry; 
    }

    # After both channels have ended, it is possible that we have 
    # one last bit to output. 
    if carry {
        more(c); 
        c.send(carry);
    }

    weaken(c);  
}

func XOR (boolean a, boolean b) -> boolean {
    return (a && !b) || (!a && b);
}

func getBinaryStreamFor(int n) -> Channel<!+boolean> {
    var c := exec toBinary; 
    c.send(n); 
    return c; 
}

prog toBinary :: c : +int;?-boolean {
    int n := c.recv(); 

    while n > 0 {
        more(c)
        if n % 2 == 1 {
            c.send(true);
        } else {
            c.send(false);
        }
        n := n / 2; 
    }

    weaken(c);
}

prog toDecimal :: c : +Channel<!+boolean> {
    var a := c.recv(), dec_val := 0, base := 1; 
 
    accept(a) { 
        if a.recv() {
            dec_val := dec_val + base; 
        }
 
        base := base * 2;
    }
 
    printf("%u\\n", dec_val);
}`

const basicCancel = `extern func printf(str s,...) -> int;

prog main :: c : -int 
{
    var other := exec peer;
    other.send(1); 
    other.send(2); 
    cancel(other);
    other.send(3);
    other.send(4);
    cancel(other); 

   c.send(0);
}

prog peer :: c : Cancelable<+int;+int>;+int;Cancelable<+int;+int> { 
    match c.recv()
        | Unit u => printf("First Recv: Canceled by main\\n");
        | int i => printf("First Recv: %u (expecting 1) \\n", i);
    cancel(c);
    printf("Second Recv: Canceled by peer\\n");

    printf("Third recv: %u (expected 3)\\n", c.recv());
    
    match c.recv() 
        | Unit u => printf("Fourth Recv: Canceled by main\\n");
        | int i => printf("Fourth Recv: %u (expected 4)\\n", i);

    match c.recv() 
        | Unit u => printf("Fifth Recv: Canceled by main (expected)\\n");
        | int i => printf("Fifth Recv: %u (Expected Canceled)\\n", i);

    cancel(c);
}`;



const timeoutHandler = `extern func printf(str s, ...) -> int;
# This program demonstrates how proxy processes can implement a timeout on 
# a data stream. 
prog main :: c : -int {
  var unsafe := exec direct;
  var prox := exec proxied;
  var l := prox.recv(), r := unsafe.recv();
  c.send(0)
}

prog proxied :: c : -int {
  var prod := exec producer;
  var safeProd := makeTimeout(prod);
  accept(safeProd) {
    printf("%u\\n", safeProd.recv());
  }
  printf("Safe version finished\\n");
  c.send(0)
}

prog direct :: c : -int {
  var prod := exec producer;
  accept(prod) {
    match prod.recv()
     | Unit u => printf("Unit\\n");
     | int i => printf("%u\\n");
  }
  cancel(prod);
  printf("Unsafe version finished\\n");
  c.send(0)
}

func makeTimeout (Channel<Cancelable<!+int>> c) -> Channel<!+int> {
  prog timeoutHandler :: c : +Channel<Cancelable<!+int>>; ?-int {
    var orig := c.recv(), now := 0;
    while now < 10 {
      acceptIf(orig, orig.is_present()) {
        match orig.recv()
         | Unit u => { now := 100; }
         | int i => { unfold(c); c.send(i); now := 0; }
      }
      else { now := now + 1; }
    }
    cancel(orig);
    weaken(c);
  }

  var ans := exec timeoutHandler;
  ans.send(c);
  return ans;
}

prog producer :: c : Cancelable<?-int> {
  var sum := 0;
  for (var i := 0; i < 100000000; i := i + 1) {

  }
  cancel (c)
}`