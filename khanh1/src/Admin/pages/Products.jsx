import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { useOutletContext } from 'react-router-dom';

const Products = () => {
  const { t, i18n } = useTranslation();
  const { products, setProducts } = useOutletContext();
  const loading = products.length === 0;
  const [searchTerm, setSearchTerm] = useState('');


  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [newProduct, setNewProduct] = useState({ title: '', description: '', category: 'beauty', price: 0, stock: 0, thumbnail: '' });

  const handleDelete = async (id) => {
    if (window.confirm(t('products.confirm_delete', 'Bạn có chắc chắn muốn xóa sản phẩm này?'))) {
      setProducts(products.filter(p => p.id !== id));
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setIsEditModalOpen(true);
  };

  const handleAdd = () => {
    setNewProduct({ title: '', description: '', category: 'beauty', price: 0, stock: 0, thumbnail: '' });
    setIsAddModalOpen(true);
  };

  const submitAdd = async (e) => {
    e.preventDefault();
    const newId = Date.now();
    const payload = { ...newProduct, id: newId, price: Number(newProduct.price), stock: Number(newProduct.stock) };
    setProducts([payload, ...products]);
    setIsAddModalOpen(false);
  };

  const submitEdit = async (e) => {
    e.preventDefault();
    const payload = { ...editingProduct, price: Number(editingProduct.price), stock: Number(editingProduct.stock) };
    setProducts(products.map(p => p.id === payload.id ? payload : p));
    setIsEditModalOpen(false);
  };

  if (loading) {
    return (
      <div className="dashboard-canvas" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '50vh' }}>
        <div style={{ color: 'var(--primary)', fontWeight: 500 }}>Đang tải dữ liệu sản phẩm...</div>
      </div>
    );
  }

  const filteredProducts = products.filter(product => 
    product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.id.toString().includes(searchTerm)
  );

  const totalProducts = products.length;
  const categories = [...new Set(products.map(p => p.category))].length;
  const lowStock = products.filter(p => p.stock < 20).length;

  const categoryMap = {
    beauty: "Làm đẹp",
    fragrances: "Nước hoa",
    furniture: "Nội thất",
    groceries: "Tạp hóa",
    "home-decoration": "Trang trí",
    "kitchen-accessories": "Đồ bếp",
    laptops: "Laptop",
    "mens-shirts": "Sơ mi nam",
    "mens-shoes": "Giày nam",
    "mens-watches": "Đồng hồ nam",
    "mobile-accessories": "Phụ kiện SĐT",
    motorcycle: "Mô tô",
    "skin-care": "Chăm sóc da",
    smartphones: "Điện thoại",
    "sports-accessories": "Đồ thể thao",
    sunglasses: "Kính mát",
    tablets: "Máy tính bảng",
    tops: "Áo",
    vehicle: "Xe cộ",
    "womens-bags": "Túi xách nữ",
    "womens-dresses": "Váy nữ",
    "womens-jewellery": "Trang sức nữ",
    "womens-shoes": "Giày nữ",
    "womens-watches": "Đồng hồ nữ"
  };

  const currentLang = i18n.language || 'en';
  const getCategoryName = (cat) => {
    if (currentLang.startsWith('vi') && categoryMap[cat]) {
      return categoryMap[cat];
    }
    return cat.replace("-", " ");
  };

  return (
    <div className="dashboard-canvas">
      <section className="page-header" style={{ marginBottom: '2rem' }}>
        <div className="page-header-text">
          <span className="page-subtitle text-primary font-medium tracking-wide">Kho Hàng & Sản Phẩm</span>
          <h2 className="page-title text-4xl mt-1 mb-2">Quản Lý Sản Phẩm</h2>
          <p className="text-on-surface-variant max-w-2xl">Quản lý kho hàng, theo dõi mặt hàng, chỉnh sửa thông tin giá cả và số lượng.</p>
        </div>
        <button onClick={handleAdd} className="btn-primary shadow-sm" style={{ borderRadius: '9999px', display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem' }}>
          <span className="material-symbols-outlined" style={{ paddingBottom: '2px' }}>add</span>
          Thêm Sản Phẩm Mới
        </button>
      </section>

      <div className="staff-overview-grid" style={{ marginBottom: '2.5rem' }}>
        <div className="stat-card">
          <div className="stat-info">
            <p className="stat-label">Tổng Sản Phẩm</p>
            <h3 className="stat-value text-3xl">{totalProducts}</h3>
            <span className="stat-meta text-primary badge-surface mt-2 inline-block">Đang hoạt động</span>
          </div>
          <div className="stat-icon-box bg-surface-container-high rounded-full p-4">
            <span className="material-symbols-outlined text-on-surface text-3xl" data-icon="inventory_2">inventory_2</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-info">
             <p className="stat-label">Danh Mục</p>
             <h3 className="stat-value text-3xl">{categories}</h3>
             <span className="stat-meta text-on-surface-variant mt-2 inline-block">Phân loại hàng hóa</span>
          </div>
          <div className="stat-icon-box bg-surface-container-high rounded-full p-4">
             <span className="material-symbols-outlined text-tertiary text-3xl" data-icon="category">category</span>
          </div>
        </div>
        <div className="stat-card border border-warning/20 bg-warning/5">
          <div className="stat-info">
             <p className="stat-label text-warning">Cảnh Báo Hết Hàng</p>
             <h3 className="stat-value text-3xl text-warning">{lowStock} <span className="text-sm font-normal text-on-surface">sản phẩm</span></h3>
             <span className="stat-meta text-warning mt-2 inline-block">Cần nhập thêm</span>
          </div>
          <div className="stat-icon-box bg-warning/20 rounded-full p-4">
             <span className="material-symbols-outlined text-warning text-3xl" data-icon="warning">warning</span>
          </div>
        </div>
      </div>

      <div className="bg-surface rounded-2xl border border-outline-variant overflow-hidden shadow-sm">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.25rem', borderBottom: '1px solid var(--outline-variant)' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 500, margin: 0, color: 'var(--on-surface)' }}>Danh Sách Sản Phẩm</h3>
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <div style={{ position: 'relative' }}>
              <span className="material-symbols-outlined" style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--on-surface-variant)', fontSize: '20px' }}>search</span>
              <input 
                type="text" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Tìm kiếm tên, ID..." 
                style={{ padding: '0.5rem 1rem 0.5rem 2.5rem', border: '1px solid var(--outline-variant)', borderRadius: '0.5rem', fontSize: '0.875rem', backgroundColor: 'var(--surface-container-lowest)', color: 'var(--on-surface)', outline: 'none', width: '240px' }} 
              />
            </div>
            <button onClick={() => {}} style={{ padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '0.25rem', borderRadius: '0.5rem', border: '1px solid var(--outline-variant)', fontSize: '0.875rem', backgroundColor: 'var(--surface)', color: 'var(--on-surface-variant)', cursor: 'pointer' }}>
              <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>filter_list</span>
              Lọc
            </button>
          </div>
        </div>
        
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse', minWidth: '800px' }}>
            <thead style={{ backgroundColor: 'var(--surface-container-lowest)', borderBottom: '1px solid var(--outline-variant)', fontSize: '13px', color: 'var(--on-surface-variant)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              <tr>
                <th style={{ padding: '1rem 1.25rem', fontWeight: 600 }} width="80">ID</th>
                <th style={{ padding: '1rem 1.25rem', fontWeight: 600 }} width="80">Ảnh</th>
                <th style={{ padding: '1rem 1.25rem', fontWeight: 600 }}>Sản Phẩm</th>
                <th style={{ padding: '1rem 1.25rem', fontWeight: 600 }} width="140">Danh Mục</th>
                <th style={{ padding: '1rem 1.25rem', fontWeight: 600 }} width="100">Giá</th>
                <th style={{ padding: '1rem 1.25rem', fontWeight: 600 }} width="120">Tồn Kho</th>
                <th style={{ padding: '1rem 1.25rem', fontWeight: 600, textAlign: 'center' }} width="120">Thao Tác</th>
              </tr>
            </thead>
            <tbody style={{ fontSize: '0.875rem' }}>
              {filteredProducts.map((product) => (
                <tr key={product.id} style={{ borderBottom: '1px solid var(--outline-variant)' }}>
                  <td style={{ padding: '0.75rem 1.25rem', fontWeight: 500, color: 'var(--on-surface-variant)' }}>#{product.id.toString().substring(0,6)}</td>
                  <td style={{ padding: '0.75rem 1.25rem' }}>
                    <img src={product.thumbnail} alt={product.title} style={{ width: '3rem', height: '3rem', objectFit: 'cover', borderRadius: '0.25rem', border: '1px solid var(--outline-variant)', backgroundColor: 'var(--surface)' }} />
                  </td>
                  <td style={{ padding: '0.75rem 1.25rem' }}>
                    <div style={{ fontWeight: 600, color: 'var(--on-surface)', fontSize: '1rem' }}>{product.title}</div>
                    <div style={{ fontSize: '13px', color: 'var(--on-surface-variant)', marginTop: '2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '240px' }} title={product.description}>{product.description}</div>
                  </td>
                  <td style={{ padding: '0.75rem 1.25rem', textTransform: 'capitalize' }}>
                    <span style={{ backgroundColor: 'var(--surface-container-highest)', color: 'var(--on-surface-variant)', padding: '0.25rem 0.625rem', borderRadius: '0.375rem', fontSize: '13px' }}>{getCategoryName(product.category)}</span>
                  </td>
                  <td style={{ padding: '0.75rem 1.25rem', fontWeight: 600, color: 'var(--primary)' }}>${product.price.toFixed(2)}</td>
                  <td style={{ padding: '0.75rem 1.25rem' }}>
                    <span style={{ display: 'inline-block', padding: '0.25rem 0.75rem', borderRadius: '9999px', fontSize: '13px', fontWeight: 500, backgroundColor: product.stock < 20 ? 'rgba(186, 26, 26, 0.1)' : 'var(--surface)', color: product.stock < 20 ? 'var(--error)' : 'var(--on-surface)', border: product.stock >= 20 ? '1px solid var(--error)' : '1px solid var(--outline-variant)' }}>
                      {product.stock}
                    </span>
                  </td>
                  <td style={{ padding: '0.75rem 1.25rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                      <button onClick={() => handleEdit(product)} style={{ width: '2rem', height: '2rem', borderRadius: '50%', border: 'none', backgroundColor: 'var(--surface-container-high)', color: 'var(--on-surface-variant)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }} title="Chỉnh Sửa">
                        <span className="material-symbols-outlined text-[18px]">edit</span>
                      </button>
                      <button onClick={() => handleDelete(product.id)} style={{ width: '2rem', height: '2rem', borderRadius: '50%', border: 'none', backgroundColor: 'rgba(186, 26, 26, 0.1)', color: 'var(--error)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }} title="Xóa">
                        <span className="material-symbols-outlined text-[18px]">delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              
              {filteredProducts.length === 0 && (
                <tr>
                  <td colSpan="7" style={{ padding: '3rem 0', textAlign: 'center', color: 'var(--on-surface-variant)' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <span className="material-symbols-outlined text-4xl text-outline mb-2" style={{ fontSize: '2.25rem', marginBottom: '0.5rem' }}>search_off</span>
                      <p>Không tìm thấy sản phẩm nào phù hợp với "{searchTerm}".</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        <div style={{ padding: '1rem', borderTop: '1px solid var(--outline-variant)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.875rem', color: 'var(--on-surface-variant)', backgroundColor: 'var(--surface-container-lowest)' }}>
          <div>Đang hiển thị <span style={{ fontWeight: 500, color: 'var(--on-surface)' }}>{filteredProducts.length}</span> kết quả</div>
          <div style={{ display: 'flex', gap: '0.375rem' }}>
            <button style={{ padding: '0.375rem 0.75rem', border: '1px solid var(--outline-variant)', borderRadius: '0.25rem', backgroundColor: 'transparent', cursor: 'not-allowed', opacity: 0.5 }}>Trang Trước</button>
            <button style={{ padding: '0.375rem 0.75rem', backgroundColor: 'var(--primary)', color: 'white', borderRadius: '0.25rem', fontWeight: 500, border: 'none' }}>1</button>
            <button style={{ padding: '0.375rem 0.75rem', border: '1px solid var(--outline-variant)', borderRadius: '0.25rem', backgroundColor: 'transparent', cursor: 'not-allowed', opacity: 0.5 }}>Trang Sau</button>
          </div>
        </div>
      </div>

      {/* Add Product Modal */}
      {isAddModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ backgroundColor: 'var(--surface)', padding: '2rem', borderRadius: '1rem', width: '450px', maxWidth: '95%', maxHeight: '90vh', overflowY: 'auto' }}>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', fontWeight: 600 }}>{t('products.add_product', 'Thêm Sản Phẩm')}</h3>
            <form onSubmit={submitAdd} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <input required value={newProduct.title} onChange={e => setNewProduct({...newProduct, title: e.target.value})} placeholder={t('products.form.title', 'Tên sản phẩm')} style={{ padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--outline-variant)' }} />
              <textarea required value={newProduct.description} onChange={e => setNewProduct({...newProduct, description: e.target.value})} placeholder={t('products.form.desc', 'Mô tả')} style={{ padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--outline-variant)' }} />
              <input required value={newProduct.thumbnail} onChange={e => setNewProduct({...newProduct, thumbnail: e.target.value})} placeholder={t('products.form.image', 'Link ảnh')} style={{ padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--outline-variant)' }} />
              <div style={{ display: 'flex', gap: '1rem' }}>
                <input required type="number" min="0" step="0.01" value={newProduct.price} onChange={e => setNewProduct({...newProduct, price: e.target.value})} placeholder={t('products.form.price', 'Giá')} style={{ flex: 1, padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--outline-variant)' }} />
                <input required type="number" min="0" value={newProduct.stock} onChange={e => setNewProduct({...newProduct, stock: e.target.value})} placeholder={t('products.form.stock', 'Tồn kho')} style={{ flex: 1, padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--outline-variant)' }} />
              </div>
              <select value={newProduct.category} onChange={e => setNewProduct({...newProduct, category: e.target.value})} style={{ padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--outline-variant)' }}>
                <option value="beauty">Beauty</option>
                <option value="fragrances">Fragrances</option>
                <option value="skin-care">Skin Care</option>
              </select>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button type="button" onClick={() => setIsAddModalOpen(false)} style={{ flex: 1, padding: '0.75rem', border: '1px solid var(--outline)', borderRadius: '0.5rem' }}>{t('products.form.cancel', 'Hủy')}</button>
                <button type="submit" className="btn-primary" style={{ flex: 1, padding: '0.75rem', borderRadius: '0.5rem', color: 'white' }}>{t('products.add_product', 'Thêm')}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Product Modal */}
      {isEditModalOpen && editingProduct && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ backgroundColor: 'var(--surface)', padding: '2rem', borderRadius: '1rem', width: '450px', maxWidth: '95%', maxHeight: '90vh', overflowY: 'auto' }}>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', fontWeight: 600 }}>{t('products.edit_product', 'Sửa Sản Phẩm')}</h3>
            <form onSubmit={submitEdit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <input required value={editingProduct.title} onChange={e => setEditingProduct({...editingProduct, title: e.target.value})} placeholder={t('products.form.title', 'Tên sản phẩm')} style={{ padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--outline-variant)' }} />
              <textarea required value={editingProduct.description} onChange={e => setEditingProduct({...editingProduct, description: e.target.value})} placeholder={t('products.form.desc', 'Mô tả')} style={{ padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--outline-variant)' }} />
              <input required value={editingProduct.thumbnail} onChange={e => setEditingProduct({...editingProduct, thumbnail: e.target.value})} placeholder={t('products.form.image', 'Link ảnh')} style={{ padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--outline-variant)' }} />
              <div style={{ display: 'flex', gap: '1rem' }}>
                <input required type="number" min="0" step="0.01" value={editingProduct.price} onChange={e => setEditingProduct({...editingProduct, price: e.target.value})} placeholder={t('products.form.price', 'Giá')} style={{ flex: 1, padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--outline-variant)' }} />
                <input required type="number" min="0" value={editingProduct.stock} onChange={e => setEditingProduct({...editingProduct, stock: e.target.value})} placeholder={t('products.form.stock', 'Tồn kho')} style={{ flex: 1, padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--outline-variant)' }} />
              </div>
              <select value={editingProduct.category} onChange={e => setEditingProduct({...editingProduct, category: e.target.value})} style={{ padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--outline-variant)' }}>
                <option value="beauty">Beauty</option>
                <option value="fragrances">Fragrances</option>
                <option value="skin-care">Skin Care</option>
              </select>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button type="button" onClick={() => setIsEditModalOpen(false)} style={{ flex: 1, padding: '0.75rem', border: '1px solid var(--outline)', borderRadius: '0.5rem' }}>{t('products.form.cancel', 'Hủy')}</button>
                <button type="submit" className="btn-primary" style={{ flex: 1, padding: '0.75rem', borderRadius: '0.5rem', color: 'white' }}>{t('products.edit_product', 'Lưu')}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;
