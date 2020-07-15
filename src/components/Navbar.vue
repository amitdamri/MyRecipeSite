<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-light">
    <a class="navbar-brand" href="#">Navbar</a>
    <div class="collapse navbar-collapse" id="navbarNavDropdown">
      <ul class="navbar-nav">
        <li class="nav-item">
          <router-link tag="a" class="nav-link" :to="{ name: 'main' }"
            >Vue Recipes</router-link
          >
        </li>
        <li class="nav-item">
          <router-link tag="a" class="nav-link" :to="{ name: 'favorites' }"
            >favorites</router-link
          >
        </li>
        <li class="nav-item">
          <router-link tag="a" class="nav-link" :to="{ name: 'myRecipes' }"
            >MyRecipes</router-link
          >
        </li>
        <li class="nav-item">
          <router-link
            tag="a"
            class="nav-link"
            :to="{ name: 'FamilyRecipesPage' }"
            >MyFamilyRecipes</router-link
          >
        </li>
        <li class="nav-item">
          <a class="nav-link" href="#" @click="openModal">New Recipe</a>
          <new-reicpe-modal
            :show.sync="showModal"
            @close="closeModal"
          ></new-reicpe-modal>
        </li>

        <li class="nav-item">
          <router-link tag="a" class="nav-link" :to="{ name: 'search' }"
            >Search</router-link
          >
        </li>

        <li class="navbar-item dropdown" v-if="!$root.store.username">
          <a
            class="nav-link dropdown-toggle"
            href="#"
            id="navbarDropdownMenuLink"
            data-toggle="dropdown"
            aria-haspopup="true"
            aria-expanded="false"
          >
            Hello Guest
          </a>
          <div class="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
            <router-link
              tag="a"
              class="dropdown-item"
              :to="{ name: 'register' }"
              >Register</router-link
            >
            <router-link tag="a" class="dropdown-item" :to="{ name: 'login' }"
              >Login</router-link
            >
          </div>
        </li>
        <li class="nav-item" v-else>
          <ul class="navbar-nav">
            <li class="nav-item dropdown">
              <a
                class="nav-link dropdown-toggle"
                href="#"
                id="navbarDropdownMenuLink"
                data-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
              >
                Personal
              </a>
              <div
                class="dropdown-menu"
                aria-labelledby="navbarDropdownMenuLink"
              >
                <router-link
                  tag="a"
                  class="dropdown-item"
                  :to="{ name: 'favoriteRecipes' }"
                  >Favorites</router-link
                >
                <router-link
                  tag="a"
                  class="dropdown-item"
                  :to="{ name: 'myRecipes' }"
                  >My Recipes</router-link
                >
                <router-link
                  tag="a"
                  class="dropdown-item"
                  :to="{ name: 'myFamilyRecipes' }"
                  >Family Recipes
                </router-link>
              </div>
            </li>
            <li class="nav-item dropdown">
              <a
                class="nav-link dropdown-toggle"
                href="#"
                id="navbarDropdownMenuLink"
                data-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
              >
                Hello {{ $root.store.username }}
              </a>
              <div
                class="dropdown-menu"
                aria-labelledby="navbarDropdownMenuLink"
              >
                <button tag="a" class="nav-link" @click="Logout">Logout</button>
              </div>
            </li>
          </ul>
        </li>
      </ul>
    </div>
  </nav>
</template>

<script>
import NewRecipeModal from "./NewRecipeModal";
export default {
  components: {
    "new-reicpe-modal": NewRecipeModal,
  },
  name: "Navbar",
  data() {
    return {
      showModal: false,
    };
  },
  methods: {
    openModal() {
      this.showModal = true;
    },
    closeModal() {
      this.showModal = false;
    },
  },
};
</script>

<style>
#nav .router-link-exact-active {
  color: #42b983;
}
</style>
