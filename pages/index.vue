<template>
  <div v-if="isAvailable">
    <div class="h-screen" id="home">
      <div class="flex items-center justify-center h-full">
        <div class="text-center font-mono max-w-[350px]">
          <h1 class="text-2xl font-bold my-4">Bismuth is a programming language designed for distributed, concurrent, and
            mobile tasks.</h1>
          <p class="text-7xl text-slate-400 font-serif animate-pulse">⇓</p>
        </div>
      </div>
    </div>
    <div id="resources" class="bg-slate-100 w-screen py-4 flex items-center font-mono flex-col">
      <h2 class="text-2xl font-bold my-4">Paper & Other Resources</h2>
      <div class="grid grid-template gap-4">
        <a href="/ahf-mqp-pw-poster.pdf">
          <div class="glass card">
            <h3 class="text-lg font-bold">PW Poster</h3><img class="h-[200px] m-auto" src="/pw-poster.png" />
          </div>
        </a>
        <a href="/ahf-CommunicatingProcessCalculus.pdf">
          <div class="glass card">
            <h3 class="text-lg font-bold">MQP Report</h3><img class="h-[250px]" src="/report.png" />
          </div>
        </a>
        <a href="/ahf-mqp-cs-poster.pdf">
          <div class="glass card">
            <h3 class="text-lg font-bold">CS Poster</h3><img class="h-[200px] m-auto" src="/cs-poster.png" />
          </div>
        </a>
      </div>
    </div>
    <Editor id="editor" />
  </div>
  <div v-else class="h-screen">
    <div class="flex items-center justify-center h-full">
      <div class="text-center font-mono max-w-[350px]">
        <h1 class="text-2xl font-bold my-4">Bismuth is a programming language designed for distributed, concurrent, and
          mobile tasks.</h1>
        <p>More information on April 21st 2023</p>
      </div>
    </div>
  </div>
</template>

<script>
// useServerSeoMeta({
//   title: 'Bismuth Programming Language',
//   // ogTitle: 'My Amazing Site',
//   // description: 'This is my amazing site, let me tell you all about it.',
//   // ogDescription: 'This is my amazing site, let me tell you all about it.',
//   // ogImage: 'https://example.com/image.png',
//   // twitterCard: 'summary_large_image',
// })

export default defineNuxtComponent({
  head(nuxtApp) {
    return {
      title: 'Bismuth Programming Language',
    }
  },
  async asyncData() {
    const event = useRequestEvent()
    const req = event.req
    const headers = (req && req.headers) ? Object.assign({}, req.headers) : {}
    const cfConnectingIp = headers['cf-connecting-ip'];
    const xForwardedFor = headers['x-forwarded-for']
    const xRealIp = headers['x-real-ip']
    // console.log(xForwardedFor)
    // console.log(xRealIp)

    const ip = cfConnectingIp || xForwardedFor || xRealIp || "";
    const ans  = new Date().getTime() / 1000 >= 1682049600 || ip.toString() === "::ffff:127.0.0.1" || ip.toString().startsWith("130.215.") || ip.toString() === "75.143.39.252" || ip.toString() === "2600:6c64:617f:7885:7da8:6d9f:2734:f8c7";
    // console.log('IP ', ip, ans, headers)
    return {
      isAvailable: ans
    }
  }
})
</script>

<style>
.grid-template {
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
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
  user-select: none;
  cursor: pointer;
  transition: all .2s ease-in-out;
}

.card:hover {
  transform: scale(1.02);
}

.glass {
  background: rgba(241, 245, 249, 0.6);
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
  backdrop-filter: blur(11px);
  -webkit-backdrop-filter: blur(11px);
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.18);
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
  