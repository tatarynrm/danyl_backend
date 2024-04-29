 function generateRandomNumberOneOrTwo() {
    // Генеруємо випадкове число в діапазоні [0, 1)
    const randomNumber = Math.random();
  
    // Округлюємо випадкове число до найближчого цілого
    const roundedNumber = Math.round(randomNumber);
  
    // Повертаємо результат
    return roundedNumber;
  }
  
  // Приклад використання
  const result = generateRandomNumberOneOrTwo();
  console.log(result); // Виведе 0 або 1


  module.exports = {
    generateRandomNumberOneOrTwo
  }