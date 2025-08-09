//exemplo de uso de var. let e const em JavaScript
const externo = "Olá eu sou uma variavel global"
//Decklaração de variável usando var
function exemploVar() {
    if (true) {
        var mensagem = "Olá, Faculdade Descomplica! Eu sou uma var...";
    }
}
//Chamando a função exemploVar
exemploVar();
//Exemplo de erro e correção
var mensagem = "Olá, Faculdade Descomplica! Eu sou uma var...";
console.log(var mensagem = "mensagem");
//Declaração de uma variavel usanddo let
function exemploLet*() {
    if true {
        let mensagem = "Essa mensagem só vale aqui dentro porque é uma let"
        console.log(mensagem);
        
    }
} 