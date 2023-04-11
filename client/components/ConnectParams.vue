<template>
  <VRow justify="center" align="center">
    <VCol cols="12" md="5">
      <v-tooltip location="top">
        <template v-slot:activator="{ props }">
          <VBtn v-bind="props" @click="emits('clearselection')" class="mb-7" icon flat>
            <VIcon size="20">fluent:arrow-left-24-regular</VIcon>
          </VBtn>
        </template>
        <span class="text-caption">Swich DB</span>
      </v-tooltip>
      <h1 class="font-weight-bold text-md-h3">Enter Details</h1>
      <p class="text-md-h6 text-medium-emphasis mt-3">
        Enter the connection details for your database
      </p>

      <form @submit="onSubmit">
        <VRow class="mt-10">
          <VCol cols="12" md="10">
            <FormInput autofocus name="user" label="User" placeholder="root" />
            <FormInput name="password" type="password" label="Password" />

            <FormInput
              placeholder="127.0.0.1"
              hint="Ex: 127.0.0.1 / localhost"
              name="host"
              label="Host"
            />
            <FormInput placeholder="3306" name="port" label="Port" type="number" />
            <VBtn
              min-width="150"
              type="submit"
              rounded="lg"
              min-height="45"
              class="text-none text-body-2 font-weight-bold"
              >Connect</VBtn
            >
          </VCol>
        </VRow>
      </form>
    </VCol>
  </VRow>
</template>

<script setup lang="ts">
  import { useForm } from "vee-validate";
  const props = defineProps<{
    selectedDb: any;
  }>();

  const emits = defineEmits<{
    (e: "clearselection"): void;
    (e: "callConnect", args: TConnect): void;
  }>();

  const { handleSubmit } = useForm<TConnect>({
    validationSchema: ConnectSchema,
  });

  const onSubmit = handleSubmit((values) => {
    emits("callConnect", values);
  });
</script>
