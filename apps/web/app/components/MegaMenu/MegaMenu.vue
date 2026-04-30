<template>
  <header class="relative w-full md:sticky md:shadow-md z-10">
    <div
      class="flex justify-between items-center px-4 md:px-10 py-5 w-full"
      style="background-color: rgb(var(--colors-2-primary-500));"
    >
      <NuxtLink to="/" class="text-white font-bold">
        Amikon
      </NuxtLink>

      <div class="flex gap-4 text-white">
        <NuxtLink to="/kontakt">Kontakt</NuxtLink>
        <NuxtLink to="/versand">Versand</NuxtLink>
      </div>
    </div>

    <!-- MEGA MENU -->
    <nav class="hidden lg:block bg-white border-b border-neutral-200">
      <ul class="flex px-6 py-2">
        <li
          class="relative"
          @mouseenter="isOpen = true"
          @mouseleave="isOpen = false"
        >
          <NuxtLink
            to="/kategorien"
            class="inline-flex items-center gap-2 font-medium text-base px-4 py-2 text-neutral-900 hover:bg-gray-100 rounded"
          >
            Kategorien
          </NuxtLink>

          <div
            v-if="isOpen"
            class="absolute left-0 top-full w-screen bg-white shadow-lg border-b border-neutral-200 z-50"
          >
            <div class="grid max-w-screen-xl grid-cols-4 gap-4 p-6">
              <NuxtLink
                v-for="item in categories"
                :key="item.label"
                :to="item.url"
                class="border rounded px-4 py-3 text-sm font-medium hover:bg-gray-100"
              >
                {{ item.label }}
              </NuxtLink>
            </div>
          </div>
        </li>
      </ul>
    </nav>
  </header>
</template>

<script setup>
const isOpen = ref(false);

const categories = [
  { label: '3D Druck', url: '/3d-druck' },
  { label: 'Maschinen', url: '/maschinen' },
  { label: 'Rasterelektronenmikroskope', url: '/rasterelektronenmikroskope' },
  { label: 'Roboter', url: '/roboter' },
  { label: 'Shaker / Schwingprüfanlagen', url: '/shaker-schwingpruefanlagen' },
  { label: 'Wärme-Klimaschränke', url: '/waerme-klimaschraenke' },
  { label: 'Begehbare Klimakammern', url: '/begehbare-klimakammern' },
  { label: 'Salzsprühkammern', url: '/salzspruehkammern' },
  { label: 'Bewitterungstechnik', url: '/bewitterungstechnik' },
  { label: 'Elektronik', url: '/elektronik' },
  { label: 'Frequenzumrichter', url: '/frequenzumrichter' },
  { label: 'Laborartikel', url: '/laborartikel' },
  { label: 'Lasertechnik', url: '/lasertechnik' },
  { label: 'Materialprüfmaschinen', url: '/materialpruefmaschinen' },
  { label: 'Mess- und Prüftechnik', url: '/mess-prueftechnik' },
  { label: 'Monitore / Bedieneinheiten', url: '/monitore-bedieneinheiten' },
  { label: 'Motoren und Antriebe', url: '/motoren-und-antriebe' },
  { label: 'Pneumatik', url: '/pneumatik' },
  { label: 'Pumpen', url: '/pumpen' },
  { label: 'Sonstige Artikel', url: '/sonstige-artikel' },
  { label: 'Thermisches Zubehör', url: '/thermisches-zubehoer' },
  { label: 'Vakuum-Technik', url: '/vakuum-technik' },
];
</script>
