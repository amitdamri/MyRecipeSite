<template>
  <div class="modal-mask" v-show="show" transition="modal">
    <div class="modal-wrapper">
      <div class="modal-container">
        <div class="modal-header">
          <slot name="header">
            <strong> Add New Recipe </strong>
          </slot>
        </div>

        <div class="modal-body">
          <slot name="body">
            <b-container>
              <b-row align-h="around">
                <b-col>Title:</b-col>
                <b-col>
                  <input type="text" v-model="title" />
                </b-col>
              </b-row>
              <b-row align-h="around">
                <b-col>readyInMinutes:</b-col>
                <b-col>
                  <input type="text" v-model="readyInMinutes" />
                </b-col>
              </b-row>
            </b-container>
          </slot>
        </div>

        <div class="modal-footer">
          <slot name="footer">
            <button class="modal-default-button" @click="$emit('close')">
              OK
            </button>
            <button class="modal-default-button" @click="$emit('close')">
              Close
            </button>
          </slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    show: {
      type: Boolean,
      required: true,
      twoWay: true,
    },
  },
  data() {
    return {
      title: "",
      readyInMinutes: 0,
      vegan: false,
      vegetarian: false,
      glutenFree: false,
      imageURL: "",
      ingredients: [],
      directions: [],
      servings: 1,
    };
  },
};
</script>

<style lang="scss" scoped>
.modal-mask {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: table;
  transition: opacity 0.3s ease;
}

.modal-wrapper {
  display: table-cell;
  vertical-align: middle;
}

.modal-container {
  width: 700px;
  margin: 0px auto;
  padding: 20px 50px;
  background-color: #fff;
  border-radius: 2px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
  transition: all 0.3s ease;
  font-family: Helvetica, Arial, sans-serif;
  overflow-y: auto;
  max-height: 500px;
}

.modal-header h3 {
  margin-top: 0;
  color: #42b983;
}

.modal-body {
  margin: 20px 0;
}

.modal-default-button {
  float: right;
}

/*
 * the following styles are auto-applied to elements with
 * v-transition="modal" when their visiblity is toggled
 * by Vue.js.
 *
 * You can easily play with the modal transition by editing
 * these styles.
 */

.modal-enter,
.modal-leave {
  opacity: 0;
}

.modal-enter .modal-container,
.modal-leave .modal-container {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}
</style>
