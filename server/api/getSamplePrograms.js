export default defineEventHandler(async (event) => {
  return {
    "Hello World": hwCode,
    "Binary Tree": btCode,
    "Database": dbCode,
    "Fibonacci Sequence": fibCode,
    "Prime Number Finder": isPrime, 
    "Binary Stream Adder": adderCode,

  }
})

const hwCode = `extern int func printf(str s, ...); # Import printf

# Define the main program in the system. 
define program :: c : Channel<-int> = {
  printf("Hello, World!\\n");
  c.send(0)
}`

const btCode = `extern int func printf(str s, ...);

# Defines a struct that holds no value; used to simulate optionals
define struct Empty {}

/* 
 * Defines a struct for each binary tree node
 * Members: 
 *  - value, the integer value stored at this node
 *  - lhs, an anonymous enum that is either empty, or a pointer to a binary tree node
 *  - rhs, an anonymous enum that is either empty, or a pointer to a binary tree node
 */
define struct BinaryTree {
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
define func insertBT(Box<BinaryTree> root, int value) {
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
define func printSpaces(int chars) {
  int i := 0; 
  while i < chars {
    printf(" ");
    i := i + 1; 
  }
  return; 
}

# Function to print a binary tree node. 
define func printBT(BinaryTree node) 
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

define func traversePreOrder(int padding, str prefix, BinaryTree node) {
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

define program :: c : Channel<-int> = {
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

const dbCode = `extern int func printf(str s, ...);

define struct Empty {}
define struct Value {int v;}
define enum OptVal {Empty, Value}

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
define Database :: c : Channel<
                        !ExternalChoice<
                              +int;-OptVal,
                              +int;+Value,
                              +int;InternalChoice<
                                       -Value;+Value,
                                       +Value>>> = {

  Value[10] data; 

  # Helper function to look up a value in the database. 
  define func Lookup(Value[10] d, int k) : OptVal {
     if k < 0 | k >= 10 { return Empty::init(); }
     return d[k]; 
  }

  # Helper function to log the contents of teh database
  define func PrintDatabase(Value[10] data) {
      var i := 0; 
      while i < data.length {
        var v := data[i]; 
        printf("%u, ", v.v);
        i := i + 1; 
      }
      printf("\\n");
      return;
  }

  printf("Initial Database State:\\n");
  PrintDatabase(data); 

  accept(c) {
    offer c 
      | +int;-OptVal => { 
            c.send(Lookup(data, c.recv()))
        }
      | +int;+Value => {
            var key := c.recv(); 
            data[key] := c.recv(); 
        }
      | +int;InternalChoice<-Value;+Value,+Value> => {
          var k := c.recv();
          c[+Value]
          data[k] := c.recv();
        }
    printf("Database Updated: \\n");
    PrintDatabase(data); 
  }
}

define program :: c : Channel<-int> = {
    var db := exec Database;  # Database to send requests to
    var rqs := exec requests; # Regular priority requests

    var setRq := exec writeRequest; # High-priority requests

    # Process each of the requests with high-priority requests taking precedence
    accept(rqs) { 

      acceptWhile(setRq, true) {
        more(db); 
        db[-int;-Value]
        db.send(setRq.recv())
        db.send(setRq.recv())
      }
   
      more(db)
      offer rqs 
        | +int;-OptVal => { 
            db[-int;+OptVal] 
            db.send(rqs.recv())  
            var a := db.recv();
            rqs.send(a) 
          } 
        | +int;+Value => { db[-int;-Value] db.send(rqs.recv()) db.send(rqs.recv()) }
        | +int;InternalChoice<-Value;+Value, +Value> => { 
            db[-int;ExternalChoice<+Value;-Value, -Value>] 
            db.send(rqs.recv())
            offer db 
                |   +Value;-Value => { rqs[-Value;+Value] rqs.send(db.recv()) db.send(rqs.recv())}
                |   -Value => { rqs[+Value] db.send(rqs.recv()) }
          }
  
    }
 

    accept(setRq) {
      more(db); 
      db[-int;-Value]
      db.send(setRq.recv())
      db.send(setRq.recv())
    }

    weaken(db)
    c.send(0);
}


define requests :: c : Channel<
                        ?InternalChoice<
                              -int;+OptVal,
                              -int;-Value,
                              -int;ExternalChoice<
                                       +Value;-Value,
                                       -Value>>> = {

    
    more(c)
    c[-int;+OptVal]
    c.send(4)
    var opt := c.recv(); 

    printf("Read Request for 4 got: ");

    match opt
      | Empty e => { printf("empty\\n"); }
      | Value v => { printf("%u\\n", v.v); }

    more(c)
    c[-int;+OptVal]
    c.send(20)
    opt := c.recv(); 

    printf("Read Request for 20 got: ");

    match opt
      | Empty e => { printf("empty\\n"); }
      | Value v => { printf("%u\\n", v.v); }

    weaken(c)
}

define writeRequest :: c : Channel<?(-int;-Value)> = {
    
    more(c)
    c.send(4)
    c.send(Value::init(2))
    
    weaken(c)
}`

const fibCode = `extern int func printf(str s,...);

define fib :: c : Channel<+int;-int> = {
  int n := c.recv(); 

  if(n == 0 | n == 1) {
    c.send(n) exit
  }

  Channel<-int;+int> f1 := exec fib; 
  Channel<-int;+int> f2 := exec fib; 

  f1.send(n - 1)
  f2.send(n - 2)

  int v1 := f1.recv(), v2 := f2.recv();

  c.send(v1 + v2)
}

define program :: c : Channel<-int> = {
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

const isPrime = `extern int func printf(str s,...);

# Function version of isPrime
define func isPrimeFunc(int n) : boolean {
  var i := 3;
  while (i < n) { 
    if (n / i * i == n) { return false; } 
    i := i + 2;
  }
  return true;
}

# Program version of isPrime
define isPrimeProg :: c : Channel<+int;-boolean> = {
  int n := c.recv();
  var i := 3, done := false, ans := true;

  while (!done & i < n) { 
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

define program :: c : Channel<-int> = {
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

const adderCode = `extern int func printf(str s, ...);

# Main program 
# - Spawns a BinaryCounter and toDecimal process
# - Uses the getBinaryStreamFor function to get a binary stream 
#      representation of two numbers (7 and 5 by default). The 
#      resulting stream is sent to the BinaryCounter process.  
# - The output of the BinaryCounter process is sent to the toDecimal
#      process which converts the output binary stream into a decimal 
#      representation.
define program :: c : Channel<-int> = {
  var addStream := exec BinaryCounter, printer := exec toDecimal;
  addStream.send(getBinaryStreamFor(7));
  addStream.send(getBinaryStreamFor(5));

  printer.send(addStream);
  c.send(0); 
}

# Receives two Channel<!+boolean> which each represent a stream of bits in 
# a binary number. We read both streams bit-by-bit and output the result 
# of adding them together. 
define BinaryCounter :: c : Channel<+Channel<!+boolean>; +Channel<!+boolean>;?-boolean> = {
    # Defines the local variables for each of the channels  
    var i1 := c.recv(), i2 := c.recv();

    # Tracks the remainder we have to carry to the next bit
    boolean carry := false; 
    accept(i1) {
        # Receive a boolean on i1, 
        boolean val := i1.recv(); 

        # Attempt to receive a single boolean on i2 (which could end before i1)
        boolean looped2, val2 := false; 
        acceptWhile(i2, !looped2) {val2 := i2.recv(); looped2 := true;}

        # Implements a full-adder to calculate the resulting sum and carry
        boolean xor := XOR(val, val2); 
        boolean sum := XOR(xor, carry); 
        carry := (xor & carry) | (val & val2);
        
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
        carry := val & carry; 
    }

    # After both channels have ended, it is possible that we have 
    # one last bit to output. 
    if carry {
        more(c); 
        c.send(carry);
    }

    weaken(c);  
}

define func XOR (boolean a, boolean b) : boolean {
    return (a & !b) | (!a & b);
}

define func getBinaryStreamFor(int n) : Channel<!+boolean> {
    var c := exec toBinary; 
    c.send(n); 
    return c; 
}

define toBinary :: c : Channel<+int;?-boolean> = {
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

define toDecimal :: c : Channel<+Channel<!+boolean>> = {
    var a := c.recv(), dec_val := 0, base := 1; 
 
    accept(a) { 
        if a.recv() {
            dec_val := dec_val + base; 
        }
 
        base := base * 2;
    }
 
    printf("%u\n", dec_val);
}`