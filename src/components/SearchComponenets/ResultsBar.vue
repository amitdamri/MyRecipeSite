<template>
  <div>
    <div
      class="form-row bg-light rounded shadow-sm col-form-label"
      id="resultSection"
    >
      <label id="resultsLabel">{{ numberOfResults }} Results Returned. </label>
      <div class="input-group col-sm-4 float-right">
        <div class="input-group-prepend">
          <label class="input-group-text" for="inputGroupSelect01"
            >Sort By:</label
          >
        </div>
        <select
          class="custom-select"
          id="inputGroupSelect01"
          v-model="selected"
          @change="updateSortOption"
        >
          <option selected>None</option>
          <option>Ready In Minutes</option>
          <option>Likes</option>
        </select>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    numberOfResults: Number,
    searchedQuery: String,
  },
  data() {
    return {
      selected: "None",
    };
  },
  methods: {
    updateSortOption() {
      this.$emit("selected", this.selected);
    },
  },
};
</script>

<style>
#resultsLabel {
  font-style: italic;
  font-weight: bold;
  margin-left: 5px;
}

#selectSort {
  margin-left: 5px;
  margin-right: 7px;
}

#resultSection {
  display: list-item;
  list-style-type: none;
  padding-bottom: 12px;
  margin-top: 5px;
  background: cyan;
  border-top-style: solid;
  border-bottom-style: solid;
  border-color: grey;
  border-width: 1px;
}
</style>
