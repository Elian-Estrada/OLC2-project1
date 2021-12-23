> #### Universidad de San Carlos de Guatemala
> #### Facultad de Ingeniería
> #### Escuela de Ciencias y Sistemas

# MANUAL DE USUARIO :male-technologist: 
> ### José Daniel Velásquez Orozco
> #### 201800722

## Acerca de Quetzal OCL2 :information_source:

Quetzal OCL2 es un intérprete y compilador que ejecuta y traduce instrucciones de alto nivel del lenguaje Quetzal.

Quetzal es un lenguaje de programación inspirado en C, su característica principal es la inclusión de tipos implícitos. El sistema de tipos de Quetzal realiza una formalización de los tipos de C y Java. Esto permite a los desarrolladores definir variables y funciones tipadas sin perder la esencia. Otra inclusión importante de Quetzal es la simplificación de los lenguajes C y Java para poder realizar diferentes instrucciones en menos pasos.


## Requerimientos para la Ejecución :computer:

| Browser Recomendado | Versión |
| ------------------- | ------- |
| Edge                | > 79    |
| Firefox             | > 73    |
| Chrome              | > 76    |


## Ejecución :arrow_forward:

1. Ingresar a [Quetzaloto Lenguage](https://elian-estrada.github.io/OLC2-project1/).
2. Ingresar código fuente dentro del editor de código.
3. Seleccionar la funcionalidad:

    + Interpretar: Esta opción nos va a permitir interpretar una entrada.
    + Compilar: Esta opción nos va a permitir traducir una entrada. El programa recibe una entrada de código de alto nivel y traduce a código intermedio en la sintaxis de tres direcciones.


## Probar código en modo desarrollo :arrow_forward:

> ### Requisitos Opcionales

- Tener instalado `git`

> ### Requisitos

- Tener instalado `npm`.
- Tener instalado `jison`.
  

1. Descargar los binarios
  
  - Clonando el repositorio
    
    ```shell
    git clone  https://github.com/Elian-Estrada/OLC2-project1.git
    ```
    
  - Descargar el archivo zip
    [Quetzal OCL2 - Download](https://github.com/Elian-Estrada/OLC2-project1/archive/refs/heads/master.zip)
    
2. Dirigrise a la carperta de descarga.
  
3. Instalar dependencias
  
  ```shell
  npm install
  ```

4. Compilar el código
  
  ```shell
  tsc .
  ```

5. Ejecutar la aplicación

Abrir la el index.html dentro de un servidor local. 

## Interfaz :black_square_button:

![](https://i.imgur.com/VMyyCLo.png)


Esta es la vista principal que se mostrara al ingresar a la aplicación, esta divido en diferentes componentes que a continuación serán descritas:

### Editor

![](https://i.imgur.com/2jO4BBd.png)

La función principal del editor será el ingreso del código fuente que será analizado.

#### Principales Características

- Cuenta con resaltado de sintaxis, para el lenguaje Quetzal.
- Barra lateral derecha con el número de línea.

### Consola

![](https://i.imgur.com/7k9hvC2.png)

La función principal de la consola será mostrar los resultados, mensajes de consola, mensajes de error del archivo entrada fue analizado.

### Consola 3D

![](https://i.imgur.com/tqug9iw.png)

La función principal de la consola 3D será mostrar el código de tres direcciones.


### Menú de Opciones

<center>  <img src="https://i.imgur.com/vhNTUu2.png">   </center>

Cada opción realiza una funcionalidad distinta, que serán descritas a continuación:

| Opción             | Decripción                                                                                                                                             |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Nuevo              | Limpia el contenido del editor de cógio|
| Abrir Archivo      | Permite abrir un archvio con extensión *.jpr* guardado en nuestra máquina y muestra el contenido en el editor                                          |
| Guardar Archivo    | Permite guardar de forma local el contenido del editor.                                                                                                |
| Guardar Como..     | Permite guardar de forma local el contenido del editor, permintiendo cambiar el nombre y ruta de archivo.                                              |


### Menú de Reportes

<center>  <img src="https://i.imgur.com/vq1QiyM.png">   </center>

Cada uno de los reportes serán descritas a continuación:

| Opción                | Descripción                                                                                           |
| --------------------- | ----------------------------------------------------------------------------------------------------- |
| CST                   | Este reporte mostrara el árbol de análisis concreto que se produjo al analizar el archivo de entrada. |
| Error Report          | Muestra los errores recoloctados durante el proceso de compilación o interpretación de la entrada |
| Symbol Table Report   | Mustra los símbolos o variables recoloectados durante el proceso de interpretación |
| Symbol Table Compiler | Mustra los símbolos o variables recoloectados durante el proceso de compilación |
| Gramatical Report     | Muestra la gramática con sintaxis BNF. |

## Sintaxis :memo:


### Comentarios <a name="comentarios"></a>

Los comentarios pueden ser:

- De una sola línea (//)

    ```java
        //  Comentario de una sola linea
    ```

- Múltiples líneas (/* ... */)

    ```java
        /*
            Esto es un
            comentario de
            múltiples líneas
        */
    ```

### Tipos <a name="tipos"></a>

Quetzal aceptará distintos tipos entre ellos se aceptarán:

+ **Nulo:** Se representa con la palabra reservada `null`, la cual indica que no existe ningún valor.
+ **int** Valores numéricos enteros. Por ejemplo: `3`, `2`, `-1`, `-100`.
+ **double** Valores númericos con punto flotante. Por ejemplo: `3.1415`, `2.7182`, `0.5`.
+ **boolean** Los valores booleanos únicamente pueden ser `true` o `false`.
+ **char** Estos son literales de carateres, se definen con comillas simples. Por ejemplo: `'a'`, `'b'`, `'z'`.
+ **String** Estos representan cadenas de texto, se definen con comillas dobles. Por ejemplo: `"Hola"`, `"Mundo"`, `"!"`.
+ **Arreglos** Estos son un conjunto de valores indexados entre 1 hasta n, que pueden ser de diferentes tipos. Por ejemplo:

    ```java
    [10, 20, 30, 40]
    ["Hola", "Mundo"]
    [1, 2, 5, [1, 2]]
    ```
+ **Struct** Estos pueden contener cualquier tipo de dato en su interior, incluso otros struct, arreglos o arreglos de structs.:

    ```c
    struct NOMBRE_STRUCT{
        LISTA_ATRIBUTOS
    };
    ```
    Y para crear una variable con nuestro Struct, se escribe:

    ```c
    NOMBRE_STRUCT ID = NOMBRE_STRUCT(VALORES);
    ```

    Un ejemplo de creación de struct podría ser:

    ```C
    struct Persona{
        int edad,
        string nombre
    };
    ```

### Expresiones <a name="expresiones"></a>

Quetzal acepta operaciones aritmeticas, relacionales y logicas de la siguiente forma:

+ **ARÍTMETICAS** Entre las operaciones aritmeticas disponibles vamos a encontrar las siguientes:
    - **Suma**: La suma de dos expresiones se define por el símbolo `+` 
    - **Resta:** La resta de dos expresiones y la negación de una expresión aritmetica se define por el símbolo `-` 
    - **Multiplicación:** La multiplicación de dos expresiones se define por el símbolo `*` 
    - **División:** La división de dos expresiones se define por el símbolo `/`
    - **Modulo:** El modulo entre dos expresiones se define por el símbolo `%` 
    - **Nativas:** Quetzal posee 6 funciones nativas para la resolución de expresiones, entre ellas se encuentran:
        1. ***pow:*** Recibe como primer parametro la base y como segundo parametro la potencia a elevar.  Ejemplo: `pow(2,4)`
        2. ***sqrt:***  Cálcula la raíz cuadrara de un número Ejemplo: `sqrt(4)`
        3. ***sin:*** Resuelve la función seno del número que se ingrese Ejemplo: `sin(1)`
        4. ***cos:*** Resuelve la función coseno del numero que se ingrese. Ejemplo: `cos(1)`
        5. ***tan:*** Resuelve la función tangente del numero que se ingrese. Ejemplo: `tan(1)`
        6. ***log10:*** Resuelve la función logaritmo base 10 de la expresión que se ingrese. Ejemplo: `log10(1)`

+ **RELACIONALES:** Entre las operaciones relacionales disponibles vamos a encontrar las siguientes:
    - **Igualdad:** Esta se define por el símbolo `==`
    - **Diferenciación:** Esta se define por el símbolo `!=`
    - **Mayor que:** Esta se define por el símbolo `>`
    - **Menor que:** Esta se define por el símbolo `<`
    - **Mayor o igual que:** Esta se define por el símbolo `>=`
    - **Menor o igual que:** Esta se define por el símbolo `<=`

+ **LÓGICAS** Entre las operaciones lógicas disponibles vamos a encontrar las siguientes:
    - **AND:** Esta se define por el símbolo `&&`
    - **OR:** Esta se define por el símbolo `||`
    - **NOT:** Esta se define por el símbolo `!`

+ **CADENAS**  Entre las operaciones con cadenas (strings) vamos a encontrar las siguientes:
    - **Concatenación:** La unión de dos cadenas de texto se define por el símbolo `&`
      ```java
      "para" & "caidismo" = "paracaidismo"
      ```
    - **Repetición:** Permite que una cadena de texto se repita cierto número de veces, esta se define por el símbolo `^`
      ```java
      "Cadena"^3 = "CadenaCadenaCadena"
      ```
    - **Acceso a una pocisión:** El acceso a un elemento de una cadena se define de la siguiente manera: `string.caracterOfPosition(posición)`, el cual devolvera el caracter correspondiente a esa posición
        ```java
        animal = "Tigre";
        println(animal.caracterOfPosition(2)); //g
        ```
    - **Acceso a una porción:** El acceso a una porción de una cadena se define de la siguiente manera: `string.subString(inicial,final)`, el cual devolvera la cadena correspondiente al intervalo definido.
        ```java
        animal = "Tigre";
        println(animal.subString(2,4)); //gre
        ```
    - **Tamaño de una cadena:** La obtención del número de elementos de una cadena se define por la función `cadena.length()`
        ```java
        animal = "Tigre";
        println(animal.length()); //5
        ```
    - **Cadena en mayusculas:** Una cadena puede ser convertida a mayusculas con la utilización de la función `cadena.toUppercase())`
        ```java
        animal = "Tigre";
        println(animal.toUppercase()); //TIGRE
        ```
    - **Cadena en minusculas:** Una cadena puede ser convertida a mayusculas con la utilización de la función `cadena.toLowercase())`
        ```java
        animal = "Tigre";
        println(animal.toLowercase()); //tigre
        ```

+ **Operador ternario** El operador ternario es utilizado cuando se necesita entre diferentes expresiones a travez de una condición

    ```java
    (EXPRESIÓN RELACIONAL O LOGICA) ? RESULTADO SI ES VERDADERO : RESULTADO SI ES FALSO
    ```
    Ejemplo:
    ```java
    respuesta = edad >= 50 ? "Puede vacunarse" : "No puede vacunarse";

    println(animal == "Perro" ? 15 : 10);
    ```
  
### Instrucciones <a name="instrucciones"></a>

Quetzal cuenta con varias instrucciones para su ejecución, cada instrucción deber termina con un punto y coma (`;`). Las instrucciones que Quetzal acepta son:

+ **IMPRESIÓN** Quetzal cuenta con 2 distintas instrucciones de imprimir.

    ```java
    print(expresión);        // Esta imprime sin realizar un salto de línea
    println(expresión);      // Esta imprime realizando un salto de línea
    ```

    Para imprimir más de un valor por línea, se puede imprimir una secuencia de valores separados por comas. También dentro de las cadenas se pueden colocar cualquier expresión utilizando el operador `$`. Por ejemplo:

    ```java
    println("+", "-");       // Imprime + -
    print("El resultado de 2 + 2 es $(2 + 2)");  // Imprime El resultado de 2 + 2 es 4
    println("$a $(b[1])"); // Imprime el valor de a y el valor de b[1]
    ```

    Quetzal también tiene la opción de imprimir arreglos y struct. Por ejemplo:

    ```java
        a = [0, 1, 2];
        println(a);          // Imprime [0, 1, 2]
        s = Hora(10, 30);
        print(s);           // Imprime Hora(10, 30)
    ```

+ **DECLARACIONES Y ASIGNACIONES** Quetzal permite la declaración y asignación de variables, las NO variables pueden cambiar su tipo de dato en cualquier momento

    - **Declaración:** Quetzal permite declarar variables de dos maneras:
        ```java
            tipo ID = Expresión;
            // ó
            tipo LISTA_ID;
        ```
        Ejemplo:
        ```java
            int x = (3*5);
            double y = (10/4);
            String str = "Saludo";
            int var1, var2, var3;  // se inicializan con los valores por defecto de java
        ```

    - **Asignación:** Quetzal permite asignar valores a variables existentes de la siguiente manera:
        ```java
            ID = Expresión;
        ```
        Ejemplo:
        ```java
            var1 = "Adios";
            v = 89 - 9;
        ```

+ **LLAMADA DE FUNCIONES** Para llamar a una función se realiza de la siguiente manera:

    ```java
    NOMBRE_FUNCION(LISTA_PARAMETROS);
    ```
    Ejemplo:
    ```java
    ordenamiento(arr1,arr2);
    imprimirLista(lista);
    nuevaLinea();
    ```

+ **DISTINTAS FUNCIONES NATIVAS** Quetzal utiliza diversas funciones nativas para sus expresiones, estas son:

    - **tipo.Parse(string):** Toma una cadena y la convierte al tipo de numero que se le indice si es posible.
    ```java
        int.parse("8200")
        ó
        double.parse("3.13159")
        ó
        boolean.parse("1")
    ```
    - **toInt:** Convierte un número flotante a un número entero sin redondearlo
    ```java
        toInt(3.99999)  // retorna 3
    ```
    - **toDouble:** Convierte un número entero a un número flotante
    ```java
        toDouble(34)  // retorna 34.0
    ```
    - **String:** Convierte el argumento en una cadena, puede usarse en cualquier tipo de dato excepto null
    ```java
        string(45.87)  // retorna "45.87"
        string([1,2,3])  // retorna "[1,2,3]"
    ```
    - **typeof:** Muestra el tipo del argumento
    ```java
        typeof(5 * 5) // int
    ```


+ **FUNCIONES** Las funcioens son secuencias de sentencias que ejecuta una operación que nosotros deseamos. Cuando se crea una función se especifica su nombre y secuencia de sentencias. Luego, ya se puede llamar a estas usando su nombre y los parámetros solicitados. Se definen las funciones en Quetzal así:

    ```java
    TIPO NOMBRE_FUNCION(LISTA_PARAMETROS){
        LISTA_INSTRUCCIONES
    }
    ```

    Por ejemplo:

    ```java
    TIPO imprimirHola(){
        print("Hola")
        println(" Mundo");
    }
    ```

    ```java
    TIPO sumar(int num1, double num2){
        return num1 + toInt(num2);
    }
    ```

+ **CONDICIONALES**

Quetzal cuenta con sentencias condicionales, lo que permite que un bloque de codigo pueda ser o no ejecutado. Estas se definen por `if`,`if...else` y `if...else if` y adicional con la sentencia switch case. Su estructura es la siguiente:

```java 
if (CONDICION){
    LISTA_INTRUCCIONES
}

if (CONDICION)
    INSTRUCCION

if(CONDICION1){
  LISTA_INTRUCCIONES
}
else if(CONDICION1){
  LISTA_INTRUCCIONES
}
else{
    LISTA_INTRUCCIONES
}


switch(expression) {
  case x:
    LISTA_INTRUCCIONES
    break;
  case y:
    LISTA_INTRUCCIONES
    break;
  default:
    LISTA_INTRUCCIONES
}
```
    
   
+ **LOOPS** Quetzal cuenta con sentencias iterativas, lo que permite ejecutar repetidamente un bloque de sentencias. Existen 2 de estas, el ciclo `while`, el ciclo `do while` y el ciclo `for`.

    + **While** La sentencia `while` sigue la siguiente estructura:

        ```java
        while (CONDITION) {
          LISTA_INTRUCCIONES
        }
        ```

        Ejemplo:

        ```java
        int i = 0;
        while (i < 5) {
          println(i);
          i++;
        }
        ```

    + **Do While** La sentencia `do while` sigue la siguiente estructura:

        ```java
        do {
          LISTA_INSTRUCCIONES
        }
        while (CONDICION);
        ```
        Ejemplo:
        ```java
        int i = 0;
        do {
          println(i);
          i++;
        }
        while (i < 5);
        ```

    + **For** La sentencia `for` en Quetzal tiene la siguiente estructura:

        ```java
        for (declaracion ó asignacion; condicion; instruccion) {
          LISTA_INSTRUCCIONES
        }
        ```

        Algunos ejemplos de for en Quetzal son:

        ```java
        for (int i = 0; i < 5; i++) {
          println(i);
        }
        ```

+ **ARREGLOS** Como se a mencionado Quetzal cuenta con arreglos, los cuales pueden ser definidos mediante una sintaxis. Los valores de los arreglos solo pueden ser del tipo definido en la variable o arreglos del mismo tipo.

    ```java
    [8,2,3,[1,2,3]]
    ``` 


    ```java
    int[] arr = [1,2,3,4,5,6];
    print(arr[2:4]); //[2,3,4]

    print(arr[begin:4]) //[1,2,3,4]
    print(arr[4:end]) //[4,5,6]
    ``` 

    + **Copiar un arreglo:** Quetzal permite crear una copia de un arreglo utilizando el símbolo `#`, es útil hacer una copia antes de realizar operaciones que las modifiquen.
    
        ```java
        int[] arr = [1,2,3,4,5,6];
        int[] arr2 = #arr;

        arr[2] = 0;

        print(arr) //[1,0,3,4,5,6]
        print(arr2) //[1,2,3,4,5,6]
        ``` 
        
    + **Push:** inserta un nuevo valor al final del arreglo, se define como:
        
        ```java
        nombre_arreglo.push(expresion);
        ```
        Ejemplo:
        ```java
        int[] arr = [1,2,3,4,5,6];
        arr.push(7); // arr = [1,2,3,4,5,6,7]
        ```
    
    + **Pop:** elimina y devuelve el ultimo valor de un arreglo, se define como:
        
        ```java
        nombre_arreglo.pop();
        ```
        Ejemplo:
        ```java
        int[] arr = [1,2,3,4,5,6];
        arr.pop(); // retorna 6, arr = [1,2,3,4,5]
        ```
    
    + **Length:** La obtención del tamaño de un arreglo, se define como:
        
        ```java
        arreglo.length();
        ```
        
        Ejemplo:
        
        ```java
        int[] arr = [1,2,3,4,5,6];
        arr.length(); // 6
        ```

+ **STRUCTS** Quetzal cuenta con tipos compuestos que los desarrolladores podrán definir mediante una sintaxis. Para la declaración de estos se utiliza la siguiente sintaxis:

    ```C
    // Struct
    struct NOMBRE_STRUCT
    {
        LISTA_ATRIBUTOS
    };

    ```

    Y para la creación de variables con nuestro Struct, ya sea mutable e inmutable:

    ```java
    NOMBRE_STRUCT ID = NOMBRE_STRUCT(LISTA_VALORES);
    ```

    Los atributos de los Struct pueden ser utilizados como parte de cualquier expresión. Para acceder a los atributos de los Struct, se utiliza la notación `.`.

    ```java
    ID.ID
    ```

    También si nosotros deseamos modificar únicamente uno de los atributos de nuestro Struct, ahí es donde entra la importancia de los dos tipos de Struct en Quetzal.

    ```java
    X.atributo = expresión
    ```

    Otros aspectos importantes de los Structs es que estos pueden ser llamados como parámetros en las funciones y, al igual que los arreglos, se pasan por referencia. Por lo que el valor de los atributos de los Structs también cambia. Por ejemplo:

    ```java
    struct Estructura{
        int x
    };

    function cambiarAtributo(Estructura s){
        s.x = 10;
    }

    Estructura a = Estructura(0);
    println(a);             // Imprime 'Estructura(0)'
    println(a.x);           // Imprime 0

    cambiarAtributo(a);
    println(a);             // Imprime 'Estructura(10)'
    println(a.x);           // Imprime 10
    ```

    Se debe de tomar en cuenta que los Struct se pueden utilizar como retorno de una función.

    Otros aspectos importantes de los Structs es que si estos tienen internamente otro struct dentro de el, se puede inicializar de 2 formas.

    ```java
    struct Estructura{
        int x,
        Estructura e
    };

    Estructura a = Estructura(0, null);
    println(a);             // Imprime 'Estructura(0, null)'

    // o tambien se puede declarar 
    Estructura b = Estructura(1, a);
    println(b);             // Imprime 'Estructura(1, Estructura(0, null))'

