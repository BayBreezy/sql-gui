<template>
  <VDialog v-model="dialog" no-click-animation persistent activator="parent" width="400">
    <VCard rounded="lg">
      <form @submit="onSubmit">
        <h1 class="mb-0 text-h6 px-4 pt-3 font-weight-bold">Create Database</h1>
        <VCardSubtitle>Enter a name for your new database.</VCardSubtitle>
        <VCardText class="mt-1">
          <FormInput name="name" label="Database Name" />
        </VCardText>
        <VCardActions class="px-5 pt-0">
          <VBtn
            rounded="lg"
            min-width="100"
            min-height="40"
            type="submit"
            class="text-none text-body-2 font-weight-medium"
            variant="elevated"
            color="primary"
            >Create</VBtn
          >
          <VBtn
            rounded="lg"
            min-height="40"
            class="text-none text-body-2 font-weight-medium"
            type="button"
            @click="dialog = false"
            variant="flat"
            border
            >Cancel</VBtn
          >
        </VCardActions>
      </form>
    </VCard>
  </VDialog>
</template>

<script setup lang="ts">
  import { useForm } from "vee-validate";
  const dialog = ref(false);
  const emits = defineEmits(["create"]);

  const { handleSubmit } = useForm<TCreateDB>({
    validationSchema: CreateDbSchema,
  });

  const onSubmit = handleSubmit(async (values) => {
    try {
      await useToast().promise(
        useQueries().createDb(values.name),
        {
          error: "Failed to create database.",
          pending: "Creating database...",
          success: "Database created successfully.",
        },
        {
          closeButton: true,
          closeOnClick: true,
        }
      );
      emits("create");
      dialog.value = false;
    } catch (error: any) {
      useToast().error(error.message);
    }
  });
</script>
