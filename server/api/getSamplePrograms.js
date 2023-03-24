    /*
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

  Value[20] data; 

  define func Lookup(Value[20] d, int k) : OptVal {
     if k < 0 | k >= 20 { return Empty::init(); }
     return d[k]; 
  }

  accept(c) {
    offer c 
      | +int;-OptVal => c.send(data[c.recv()])
      | +int;+Value => {
            var key := c.recv(); 
            data[key] := c.recv(); 
        }
      | +int;InternalChoice<-Value;+Value,+Value> => {
          var k := c.recv();
          
          c[+Value]
          data[k] := c.recv();
        }
  }
}

define program :: c : Channel<-int> = {
    var db := exec Database;
    var rqs := exec requests;

    var setRq;

    accept(rqs) {
      acceptWhile(setRq, true) {more(db); link(setRq, db)}
      more(db)
      link(rqs, db)
    }
    accept(writes) { more(db); link(setRq, db) }
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

    weaken(c)
}
*/

export default defineEventHandler(async (event) => {
    return {
        Programs: {
            bt: {
                name: "Binary Tree", 
                code: btCode
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
  printf("\n");


  match node.lhs {
    Empty e => {}
    Box<BinaryTree> n => traversePreOrder(0, "├──", *n);
  }

  match node.rhs {
    Empty e => {}
    Box<BinaryTree> n => traversePreOrder(0, "└──", *n);
  }

  printf("\n");
  return; 
}

define func traversePreOrder(int padding, str prefix, BinaryTree node) {
  printSpaces(padding);
  printf(prefix);
  printf("%u", node.value);
  printf("\n");

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