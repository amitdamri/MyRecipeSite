
const routes = [
  {
    path: "/",
    name: "main",
    component: () => import("./pages/MainPage"),
  },
  {
    path: "/register",
    name: "register",
    component: () => import("./pages/RegisterPage"),
  },
  {
    path: "/login",
    name: "login",
    component: () => import("./pages/LoginPage"),
  },
  {
    path: "/search",
    name: "search",
    component: () => import("./pages/SearchPage"),
  },
  {
    path: "/recipe/:recipeId",
    name: "recipe",
    component: () => import("./pages/RecipeViewPage"),
  },
  {
    path: "/about",
    name: "about",
    component: () => import("./pages/About")
  },
  {
    path: "*",
    name: "notFound",
    component: () => import("./pages/NotFoundPage"),
  },
];

export default routes;
