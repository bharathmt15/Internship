window.onload = function () {
    const container = document.getElementById("product-container");

    fetch("https://dummyjson.com/products")
        .then((res) => res.json())
        .then((data) => {
            console.clear();
            data.products.forEach((product) => {
                const card = document.createElement("div");
                card.classList.add("card");
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
