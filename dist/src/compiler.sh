#!/bin/bash

echo "Procesando gramática..."

jison dist/src/grammar.jison -o dist/src/grammar.js

echo "Gramática procesada"