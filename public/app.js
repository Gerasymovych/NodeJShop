document.querySelectorAll('.price').forEach(node => {
    node.textContent = new Intl.NumberFormat('en-US', {
        currency: 'ils',
        style: 'currency'
    }).format(node.textContent);
})

const toDate = date => {
    return new Intl.DateTimeFormat('en-US', {
       day: '2-digit',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    }).format(new Date(date));
}

document.querySelectorAll('.date').forEach(node => {
    node.textContent = toDate(node.textContent);
});

const $card = document.querySelector('#card');
if ($card) {
    $card.addEventListener('click', e => {
        if (e.target.classList.contains('js-remove')) {
            const id = e.target.dataset.id;
            console.log(id);

            fetch('/card/remove/' + id, {
                method: 'delete'
            }).then(res => res.json())
                .then(card => {
                console.log(card);
                if (card.courses.length) {
                    const html = card.courses.map(c => {
                        return `
                            <tr>
                                <td>${c.title}</td>
                                <td>${c.count}</td>
                                <td>
                                    <button class="btn btn-small js-remove" data-id="${c.id}">Delete</button>
                                </td>
                            </tr>
                        `
                    }).join('');
                    $card.querySelector('tbody').innerHTML = html;
                    $card.querySelector('.price').textContent = card.price;
                } else {
                    $card.innerHTML = "<p>Cart is empty</p>";
                }
            })
        }
    })
}

var instance = M.Tabs.init(document.querySelectorAll('.tabs'));