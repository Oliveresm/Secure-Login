### Explicación de la Arquitectura del Sistema

Este diagrama UML describe una arquitectura de software multicapa para un sistema de autenticación. Cada capa tiene una responsabilidad clara, lo que promueve un código más limpio, mantenible y escalable.

#### 📦 Capa de Ruteo (Routes)
Es el **punto de entrada** de todas las solicitudes HTTP al sistema.
* **Función**: Su única responsabilidad es recibir las peticiones (`Request`) y dirigirlas al controlador adecuado. No contiene lógica de negocio.
* **Clases**:
    * `AuthRoutes`: Actúa como el enrutador principal que agrupa todas las rutas relacionadas con la autenticación.
    * `RegisterLocalRoutes`, `LoginLocalRoutes`, etc.: Son sub-enrutadores que manejan endpoints específicos (ej: `/register`, `/login`) y llaman al método correspondiente en el controlador.
* **Atributos Protegidos (`#`)**: Los atributos `req` y `res` son protegidos, indicando que son accesibles dentro de la clase y sus subclases, pero no desde fuera, manteniendo un encapsulamiento adecuado.

#### 🕹️ Capa de Controladores (Controllers)
Esta capa actúa como el **intermediario** entre las rutas y la lógica de negocio.
* **Función**: Extrae la información necesaria de la solicitud (`req`), como el cuerpo (body) o los parámetros. Llama a los repositorios para ejecutar la lógica de negocio y, finalmente, formula y envía la respuesta (`res`) al cliente (por ejemplo, un código 200 con un token JWT, o un 401 si las credenciales son inválidas).
* **Clases**: `RegisterLocalController`, `LoginLocalController`, `VerifyAccountController`.

#### 📚 Capa de Repositorios (Repositories)
Esta capa **orquesta la lógica de negocio**. No ejecuta la lógica directamente, sino que coordina a los servicios y funciones de acceso a datos (DAO) para cumplir con una tarea.
* **Función**: Recibe los datos del controlador (ej: email y contraseña) y los utiliza para llamar a diferentes servicios. Por ejemplo, `RegisterLocalRepository` llamará a `HashService` para encriptar la contraseña, a `createUser` para guardar el usuario en la base de datos y a `EmailService` para enviar un correo de verificación.
* **Atributos Privados (`-`)**: Los datos sensibles como `email` y `password` son **privados**. Esto significa que solo pueden ser accedidos y manipulados por los métodos de la propia clase, garantizando un alto nivel de encapsulamiento y seguridad.

#### 🛠️ Capa de Servicios (Services)
Contiene la **lógica de negocio pura y reutilizable**.
* **Función**: Cada servicio tiene una única responsabilidad bien definida (Principio de Responsabilidad Única). Son componentes aislados y fácilmente testeables.
* **Clases**:
    * `HashService`: Se encarga de todo lo relacionado con criptografía, como hashear contraseñas y compararlas.
    * `EmailService`: Gestiona el envío de correos electrónicos.
    * `UserLookupService`: Proporciona métodos para buscar usuarios en la base de datos.

#### 🗄️ Capa de Funciones de Acceso a Datos (DAO)
Es la capa más baja y la única que **interactúa directamente con la base de datos**.
* **Función**: Contiene las funciones que ejecutan las consultas SQL (o de cualquier motor de BD) para crear, leer, actualizar o eliminar registros. Por ejemplo, la clase `createUser` contiene la lógica para ejecutar un `INSERT INTO` en la tabla `User`.

#### ⚙️ Configuración (Config)
Gestiona la configuración global de la aplicación.
* **Función**: En este caso, la clase `DB` maneja la conexión a la base de datos utilizando un patrón **Singleton**, que asegura que solo exista una única instancia de la conexión en toda la aplicación, optimizando recursos.

#### 📊 Esquema de la Base de Datos (Database Schema)
Representa la **estructura de las tablas** en la base de datos.
* **Función**: Sirve como una referencia visual de cómo se almacenan los datos, incluyendo las tablas (`User`, `RefreshToken`), sus columnas y las relaciones entre ellas.

---
### 🤔 ¿Por qué `public`, `protected` y `private`? (Visibilidad)

La visibilidad (`+`, `#`, `-`) define qué tan accesible es un atributo o método desde otras partes del código. Elegir la correcta es clave para un diseño seguro y robusto.

* **Privado (`-`)**: Es el nivel **más restrictivo**. Un miembro privado solo puede ser accedido desde **dentro de la misma clase**.
    * **¿Por qué se usa aquí?**: En los `Repositories`, los atributos como `email` y `password` son privados. Esto es fundamental para la **encapsulación** y la **seguridad**. Ninguna otra clase puede leer o modificar directamente la contraseña de un usuario. La única forma de interactuar con esos datos es a través de los métodos públicos de la clase (como `registerLocalUser()`), que contienen la lógica controlada para manejarlos de forma segura.

* **Protegido (`#`)**: Es un nivel **intermedio**. Un miembro protegido puede ser accedido desde **dentro de la misma clase y por cualquier clase que herede de ella (subclases)**.
    * **¿Por qué se usa aquí?**: Los atributos `req` (Request) y `res` (Response) en las capas de `Routes` y `Controllers` son protegidos. Esto sugiere un diseño donde podría existir una clase base (ej. `BaseController`) que defina estos atributos, y las clases específicas (`RegisterLocalController`) hereden de ella para reutilizar esa funcionalidad. Los mantiene ocultos para el resto de la aplicación, pero disponibles para su jerarquía de herencia.

* **Público (`+`)**: Es el nivel **más permisivo**. Un miembro público puede ser accedido desde **cualquier parte del código**.
    * **¿Por qué se usa aquí?**: Los métodos como `handleLocalRegister()` en un controlador o `registerLocalUser()` en un repositorio son públicos. Estos métodos forman la **"API pública"** de la clase; son los puntos de entrada diseñados intencionadamente para que otras clases los llamen y puedan interactuar con el objeto. Son las "puertas" de comunicación entre las distintas capas.

---
### 🔗 Relaciones y Flujos entre Clases

Las flechas y líneas en el diagrama no son decorativas; definen cómo interactúan las clases y cómo fluye la información.

* **Dependencia (`..>` y `-->`)**: La flecha punteada o sólida con punta abierta indica que una clase **usa** a otra. La clase de origen necesita una instancia de la clase de destino para poder funcionar. Esto define el flujo de control de la aplicación.
    * **Ejemplo de Flujo (Registro)**:
        1.  `AuthRoutes --> RegisterLocalRoutes`: El enrutador principal delega la petición de registro al enrutador específico.
        2.  `RegisterLocalRoutes ..> RegisterLocalController`: El enrutador de registro llama al método `handleLocalRegister` del controlador.
        3.  `RegisterLocalController ..> RegisterLocalRepository`: El controlador le pasa los datos de registro (email, password) al repositorio para que orqueste la operación.
        4.  `RegisterLocalRepository ..> HashService`, `EmailService`, `createUser`: El repositorio **usa** múltiples servicios y DAOs para cumplir su tarea: hashear la contraseña, crear el usuario en la BD y enviar el email.

* **Asociación (`--`)**: La línea sólida sin flecha entre `User` y `RefreshToken` indica una **relación estructural** a largo plazo.
    * **Significado**: Un objeto `User` está conectado o "asociado" con objetos `RefreshToken`. La multiplicidad (`1` y `0..*`) especifica que **un** `User` puede tener **cero o muchos** `RefreshToken`. Esto se traduce directamente en una relación de clave primaria y foránea en la base de datos.