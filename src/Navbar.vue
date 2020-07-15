<template>
  <div>
    <b-navbar toggleable="lg" type="dark" variant="dark">
      <b-navbar-brand href="#">Recipe World</b-navbar-brand>
      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

      <b-collapse id="nav-collapse" is-nav>
        <b-navbar-nav>
          <router-link tag="b-nav-item" :to="{ name: 'main' }">Vue Recipes</router-link>
          <router-link tag="b-nav-item" :to="{ name: 'search' }" >Search</router-link>
          <router-link tag="b-nav-item" :to="{ name: 'about' }" >About</router-link>
        </b-navbar-nav>
        <!-- Right aligned nav items -->
        <b-navbar-nav class="ml-auto">
          <b-nav-item-dropdown text="Hello Guest" right v-if="!$root.store.username">
            <router-link tag="b-dropdown-item" :to="{ name: 'register' }">Register</router-link>
            <router-link tag="b-dropdown-item" :to="{ name: 'login' }">Login</router-link>
          </b-nav-item-dropdown>

          <b-nav-item-dropdown right v-if="$root.store.username">
            <!-- Using 'button-content' slot -->
            <template v-slot:button-content>
              <em>Personal</em>
            </template>
            <router-link tag="b-dropdown-item" :to="{ name: 'favoriteRecipes' }">Favorites</router-link>
            <router-link tag="b-dropdown-item" :to="{ name: 'myRecipes' }">My Recipes</router-link>
            <router-link tag="b-dropdown-item" :to="{ name: 'myFamilyRecipes' }">Family Recipes</router-link>
          </b-nav-item-dropdown>

          <b-nav-item-dropdown right v-if="$root.store.username">
            <!-- Using 'button-content' slot -->
            <template v-slot:button-content>
              <em>Hello {{ $root.store.username }}</em>
            </template>
            <b-dropdown-item @click="logout()">Logout</b-dropdown-item>
          </b-nav-item-dropdown>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
  </div>
</template>

<script>
  export default {
    name: "Navbar",
    methods: {
    async logout() {
      try {
        await this.axios.post(
        "http://localhost:3000/auth/Logout"
        );
        this.$root.store.logout();
        this.$router.go("/");
      } catch (error) {
        console.log(error);
      }
    }
  },
  }
</script>

<style>
</style>