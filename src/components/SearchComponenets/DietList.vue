<template>
  <div class="form-row">
    <select
      id="dietDropDown"
      class="form-control"
      @change="updateSelectedDiet()"
      v-model="selectedDiet"
    >
      <option>Select Diet...</option>
      <option v-for="(option, index) in dietOptions" :key="index">
        {{ option }}
      </option>
    </select>
  </div>
</template>

<script>
export default {
  data() {
    return {
      selectedDiet: "Select Diet...",
      dietOptions: [
        "Gluten Free",
        "Ketogenic",
        "Vegetarian",
        "Lacto-Vegetarian",
        "Ovo-Vegetarian",
        "Vegan",
        "Pescetarian",
        "Paleo",
        "Primal",
        "Whole30",
      ],
    };
  },
  methods: {
    updateSelectedDiet() {
      this.$emit("selected", this.selectedDiet);
    },
  },
};
</script>

<style></style>
