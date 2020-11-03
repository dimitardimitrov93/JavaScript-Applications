function attachEvents() {
    const authorInputElement = document.getElementById('author');
    const contentInputElement = document.getElementById('content');
    const textAreaElement = document.getElementById('messages');
    const sendButtonElement = document.getElementById('submit');
    const refreshButtonElement = document.getElementById('refresh');
    const apiUrl = 'https://rest-messanger.firebaseio.com/messanger.json';

    sendButtonElement.addEventListener('click', () => {

        if ((!authorInputElement.value || authorInputElement.value.trim() === '') || (!contentInputElement.value || contentInputElement.value.trim() === '')) return;

        let authorName = authorInputElement.value;
        let msgText = contentInputElement.value;

        authorInputElement.value = '';
        contentInputElement.value = '';

        let newPost = {
            author: authorName,
            content: msgText,
        }

        fetch(apiUrl, {
            method: 'POST',
            body: JSON.stringify(newPost),
        })
            .catch(err => {
                textAreaElement.value = 'Sorry, something went wrong :(';
            });
    });

    refreshButtonElement.addEventListener('click', () => {
        textAreaElement.value = '';
        fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
                let messages = Object.values(data);
                messages.forEach(post => {
                    if (post.author !== '' && post.content !== '') {
                        textAreaElement.value += `${post.author}: ${post.content}`;

                        if (post.author !== 'Last') {
                            textAreaElement.value += '\n';
                        }
                    }
                });
            })
            .catch(err => {
                textAreaElement.value = 'Sorry, something went wrong :(';
            });
    });
}

attachEvents();