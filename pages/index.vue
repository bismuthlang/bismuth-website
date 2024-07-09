<template>
  <div>
    <div class="mt-44 mb-40" id="home">
      <div class="flex items-center justify-center h-full flex-col">
        <div class="flex items-center font-bold text-center font-mono flex-col md:flex-row">
          <h1 class="fancy-text md:mr-4 text-5xl">Bismuth</h1>
          <h1 class="max-w-[400px] md:pl-4 text-2xl md:border-l-2">A session-typed programming language designed to make it easier to write safe distributed & concurrent programs.</h1>
          <!-- <h1 class="max-w-[400px] pl-4 text-2xl border-l-2">A programming language designed for distributed & concurrent systems while remaining user-friendly and providing correctness guarantees.</h1> -->
        </div>

        <!-- <div class="mt-16">

            <div class="border-2 card-term">
              <div class="w-full text-center p-1 border-b-2 font-mono font-bold">
                Session Types
              </div>
              <div class="p-2 font-mono">
                hey there so this is some stuff
              </div>
            </div>

        </div> -->


      </div>
    </div>
    <div id="resources" class="bg-slate-100 w-full py-4 flex items-center font-mono flex-col">
      <h2 class="text-2xl font-bold my-4">Papers & Other Resources</h2>
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
  // async asyncData() {
  //   const event = useRequestEvent()
  //   const req = event.req
  //   const headers = (req && req.headers) ? Object.assign({}, req.headers) : {}
  //   const cfConnectingIp = headers['cf-connecting-ip'];
  //   const xForwardedFor = headers['x-forwarded-for']
  //   const xRealIp = headers['x-real-ip']
  //   // console.log(xForwardedFor)
  //   // console.log(xRealIp)

  //   const ip = cfConnectingIp || xForwardedFor || xRealIp || "";
  //   const ans  = new Date().getTime() / 1000 >= 1682049600 || ip.toString() === "::ffff:127.0.0.1" || ip.toString().startsWith("130.215.") || ip.toString() === "75.143.39.252" || ip.toString() === "2600:6c64:617f:7885:7da8:6d9f:2734:f8c7";
  //   // console.log('IP ', ip, ans, headers)
  //   return {
  //     isAvailable: true
  //   }
  // }
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


.fancy-text {
  background:   repeating-linear-gradient(135deg, #c179ff,#9a60cc, #2ca4ac, #39d6d5);
  background-clip: text;
  color: transparent;
}

.card-1 {
  border-radius: 50px;
background: #F1F5F9;
box-shadow:  -20px 20px 60px #cdd0d4,
             20px -20px 60px #ffffff;

             padding-top: 100%
}

.card-term {
  height: 350px;
  border-radius: 15px;
  aspect-ratio: 1/1;
}
</style>
  