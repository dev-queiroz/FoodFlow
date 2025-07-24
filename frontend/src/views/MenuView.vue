<template>
  <div class="dashboard-layout">
    <SidebarMenu />
    <div class="dashboard-content">
      <!-- Header da página -->
      <div class="page-header">
        <h1>Cardápio Digital</h1>
        <div class="header-actions">
          <button class="btn btn-outline" @click="showPreview = !showPreview">
            <i class="fas fa-eye"></i>
            {{ showPreview ? 'Editar' : 'Visualizar' }}
          </button>
          <button class="btn btn-primary" @click="showAddProduct = true">
            <i class="fas fa-plus"></i>
            Adicionar Produto
          </button>
        </div>
      </div>

      <!-- Navegação por abas -->
      <div class="tabs">
        <button 
          class="tab" 
          :class="{ active: activeTab === 'products' }"
          @click="activeTab = 'products'"
        >
          <i class="fas fa-utensils"></i>
          Produtos
        </button>
        <button 
          class="tab" 
          :class="{ active: activeTab === 'categories' }"
          @click="activeTab = 'categories'"
        >
          <i class="fas fa-tags"></i>
          Categorias
        </button>
        <button 
          class="tab" 
          :class="{ active: activeTab === 'settings' }"
          @click="activeTab = 'settings'"
        >
          <i class="fas fa-cog"></i>
          Configurações
        </button>
      </div>

      <!-- Conteúdo das abas -->
      <div class="tab-content">
        <!-- Aba Produtos -->
        <div v-if="activeTab === 'products'" class="products-section">
          <div v-if="!showPreview" class="products-management">
            <!-- Filtros e busca -->
            <div class="filters">
              <div class="search-box">
                <i class="fas fa-search"></i>
                <input 
                  type="text" 
                  placeholder="Buscar produtos..." 
                  v-model="searchTerm"
                >
              </div>
              <select v-model="selectedCategory" class="category-filter">
                <option value="">Todas as categorias</option>
                <option v-for="category in categories" :key="category.id" :value="category.id">
                  {{ category.name }}
                </option>
              </select>
            </div>

            <!-- Lista de produtos -->
            <div class="products-grid">
              <div 
                v-for="product in filteredProducts" 
                :key="product.id" 
                class="product-card"
              >
                <div class="product-image">
                  <img :src="product.image" :alt="product.name" />
                  <div class="product-status" :class="{ active: product.isActive }">
                    {{ product.isActive ? 'Ativo' : 'Inativo' }}
                  </div>
                </div>
                <div class="product-info">
                  <h3>{{ product.name }}</h3>
                  <p class="product-description">{{ product.description }}</p>
                  <div class="product-price">R$ {{ product.price.toFixed(2) }}</div>
                  <div class="product-category">{{ getCategoryName(product.categoryId) }}</div>
                </div>
                <div class="product-actions">
                  <button class="btn-icon" @click="editProduct(product)">
                    <i class="fas fa-edit"></i>
                  </button>
                  <button class="btn-icon" @click="toggleProductStatus(product)">
                    <i class="fas" :class="product.isActive ? 'fa-eye-slash' : 'fa-eye'"></i>
                  </button>
                  <button class="btn-icon danger" @click="deleteProduct(product)">
                    <i class="fas fa-trash"></i>
                  </button>
                </div>
              </div>

              <!-- Card para adicionar novo produto -->
              <div class="product-card add-product" @click="showAddProduct = true">
                <div class="add-icon">
                  <i class="fas fa-plus"></i>
                </div>
                <p>Adicionar Produto</p>
              </div>
            </div>
          </div>

          <!-- Preview do cardápio -->
          <div v-else class="menu-preview">
            <div class="preview-header">
              <h2>Preview do Cardápio</h2>
              <p>Visualização de como seus clientes verão o cardápio</p>
            </div>
            
            <div class="menu-categories">
              <div v-for="category in categories" :key="category.id" class="menu-category">
                <h3>{{ category.name }}</h3>
                <div class="menu-items">
                  <div 
                    v-for="product in getProductsByCategory(category.id)" 
                    :key="product.id"
                    class="menu-item"
                  >
                    <img :src="product.image" :alt="product.name" class="menu-item-image" />
                    <div class="menu-item-info">
                      <h4>{{ product.name }}</h4>
                      <p>{{ product.description }}</p>
                      <span class="menu-item-price">R$ {{ product.price.toFixed(2) }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Aba Categorias -->
        <div v-if="activeTab === 'categories'" class="categories-section">
          <div class="section-header">
            <h2>Gerenciar Categorias</h2>
            <button class="btn btn-primary" @click="showAddCategory = true">
              <i class="fas fa-plus"></i>
              Nova Categoria
            </button>
          </div>

          <div class="categories-list">
            <div 
              v-for="category in categories" 
              :key="category.id" 
              class="category-item"
            >
              <div class="category-info">
                <h3>{{ category.name }}</h3>
                <p>{{ getProductsCountByCategory(category.id) }} produtos</p>
              </div>
              <div class="category-actions">
                <button class="btn-icon" @click="editCategory(category)">
                  <i class="fas fa-edit"></i>
                </button>
                <button class="btn-icon danger" @click="deleteCategory(category)">
                  <i class="fas fa-trash"></i>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Aba Configurações -->
        <div v-if="activeTab === 'settings'" class="settings-section">
          <h2>Configurações do Cardápio</h2>
          
          <div class="settings-grid">
            <div class="setting-card">
              <h3>Aparência</h3>
              <div class="setting-option">
                <label>Tema do cardápio:</label>
                <select v-model="menuSettings.theme">
                  <option value="modern">Moderno</option>
                  <option value="classic">Clássico</option>
                  <option value="elegant">Elegante</option>
                </select>
              </div>
              <div class="setting-option">
                <label>
                  <input type="checkbox" v-model="menuSettings.showImages">
                  Mostrar imagens dos produtos
                </label>
              </div>
            </div>

            <div class="setting-card">
              <h3>Funcionalidades</h3>
              <div class="setting-option">
                <label>
                  <input type="checkbox" v-model="menuSettings.allowOrdering">
                  Permitir pedidos online
                </label>
              </div>
              <div class="setting-option">
                <label>
                  <input type="checkbox" v-model="menuSettings.showNutritionalInfo">
                  Mostrar informações nutricionais
                </label>
              </div>
            </div>

            <div class="setting-card">
              <h3>QR Code</h3>
              <p>Gere um QR Code para que seus clientes acessem o cardápio</p>
              <button class="btn btn-outline">
                <i class="fas fa-qrcode"></i>
                Gerar QR Code
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Modal para adicionar produto -->
      <div v-if="showAddProduct" class="modal-overlay" @click="showAddProduct = false">
        <div class="modal" @click.stop>
          <div class="modal-header">
            <h3>{{ editingProduct ? 'Editar Produto' : 'Adicionar Produto' }}</h3>
            <button class="modal-close" @click="showAddProduct = false">
              <i class="fas fa-times"></i>
            </button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="saveProduct">
              <div class="form-group">
                <label>Nome do Produto:</label>
                <input type="text" v-model="productForm.name" required>
              </div>
              <div class="form-group">
                <label>Descrição:</label>
                <textarea v-model="productForm.description" rows="3"></textarea>
              </div>
              <div class="form-row">
                <div class="form-group">
                  <label>Preço (R$):</label>
                  <input type="number" step="0.01" v-model="productForm.price" required>
                </div>
                <div class="form-group">
                  <label>Categoria:</label>
                  <select v-model="productForm.categoryId" required>
                    <option value="">Selecione uma categoria</option>
                    <option v-for="category in categories" :key="category.id" :value="category.id">
                      {{ category.name }}
                    </option>
                  </select>
                </div>
              </div>
              <div class="form-group">
                <label>URL da Imagem:</label>
                <input type="url" v-model="productForm.image" placeholder="https://exemplo.com/imagem.jpg">
              </div>
              <div class="form-actions">
                <button type="button" class="btn btn-outline" @click="showAddProduct = false">
                  Cancelar
                </button>
                <button type="submit" class="btn btn-primary">
                  {{ editingProduct ? 'Salvar' : 'Adicionar' }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <!-- Modal para adicionar categoria -->
      <div v-if="showAddCategory" class="modal-overlay" @click="showAddCategory = false">
        <div class="modal" @click.stop>
          <div class="modal-header">
            <h3>Nova Categoria</h3>
            <button class="modal-close" @click="showAddCategory = false">
              <i class="fas fa-times"></i>
            </button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="saveCategory">
              <div class="form-group">
                <label>Nome da Categoria:</label>
                <input type="text" v-model="categoryForm.name" required>
              </div>
              <div class="form-actions">
                <button type="button" class="btn btn-outline" @click="showAddCategory = false">
                  Cancelar
                </button>
                <button type="submit" class="btn btn-primary">
                  Adicionar
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue';
import SidebarMenu from '@/components/dashboard/SidebarMenu.vue';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  categoryId: string;
  image: string;
  isActive: boolean;
}

interface Category {
  id: string;
  name: string;
}

export default defineComponent({
  name: 'MenuView',
  components: {
    SidebarMenu
  },
  setup() {
    const activeTab = ref('products');
    const showPreview = ref(false);
    const showAddProduct = ref(false);
    const showAddCategory = ref(false);
    const searchTerm = ref('');
    const selectedCategory = ref('');
    const editingProduct = ref<Product | null>(null);

    // Dados mock
    const categories = ref<Category[]>([
      { id: '1', name: 'Entradas' },
      { id: '2', name: 'Pratos Principais' },
      { id: '3', name: 'Sobremesas' },
      { id: '4', name: 'Bebidas' }
    ]);

    const products = ref<Product[]>([
      {
        id: '1',
        name: 'Bruschetta Italiana',
        description: 'Pão italiano tostado com tomate, manjericão e azeite extra virgem',
        price: 18.90,
        categoryId: '1',
        image: 'https://images.unsplash.com/photo-1572441713132-51c75654db73?w=300',
        isActive: true
      },
      {
        id: '2',
        name: 'Salmão Grelhado',
        description: 'Salmão fresco grelhado com legumes salteados e molho de ervas',
        price: 45.90,
        categoryId: '2',
        image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=300',
        isActive: true
      },
      {
        id: '3',
        name: 'Tiramisu',
        description: 'Sobremesa italiana tradicional com café e mascarpone',
        price: 16.90,
        categoryId: '3',
        image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=300',
        isActive: true
      }
    ]);

    const productForm = ref({
      name: '',
      description: '',
      price: 0,
      categoryId: '',
      image: ''
    });

    const categoryForm = ref({
      name: ''
    });

    const menuSettings = ref({
      theme: 'modern',
      showImages: true,
      allowOrdering: true,
      showNutritionalInfo: false
    });

    // Computed
    const filteredProducts = computed(() => {
      let filtered = products.value;
      
      if (searchTerm.value) {
        filtered = filtered.filter(product => 
          product.name.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
          product.description.toLowerCase().includes(searchTerm.value.toLowerCase())
        );
      }
      
      if (selectedCategory.value) {
        filtered = filtered.filter(product => product.categoryId === selectedCategory.value);
      }
      
      return filtered;
    });

    // Methods
    const getCategoryName = (categoryId: string) => {
      const category = categories.value.find(c => c.id === categoryId);
      return category ? category.name : 'Sem categoria';
    };

    const getProductsByCategory = (categoryId: string) => {
      return products.value.filter(product => product.categoryId === categoryId && product.isActive);
    };

    const getProductsCountByCategory = (categoryId: string) => {
      return products.value.filter(product => product.categoryId === categoryId).length;
    };

    const editProduct = (product: Product) => {
      editingProduct.value = product;
      productForm.value = { ...product };
      showAddProduct.value = true;
    };

    const toggleProductStatus = (product: Product) => {
      product.isActive = !product.isActive;
    };

    const deleteProduct = (product: Product) => {
      if (confirm(`Tem certeza que deseja excluir o produto "${product.name}"?`)) {
        const index = products.value.findIndex(p => p.id === product.id);
        if (index > -1) {
          products.value.splice(index, 1);
        }
      }
    };

    const saveProduct = () => {
      if (editingProduct.value) {
        // Editando produto existente
        const index = products.value.findIndex(p => p.id === editingProduct.value!.id);
        if (index > -1) {
          products.value[index] = { ...editingProduct.value, ...productForm.value };
        }
      } else {
        // Adicionando novo produto
        const newProduct: Product = {
          id: Date.now().toString(),
          ...productForm.value,
          isActive: true
        };
        products.value.push(newProduct);
      }
      
      // Reset form
      productForm.value = {
        name: '',
        description: '',
        price: 0,
        categoryId: '',
        image: ''
      };
      editingProduct.value = null;
      showAddProduct.value = false;
    };

    const editCategory = (category: Category) => {
      categoryForm.value.name = category.name;
      showAddCategory.value = true;
    };

    const deleteCategory = (category: Category) => {
      if (confirm(`Tem certeza que deseja excluir a categoria "${category.name}"?`)) {
        const index = categories.value.findIndex(c => c.id === category.id);
        if (index > -1) {
          categories.value.splice(index, 1);
        }
      }
    };

    const saveCategory = () => {
      const newCategory: Category = {
        id: Date.now().toString(),
        name: categoryForm.value.name
      };
      categories.value.push(newCategory);
      
      categoryForm.value.name = '';
      showAddCategory.value = false;
    };

    return {
      activeTab,
      showPreview,
      showAddProduct,
      showAddCategory,
      searchTerm,
      selectedCategory,
      editingProduct,
      categories,
      products,
      productForm,
      categoryForm,
      menuSettings,
      filteredProducts,
      getCategoryName,
      getProductsByCategory,
      getProductsCountByCategory,
      editProduct,
      toggleProductStatus,
      deleteProduct,
      saveProduct,
      editCategory,
      deleteCategory,
      saveCategory
    };
  }
});
</script>

<style scoped>
.dashboard-layout {
  display: flex;
  min-height: 100vh;
  background: #f8fafc;
}

.dashboard-content {
  flex: 1;
  padding: 2rem;
  overflow-y: auto;
}

/* Header da página */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #e2e8f0;
}

.page-header h1 {
  font-size: 2rem;
  font-weight: 700;
  color: #1a202c;
  margin: 0;
}

.header-actions {
  display: flex;
  gap: 1rem;
}

/* Botões */
.btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  font-weight: 500;
  text-decoration: none;
  transition: all 0.2s;
  border: none;
  cursor: pointer;
  font-size: 0.9rem;
}

.btn-primary {
  background: #1a73e8;
  color: white;
}

.btn-primary:hover {
  background: #1557b0;
}

.btn-outline {
  background: white;
  color: #1a73e8;
  border: 2px solid #1a73e8;
}

.btn-outline:hover {
  background: #1a73e8;
  color: white;
}

.btn-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 0.5rem;
  border: none;
  background: #f7fafc;
  color: #4a5568;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-icon:hover {
  background: #e2e8f0;
}

.btn-icon.danger {
  color: #e53e3e;
}

.btn-icon.danger:hover {
  background: #fed7d7;
}

/* Tabs */
.tabs {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 2rem;
  border-bottom: 1px solid #e2e8f0;
}

.tab {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem 1.5rem;
  background: none;
  border: none;
  color: #718096;
  font-weight: 500;
  cursor: pointer;
  border-bottom: 2px solid transparent;
  transition: all 0.2s;
}

.tab:hover {
  color: #1a73e8;
}

.tab.active {
  color: #1a73e8;
  border-bottom-color: #1a73e8;
}

/* Filtros */
.filters {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  align-items: center;
}

.search-box {
  position: relative;
  flex: 1;
  max-width: 400px;
}

.search-box i {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #a0aec0;
}

.search-box input {
  width: 100%;
  padding: 0.75rem 0.75rem 0.75rem 3rem;
  border: 2px solid #e2e8f0;
  border-radius: 0.5rem;
  font-size: 0.9rem;
  transition: border-color 0.2s;
}

.search-box input:focus {
  outline: none;
  border-color: #1a73e8;
}

.category-filter {
  padding: 0.75rem 1rem;
  border: 2px solid #e2e8f0;
  border-radius: 0.5rem;
  background: white;
  min-width: 200px;
}

/* Grid de produtos */
.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}

.product-card {
  background: white;
  border-radius: 0.75rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: transform 0.2s, box-shadow 0.2s;
}

.product-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.product-image {
  position: relative;
  height: 200px;
  overflow: hidden;
}

.product-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.product-status {
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.75rem;
  font-weight: 600;
  background: #fed7d7;
  color: #c53030;
}

.product-status.active {
  background: #c6f6d5;
  color: #22543d;
}

.product-info {
  padding: 1.5rem;
}

.product-info h3 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1a202c;
  margin: 0 0 0.5rem;
}

.product-description {
  color: #718096;
  font-size: 0.9rem;
  margin: 0 0 1rem;
  line-height: 1.5;
}

.product-price {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1a73e8;
  margin-bottom: 0.5rem;
}

.product-category {
  font-size: 0.8rem;
  color: #a0aec0;
  text-transform: uppercase;
  font-weight: 500;
}

.product-actions {
  display: flex;
  gap: 0.5rem;
  padding: 1rem 1.5rem;
  background: #f7fafc;
  border-top: 1px solid #e2e8f0;
}

/* Card para adicionar produto */
.add-product {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 300px;
  border: 2px dashed #e2e8f0;
  background: #f7fafc;
  cursor: pointer;
  transition: all 0.2s;
}

.add-product:hover {
  border-color: #1a73e8;
  background: #ebf8ff;
}

.add-icon {
  width: 4rem;
  height: 4rem;
  border-radius: 50%;
  background: #1a73e8;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  margin-bottom: 1rem;
}

.add-product p {
  color: #718096;
  font-weight: 500;
  margin: 0;
}

/* Preview do menu */
.menu-preview {
  max-width: 800px;
  margin: 0 auto;
}

.preview-header {
  text-align: center;
  margin-bottom: 3rem;
}

.preview-header h2 {
  font-size: 1.875rem;
  font-weight: 700;
  color: #1a202c;
  margin-bottom: 0.5rem;
}

.preview-header p {
  color: #718096;
  font-size: 1.1rem;
}

.menu-category {
  margin-bottom: 3rem;
}

.menu-category h3 {
  font-size: 1.5rem;
  font-weight: 600;
  color: #1a202c;
  margin-bottom: 1.5rem;
  padding-bottom: 0.75rem;
  border-bottom: 2px solid #1a73e8;
}

.menu-items {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.menu-item {
  display: flex;
  gap: 1rem;
  padding: 1.5rem;
  background: white;
  border-radius: 0.75rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.menu-item-image {
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 0.5rem;
  flex-shrink: 0;
}

.menu-item-info {
  flex: 1;
}

.menu-item-info h4 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1a202c;
  margin: 0 0 0.5rem;
}

.menu-item-info p {
  color: #718096;
  margin: 0 0 1rem;
  line-height: 1.5;
}

.menu-item-price {
  font-size: 1.25rem;
  font-weight: 700;
  color: #1a73e8;
}

/* Seção de categorias */
.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.section-header h2 {
  font-size: 1.5rem;
  font-weight: 600;
  color: #1a202c;
  margin: 0;
}

.categories-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.category-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  background: white;
  border-radius: 0.75rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.category-info h3 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1a202c;
  margin: 0 0 0.25rem;
}

.category-info p {
  color: #718096;
  margin: 0;
  font-size: 0.9rem;
}

.category-actions {
  display: flex;
  gap: 0.5rem;
}

/* Configurações */
.settings-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}

.setting-card {
  background: white;
  padding: 2rem;
  border-radius: 0.75rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.setting-card h3 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1a202c;
  margin: 0 0 1.5rem;
}

.setting-option {
  margin-bottom: 1rem;
}

.setting-option label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 500;
  color: #4a5568;
  cursor: pointer;
}

.setting-option select {
  margin-top: 0.5rem;
  padding: 0.5rem;
  border: 2px solid #e2e8f0;
  border-radius: 0.375rem;
  width: 100%;
}

/* Modais */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal {
  background: white;
  border-radius: 0.75rem;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
  max-width: 500px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #e2e8f0;
}

.modal-header h3 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1a202c;
  margin: 0;
}

.modal-close {
  background: none;
  border: none;
  font-size: 1.25rem;
  color: #a0aec0;
  cursor: pointer;
  padding: 0.25rem;
}

.modal-close:hover {
  color: #718096;
}

.modal-body {
  padding: 1.5rem;
}

/* Formulários */
.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  font-weight: 500;
  color: #4a5568;
  margin-bottom: 0.5rem;
}

.form-group input,
.form-group textarea,
.form-group select {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #e2e8f0;
  border-radius: 0.375rem;
  font-size: 0.9rem;
  transition: border-color 0.2s;
}

.form-group input:focus,
.form-group textarea:focus,
.form-group select:focus {
  outline: none;
  border-color: #1a73e8;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.form-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 2rem;
}

/* Responsividade */
@media (max-width: 900px) {
  .dashboard-layout {
    flex-direction: column;
  }
  
  .dashboard-content {
    padding: 1rem;
  }
  
  .page-header {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }
  
  .header-actions {
    justify-content: center;
  }
  
  .filters {
    flex-direction: column;
  }
  
  .products-grid {
    grid-template-columns: 1fr;
  }
  
  .form-row {
    grid-template-columns: 1fr;
  }
  
  .settings-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 600px) {
  .tabs {
    flex-wrap: wrap;
  }
  
  .menu-item {
    flex-direction: column;
  }
  
  .menu-item-image {
    width: 100%;
    height: 200px;
  }
}
</style>