<template>
  <div class="form-row">
    <select
      id="resultsDropDown"
      class="form-control"
      @change="updateNumberOfResults()"
      v-model="selectedResultsNumber"
    >
      <option>Number of Results...</option>
      <option v-for="(option, index) in resultsOptions" :key="index">
        {{ option }}
      </option>
    </select>
  </div>
</template>

<script>
export default {
  data() {
    return {
      selectedResultsNumber: "Number of Results...",
      resultsOptions: [5, 10, 15],
    };
  },
  methods: {
    updateNumberOfResults() {
      this.$emit("selected", parseInt(this.selectedResultsNumber));
    },
  },
};
</script>

<style></style>
