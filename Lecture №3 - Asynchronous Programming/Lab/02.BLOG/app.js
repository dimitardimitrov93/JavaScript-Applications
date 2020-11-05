function attachEvents() {
    const loadPostsButtonElement = document.getElementById('btnLoadPosts');
    const selectPostsSelectElement = document.getElementById('posts');
    const viewPostsButtonElement = document.getElementById('btnViewPost');
    const postTitleH1Element = document.getElementById('post-title');
    const postBodyParagraphElement = document.getElementById('post-body');
    const postCommentsUlElement = document.getElementById('post-comments');

    const loadPostsUrl = `https://blog-apps-c12bf.firebaseio.com/posts.json`;

    loadPostsButtonElement.addEventListener('click', () => {
        loadPosts(loadPostsUrl)
            .then(allPosts => {
                selectPostsSelectElement.innerHTML = Object.entries(allPosts)
                    .map(post => `<option value="${post[0]}">${post[1].title}<option>`)
                    .join('');
            })

    });

    viewPostsButtonElement.addEventListener('click', () => {
        let postId = selectPostsSelectElement.value;
        let viewPostsUrl = `https://blog-apps-c12bf.firebaseio.com/posts/${postId}.json`

        viewPost(viewPostsUrl)
            .then(desiredPost => {
                postTitleH1Element.innerHTML = desiredPost.title;
                postBodyParagraphElement.innerHTML = desiredPost.body;
                
                postCommentsUlElement.innerHTML = '';
                postCommentsUlElement.innerHTML += desiredPost.comments
                    .map(comment => `<li id="${comment.id}">${comment.text}</li>`)
                    .join('');
            })
    })


    async function loadPosts(loadPostsUrl) {
        try {
            const response = fetch(loadPostsUrl);
            const allPostsResponse = await response;
            return allPostsResponse.json();
        }
        catch (err) {
            return err.message;
        }
    }

    async function viewPost(viewPostsUrl) {
        try {
            const response = fetch(viewPostsUrl);
            const desiredPostResponse = await response;
            return desiredPostResponse.json();
        }
        catch (err) {
            return err.message;
        }
    }
}

attachEvents();