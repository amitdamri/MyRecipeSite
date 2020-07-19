<template>
  <div class="form-row">
    <select
      id="cuisineDropDown"
      class="form-control"
      @change="updateCuisine()"
      v-model="selectedCuisine"
    >
      <option>Select Cuisine...</option>
      <option v-for="(option, index) in cuisineOptions" :key="index">
        {{ option }}
      </option>
    </select>
  </div>
</template>

<script>
export default {
  data() {
    return {
      selectedCuisine: "Select Cuisine...",
      cuisineOptions: [
        "African",
        "American",
        "British",
        "Cajun",
        "Caribbean",
        "Chinese",
        "Eastern European",
        "European",
        "French",
        "German",
        "Greek",
        "Indian",
        "Irish",
        "Italian",
        "Japanese",
        "Jewish",
        "Korean",
        "Latin American",
        "Mediterranean",
        "Mexican",
        "Middle Eastern",
        "Nordic",
        "Southern",
        "Spanish",
        "Thai",
        "Vietnamese",
      ],
    };
  },
  methods: {
    updateCuisine() {
      this.$emit("selected", this.selectedCuisine);
    },
  },
};
</script>

<style></style>
