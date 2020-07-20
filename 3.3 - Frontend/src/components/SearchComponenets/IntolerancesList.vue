<template>
  <div class="form-row">
    <select
      id="intolerancesDropDown"
      class="form-control"
      @change="updateSelectedIntolerances()"
      v-model="selectedIntolerances"
    >
      <option>Select Intolerances...</option>
      <option v-for="(option, index) in intolerancesOptions" :key="index">
        {{ option }}
      </option>
    </select>
  </div>
</template>

<script>
export default {
  data() {
    return {
      selectedIntolerances: "Select Intolerances...",
      intolerancesOptions: [
        "Dairy",
        "Egg",
        "Gluten",
        "Grain",
        "Peanut",
        "Seafood",
        "Sesame",
        "Shellfish",
        "Soy",
        "Sulfite",
        "Tree Nut",
        "Wheat",
      ],
    };
  },
  methods: {
    updateSelectedIntolerances() {
      this.$emit("selected", this.selectedIntolerances);
    },
  },
};
</script>

<style></style>
