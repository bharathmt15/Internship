window.onload = function () {
    const container = document.getElementById("product-container"); // html div element where the API data is fetched and shown on browser

    fetch("https://dummyjson.com/products") // this is the fake API used found it online
        .then((res) => res.json())
        .then((data) => {
            console.clear();
            data.products.forEach((product) => {
                // iterating over the data and placing them into cards
                const card = document.createElement("div");
                card.classList.add("card");
                // writing HTML in template literlas
                card.innerHTML = `
          <img src="${product.thumbnail}" alt="${product.title}" />
          <div class="card-body">
            <h3>${product.title}</h3>
            <p>${product.description}</p>
            <div class="price">₹${product.price}</div>
          </div>
        `;
                container.appendChild(card);
            });
        })
        .catch((err) => {
            console.error("Error:", err);
        });
};
