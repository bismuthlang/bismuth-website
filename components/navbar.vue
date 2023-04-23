<template>
    <header class="font-mono">
        <nav class="z-50 shadow bg-white fixed top-0 left-0 w-screen leading-[56px] flex flex-row justify-center">
            <NuxtLink to="https://ahfriedman.com/about" class="px-5 underline">Contact</NuxtLink>
            <NuxtLink to="/#resources" class="px-5 underline">Papers</NuxtLink>
            <NuxtLink to="/#editor" class="px-5 underline">Editor</NuxtLink>
            <!-- {{ $route.fullPath }} -->
        </nav>
    </header>
</template>

<style>
.shadow {
    box-shadow: 0 4px 6px 0 rgba(0,0,0,.12);
}
</style>