<template>
  <div class="options">
    <div class="option" v-if="!isSpecial">
      <button
        type="button"
        :style="checkFavorite"
        title="Add to favorites"
        class="btn btn-outline-success"
        @click="$emit('favorite')"
      >
        <i class="fa fa-star-o" style="color:red"></i
        ><strong>{{ isFavorite ? "Saved" : "Save" }}</strong>
      </button>
    </div>
    <div class="option">
      <button
        type="button"
        title="Make recipe now"
        class="btn btn-outline-success"
      >
        <i class="fa fa-spoon" style="color:red"></i><strong>Make</strong>
      </button>
    </div>
    <div class="option">
      <button
        type="button"
        title="Add recipe to meal"
        class="btn btn-outline-success"
      >
        <i class="fa fa-calendar" style="color:red"></i><strong>Add</strong>
      </button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    isSpecial: {
      type: Boolean,
      required: false,
      default: () => {
        return false;
      },
    },
    isFavorite: {
      type: Boolean,
      required: false,
      default: () => {
        return false;
      },
    },
  },
  computed: {
    checkFavorite() {
      return this.isFavorite ? "backgroundColor:green;" : "";
    },
  },
};
</script>

<style lang="scss" scoped>
.options {
  float: left;
  width: 48px;
  margin-right: 20px;
}
.option {
  height: 58px;
  margin-bottom: 20px;
}
</style>
