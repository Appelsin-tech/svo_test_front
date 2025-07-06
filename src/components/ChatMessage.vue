<template>
	<div :class="['message', isCurrentUser ? 'from-user' : 'from-other']">
		<div class="meta">
			<strong>{{ message.sender_name }}</strong>
			<small>{{ formattedTime }}</small>
		</div>
		{{ message.text }}
	</div>
</template>

<script setup>
    import { computed } from 'vue'
    import { useChatStore } from '@/stores/chat'

    const props = defineProps({
        message: Object
    })

    const chat = useChatStore()

    const isCurrentUser = computed(() =>
        props.message?.sender_id === chat.currentUser?.id
    )

    const formattedTime = computed(() => {
        const raw = props.message?.sent_at
        if (!raw) return '—'

        const date = new Date(raw)
        if (isNaN(date)) return '—'

        const now = new Date()

        const isToday =
            date.getDate() === now.getDate() &&
            date.getMonth() === now.getMonth() &&
            date.getFullYear() === now.getFullYear()

        const timeStr = date.toLocaleTimeString('ru-RU', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
        })

        if (isToday) {
            return timeStr
        }

        const dateStr = date.toLocaleDateString('ru-RU') // например, 06.07.2025
        return `${dateStr} ${timeStr}`
    })

</script>


<style scoped lang="scss">
.message {
	border-radius: 20px;
	padding: 1rem 1rem;
	margin: 0.5rem 0;
	width: 75%;
	box-sizing: border-box;
	word-break: break-word;
	overflow-wrap: break-word;
	display: flex;
	flex-direction: column;

	.meta {
		display: flex;
		justify-content: space-between;
		font-size: 0.75rem;
		color: #666;
	}

	&.from-user {
		background-color: #e6f7f2;
		align-self: flex-end;
		margin-left: 25%;
		margin-right: 0;
	}

	&.from-other {
		background-color: #ededed;
		align-self: flex-start;
		margin-right: 25%;
		margin-left: 0;
	}
}

</style>