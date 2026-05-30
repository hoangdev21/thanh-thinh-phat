const mysql = require('mysql2/promise');

const config = {
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: '123456',
  database: 'thanh_thinh_phat'
};

async function migrate() {
  try {
    const conn = await mysql.createConnection(config);
    console.log('Connected to database for features, guides & gallery_images migration.');

    const addColumn = async (colName, definition) => {
      try {
        await conn.execute(`ALTER TABLE products ADD COLUMN ${colName} ${definition}`);
        console.log(`Successfully added column ${colName}`);
      } catch (err) {
        if (err.code === 'ER_DUP_FIELDNAME') {
          console.log(`Column ${colName} already exists, skipping.`);
        } else {
          throw err;
        }
      }
    };

    await addColumn('gallery_images', 'TEXT');
    await addColumn('features', 'TEXT');
    await addColumn('guides', 'TEXT');

    // Get all products to initialize features and guides
    const [products] = await conn.execute('SELECT id, category_id, name, image_url, thumbnail_url FROM products');
    
    for (const p of products) {
      // Default features list (separated by newlines)
      let features = 
        'Thiết kế hiện đại, tinh giản theo xu hướng kiến trúc mới nhất.\n' +
        'Khung liên kết vững chắc, chịu áp lực gió lớn và chống ngập úng cực tốt.\n' +
        'Keo silicone liên kết chống thấm nước tuyệt đối, bảo vệ tường nhà.\n' +
        'Bề mặt sơn phủ tĩnh điện cao cấp, không phai màu hay trầy xước.';
      
      // Default guides list (separated by newlines)
      let guides = 
        'Khảo sát và Đo đạc: Đội ngũ thợ kỹ thuật đến trực tiếp công trình khảo sát hiện trạng và đo đạc kích thước thực tế chuẩn xác từng milimet.\n' +
        'Tư vấn và Chốt bản vẽ: Tư vấn phương án thiết kế tối ưu, chốt chủng loại vật liệu (nhôm, kính, phụ kiện) và báo giá minh bạch.\n' +
        'Gia công tại Xưởng: Sản phẩm được gia công, cắt ghép trên dây chuyền máy móc hiện đại tại nhà xưởng Thành Thịnh Phát.\n' +
        'Lắp đặt & Nghiệm thu: Vận chuyển an toàn, tiến hành căn chỉnh, lắp đặt chắc chắn tại công trình, bắn keo silicone liên kết chống thấm nước tuyệt đối.\n' +
        'Bàn giao & Bảo hành: Vệ sinh sạch sẽ, vận hành thử êm ái, bàn giao phiếu bảo hành chính hãng từ 2 đến 5 năm cho khách hàng.';

      // Let's create realistic gallery images JSON
      // Use the main product image and some placeholders or general project photos as secondaries
      const galleryList = [p.image_url];
      if (p.thumbnail_url && p.thumbnail_url !== p.image_url) {
        galleryList.push(p.thumbnail_url);
      }
      
      // Add extra catalog items based on category
      if (p.category_id === 1) {
        galleryList.push('https://placehold.co/800x600/1B2A4A/FFFFFF?text=Cua+Nhom+Kinh+Detail+1');
        galleryList.push('https://placehold.co/800x600/1B2A4A/FFFFFF?text=Cua+Nhom+Kinh+Detail+2');
      } else if (p.category_id === 2) {
        galleryList.push('https://placehold.co/800x600/1B2A4A/FFFFFF?text=Vach+Kinh+Detail+1');
      } else {
        galleryList.push('https://placehold.co/800x600/1B2A4A/FFFFFF?text=Thi+Cong+Thuc+Te');
      }
      
      const gallery_images = JSON.stringify(galleryList);

      await conn.execute(
        'UPDATE products SET features = ?, guides = ?, gallery_images = ? WHERE id = ?',
        [features, guides, gallery_images, p.id]
      );
    }

    console.log('Seeded default features, guides, and gallery_images for all existing products.');
    await conn.end();
  } catch (err) {
    console.error('Error during migration:', err);
  }
}

migrate();
