# 🐍 JPQL to SQL Converter  
A simple **JPQL to SQL Converter** that transforms **PascalCase & camelCase** into **snake_case**, while preserving named parameters like `:orderId`.

🔹 **Live Demo:** [https://shakib04.github.io/jpql-to-sql-converter/](https://shakib04.github.io/jpql-to-sql-converter/)

---

## ✨ Features  
✅ **Converts PascalCase & camelCase to snake_case**  
✅ **Preserves Named Parameters (`:paramName` remains unchanged)**  
✅ **Responsive UI using Bootstrap 5**  
✅ **Copy to Clipboard Functionality**  
✅ **Deployable via GitHub Pages**

---

## 🚀 How to Use  
1. **Enter a JPQL query** in the textarea.  
2. **Click "Convert"** to transform it into SQL.  
3. **Click "Copy to Clipboard"** for easy copying.

---

## 📂 Deployment (GitHub Pages)  
1. **Fork & Clone the Repo:**  
   ```sh
   git clone https://github.com/shakib04/jpql-to-sql-converter.git
   cd jpql-to-sql-converter
   ```
   
---

## 🛠️ Technologies Used  
- **HTML, JavaScript** (for logic)  
- **Bootstrap 5** (for styling)

---

## 🎯 Example Conversion  
### **Input JPQL Query:**
```sql
SELECT c.name, o.totalAmount FROM Customer c JOIN Order o ON c.id = o.customerId
WHERE c.createdDate > :startDate AND o.status = :orderStatus
```

### **Converted SQL Output:**
```sql
SELECT c.name, o.total_amount FROM customer c JOIN order o ON c.id = o.customer_id
WHERE c.created_date > :startDate AND o.status = :orderStatus
```

---

## 🎯 Another Example  
### **Input JPQL Query:**
```sql
SELECT p.productName, s.stockQuantity FROM Product p JOIN Stock s ON p.id = s.productId
WHERE p.categoryId = :categoryId
```

### **Converted SQL Output:**
```sql
SELECT p.product_name, s.stock_quantity FROM product p JOIN stock s ON p.id = s.product_id
WHERE p.category_id = :categoryId
```

---

## 👨‍💻 Contributing  
Feel free to open an **issue** or submit a **pull request** to enhance the project!  

**Star ⭐ the repo if you find it useful!** 🚀

---

Let me know if you'd like any further adjustments or if you have specific table/field names in mind! 😊
