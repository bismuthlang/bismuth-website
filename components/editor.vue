<template>
  <div class="gradient py-4">
    <!-- <client-only placeholder="Loading..."> -->
      <div class="grid grid-cols-2 space-x-6 max-w-6xl mx-auto">
        <CodeEditor theme="light" class="my-editor capped-width col-span-2 lg:col-span-1 m-6 lg:m-0" :display_language="false" height="38rem" v-model="code"
          :languages="[['tbd', 'TBD']]"></CodeEditor>
        <div class="flex capped-width max-h-[inherit] flex-col col-span-2 lg:col-span-1 m-6 lg:m-0">
          <span class="flex">
            <button disabled v-if="isLoading" class="run_btn mb-2 p-2 flex" v-on:click="compile">Run  <Spinner class="ml-2"/> </button>
            <button v-else class="run_btn mb-2 p-2" v-on:click="compile">Run -> </button>
            <select v-on:change="selectChange" :disabled="isLoading" name="Program" class="program_select mx-4 mb-2 p-2">
              <option hidden disabled selected value> Load Sample Program </option>
              <option value="bt">Binary Tree</option>
              <option value="db">Database</option>
              <option value="opel">Opel</option>
              <option value="audi">Audi</option>
            </select>
          </span>
          <pre class="terminal h-full p-4 overflow-auto">
{{ terminalText }}
            </pre>
        </div>
      </div>
    <!-- </client-only> -->
  </div>
</template>


<script lang="js">

// navigateTo('/')

useServerSeoMeta({
  title: 'Bismuth Editor',
  // ogTitle: 'My Amazing Site',
  // description: 'This is my amazing site, let me tell you all about it.',
  // ogDescription: 'This is my amazing site, let me tell you all about it.',
  // ogImage: 'https://example.com/image.png',
  // twitterCard: 'summary_large_image',
})

import hljs from "highlight.js";
import CodeEditor from 'simple-code-editor';

hljs.registerLanguage("tbd", (hljs) => ({
  name: "Tbd",
  aliases: ["tbd", "TBD"],
  keywords: {
    keyword: "if while else func define extern match offer return select exit struct enum",
    type: "int boolean str var Channel Program InternalChoice ExternalChoice"
  },
  contains: [
    {
      className: "comment",
      begin: /#.*/,
    },
    {
      className: "comment", 
      begin: /\/\*/, 
      end: /\*\//, 
    },
    {
      className: "string",
      begin: /"(?:[^"\\]|\\.)*"/,
    },
    {
      className: "type",
      begin: /\b[A-Z][^\r\n\t \(\)\[\]\{\}'"/]*\b/,
    },
    {
      className: "number",
      begin: /\b-?[0-9]+(\.[0-9]+)?\b/,
    },
  ],
}));

// hljs.initHighlightingOnLoad();

export default {
  components: {
    // PrismEditor,
    CodeEditor
  },
  data: () => ({
    code: '',
    terminalText: ">",
    isLoading: false, 
  }),
  methods: {

    compile: async function () {
      this.isLoading = true;       
      this.terminalText = ">"
      // const { data: resData } = await useFetch('/api/compile')
      const { data: resData } = await useFetch('/api/compile', { method: 'post', body: { code: this.code } })
      this.terminalText = resData._rawValue.data;
      this.isLoading = false; 
      // console.log(resData)
    },
    selectChange: async function(event) {
      console.log(event.target.value); 

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

      const Programs = {
        db: "Database", 
        bt: `extern int func printf(str s, ...);

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
}`,
      }

      this.code = Programs[event.target.value] || "";
    }
  },
};
</script>

<style>

.loader {
  border: 3px solid #f3f3f3; /* Light grey */
  border-top: 3px solid #3498db; /* Blue */
  border-radius: 50%;
  width: 20px;
  height: 20px;
  animation: spin 2s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.inherit-height {
  max-height: inherit;
}

.capped-width {
  width: calc(100% - 3rem) !important;
}

/* required class */
.my-editor {
  /* we don't use `language-` classes anymore so thats why we need to add background and text color manually */
  /* background: #2d2d2d; */
  /* background-color: transparent !important; */
  color: #3b3535;

  font-variant-ligatures: none;

  /* you must provide font-family font-size line-height. Example: */
  font-family: Fira code, Fira Mono, Consolas, Menlo, Courier, monospace;
  font-size: 14px;
  line-height: 1.5;
  padding: 5px;

  background: rgba(255, 255, 255, 0.25);
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.18);
}

/* optional class for removing the outline */
.prism-editor__textarea:focus {
  outline: none;
}

.atom_one_light.hljs,
.atom_one_light .hljs {
  /* .atom_one_dark.hljs, .atom_one_dark .hljs  */
  background-color: transparent !important;
}

.terminal {
  font-family: Fira code, Fira Mono, Consolas, Menlo, Courier, monospace;
  color: whitesmoke;

  background: rgba(25, 23, 23, 0.7);
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.18);
}

.run_btn {
  font-family: Fira code, Fira Mono, Consolas, Menlo, Courier, monospace;

  background: rgba(117, 197, 27, 0.6);
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.18);
}

.run_btn:disabled {
  background: rgba(118, 197, 27, 0.281);
}

.program_select {
  font-family: Fira code, Fira Mono, Consolas, Menlo, Courier, monospace;

  background: rgba(87, 90, 85, 0.6);
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.18);
}

.program_select:disabled {
  background: rgba(87, 90, 85, 0.308);
}

.gradient {
  background: repeating-linear-gradient(45deg, #fff, #fff 28px, #ccc 28px, #ccc 30px);
}
</style>
