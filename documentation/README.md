> #### Universidad de San Carlos de Guatemala
> #### Facultad de Ingeniería
> #### Escuela de Ciencias y Sistemas

# MANUAL TÉCNICO :computer: 
> ### José Daniel Velásquez Orozco
> #### 201800722
> ### Elian Saúl Estrada Urbina
> #### 201806838



# Especificación Técnica

### Hardware
| Arquitectura |   CPU   | Generación | Memoria RAM |
|:------------:|:-------:|:----------:|:-----------:|
|     x64      | core i3 | mínimo 5ta | mínimo 4 GB |

### Navegadores

| Browser Recomendado | Versión         |
| ------------------- | --------------- |
| Edge                | > 79            |
| Firefox             | > 73            |
| Chromium            | > 96.0.4664.110 |

# Flujo

<!--Aquí iria una imagen del flujo de la aplicación como la que esta en la explicación del proyecto-->

El flujo de la aplicación es el siguiente mostrado en el diagrama: 

![](https://i.imgur.com/hBrEyQ9.png)

1. Se ingresa un código fuente.
2. Se analiza la entrada.
3. Se interpreta y genera la salida esperada por el programa introducido.
4. Se traduce y genera código intermedio (código 3 direcciones) para su posterior ejecución.
5. Se generan los reportes correspondientes.

# Metodología

<!--Aquí va la explicación de la metodología, que sería la implementación del patron interprete como se visualiza y no se que metodología hay usado usted para el C3D también la implementación de git-flow podriamos meter aquí también-->

La metodología utilizada fue la del patrón interprete, descrito en el siguiente diagrama:

![](https://i.imgur.com/Ulqs77U.png)


# Herramientas Utilizadas

<!--Aquí iria el lenguaje, y las demás herramientas que hayamos utilizado para la implementación del proyecto, ejemplo: viz.js, typescript, javascript y otras cosas que hayamos usado jjajaja --> 

#### Lenguaje
> #### typescript / javascript

#### Generador de Scanner y parser
> #### jison

#### Librerias
> #### Viz.js (graficar el CST)
> #### Codemirror (consolas de entrada y salida)

#### Frameworks
> #### Materialize CSS (para el diseño de la página)

#### Maquetado
> #### HTML

#### Controlador de veriones
> #### Git & GitHub

#### Publicación de la página
> #### GitHub Pages

# Diccionario de Clases

<!--Aquí van todas las clases que se han implementado, explicando sus parametros o atributos y los metodos que esta tiene.-->

<table>
    <tr>
        <th colspan="5"> Decripción de las Clases </th>
    </tr>
    <tr>
        <th>Nombre Clase</th>
        <th> Atributos </th>
        <th>Metodos</th>
        <th>Decripción general de la clase.</th>
    </tr>
    <tr>
        <td> 
            Instrucción
        </td>
        <td>
            <ul>
                <li>fila</li>
                <li>columna</li>
            </ul>
        </td>
        <td>
            <ul>
                <li> Constructor </li>
                <ul>
                    <li>fila</li>
                    <li>columna</li>
                </ul>
                <li>interpret</li>
                <ul>
                    <li>tree</li>
                    <li>table</li>
                </ul>
                <li>compile</li>
                <ul>
                    <li>table</li>
                    <li>generator3D</li>
                    <li>tree</li>
                </ul>
                <li>get_node</li>
            </ul>    
        </td>
        <td>
            Clase Abstracta, que generaliza todas las instrucciones y expresiones utilizadas en el interprete.
        </td>
    </tr>
    <tr>
        <td> Value </td>
        <td>
            <ul>
                <li>value</li>
                <li>type</li>
                <li>is_temp</li>
                <li>aux_type</li>
                <li>true_label</li>
                <li>false_label</li>
                <li>size</li>
            </ul>
        </td>
        <td>
            <ul>
                <li>get_type()</li>
            </ul>
        </td>
        <td>
            Clase abstracta para guardar valores y temporales al compilar.
        </td>
    </tr>
    <tr>
        <td> Cst_Node </td>
        <td> <ul>
                <li>childs</li>    
                <li>value</li>
            </ul> 
        </td>
        <td> 
            <ul>
                <li>constructor</li>
                <ul>
                    <li>value</li>
                </ul>
                <li>add_child</li>
                <ul>
                    <li>child</li>
                </ul>
                <li>add_childs_node</li>
                <ul>
                    <li>child</li>
                </ul>
            </ul>
        </td>
        <td> Clase para la creación de nodos para el CST </td>
    </tr>
    <tr>
        <td>Type</td>
        <td>
            <ul>
                <li>type</li>
                <li>Arithmetic_operator</li>
                <li>Relational_operator</li>
                <li>Logical_operator</li>
                <li>String_operator</li>
            </ul>
        </td>
        <td></td>
        <td> Clase que contiene los enumarables, para los tipos y los operadores de las expresiones. </td>
    </tr>
    <tr>
        <td>Exception</td>
        <td>
            <ul>
                <li>type</li>
                <li>description</li>
                <li>row</li>
                <li>column</li>
                <li>environment</li>
            </ul>
        </td>
        <td> 
            <ul>
                <li>constructor</li>
                <ul>
                    <li>type</li>
                    <li>description</li>
                    <li>row</li>
                    <li>column</li>
                    <li>environment</li>
                </ul>
                <li>getter</li>
                <li>toString</li>
            </ul>
        </td>
        <td> Clase que se encarga de agregar Errores de todo tipo, lexico, sintactico y semanticos, guarda la descripción, la fila, la columna y el entorno donde ocurre el error. </td>
    </tr>
    <tr>
        <td>Symbol</td>
        <td>
            <ul>
                <li>id</li>
                <li>type</li>
                <li>value</li>
                <li>environmet</li>
                <li>row</li>
                <li>column</li>
                <li>inHeap</li>
                <li>pos</li>
                <li>label_true</li>
                <li>label_false</li>
                <li>size</li>
            </ul>
        </td>
        <td>
            <ul>
                <li>constructor</li>
                <ul>
                    <li>id</li>
                    <li>type</li>
                    <li>value</li>
                    <li>environmet</li>
                    <li>row</li>
                    <li>column</li>
                    <li>inHeap</li>
                    <li>pos</li>
                    <li>label_true</li>
                    <li>label_false</li>
                    <li>size</li>
                </ul>
                <li>getter</li>
            </ul>
        </td>
        <td>Clase que se encarga de guardar los symbolos que a su vez 
        almacenara la tabla de simbolos, guarda el id, el valor, fila, columna, entorno, y datos que serviran para la posterior compilación.</td>
    </tr>
    <tr>
        <td>Tree</td>
        <td>
            <ul>
                <li>instructions</li>
                <li>errors</li>
                <li>console</li>
                <li>global_table</li>
                <li>function</li>
                <li>symbol_table</li>
                <li>structs</li>
                <li>count</li>
                <li>dot</li>
            </ul>
        </td>
        <td>
            <ul>
                <li>constructor</li>
                <ul>
                    <li>instructions</li>
                </ul>
                <li>update_console</li>
                <ul>
                    <li>input</li>
                    <li>flag</li>
                </ul>
                <li>get_function</li>
                <ul>
                    <li>name</li>
                </ul>
                <li>get_struct</li>
                <ul>
                    <li>id</li>
                </ul>
                <li>get_dot</li>
                <ul>
                    <li>root</li>
                </ul>
                <li>travel_cst</li>
                <ul>
                    <li>id_root</li>
                    <li>node_root</li>
                </ul>
            </ul>
        </td>
        <td> Clase que maneja el árbol en el análisis y guarda funciones y structs. </td>
    </tr>
    <tr>
        <td>SymbolTable</td>
        <td>
            <ul>
                <li>size</li>
                <li>name</li>
                <li>table</li>
                <li>prev</li>
                <li>break_label</li>
                <li>break_label</li>
                <li>continue_label</li>
                <li>return_label</li>
                <li>type</li>
                <li>value_ret</li>
            </ul>
        </td>
        <td>
            <ul>
                <li>constructor</li>
                <ul>
                    <li>prev</li>
                    <li>name</li>
                </ul>
                <li>set_table</li>
                <ul>
                    <li>symbol</li>
                </ul>
                <li>get_table</li>
                <ul>
                    <li>id</li>
                </ul>
                <li>update_table</li>
                <ul>
                    <li>symbol</li>
                </ul>
            </ul>
        </td>
        <td>Clase que maneja todo el control de la tabla de simbolos donde se almacenan todas las variables declaradas, se recuperan y se reasignan.</td>
    </tr>
    <tr>
        <td>Main</td>
        <td>
            <ul>
                <li>tree</li>
                <li>global_table</li>
            </ul>
        </td>
        <td>
            <ul>
                <li>constructor</li>
                <li>lexicalAnalysis</li>
                <ul>
                    <li>bufferStream</li>
                </ul>
                <li>compile</li>
                <ul>
                    <li>bufferStream</li>
                </ul>
            </ul>
        </td>
        <td>Clase que se encarga de ejecutar tanto el interprete, como el compilador, para el inteprete, se encarga de realizar el analis léxico y sintáctico, y obitiene la lista de listas con todas las instrucciones, para luego hacer varias pasadas (4 en total), la primera crea las funciones y structs, las declaraciones tanto de variables como de arreglos y asgnaciones, la 2da pasada, verifica que le metodo main no se repita, la 3ra pasada ejecuta las instrucciones del main y la 4ta reporta las instrucciones que estan fuera del main como errores.</td>
    </tr>
    <tr>
        <td>Index</td>
        <td>
            <ul>
                <li>myCodeMirror</li>
                <li>main</li>
            </ul>
        </td>
        <td>
            <ul>
                <li>codeToAnalyze</li>
                <li>codToCompile</li>
            </ul>
        </td>
        <td> Este archivo, es el que obtine todos los botones para la ejecución y se encarga de escuchar los eventos tanto de mause como de teclado. Se encarga de obtener el texto del primer codemirror para su analisis, y posteriormente actualiza los codemirror correspondientes a la salida.</td>
    </tr>
    <tr>
        <td>grammar.jison</td>
        <td>
            <ul>
                <li>errors</li>
                <li>grammatical</li>
            </ul>
        </td>
        <td>
            <ul>
                <li>clean_errors</li>
                <li>clean_grammatical</li>
            </ul>
        </td>
        <td>Archivo encargado de generar todo el analizador lexico, sintactico y de crear toda la lista de instrucciones para su posterior recorrido en la clase Main</td>
    </tr>
</table>

