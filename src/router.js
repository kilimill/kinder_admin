import Vue from 'vue';
import Router from 'vue-router';

import Dashboard from './views/Dashboard';
import Login from './views/Login';

import Posts from './views/posts/Index.vue';
import Post from './views/posts/Elem.vue';
import MakingPost from './views/posts/Making.vue';
import Articles from './views/articles/Index.vue';
import Article from './views/articles/Elem.vue';
import MakingArticle from './views/articles/Making.vue';

import store from './store/index';

Vue.use(Router);

let routes = [
	{
		path: '/',
		component: Dashboard,
		meta: {
			title: 'Главная Админка',
		},
	},
	{
		path: '/login',
		component: Login,
		name: 'login',
		meta: {
			title: 'Авторизация',
		},
	},
	{
		path: '/makingPost',
		component: MakingPost,
		name: 'makingPost',
		meta: {
			title: 'Создать в календаре',
		},
	},
	{
		path: '/post',
		component: Posts,
		name: 'posts',
		meta: {
			title: 'Публикации в календаре',
		},
	},
	
	{
		path: '/post/:id',
		component: Post,
		name: 'post',
		props: true,
		meta: {
			title: 'Изменить публикацию',
		},
	},
	{
		path: '/makingArticle',
		component: MakingArticle,
		name: 'makingArticle',
		meta: {
			title: 'Создать на главной',
		},
	},
	{
		path: '/article',
		component: Articles,
		name: 'articles',
		meta: {
			title: 'Публикации на главной',
		},
	},
	
	{
		path: '/article/:id',
		component: Article,
		name: 'article',
		props: true,
		meta: {
			title: 'Изменить публикацию',
		},
	},
];

const router = new Router({
	mode: 'history',
	base: process.env.BASE_URL,
	routes
})

router.beforeEach((to, _from, next) => {
	if (to.name === 'login' || store.state.token) {
		next();
	} else {
		next('/login');
	}
});
// eslint-disable-next-line no-unused-vars
router.afterEach((to, _from) => {
  Vue.nextTick(() => {
    document.title = to.meta.title;
  })
});

export default router
