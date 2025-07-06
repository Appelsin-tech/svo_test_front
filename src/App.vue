<template>
	<div class="app-container">

		<!-- ВЫБОР ПОЛЬЗОВАТЕЛЯ -->
		<div class="user-selector-wrapper">
			<div class="user-selector" @click="isOpen = !isOpen" :class="{ open: isOpen }">
				<div class="selected">
					<span class="user-info">
						<i class="bi bi-person-fill"></i>
						<span>{{ chat.currentUser?.name }}</span>
					</span>
					<i class="bi bi-chevron-down arrow"></i>
				</div>
				<ul v-show="isOpen" class="dropdown">
					<li
						v-for="u in chat.users"
						:key="u.id"
						@click.stop="chat.selectUser(u); isOpen = false"
						:class="{ selectedItem: u.id === chat.currentUser?.id }"
					>
						<i class="bi bi-person-fill"></i>
						<span>{{ u.name }}</span>
					</li>
				</ul>
			</div>

			<!-- КНОПКА АВТО-ОТПРАВКИ -->
			<button
				class="robot-button"
				:class="{ active: autoMode }"
				@click="autoMode = !autoMode"
				title="Включить/выключить авто-сообщения"
			>
				<i class="bi bi-robot"></i>
			</button>

			<!-- КНОПКА ОЧИСТКИ -->
			<button class="clear-button" @click="chat.clearChat" title="Очистить чат">
				<i class="bi bi-trash"></i>
			</button>
		</div>

		<!-- БЛОК ЧАТА -->
		<div class="chat-container">
			<div class="messages-box" ref="messagesBox">
				<ChatMessage
					v-for="(msg, i) in chat.messages"
					:key="msg.id || i"
					:message="msg"
					:currentUser="chat.currentUser"
				/>
			</div>
			<ChatForm @send="handleSend" />
		</div>

	</div>
</template>

<script setup>
import { ref, nextTick, watch, onMounted } from 'vue'
import { useChatStore } from './stores/chat'
import ChatMessage from './components/ChatMessage.vue'
import ChatForm from './components/ChatForm.vue'

const chat = useChatStore()
const isOpen = ref(false)
const messagesBox = ref(null)

const autoMode = ref(false)
let autoInterval = null

// при отправке от текущего
async function handleSend(text) {
	await chat.addMessage(chat.currentUser, text)
}

// авто-скролл вниз
watch(
	() => chat.messages.length,
	async () => {
		await nextTick()
		if (messagesBox.value) {
			messagesBox.value.scrollTop = messagesBox.value.scrollHeight
		}
	}
)

// отслеживаем изменения autoMode
watch(autoMode, (val) => {
	localStorage.setItem('chat:autoMode', JSON.stringify(val))
})

// отслеживаем смену пользователя
watch(
	() => chat.currentUser,
	(user) => {
		if (user) {
			localStorage.setItem('chat:currentUserId', user.id)
		}
	}
)

onMounted(async () => {
	await chat.loadUsers()
	await chat.loadMessages()

	// восстановление autoMode из localStorage
	const savedAuto = localStorage.getItem('chat:autoMode')
	if (savedAuto !== null) {
		autoMode.value = JSON.parse(savedAuto)
	}

	// восстановление текущего пользователя
	const savedUserId = localStorage.getItem('chat:currentUserId')
	if (savedUserId && chat.users.length) {
		const found = chat.users.find(u => u.id === +savedUserId)
		if (found) chat.selectUser(found)
	}

	// авто-отправка сообщений
	autoInterval = setInterval(() => {
		if (!autoMode.value) return

		const allUsers = chat.users
		const current = chat.currentUser
		if (!allUsers.length || !current) return

		const candidates = allUsers.filter(u => u.id !== current.id)
		if (!candidates.length) return

		const randomUser = candidates[Math.floor(Math.random() * candidates.length)]
		const text = 'Автоматическое сообщение'

		chat.addMessage(randomUser, text)
	}, 4000)
})
</script>



<style scoped lang="scss">
.app-container {
	height: 100vh;
	background: #e0e0e0;
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 1rem;
	padding: 1rem;
	box-sizing: border-box;
}

// ОБЁРТКА ДЛЯ ВЫБОРА МЕНЮ
.user-selector-wrapper {
	width: 100%;
	max-width: 600px;
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 0.75rem;
}

// ВЫПАДАЮЩИЙ СПИСОК
.user-selector {
	flex: 1;
	position: relative;
	cursor: pointer;
	user-select: none;

	.selected {
		padding: 0.8rem 1.2rem;
		border-radius: 30px;
		background: #ffffff;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
		display: flex;
		align-items: center;
		justify-content: space-between;
		font-size: 1rem;

		.user-info {
			display: flex;
			align-items: center;
			gap: 0.5rem;

			i {
				font-size: 1.1rem;
			}
		}

		.arrow {
			font-size: 1.1rem;
			transition: transform 0.3s ease;
		}
	}

	&.open .arrow {
		transform: rotate(180deg);
	}

	.dropdown {
		position: absolute;
		top: 100%;
		left: 0;
		width: 100%;
		background: #fff;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
		border-radius: 30px;
		margin-top: 0.25rem;
		z-index: 10;
		list-style: none;
		padding: 0.5rem 0;
		overflow: hidden;

		li {
			margin: 0 0.5rem;
			padding: 0.75rem 1rem;
			border-radius: 20px;
			cursor: pointer;
			display: flex;
			align-items: center;
			gap: 0.5rem;
			transition: background 0.2s;
			line-height: 1.3;

			&:hover {
				background: #ededed;
			}

			&.selectedItem {
				font-weight: bold;
				background: #e6f7f2;
			}
		}
	}
}

// КНОПКА АВТО-ОТПРАВКИ
.robot-button {
	background: #fff;
	border: none;
	border-radius: 50%;
	box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
	width: 44px;
	height: 44px;
	display: flex;
	align-items: center;
	justify-content: center;
	cursor: pointer;
	transition: background 0.2s;

	i {
		font-size: 1.1rem;
		color: #888;
	}

	&:hover {
		background: #e6f7f2;
		i {
			color: #3c9;
		}
	}

	&.active {
		background: #d1f0e2; // как у input-кнопки
		i {
			color: #28a745;
		}
	}
}

// КНОПКА ОЧИСТКИ
.clear-button {
	background: #fff;
	border: none;
	border-radius: 50%;
	box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
	width: 44px;
	height: 44px;
	display: flex;
	align-items: center;
	justify-content: center;
	cursor: pointer;
	transition: background 0.2s;

	i {
		font-size: 1.1rem;
		color: #888;
	}

	&:hover {
		background: #f8d7da;
		i {
			color: #c00;
		}
	}
}

// ОСНОВНОЙ БЛОК ЧАТА
.chat-container {
	background: white;
	border-radius: 30px;
	width: 100%;
	max-width: 600px;
	display: flex;
	flex-direction: column;
	flex-grow: 1;
	overflow: hidden;
}

// СООБЩЕНИЯ
.messages-box {
	flex: 1;
	overflow-y: auto;
	padding: 1rem;
	display: flex;
	flex-direction: column;
}
</style>
