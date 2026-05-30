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
    console.log('Connected to database.');

    // Helper to safely add column if it doesn't exist
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

    await addColumn('code', 'VARCHAR(100)');
    await addColumn('brand', 'VARCHAR(100)');
    await addColumn('color', 'VARCHAR(255)');
    await addColumn('material', 'VARCHAR(255)');
    await addColumn('option_name', 'VARCHAR(100)');
    await addColumn('thickness', 'VARCHAR(255)');
    await addColumn('hardware', 'VARCHAR(255)');
    await addColumn('warranty', 'VARCHAR(100)');
    await addColumn('soundproof', 'VARCHAR(255)');
    await addColumn('status', "VARCHAR(100) DEFAULT 'Còn hàng'");

    console.log('Successfully altered products table with new columns.');

    // Let's populate the existing products with some realistic default values so they don't appear empty!
    const [products] = await conn.execute('SELECT id, category_id, name FROM products');
    for (const p of products) {
      let code = `TTP-SP-${p.id.toString().padStart(3, '0')}`;
      let brand = 'Thành Thịnh Phát';
      let color = 'Tùy chọn';
      let material = 'Kính cường lực & Hợp kim nhôm';
      let option_name = 'TIÊU CHUẨN';
      let thickness = 'Theo thiết kế';
      let hardware = 'Phụ kiện kim khí đồng bộ';
      let soundproof = 'Đạt tiêu chuẩn cách âm TCVN';
      let warranty = '2 năm';
      let status = 'Còn hàng';

      if (p.category_id === 1) { // Cửa nhôm kính
        code = `CNK-XF-${p.id.toString().padStart(3, '0')}`;
        brand = 'Xingfa Quảng Đông';
        color = 'Ghi xám, Nâu cafe, Trắng sứ, Đen';
        material = 'Nhôm Xingfa & Kính cường lực 8-12mm';
        option_name = 'TIÊU CHUẨN';
        thickness = 'Nhôm hệ 55, dày 1.4mm - 2.0mm';
        hardware = 'Kinlong chính hãng nhập khẩu';
        soundproof = 'Cách âm vượt trội, cản gió bão';
        warranty = '5 năm nhôm, 2 năm phụ kiện';
      } else if (p.category_id === 2) { // Vách kính
        code = `VK-CL-${p.id.toString().padStart(3, '0')}`;
        brand = 'Hải Long / Việt Nhật';
        color = 'Trong suốt, mờ cát, phản quang';
        material = 'Kính cường lực Temper 10mm - 12mm';
        option_name = 'CAO CẤP';
        thickness = 'Kính temper dày 10mm - 12mm';
        hardware = 'Nẹp sập nhôm định hình / Đế sập inox';
        soundproof = 'Phân chia không gian tốt, cách âm tốt';
        warranty = '2 năm';
      } else if (p.category_id === 3) { // Lan can kính
        code = `LC-KK-${p.id.toString().padStart(3, '0')}`;
        brand = 'Thành Thịnh Phát';
        color = 'Kính trong suốt, phụ kiện inox sáng bóng';
        material = 'Kính cường lực 12mm & Trụ Inox 304';
        option_name = 'TIÊU CHUẨN';
        thickness = 'Kính cường lực dày 12mm';
        hardware = 'Trụ lửng Inox 304, tay vịn gỗ căm xe';
        soundproof = 'Chịu lực cao, an toàn tuyệt đối';
        warranty = '3 năm';
      } else if (p.category_id === 4) { // Mái kính
        code = `MK-CL-${p.id.toString().padStart(3, '0')}`;
        brand = 'Thành Thịnh Phát';
        color = 'Kính trong, kính phản quang chống nhiệt';
        material = 'Kính cường lực dán 11.52mm & Khung thép mạ kẽm';
        option_name = 'TIÊU CHUẨN';
        thickness = 'Kính dán an toàn cường lực 11.52mm';
        hardware = 'Chốt spider inox 304, keo kết cấu chống thấm';
        soundproof = 'Lấy sáng tự nhiên, chống mưa nắng và tia cực tím';
        warranty = '5 năm hệ khung, 2 năm kính';
      } else if (p.category_id === 5) { // Cửa cuốn
        code = `CC-AD-${p.id.toString().padStart(3, '0')}`;
        brand = 'Austdoor chính hãng';
        color = 'Ghi sáng (#5), Nâu cafe (#7)';
        material = 'Hợp kim nhôm AL 6063 T5';
        option_name = 'TIÊU CHUẨN';
        thickness = 'Độ dày nan cửa 0.9mm - 1.2mm';
        hardware = 'Motor Austdoor nhập khẩu đồng bộ';
        soundproof = 'Vận hành êm ái, chống cạy phá';
        warranty = '5 năm cho motor, 2 năm cho nan cửa';
      } else if (p.category_id === 6) { // Phòng tắm kính
        code = `PT-PT-${p.id.toString().padStart(3, '0')}`;
        brand = 'VVP Thái Lan / Hafele';
        color = 'Trong suốt';
        material = 'Kính cường lực 10mm & Inox 304';
        option_name = 'TIÊU CHUẨN';
        thickness = 'Kính cường lực dày 10mm';
        hardware = 'Bản lề cabin tắm, định vị kính, giằng inox, gioăng từ';
        soundproof = 'Ngăn nước tuyệt đối, giữ ấm cực tốt';
        warranty = '2 năm hoàn thiện';
      }

      await conn.execute(`
        UPDATE products 
        SET code = ?, brand = ?, color = ?, material = ?, option_name = ?, thickness = ?, hardware = ?, warranty = ?, soundproof = ?, status = ?
        WHERE id = ?
      `, [code, brand, color, material, option_name, thickness, hardware, warranty, soundproof, status, p.id]);
    }

    console.log('Successfully seeded existing products with real specifications.');
    await conn.end();
  } catch (err) {
    console.error('Error during migration:', err);
  }
}

migrate();
