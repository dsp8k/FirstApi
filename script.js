const apiUrl = 'https://localhost:7275/api/Products';

// Fetch and display all products
async function fetchProducts() {
  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error('Failed to fetch products');
    }
    const products = await response.json();
    displayProducts(products);
  } catch (error) {
    console.error('Error:', error);
    document.getElementById('product-list').innerHTML = '<p>Failed to load products.</p>';
  }
}

// Display products in the HTML
function displayProducts(products) {
  const productList = document.getElementById('product-list');
  productList.innerHTML = products
    .map(
      (product) => `
      <div class="product-item" data-id="${product.id}">
        <strong>ID:</strong> ${product.id} <br>
        <strong>SKU:</strong> ${product.sku} <br>
        <strong>Name:</strong> ${product.name} <br>
        <strong>Description:</strong> ${product.description} <br>
        <strong>Price:</strong> $${product.price} <br>
        <strong>Available:</strong> ${product.isAvailable ? 'Yes' : 'No'} <br>
        <strong>Category ID:</strong> ${product.categoryId} <br>
        <button onclick="deleteProduct(${product.id})">Delete</button>
        <button onclick="editProduct(${product.id})">Edit</button>
      </div>
    `
    )
    .join('');
}

// Fetch a product by ID
async function fetchProductById(id) {
  try {
    const response = await fetch(`${apiUrl}/${id}`);
    if (!response.ok) {
      throw new Error('Product not found');
    }
    const product = await response.json();
    displayProductDetails(product);
  } catch (error) {
    console.error('Error:', error);
    document.getElementById('product-details').innerHTML = '<p>Product not found.</p>';
  }
}

// Display product details in the HTML
function displayProductDetails(product) {
  const productDetails = document.getElementById('product-details');
  productDetails.innerHTML = `
    <div>
      <strong>ID:</strong> ${product.id} <br>
      <strong>SKU:</strong> ${product.sku} <br>
      <strong>Name:</strong> ${product.name} <br>
      <strong>Description:</strong> ${product.description} <br>
      <strong>Price:</strong> $${product.price} <br>
      <strong>Available:</strong> ${product.isAvailable ? 'Yes' : 'No'} <br>
      <strong>Category ID:</strong> ${product.categoryId}
    </div>
  `;
}

// Add a new product
async function addProduct(event) {
  event.preventDefault();
  const sku = document.getElementById('product-sku').value;
  const name = document.getElementById('product-name').value;
  const description = document.getElementById('product-description').value;
  const price = parseFloat(document.getElementById('product-price').value);
  const isAvailable = document.getElementById('product-isAvailable').checked;
  const categoryId = parseInt(document.getElementById('product-categoryId').value);

  const newProduct = { sku, name, description, price, isAvailable, categoryId };

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newProduct),
    });

    if (!response.ok) {
      throw new Error('Failed to add product');
    }

    const product = await response.json();
    console.log('Product added:', product);
    fetchProducts(); // Refresh the product list
  } catch (error) {
    console.error('Error:', error);
  }
}

// Update a product
async function updateProduct(event) {
  event.preventDefault();
  const id = document.getElementById('edit-product-id').value;
  const sku = document.getElementById('edit-product-sku').value;
  const name = document.getElementById('edit-product-name').value;
  const description = document.getElementById('edit-product-description').value;
  const price = parseFloat(document.getElementById('edit-product-price').value);
  const isAvailable = document.getElementById('edit-product-isAvailable').checked;
  const categoryId = parseInt(document.getElementById('edit-product-categoryId').value);

  const updatedProduct = { id, sku, name, description, price, isAvailable, categoryId };

  try {
    const response = await fetch(`${apiUrl}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedProduct),
    });

    if (!response.ok) {
      throw new Error('Failed to update product');
    }

    console.log('Product updated:', updatedProduct);
    fetchProducts(); // Refresh the product list
    closeEditForm(); // Close the edit form
  } catch (error) {
    console.error('Error:', error);
  }
}

// Delete a product
async function deleteProduct(id) {
  try {
    const response = await fetch(`${apiUrl}/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Failed to delete product');
    }

    console.log('Product deleted:', id);
    fetchProducts(); // Refresh the product list
  } catch (error) {
    console.error('Error:', error);
  }
}

// Open the edit form and scroll to it
function editProduct(id) {
  fetch(`${apiUrl}/${id}`)
    .then((response) => response.json())
    .then((product) => {
      document.getElementById('edit-product-id').value = product.id;
      document.getElementById('edit-product-sku').value = product.sku;
      document.getElementById('edit-product-name').value = product.name;
      document.getElementById('edit-product-description').value = product.description;
      document.getElementById('edit-product-price').value = product.price;
      document.getElementById('edit-product-isAvailable').checked = product.isAvailable;
      document.getElementById('edit-product-categoryId').value = product.categoryId;
      const editForm = document.getElementById('edit-form');
      editForm.style.display = 'block';
      setTimeout(() => {
        document.getElementById('edit-product-name').scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 100);
    })
    .catch((error) => console.error('Error:', error));
}


// Close the edit form
function closeEditForm() {
  document.getElementById('edit-form').style.display = 'none';
}

// Event listeners
document.getElementById('add-product-form').addEventListener('submit', addProduct);
document.getElementById('edit-form').addEventListener('submit', updateProduct);
document.getElementById('product-form').addEventListener('submit', (event) => {
  event.preventDefault();
  const productId = document.getElementById('product-id').value;
  fetchProductById(productId);
});

// Load products when the page loads
window.onload = fetchProducts;


