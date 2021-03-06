> #### Universidad de San Carlos de Guatemala
> #### Facultad de Ingenier铆a
> #### Escuela de Ciencias y Sistemas

# MANUAL DE USUARIO 馃捇: 
> ### Jos茅 Daniel Vel谩squez Orozco
> #### 201800722
> ### Elian Sa煤l Estrada Urbina
> #### 201806838

## Acerca de Quetzal OCL2 :information_source:

Quetzal OCL2 es un int茅rprete y compilador que ejecuta y traduce instrucciones de alto nivel del lenguaje Quetzal.

Quetzal es un lenguaje de programaci贸n inspirado en C, su caracter铆stica principal es la inclusi贸n de tipos impl铆citos. El sistema de tipos de Quetzal realiza una formalizaci贸n de los tipos de C y Java. Esto permite a los desarrolladores definir variables y funciones tipadas sin perder la esencia. Otra inclusi贸n importante de Quetzal es la simplificaci贸n de los lenguajes C y Java para poder realizar diferentes instrucciones en menos pasos.


## Requerimientos para la Ejecuci贸n 馃捇:

| Browser Recomendado | Versi贸n |
| ------------------- | ------- |
| Edge                | > 79    |
| Firefox             | > 73    |
| Chrome              | > 76    |


## Ejecuci贸n :arrow_forward:

1. Ingresar a [Quetzaloto Lenguage](https://elian-estrada.github.io/OLC2-project1/).
2. Ingresar c贸digo fuente dentro del editor de c贸digo.
3. Seleccionar la funcionalidad:

    + Interpretar: Esta opci贸n nos va a permitir interpretar una entrada.
    + Compilar: Esta opci贸n nos va a permitir traducir una entrada. El programa recibe una entrada de c贸digo de alto nivel y traduce a c贸digo intermedio en la sintaxis de tres direcciones.


## Probar c贸digo en modo desarrollo :arrow_forward:

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

4. Compilar el c贸digo
  
  ```shell
  tsc .
  ```

5. Ejecutar la aplicaci贸n

Abrir la el index.html dentro de un servidor local. 

## Interfaz :black_square_button:

![](https://i.imgur.com/VMyyCLo.png)


Esta es la vista principal que se mostrara al ingresar a la aplicaci贸n, esta divido en diferentes componentes que a continuaci贸n ser谩n descritas:

### Editor

![](https://i.imgur.com/2jO4BBd.png)

La funci贸n principal del editor ser谩 el ingreso del c贸digo fuente que ser谩 analizado.

#### Principales Caracter铆sticas

- Cuenta con resaltado de sintaxis, para el lenguaje Quetzal.
- Barra lateral derecha con el n煤mero de l铆nea.

### Consola

![](https://i.imgur.com/7k9hvC2.png)

La funci贸n principal de la consola ser谩 mostrar los resultados, mensajes de consola, mensajes de error del archivo entrada fue analizado.

### Consola 3D

![](https://i.imgur.com/tqug9iw.png)

La funci贸n principal de la consola 3D ser谩 mostrar el c贸digo de tres direcciones.


### Men煤 de Opciones

<center>  <img src="https://i.imgur.com/vhNTUu2.png">   </center>

Cada opci贸n realiza una funcionalidad distinta, que ser谩n descritas a continuaci贸n:

| Opci贸n             | Decripci贸n                                                                                                                                             |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Nuevo              | Limpia el contenido del editor de c贸gio|
| Abrir Archivo      | Permite abrir un archvio con extensi贸n *.jpr* guardado en nuestra m谩quina y muestra el contenido en el editor                                          |
| Guardar Archivo    | Permite guardar de forma local el contenido del editor.                                                                                                |
| Guardar Como..     | Permite guardar de forma local el contenido del editor, permintiendo cambiar el nombre y ruta de archivo.                                              |


### Men煤 de Reportes

<center>  <img src="https://i.imgur.com/vq1QiyM.png">   </center>

Cada uno de los reportes ser谩n descritas a continuaci贸n:

| Opci贸n                | Descripci贸n                                                                                           |
| --------------------- | ----------------------------------------------------------------------------------------------------- |
| CST                   | Este reporte mostrara el 谩rbol de an谩lisis concreto que se produjo al analizar el archivo de entrada. |
| Error Report          | Muestra los errores recoloctados durante el proceso de compilaci贸n o interpretaci贸n de la entrada |
| Symbol Table Report   | Mustra los s铆mbolos o variables recoloectados durante el proceso de interpretaci贸n |
| Symbol Table Compiler | Mustra los s铆mbolos o variables recoloectados durante el proceso de compilaci贸n |
| Gramatical Report     | Muestra la gram谩tica con sintaxis BNF. |

## Sintaxis :memo:


### Comentarios <a name="comentarios"></a>

Los comentarios pueden ser:

- De una sola l铆nea (//)

    ```java
        //  Comentario de una sola linea
    ```

- M煤ltiples l铆neas (/* ... */)

    ```java
        /*
            Esto es un
            comentario de
            m煤ltiples l铆neas
        */
    ```

### Tipos <a name="tipos"></a>

Quetzal aceptar谩 distintos tipos entre ellos se aceptar谩n:

+ **Nulo:** Se representa con la palabra reservada `null`, la cual indica que no existe ning煤n valor.
+ **int** Valores num茅ricos enteros. Por ejemplo: `3`, `2`, `-1`, `-100`.
+ **double** Valores n煤mericos con punto flotante. Por ejemplo: `3.1415`, `2.7182`, `0.5`.
+ **boolean** Los valores booleanos 煤nicamente pueden ser `true` o `false`.
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

    Un ejemplo de creaci贸n de struct podr铆a ser:

    ```C
    struct Persona{
        int edad,
        string nombre
    };
    ```

### Expresiones <a name="expresiones"></a>

Quetzal acepta operaciones aritmeticas, relacionales y logicas de la siguiente forma:

+ **AR脥TMETICAS** Entre las operaciones aritmeticas disponibles vamos a encontrar las siguientes:
    - **Suma**: La suma de dos expresiones se define por el s铆mbolo `+` 
    - **Resta:** La resta de dos expresiones y la negaci贸n de una expresi贸n aritmetica se define por el s铆mbolo `-` 
    - **Multiplicaci贸n:** La multiplicaci贸n de dos expresiones se define por el s铆mbolo `*` 
    - **Divisi贸n:** La divisi贸n de dos expresiones se define por el s铆mbolo `/`
    - **Modulo:** El modulo entre dos expresiones se define por el s铆mbolo `%` 
    - **Nativas:** Quetzal posee 6 funciones nativas para la resoluci贸n de expresiones, entre ellas se encuentran:
        1. ***pow:*** Recibe como primer parametro la base y como segundo parametro la potencia a elevar.  Ejemplo: `pow(2,4)`
        2. ***sqrt:***  C谩lcula la ra铆z cuadrara de un n煤mero Ejemplo: `sqrt(4)`
        3. ***sin:*** Resuelve la funci贸n seno del n煤mero que se ingrese Ejemplo: `sin(1)`
        4. ***cos:*** Resuelve la funci贸n coseno del numero que se ingrese. Ejemplo: `cos(1)`
        5. ***tan:*** Resuelve la funci贸n tangente del numero que se ingrese. Ejemplo: `tan(1)`
        6. ***log10:*** Resuelve la funci贸n logaritmo base 10 de la expresi贸n que se ingrese. Ejemplo: `log10(1)`

+ **RELACIONALES:** Entre las operaciones relacionales disponibles vamos a encontrar las siguientes:
    - **Igualdad:** Esta se define por el s铆mbolo `==`
    - **Diferenciaci贸n:** Esta se define por el s铆mbolo `!=`
    - **Mayor que:** Esta se define por el s铆mbolo `>`
    - **Menor que:** Esta se define por el s铆mbolo `<`
    - **Mayor o igual que:** Esta se define por el s铆mbolo `>=`
    - **Menor o igual que:** Esta se define por el s铆mbolo `<=`

+ **L脫GICAS** Entre las operaciones l贸gicas disponibles vamos a encontrar las siguientes:
    - **AND:** Esta se define por el s铆mbolo `&&`
    - **OR:** Esta se define por el s铆mbolo `||`
    - **NOT:** Esta se define por el s铆mbolo `!`

+ **CADENAS**  Entre las operaciones con cadenas (strings) vamos a encontrar las siguientes:
    - **Concatenaci贸n:** La uni贸n de dos cadenas de texto se define por el s铆mbolo `&`
      ```java
      "para" & "caidismo" = "paracaidismo"
      ```
    - **Repetici贸n:** Permite que una cadena de texto se repita cierto n煤mero de veces, esta se define por el s铆mbolo `^`
      ```java
      "Cadena"^3 = "CadenaCadenaCadena"
      ```
    - **Acceso a una pocisi贸n:** El acceso a un elemento de una cadena se define de la siguiente manera: `string.caracterOfPosition(posici贸n)`, el cual devolvera el caracter correspondiente a esa posici贸n
        ```java
        animal = "Tigre";
        println(animal.caracterOfPosition(2)); //g
        ```
    - **Acceso a una porci贸n:** El acceso a una porci贸n de una cadena se define de la siguiente manera: `string.subString(inicial,final)`, el cual devolvera la cadena correspondiente al intervalo definido.
        ```java
        animal = "Tigre";
        println(animal.subString(2,4)); //gre
        ```
    - **Tama帽o de una cadena:** La obtenci贸n del n煤mero de elementos de una cadena se define por la funci贸n `cadena.length()`
        ```java
        animal = "Tigre";
        println(animal.length()); //5
        ```
    - **Cadena en mayusculas:** Una cadena puede ser convertida a mayusculas con la utilizaci贸n de la funci贸n `cadena.toUppercase())`
        ```java
        animal = "Tigre";
        println(animal.toUppercase()); //TIGRE
        ```
    - **Cadena en minusculas:** Una cadena puede ser convertida a mayusculas con la utilizaci贸n de la funci贸n `cadena.toLowercase())`
        ```java
        animal = "Tigre";
        println(animal.toLowercase()); //tigre
        ```

+ **Operador ternario** El operador ternario es utilizado cuando se necesita entre diferentes expresiones a travez de una condici贸n

    ```java
    (EXPRESI脫N RELACIONAL O LOGICA) ? RESULTADO SI ES VERDADERO : RESULTADO SI ES FALSO
    ```
    Ejemplo:
    ```java
    respuesta = edad >= 50 ? "Puede vacunarse" : "No puede vacunarse";

    println(animal == "Perro" ? 15 : 10);
    ```
  
### Instrucciones <a name="instrucciones"></a>

Quetzal cuenta con varias instrucciones para su ejecuci贸n, cada instrucci贸n deber termina con un punto y coma (`;`). Las instrucciones que Quetzal acepta son:

+ **IMPRESI脫N** Quetzal cuenta con 2 distintas instrucciones de imprimir.

    ```java
    print(expresi贸n);        // Esta imprime sin realizar un salto de l铆nea
    println(expresi贸n);      // Esta imprime realizando un salto de l铆nea
    ```

    Para imprimir m谩s de un valor por l铆nea, se puede imprimir una secuencia de valores separados por comas. Tambi茅n dentro de las cadenas se pueden colocar cualquier expresi贸n utilizando el operador `$`. Por ejemplo:

    ```java
    println("+", "-");       // Imprime + -
    print("El resultado de 2 + 2 es $(2 + 2)");  // Imprime El resultado de 2 + 2 es 4
    println("$a $(b[1])"); // Imprime el valor de a y el valor de b[1]
    ```

    Quetzal tambi茅n tiene la opci贸n de imprimir arreglos y struct. Por ejemplo:

    ```java
        a = [0, 1, 2];
        println(a);          // Imprime [0, 1, 2]
        s = Hora(10, 30);
        print(s);           // Imprime Hora(10, 30)
    ```

+ **DECLARACIONES Y ASIGNACIONES** Quetzal permite la declaraci贸n y asignaci贸n de variables, las NO variables pueden cambiar su tipo de dato en cualquier momento

    - **Declaraci贸n:** Quetzal permite declarar variables de dos maneras:
        ```java
            tipo ID = Expresi贸n;
            // 贸
            tipo LISTA_ID;
        ```
        Ejemplo:
        ```java
            int x = (3*5);
            double y = (10/4);
            String str = "Saludo";
            int var1, var2, var3;  // se inicializan con los valores por defecto de java
        ```

    - **Asignaci贸n:** Quetzal permite asignar valores a variables existentes de la siguiente manera:
        ```java
            ID = Expresi贸n;
        ```
        Ejemplo:
        ```java
            var1 = "Adios";
            v = 89 - 9;
        ```

+ **LLAMADA DE FUNCIONES** Para llamar a una funci贸n se realiza de la siguiente manera:

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
        贸
        double.parse("3.13159")
        贸
        boolean.parse("1")
    ```
    - **toInt:** Convierte un n煤mero flotante a un n煤mero entero sin redondearlo
    ```java
        toInt(3.99999)  // retorna 3
    ```
    - **toDouble:** Convierte un n煤mero entero a un n煤mero flotante
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


+ **FUNCIONES** Las funcioens son secuencias de sentencias que ejecuta una operaci贸n que nosotros deseamos. Cuando se crea una funci贸n se especifica su nombre y secuencia de sentencias. Luego, ya se puede llamar a estas usando su nombre y los par谩metros solicitados. Se definen las funciones en Quetzal as铆:

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
        for (declaracion 贸 asignacion; condicion; instruccion) {
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

    + **Copiar un arreglo:** Quetzal permite crear una copia de un arreglo utilizando el s铆mbolo `#`, es 煤til hacer una copia antes de realizar operaciones que las modifiquen.
    
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
    
    + **Length:** La obtenci贸n del tama帽o de un arreglo, se define como:
        
        ```java
        arreglo.length();
        ```
        
        Ejemplo:
        
        ```java
        int[] arr = [1,2,3,4,5,6];
        arr.length(); // 6
        ```

+ **STRUCTS** Quetzal cuenta con tipos compuestos que los desarrolladores podr谩n definir mediante una sintaxis. Para la declaraci贸n de estos se utiliza la siguiente sintaxis:

    ```C
    // Struct
    struct NOMBRE_STRUCT
    {
        LISTA_ATRIBUTOS
    };

    ```

    Y para la creaci贸n de variables con nuestro Struct, ya sea mutable e inmutable:

    ```java
    NOMBRE_STRUCT ID = NOMBRE_STRUCT(LISTA_VALORES);
    ```

    Los atributos de los Struct pueden ser utilizados como parte de cualquier expresi贸n. Para acceder a los atributos de los Struct, se utiliza la notaci贸n `.`.

    ```java
    ID.ID
    ```

    Tambi茅n si nosotros deseamos modificar 煤nicamente uno de los atributos de nuestro Struct, ah铆 es donde entra la importancia de los dos tipos de Struct en Quetzal.

    ```java
    X.atributo = expresi贸n
    ```

    Otros aspectos importantes de los Structs es que estos pueden ser llamados como par谩metros en las funciones y, al igual que los arreglos, se pasan por referencia. Por lo que el valor de los atributos de los Structs tambi茅n cambia. Por ejemplo:

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

    Se debe de tomar en cuenta que los Struct se pueden utilizar como retorno de una funci贸n.

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

