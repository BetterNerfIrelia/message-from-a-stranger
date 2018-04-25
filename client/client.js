/** @type {HTMLButtonElement} */
const submitButton = document.querySelector('#send-message-button')
/** @type {HTMLInputElement} */
const messageInput = document.querySelector('#message-input')

/** @type {HTMLDivElement[]} */
const moodIcons = Array.from(document.querySelectorAll('.mood'))

/** @type {string} */
let mood = null

const MOOD_SELECTED_CLASS = 'mood--selected'

/**
 * @param {HTMLDivElement} moodElement
 */
function selectMood(moodElement) {
  moodIcons.forEach(el => el.classList.remove(MOOD_SELECTED_CLASS))
  mood = moodElement.textContent
  moodElement.classList.add(MOOD_SELECTED_CLASS)
}

// select the first moodicon
selectMood(moodIcons[0])

moodIcons.forEach(moodElement => {
  moodElement.addEventListener('click', () => selectMood(moodElement))
})

submitButton.addEventListener('click', async () => {
  await fetch('/send-message', {
    method: 'POST',
    body: JSON.stringify({
      message: messageInput.value,
      mood,
    }),
  })
  // reset
  messageInput.value = ''
  selectMood(moodIcons[0])
})
