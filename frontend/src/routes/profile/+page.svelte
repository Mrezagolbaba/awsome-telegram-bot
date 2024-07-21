<script>
	import { onMount } from 'svelte';
	import { users, currentUser, isAuthenticated } from '$lib/store';
	import { goto } from '$app/navigation';

	let user = null;
	let telegramID = '';
	let password = '';
	let token = '';
	let showLogin = true;
	let showTokenInput = false;
	let validToken = false;

	onMount(() => {
		if (typeof window !== 'undefined') {
			const savedUser = JSON.parse(sessionStorage.getItem('currentUser'));
			console.log('saved', savedUser);
		}
	});

	function login() {
		users.update((currentUsers) => {
			const foundUser = currentUsers.find(
				(u) => u.telegramID === telegramID && u.password === password
			);
			if (foundUser) {
				currentUser.set(foundUser);
				isAuthenticated.set(true);
				sessionStorage.setItem('currentUser', JSON.stringify(foundUser));
				user = foundUser;
				showLogin = false;
				showTokenInput = true;
			} else {
				alert('Invalid credentials');
			}
			return currentUsers;
		});
	}

	function validateToken() {
		if (token === user.token) {
			validToken = true;
			showTokenInput = false;
		} else {
			alert('Invalid token');
			goto('/');
		}
	}
	function handleLogout() {
		sessionStorage.removeItem('currentUser');
		currentUser.set(null);
		isAuthenticated.set(false);
		user = null;
		showLogin = true;
		showTokenInput = false;
		validToken = false;
		token = '';
		telegramID = '';
	}
</script>

{#if showLogin}
	<main>
		<h3>Log In</h3>
		<form on:submit|preventDefault={login}>
			<label>
				<span>Telegram ID:</span>
				<input type="text" bind:value={telegramID} required />
			</label>
			<label>
				<span>Password:</span>
				<input type="password" bind:value={password} required />
			</label>
			<button type="submit">Log In</button>
		</form>
	</main>
{/if}

{#if showTokenInput}
	<main>
		<h1>Validate Token</h1>
		<form on:submit|preventDefault={validateToken}>
			<label>
				Token:
				<input type="text" bind:value={token} required />
			</label>
			<button type="submit">Validate Token</button>
		</form>
	</main>
{/if}

{#if validToken}
	<main>
		<button on:click={handleLogout}>logout</button>
		<h1>Profile</h1>
		<div>
			<p>Telegram ID: {user.telegramID}</p>
			<p>Password: *******</p>
			<p>Created: {new Date(user.createdAt).toLocaleDateString()}</p>
		</div>
	</main>
{/if}

<style>
	@import '../../styles/home.css';
</style>
