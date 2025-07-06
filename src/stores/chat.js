import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getUsers, getMessages, sendMessage, clearMessages } from '../api'

export const useChatStore = defineStore('chat', () => {
	const users = ref([])
	const messages = ref([])
	const currentUser = ref(null)

	async function loadUsers() {
        const response = await getUsers()
        users.value = response.data

        const savedUserId = localStorage.getItem('chat:currentUserId')
        const foundUser = response.data.find(u => u.id === Number(savedUserId))

        if (foundUser) {
            currentUser.value = foundUser
        } else if (response.data.length > 0) {
            currentUser.value = response.data[0]
        }
    }

	async function loadMessages() {
		const { data } = await getMessages()
		messages.value = data
	}

	async function addMessage(user, text) {
		if (!user) return
		const payload = {
			sender_id: user.id,
			text,
		}
		const { data } = await sendMessage(payload)
		messages.value.push(data)
	}

	async function clearChat() {
		await clearMessages()
		messages.value = []
	}

	function selectUser(user) {
		currentUser.value = user
	}

	return {
		users, 
        currentUser, 
        messages,
		loadUsers, 
        loadMessages, 
        addMessage, 
        clearChat, 
        selectUser
	}
})
