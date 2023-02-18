<template>
  <div class="h-100 gradient">
    <client-only placeholder="Loading...">
      <div class="flex justify-center flex-row space-x-6 max-w-6xl mx-auto my-4 h-[38rem] max-h-max">
        <prism-editor class="my-editor grow basis-0" v-model="code" :highlight="highlighter" line-numbers></prism-editor>
        <!-- <prism-editor class="my-editor" v-model="code" :highlight="highlighter" line-numbers></prism-editor> -->
        <div class="flex flex-col grow basis-0">
          <span>
            <button class="run_btn mb-2 p-2" v-on:click="compile">Run -></button>
          </span>
          <pre class="terminal h-full p-4 overflow-auto">
{{ terminalText }}
          </pre>
        </div>
      </div>
    </client-only>
  </div>
</template>

<script lang="js">
// import Prism Editor
import { PrismEditor } from 'vue-prism-editor';
import 'vue-prism-editor/dist/prismeditor.min.css'; // import the styles somewhere

// import highlighting library (you can use any library you want just return html string)
import { highlight, languages } from 'prismjs/components/prism-core';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';
import 'prismjs/themes/prism-dark.css'; // import syntax highlighting styles

export default {
  components: {
    PrismEditor,
  },
  data: () => ({ 
    code: 'console.log("Hello World")', 
    terminalText: ">"
  }),
  methods: {
    highlighter(code) {
      return highlight(code, languages.js); // languages.<insert language> to return html with markup
    },
    compile: async function () {
      this.terminalText = ">"
      // const { data: resData } = await useFetch('/api/compile')
      const { data: resData } = await useFetch('/api/compile', { method: 'post', body: { code: this.code } })
      this.terminalText = resData._rawValue.data; 
      console.log(resData)
    }
  },
};
</script>

<style>
/* required class */
.my-editor {
  /* we dont use `language-` classes anymore so thats why we need to add background and text color manually */
  /* background: #2d2d2d; */
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

.gradient {
  background: repeating-linear-gradient(45deg, #fff, #fff 28px, #ccc 28px, #ccc 30px);
}

/* Syntax highlighting */
.token.comment,
.token.prolog,
.token.doctype,
.token.cdata {
  color: #90a4ae;
}

.token.punctuation {
  color: #9e9e9e;
}

.namespace {
  opacity: 0.7;
}

.token.property,
.token.tag,
.token.boolean,
.token.number,
.token.constant,
.token.symbol,
.token.deleted {
  color: #e91e63;
}

.token.selector,
.token.attr-name,
.token.string,
.token.char,
.token.builtin,
.token.inserted {
  color: #4caf50;
}

.token.operator,
.token.entity,
.token.url,
.language-css .token.string,
.style .token.string {
  color: #795548;
}

.token.atrule,
.token.attr-value,
.token.keyword {
  color: #3f51b5;
}

.token.function {
  color: #f44336;
}

.token.regex,
.token.important,
.token.variable {
  color: #ff9800;
}

.token.important,
.token.bold {
  font-weight: bold;
}

.token.italic {
  font-style: italic;
}

.token.entity {
  cursor: help;
}</style>