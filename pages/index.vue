<template>
    <div class="h-screen">
        <div class="flex items-center justify-center h-full">
            <div class="text-center font-mono max-w-[350px]">
                <h1 class="text-2xl font-bold my-4">Bismuth is a programming language designed for distributed, concurrent, and mobile tasks.</h1>
                <p>More information on April 21st 2023</p>
            </div>
        </div>
    </div>
</template>

<script lang="js">

useServerSeoMeta({
  title: 'Bismuth Programming Language',
  // ogTitle: 'My Amazing Site',
  // description: 'This is my amazing site, let me tell you all about it.',
  // ogDescription: 'This is my amazing site, let me tell you all about it.',
  // ogImage: 'https://example.com/image.png',
  // twitterCard: 'summary_large_image',
})

export default {

}

</script>

<style>
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
  