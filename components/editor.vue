<template>
  <div class="gradient py-4">
    <!-- <client-only placeholder="Loading..."> -->
      <div class="grid grid-cols-2 space-x-6 max-w-6xl mx-auto">
        <CodeEditor theme="light" class="my-editor capped-width col-span-2 lg:col-span-1 m-6 lg:m-0" :display_language="false" height="38rem" v-model="code"
          :languages="[['tbd', 'TBD']]"></CodeEditor>
        <div class="flex capped-width max-h-[inherit] flex-col col-span-2 lg:col-span-1 m-6 lg:m-0">
          <span>
            <button class="run_btn mb-2 p-2" v-on:click="compile">Run -></button>
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

navigateTo('/')

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
      begin: /\(\*/, 
      end: /\*\)/, 
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
    code: 'console.log("Hello World")',
    terminalText: ">"
  }),
  methods: {

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

.gradient {
  background: repeating-linear-gradient(45deg, #fff, #fff 28px, #ccc 28px, #ccc 30px);
}
</style>
