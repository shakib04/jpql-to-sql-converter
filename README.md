# 🔄 JPQL ⇄ SQL Converter
A powerful **bidirectional converter** between JPQL and SQL that transforms naming conventions while preserving query structure and parameters.

🔹 **Live Demo:** [https://shakib04.github.io/jpql-to-sql-converter/](https://shakib04.github.io/jpql-to-sql-converter/)

---

## ✨ Features
✅ **Bidirectional Conversion** - Convert JPQL to SQL and SQL to JPQL  
✅ **Smart Case Conversion** - PascalCase/camelCase ⇄ snake_case  
✅ **Preserves Named Parameters** - `:paramName` remains unchanged  
✅ **Convert & Copy** - Single-click conversion and clipboard copy  
✅ **Modern UI** - Clean, responsive design with smooth animations  
✅ **Examples & FAQ** - Built-in learning resources  
✅ **Privacy-Focused Analytics** - Anonymous usage tracking with consent  
✅ **No Installation Required** - Works directly in your browser

---

## 🚀 How to Use

### Converting JPQL to SQL:
1. **Ensure "JPQL → SQL" mode is selected** (default)
2. **Enter your JPQL query** in the input field
3. **Click "Convert"** or press `Ctrl/Cmd + Enter`
4. **Click "Copy to Clipboard"** or use "Convert & Copy" for one-click operation

### Converting SQL to JPQL:
1. **Click the arrow button** to switch to "SQL → JPQL" mode
2. **Enter your SQL query** with snake_case naming
3. **Follow the same conversion steps**

---

## 📂 Deployment (GitHub Pages)
1. **Fork this repository**
2. **Clone your fork:**
   ```sh
   git clone https://github.com/YOUR-USERNAME/jpql-to-sql-converter.git
   cd jpql-to-sql-converter
   ```
3. **Enable GitHub Pages** in your repository settings
4. **Access your converter** at `https://YOUR-USERNAME.github.io/jpql-to-sql-converter/`

---

## 🛠️ Technologies Used
- **HTML5** - Structure and semantic markup
- **JavaScript** - Core conversion logic
- **Bootstrap 5** - Responsive UI framework
- **Bootstrap Icons** - Modern iconography
- **Google Analytics 4** - Anonymous usage analytics

---

## 🎯 Example Conversions

### Example 1: Entity Query (JPQL → SQL)
**Input JPQL:**
```sql
SELECT u FROM UserEntity u WHERE u.isActive = true AND u.createdDate > :startDate
```

**Output SQL:**
```sql
SELECT u FROM user_entity u WHERE u.is_active = true AND u.created_date > :startDate
```

### Example 2: Join Query (SQL → JPQL)
**Input SQL:**
```sql
SELECT o FROM order_entity o JOIN o.customer_info c WHERE c.customer_id = :customerId
```

**Output JPQL:**
```sql
SELECT o FROM OrderEntity o JOIN o.customerInfo c WHERE c.customerId = :customerId
```

### Example 3: Complex Query with Aggregation
**Input JPQL:**
```sql
SELECT p.categoryName, COUNT(p.productId), AVG(p.productPrice) 
FROM ProductEntity p 
WHERE p.stockQuantity > 0 
GROUP BY p.categoryName 
ORDER BY p.categoryName
```

**Output SQL:**
```sql
SELECT p.category_name, COUNT(p.product_id), AVG(p.product_price) 
FROM product_entity p 
WHERE p.stock_quantity > 0 
GROUP BY p.category_name 
ORDER BY p.category_name
```

---

## 🔧 Advanced Features

### Preserved Elements
- **Named parameters**: `:userId`, `:orderStatus`
- **SQL keywords**: `SELECT`, `FROM`, `WHERE`, `JOIN`, etc.
- **Functions**: `COUNT()`, `AVG()`, `MAX()`, etc.
- **Operators**: `=`, `>`, `<`, `LIKE`, `IN`, etc.

### Naming Convention Rules
- **JPQL to SQL**: `userProfile` → `user_profile`
- **SQL to JPQL**: `user_profile` → `userProfile`
- **Entities**: `OrderEntity` → `order_entity`
- **Fields**: `createdDate` → `created_date`

---

## 📊 Privacy & Analytics

This tool uses Google Analytics 4 to collect anonymous usage data:
- Number of conversions performed
- Conversion types (JPQL→SQL or SQL→JPQL)
- Session duration and engagement
- **No personal data or query content is ever stored**

You can opt-out by not accepting the analytics notice.

---

## 🤝 Contributing

We welcome contributions! Here's how you can help:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/YourFeature`
3. **Commit your changes**: `git commit -m 'Add YourFeature'`
4. **Push to the branch**: `git push origin feature/YourFeature`
5. **Open a Pull Request**

### Ideas for Contribution:
- Add support for more SQL dialects
- Implement query validation
- Add more complex conversion patterns
- Improve mobile experience
- Add dark mode support

---

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

---

## 🌟 Support

If you find this tool helpful, please consider:
- ⭐ **Starring this repository**
- 🐛 **Reporting issues**
- 💡 **Suggesting new features**
- 📣 **Sharing with your team**

---

## 📞 Contact

Created by [@shakib04](https://github.com/shakib04)

For questions or suggestions, please [open an issue](https://github.com/shakib04/jpql-to-sql-converter/issues).

---

**Happy Converting!** 🚀