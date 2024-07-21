<script>
	import { onMount } from 'svelte';
	import { users, currentUser, isAuthenticated } from '$lib/store';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';

	let telegramID = '';
	let password = '';
	let token = '';
	let showForm = true;
	let showToken = false;

	// Extract the telegramID from the URL query parameters
	$: {
		const params = new URLSearchParams($page.url.search);
		telegramID = params.get('telegram_id') || '';
	}

	onMount(() => {
		// Initialize users store from sessionStorage if in the browser
		if (typeof window !== 'undefined') {
			const savedUsers = JSON.parse(sessionStorage.getItem('users') || '[]');
			users.set(savedUsers);
		}
	});

	function signUp() {
		const newToken = Math.random().toString(36).substr(2);
		const newUser = {
			telegramID,
			password,
			createdAt: new Date().toISOString(),
			token: newToken
		};

		users.update((currentUsers) => {
			const updatedUsers = [...currentUsers, newUser];
			if (typeof window !== 'undefined') {
				sessionStorage.setItem('users', JSON.stringify(updatedUsers));
			}
			return updatedUsers;
		});

		token = newToken;
		currentUser.set(newUser);
		isAuthenticated.set(true);
		showForm = false;
		showToken = true;
	}

	function handleTokenCopy() {
		//copy token to clipboard
		navigator.clipboard.writeText(token);
		alert('Token copied to clipboard');
		token = '';
		showToken = false;
		showForm = false;
	}
</script>

<main>
	{#if showForm}
		<h3>Sign Up</h3>
		<form on:submit|preventDefault={signUp}>
			<label>
				<span>Telegram ID:</span>
				<input type="text" bind:value={telegramID} required />
			</label>
			<label>
				<span> Password:</span>
				<input type="password" bind:value={password} required />
			</label>
			<button type="submit">Sign Up</button>
		</form>
	{/if}

	{#if showToken}
		<div>
			<p>Your token: {token}</p>
			<p>Please save it somewhere secure!</p>
			<button on:click={handleTokenCopy}>OK</button>
		</div>
	{/if}

	{#if !showForm&&!showToken}
		<nav>
			<button on:click={() => goto('/')}>Home</button>
			<button on:click={() => goto('/profile')}>Profile</button>
		</nav>
	{/if}
</main>

<style>
	@import '../styles/home.css';
</style>
