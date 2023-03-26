export default defineEventHandler(async (event) => {
    return {
        Programs: {
            hw: {
              name: "Hello World!", 
              code: `extern int func printf(str s, ...); # Import printf

# Define the main program in the system. 
define program :: c : Channel<-int> = {
  printf("Hello, World!\\n");
  c.send(0)
}`
            },
            bt: {
                name: "Binary Tree", 
                code: btCode
            },
            db: {
              name: "Database", 
              code: dbCode
            }
        }
    }
})

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

define Database :: c : Channel<
                        !ExternalChoice<
                              +int;-OptVal,
                              +int;+Value,
                              +int;InternalChoice<
                                       -Value;+Value,
                                       +Value>>> = {

  Value[10] data; 

  define func Lookup(Value[10] d, int k) : OptVal {
     if k < 0 | k >= 10 { return Empty::init(); }
     return d[k]; 
  }

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
    var db := exec Database;
    var rqs := exec requests;

    var setRq := exec writeRequest; 
   
    acceptWhile(setRq, true) {
        more(db); 
        db[-int;-Value]
        db.send(setRq.recv())
        db.send(setRq.recv())
      }

    accept(rqs) {
   
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