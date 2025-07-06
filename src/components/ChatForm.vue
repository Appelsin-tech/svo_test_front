<template>
	<form class="chat-form" @submit.prevent="submit">
		<input
			v-model="text"
			type="text"
			placeholder="Введите сообщение..."
		/>
		<button type="submit" :disabled="!text.trim()">
			<i class="bi bi-send-fill"></i>
		</button>
	</form>
</template>

<script setup>
    import { ref } from 'vue'
    import { useChatStore } from '@/stores/chat'

    const text = ref('')
    const chat = useChatStore()

    function submit() {
        const message = text.value.trim()
        if (!message) return

        chat.addMessage(chat.currentUser, message)
        text.value = ''
    }
</script>


<style scoped lang="scss">
.chat-form {
	display: flex;
	padding: 1rem;
	border-top: 1px solid #ddd;
	position: relative;

	input {
		flex: 1;
		padding: 0.75rem 3rem 0.75rem 1rem;
		border: none;
		border-radius: 999px;
		background: #f0f0f0;
		font-size: 1rem;
		outline: none;
        cursor: text;
	}

	button {
		position: absolute;
		right: 1.5rem;
		top: 50%;
		transform: translateY(-50%);
		background: #ccc;
		color: white;
		border: none;
		border-radius: 50%;
		width: 32px;
		height: 32px;
		display: flex;
		justify-content: center;
		align-items: center;
		cursor: pointer;
		transition: 0.3s;

		&:disabled {
			background: #aaa;
			cursor: not-allowed;
		}

		&:not(:disabled) {
			background: #2eebb3;
		}
	}
}
</style>