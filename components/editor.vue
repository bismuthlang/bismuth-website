<script setup>
const { data: Programs } = await useFetch('/api/getSamplePrograms', { method: 'get'});
</script>

<template>
  <div class="gradient py-4">
    <!-- <client-only placeholder="Loading..."> -->
      <div class="grid grid-cols-2 space-x-6 max-w-6xl mx-auto">
        <div class="flex flex-col col-span-2 lg:col-span-1 m-6 lg:m-0">
          <span class="flex">
            <button disabled v-if="isLoading" class="run_btn mb-2 p-2 flex" v-on:click="compile">Run  <Spinner class="ml-2"/> </button>
            <button v-else class="run_btn mb-2 p-2" v-on:click="compile">Run -> </button>
            
            <select v-on:change="$event => selectChange(Programs[$event.target.value])" :disabled="isLoading" name="Program" class="program_select mx-4 mb-2 p-2">
              <option hidden disabled selected value> Load Sample Program </option>
              <option v-for="pid in Object.keys(Programs)" :value="pid">{{ pid }}</option>
            </select>
          </span>
          <CodeEditor font_size="15px" theme="light" class="my-editor col-span-2 lg:col-span-1 lg:m-0" :display_language="false" height="38rem" v-model="code"
          :languages="[['tbd', 'TBD']]"></CodeEditor>
        </div>

        <div class="flex capped-width max-h-[41.125rem] flex-col col-span-2 lg:col-span-1 m-6 lg:m-0 lg:pt-[50px]">
          <pre class="terminal h-full p-4 overflow-auto">
{{ terminalText }}
            </pre>
        </div>
      </div>
    <!-- </client-only> -->
  </div>
</template>


<script>
import hljs from "highlight.js";
import CodeEditor from 'simple-code-editor';

hljs.registerLanguage("tbd", (hljs) => ({
  name: "Tbd",
  aliases: ["tbd", "TBD"],
  keywords: {
    keyword: "if while else func define extern match offer return select exit struct enum accept acceptWhile more weaken",
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
    },
    selectChange: async function(Programs)  {
      // this.code = this.Programs[event.target.value]?.code || "";
      this.code = Programs || "";
    },
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
  font-family: Fira code, Fira Mono, Consolas, Menlo, monospace;
  line-height: 1.5;
  padding: 5px;

  background: rgba(255, 255, 255, 0.25);
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.18);

  width: 100% !important;
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
  font-size: 15px; 
  font-family: Consolas, Monaco, monospace;
  color: whitesmoke;

  background: rgba(25, 23, 23, 0.7);
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.18);
}

.run_btn {
  font-family: Fira code, Fira Mono, Consolas, monospace;

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
  font-family: Fira code, Fira Mono, Consolas, monospace;

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
