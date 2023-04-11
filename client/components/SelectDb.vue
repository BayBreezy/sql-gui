<template>
  <VRow justify="center" align="center">
    <VCol cols="12" md="6">
      <h1 class="font-weight-bold text-md-h3">Select Database</h1>
      <p class="text-md-h6 text-medium-emphasis mt-3">
        Choose the type of database that you want to connect to
      </p>
      <VRow class="mt-10">
        <VCol v-for="o in options" :key="o.title">
          <VCard
            rounded="lg"
            :color="selectedDb?.title === o.title ? 'primary' : ''"
            @click="emits('select', o)"
            height="200"
            class="shadow d-flex align-center justify-center flex-column"
          >
            <VIcon size="80">{{ o.icon }}</VIcon>
            <span class="mt-5">{{ o.title }}</span>
          </VCard>
        </VCol>
      </VRow>
    </VCol>
  </VRow>
</template>
<script lang="ts" setup>
  const props = defineProps<{
    selectedDb: any;
    options: any[];
  }>();

  const emits = defineEmits<{
    (e: "select", o: any): void;
  }>();
</script>

<style scoped></style>
