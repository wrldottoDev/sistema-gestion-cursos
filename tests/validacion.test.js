// Ejecutar con: node tests/validacion.test.js
const assert = require('node:assert');
const v = require('../js/validacion.js');

// RNF-001 a RNF-004: límites y composición de la contraseña.
assert.ok(v.validarContrasena('Abcdef1'));            // 7 caracteres
assert.ok(v.validarContrasena('Abcdefghijklmn12'));   // 16 caracteres
assert.strictEqual(v.validarContrasena('Abcdefg1'), '');        // 8
assert.strictEqual(v.validarContrasena('Abcdefghijklm12'), ''); // 15
assert.ok(v.validarContrasena('abcdefg1'));  // sin mayúscula
assert.ok(v.validarContrasena('ABCDEFG1'));  // sin minúscula
assert.ok(v.validarContrasena('Abcdefgh'));  // sin número

assert.strictEqual(v.validarCorreo('ana@ucenfotec.ac.cr', { institucional: true }), '');
assert.ok(v.validarCorreo('ana@gmail.com', { institucional: true }));
assert.ok(v.validarCorreo('ana.ucenfotec.ac.cr'));
assert.strictEqual(v.validarCorreo('', { requerido: false }), '');

const hoy = new Date(2026, 9, 10);
assert.strictEqual(v.calcularEdad('2000-10-10', hoy), 26);
assert.strictEqual(v.calcularEdad('2000-10-11', hoy), 25);
assert.ok(v.validarFechaNacimiento('2010-01-01', hoy)); // menor de 18

assert.strictEqual(v.validarIdentificacion('101110111'), '');
assert.ok(v.validarIdentificacion('1-0111-0111'));
assert.ok(v.validarCelular('8888777'));

assert.strictEqual(v.validarCodigoCurso('soft-101'), '');
assert.ok(v.validarCodigoCurso('SOFT 101'));
assert.ok(v.validarLongitudMax('x'.repeat(41), 40));
assert.strictEqual(v.validarLongitudMax('x'.repeat(40), 40), '');
assert.ok(v.validarEntero('2.5', 0, 12));
assert.ok(v.validarEntero('13', 1, 12));
assert.strictEqual(v.totalHoras('30', '15'), 45);
assert.strictEqual(v.totalHoras('', '15'), 15);

assert.strictEqual(v.normalizar('  Diseño ÁGIL '), 'diseno agil');
assert.ok(v.normalizar('Ingeniería del Software').includes(v.normalizar('INGENIERIA')));
assert.deepStrictEqual(v.separarPalabrasClave(' html, CSS ,, css, JavaScript, Html '), ['html', 'CSS', 'JavaScript']);
assert.deepStrictEqual(v.separarPalabrasClave(''), []);

console.log('validacion: todas las pruebas pasaron');
