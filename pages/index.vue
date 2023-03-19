<template>
  <div v-if="new Date().getTime()/1000 >= 1682049600">
    <div class="h-screen">
      <div class="flex items-center justify-center h-full">
        <div class="text-center font-mono max-w-[350px]">
          <h1 class="text-2xl font-bold my-4">Bismuth is a programming language designed for distributed, concurrent, and mobile tasks.</h1>
          <p class="text-7xl text-slate-400 font-serif animate-pulse">⇓</p>
        </div>
      </div>
    </div>
    <div class="bg-slate-100 w-screen py-4 flex items-center font-mono flex-col">
      <h2 class="text-2xl font-bold my-4">Paper & Other Resources</h2>
      <div class="grid grid-template gap-4">
        <div class="glass card"><h3 class="text-lg font-bold">PW Poster</h3><img class="h-[200px] m-auto" src="/pw-poster.png"/></div>
        <div class="glass card"><h3 class="text-lg font-bold">MQP Report</h3><img class="h-[250px]" src="/report.png"/></div>
        <div class="glass card"><h3 class="text-lg font-bold">CS Poster</h3><img class="h-[200px] m-auto" src="/pw-poster.png"/></div>
      </div>
    </div>
    <Editor />
  </div>
  <div v-else class="h-screen">
        <div class="flex items-center justify-center h-full">
            <div class="text-center font-mono max-w-[350px]">
                <h1 class="text-2xl font-bold my-4">Bismuth is a programming language designed for distributed, concurrent, and mobile tasks.</h1>
                <p>More information on April 21st 2023</p>
            </div>
        </div>
    </div>
</template>

<script setup>

useServerSeoMeta({
  title: 'Bismuth Programming Language',
  // ogTitle: 'My Amazing Site',
  // description: 'This is my amazing site, let me tell you all about it.',
  // ogDescription: 'This is my amazing site, let me tell you all about it.',
  // ogImage: 'https://example.com/image.png',
  // twitterCard: 'summary_large_image',
})

const event = useRequestEvent()
if (process.server) {
      const req = event.req
      const headers = (req && req.headers) ? Object.assign({}, req.headers) : {}
      const xForwardedFor = headers['x-forwarded-for']      
      const xRealIp = headers['x-real-ip']
      console.log(xForwardedFor)
      console.log(xRealIp)
    }
</script>

<style>
  .grid-template {
    grid-template-columns: repeat(auto-fit,minmax(300px,1fr));
    width: 100%;
    max-width: 1000px;
  }

  .card {
    height: 300px;
    width: 300px; 
    margin: auto; 
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 6px;
  }

  .glass {
    background: rgba( 241, 245, 249, 0.6 );
    box-shadow: 0 8px 32px 0 rgba( 31, 38, 135, 0.37 );
    backdrop-filter: blur( 11px );
    -webkit-backdrop-filter: blur( 11px );
    border-radius: 10px;
    border: 1px solid rgba( 255, 255, 255, 0.18 );
  }

  .inherit-height {
    max-height: inherit;
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
  