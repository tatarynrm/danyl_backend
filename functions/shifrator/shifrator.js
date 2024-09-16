function shifrator(str) {
    let result = '';
    
    // Перебираємо всі символи рядка
    for (let i = 0; i < str.length; i++) {
      // Отримуємо код символа
      let charCode = str.charCodeAt(i);
      
      // Обчислюємо новий код символа після шифрування
      let newCharCode = 0xFF - charCode;
      
      // Додаємо новий символ до результату
    //   result += String.fromCharCode(newCharCode);
      result += String.fromCharCode(0xFF - charCode);
    }
    
    return result;
  }
  



  module.exports = {
    shifrator
  }