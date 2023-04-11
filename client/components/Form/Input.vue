<template>
  <div>
    <label v-if="label" class="label" :for="label">{{ label }}</label>
    <VTextField
      v-model="value"
      :error-messages="errors"
      @blur="handleBlur"
      @input="handleChange"
      @click:clear="handleReset"
      :type="type"
      @change="handleChange"
      :id="label"
      :name="name"
      :placeholder="placeholder"
      v-bind="$attrs"
    ></VTextField>
  </div>
</template>
<script lang="ts" setup>
  import { useField } from "vee-validate";
  const props = withDefaults(
    defineProps<{
      label?: string;
      name: string;
      rules?: any;
      modelValue?: any;
      type?: string;
      placeholder?: string;
    }>(),
    {
      type: "text",
      placeholder: "",
    }
  );

  const { value, errors, handleBlur, handleChange, handleReset } = useField(
    ref(props.name),
    props.rules,
    {
      initialValue: props.modelValue,
      label: props.label,
    }
  );
</script>

<style scoped></style>
