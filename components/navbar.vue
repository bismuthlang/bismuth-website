<template>
    <header class="font-mono">
        <nav class="z-50 shadow bg-white fixed top-0 left-0 w-screen leading-[56px] flex flex-row">
            <div class="mr-auto hidden md:flex">
                <img src="/logo2.svg" class="max-h-14 p-1.5">
            </div>
            <div class="max-md:m-auto md:mr-auto">
                <NuxtLink to="https://github.com/bismuthlang" class="px-5 underline hidden md:inline">Source</NuxtLink>
                <NuxtLink to="https://docs.bismuth-lang.org/" class="px-5 underline">Docs</NuxtLink>
                <NuxtLink to="/#editor" class="px-5 underline">Editor</NuxtLink>
                <NuxtLink to="/#resources" class="px-5 underline">Papers</NuxtLink>
                <!-- {{ $route.fullPath }} -->
            </div>
        </nav>
    </header>
</template>

<style>
.shadow {
    box-shadow: 0 4px 6px 0 rgba(0,0,0,.12);
}
</style>
