// Criação de funções em JavaScript
// Criando funções simples:
function saudacao() {
  console.log("Olá, mundo!");
}
saudacao(); 
// Passando parâmetros para funções
function novaSaudacao(nome) {
  console.log("Olá, " + nome + "!");
}
novaSaudacao("Fabricia");
novaSaudacao("Lucas");
novaSaudacao("Ana");
// Criando uma função chamada soma
function soma(a, b) {
  return a + b;
}
console.log(soma(5, 3));     // Resultado: 8
console.log(soma(10, 15));   // Resultado: 25
console.log(soma(-2, 7));    // Resultado: 5