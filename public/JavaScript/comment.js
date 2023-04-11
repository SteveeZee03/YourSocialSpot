

async function commentFormHandler(event) {
    event.preventDefault();

    const commentTxt = document.querySelector('textarea[name="comment-body"]').value.trim();

    const post_id = window.location.toString().split('/')[
        window.location.toString().split('/').length - 1
    ];

    if (commentTxt) {
        const response = await fetch('/api/comment', {
            method: 'POST',
            body: JSON.stringify({
                post_id,
                commentTxt
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            document.location.reload();
        } else {
            alert(response.statusText);
        }
    }
}

document.querySelector('.comment-form').addEventListener('submit', commentFormHandler);