# Proyecto: Sistema de Autenticación

---

## Integrantes del Equipo
* ALEJANDRO JUNCAL PONCE
* ARLETH MISUKI ORTIZ ROQUE
* SAMANTHA DE LA MORA LòPEZ
* DIEGO ARIAS TIRADO
* OLIVER ENRIQUE SUÁREZ MORA
* DANIEL ALEJANDRO ALVAREZ MATA

---

## Descripción del Proyecto
Este proyecto implementa el núcleo de un sistema de autenticación seguro y modular. La arquitectura se centra en tres endpoints clave: registro de nuevos usuarios, inicio de sesión local (email y contraseña) y verificación de la cuenta, demostrando un flujo de trabajo completo y escalable.

---

## Diagrama de Clases (PlantUML)

```plantuml
@startuml
' Título del Diagrama
title Arquitectura Final del Sistema de Autenticación

' --- Estilo y Configuración ---
skinparam classAttributeIconSize 0
skinparam linetype ortho
skinparam package {
  BackgroundColor LightBlue
  BorderColor Blue
}
' --- Espaciado Aumentado ---
skinparam nodesep 150 
skinparam ranksep 200
' ----------------------------------

' --- Capa de Ruteo (Punto de Entrada) ---
package "Routes" {
  class AuthRoutes <<Router>> {
    + req: Request
    + res: Response
    --
    + registerLocalRoutes()
    + loginLocalRoutes()
    + verifyAccountRoutes()
  }
  class RegisterLocalRoutes <<Router>> {
    + req: Request
    + res: Response
    --
    + handleLocalRegister()
  }
  class LoginLocalRoutes <<Router>> {
    + req: Request
    + res: Response
    --
    + handleLoginLocal()
  }
  class VerifyAccountRoutes <<Router>> {
    + req: Request
    + res: Response
    --
    + handleVerifyAccount()
  }
}

' --- Capa de Controladores (Lógica de Petición/Respuesta) ---
package "Controllers" {
  class RegisterLocalController <<Controller>> {
   + req: Request
   + res: Response
   --
   + handleLocalRegister(): Promise<void>
  }
  class LoginLocalController <<Controller>> {
    + req: Request
    + res: Response
    --
    + handleLocalLogin(): Promise<void>
  }
  class VerifyAccountController <<Controller>> {
   + req: Request
   + res: Response
   --
   + handleVerifyAccount(): Promise<void>
  }
}

' --- Capa de Repositorios (Orquestación de Lógica) ---
package "Repositories" {
  class RegisterLocalRepository <<Repository>> {
    - email: string
    - display_name: string
    - password: string
    --
    + registerLocalUser(): Promise<void>
  }
  class LoginLocalRepository <<Repository>> {
    - email: string
    - password: string
    --
    + login(): Promise<{accessToken, refreshToken}>
  }
}

' --- Capa de Servicios (Lógica de Negocio Aislada) ---
package "Services" {
  class HashService <<Service>> {
    + hash(value: string): Promise<string>
    + compare(plain: string, hashed: string): Promise<boolean>
    + generateToken(): Promise<string>
  }
  class EmailService <<Service>> {
    + sendVerificationEmail(to: string, token: string): Promise<void>
    + sendPasswordRecoveryEmail(to: string, token: string): Promise<void>
  }
  class UserLookupService <<Service>> {
    + getUserByEmail(email: string): Promise<User | null>
  }
}

' --- Capa de Funciones de Acceso a Datos (DAO) ---
package "Data Access Functions" {
    interface ICreateUser {
        # email: string
        # display_name: string
        # auth_type: 'local' | 'oauth'
        # auth_hash: string | null
        # out_hash: string | null
    }
    class "create-user.model" as CreateUserModel <<DAO>> {
        --
        + execute(): Promise<void>
    }
    CreateUserModel ..|> ICreateUser
}

' --- Configuración (Conexión a BD) ---
package "Config" {
  class DB <<Singleton>> {
   - instance: mysql.Connection
   + {static} getInstance(): Promise<Connection>
  }
}

' --- Esquema de la Base de Datos (Representación) ---
package "Database Schema" {
  class User <<Table>> {
    - id: CHAR(36)
    - email: VARCHAR(255)
    - display_name: VARCHAR(100)
    - auth_type: ENUM
    - auth_hash: VARCHAR(255)
    - is_verified: BOOLEAN
    - created_at: DATETIME
  }
  class RefreshToken <<Table>> {
    - id: CHAR(36)
    - user_id: CHAR(36)
    - token: VARCHAR(255)
    - expires_at: DATETIME
  }
  enum AuthType <<Enum>> {
    LOCAL
    OAUTH
  }
 
  User "1" -- "0..*" RefreshToken
  User ..> AuthType
}

' --- RELACIONES Y FLUJOS DE LA APLICACIÓN ---

' --- Conexión Principal a la Base de Datos ---
DB ..> User

' --- Flujo de Registro ---
AuthRoutes --> RegisterLocalRoutes
RegisterLocalRoutes ..> RegisterLocalController
RegisterLocalController ..> RegisterLocalRepository
RegisterLocalRepository ..> CreateUserModel
RegisterLocalRepository ..> EmailService
RegisterLocalRepository ..> HashService
CreateUserModel ..> DB


' --- Flujo de Login ---
AuthRoutes --> LoginLocalRoutes
LoginLocalRoutes ..> LoginLocalController
LoginLocalController ..> LoginLocalRepository
LoginLocalRepository ..> UserLookupService
LoginLocalRepository ..> HashService
LoginLocalRepository ..> DB
UserLookupService ..> DB

' --- Flujo de Verificación de Cuenta ---
AuthRoutes --> VerifyAccountRoutes
VerifyAccountRoutes ..> VerifyAccountController
VerifyAccountController ..> HashService
VerifyAccountController ..> DB
@enduml
```
### Explicación del Diagrama de Arquitectura

Este diagrama UML describe una arquitectura de software multicapa para un sistema de autenticación. Cada capa tiene una responsabilidad clara, lo que promueve un código más limpio, mantenible y escalable.

#### Capa de Ruteo (Routes)
Es el **punto de entrada** de todas las solicitudes HTTP al sistema.
* **Función**: Su única responsabilidad es recibir las peticiones (`Request`) y dirigirlas al controlador adecuado. No contiene lógica de negocio.
* **Clases**:
    * `AuthRoutes`: Actúa como el enrutador principal que agrupa todas las rutas relacionadas con la autenticación.
    * `RegisterLocalRoutes`, `LoginLocalRoutes`, `verifyAccountRoutes`,etc.: Son sub-enrutadores que manejan endpoints específicos (ej: `/register`, `/login`) y llaman al método correspondiente en el controlador.
* **Atributos Publicos (`#`)**: Los atributos `req` y `res` son publicos, indicando que son accesibles desde afuera

#### Capa de Controladores (Controllers)
Esta capa actúa como el **intermediario** entre las rutas y la lógica de negocio.
* **Función**: Extrae la información necesaria de la solicitud (`req`), como el cuerpo (body) o los parámetros. Llama a los repositorios para ejecutar la lógica de negocio y, finalmente, formula y envía la respuesta (`res`) al cliente (por ejemplo, un código 200 con un token JWT, o un 401 si las credenciales son inválidas).
* **Clases**: `RegisterLocalController`, `LoginLocalController`, `VerifyAccountController`.

#### Capa de Repositorios (Repositories)
Esta capa **orquesta la lógica de negocio**. No ejecuta la lógica directamente, sino que coordina a los servicios y funciones de acceso a datos (DAO) para cumplir con una tarea.
* **Función**: Recibe los datos del controlador (ej: email y contraseña) y los utiliza para llamar a diferentes servicios. Por ejemplo, `RegisterLocalRepository` llamará a `HashService` para encriptar la contraseña, a `"create-user.model"` para guardar el usuario en la base de datos y a `EmailService` para enviar un correo de verificación.
* **Atributos Privados (`-`)**: Los datos sensibles como `email` y `password` son **privados**. Esto significa que solo pueden ser accedidos y manipulados por los métodos de la propia clase, garantizando un alto nivel de encapsulamiento y seguridad.

#### Capa de Servicios (Services)
Contiene la **lógica de negocio pura y reutilizable**.
* **Función**: Cada servicio tiene una única responsabilidad bien definida (Principio de Responsabilidad Única). Son componentes aislados y fácilmente testeables.
* **Clases**:
    * `HashService`: Se encarga de todo lo relacionado con criptografía, como hashear contraseñas y compararlas.
    * `EmailService`: Gestiona el envío de correos electrónicos.
    * `UserLookupService`: Proporciona métodos para buscar usuarios en la base de datos.

#### Capa de Funciones de Acceso a Datos (DAO)
Es la capa más baja y la única que **interactúa directamente con la base de datos**.
* **Función**: Contiene las funciones que ejecutan las consultas SQL. Por ejemplo, la clase `"create-user.model"` implementa la interfaz `ICreateUser` para definir los datos que necesita y contiene la lógica para ejecutar un `INSERT INTO` en la tabla `User`. Este uso de interfaces asegura que los datos que recibe el DAO siempre tengan una estructura consistente.

#### Configuración (Config)
Gestiona la configuración global de la aplicación.
* **Función**: En este caso, la clase `DB` maneja la conexión a la base de datos utilizando un patrón **Singleton**, que asegura que solo exista una única instancia de la conexión en toda la aplicación, optimizando recursos.

#### Esquema de la Base de Datos (Database Schema)
Representa la **estructura de las tablas** en la base de datos.
* **Función**: Sirve como una referencia visual de cómo se almacenan los datos, incluyendo las tablas (`User`, `RefreshToken`), sus columnas y las relaciones entre ellas.

---
### Relaciones y Flujos entre Clases

Las flechas y líneas en el diagrama no son decorativas; definen cómo interactúan las clases y cómo fluye la información.

* **Dependencia (`..>` y `-->`)**: La flecha punteada o sólida con punta abierta indica que una clase **usa** a otra. La clase de origen necesita una instancia de la clase de destino para poder funcionar. Esto define el flujo de control de la aplicación.
    * **Ejemplo de Flujo (Registro)**:
        1.  `AuthRoutes --> RegisterLocalRoutes`: El enrutador principal delega la petición de registro al enrutador específico.
        2.  `RegisterLocalRoutes ..> RegisterLocalController`: El enrutador de registro llama al método `handleLocalRegister` del controlador.
        3.  `RegisterLocalController ..> RegisterLocalRepository`: El controlador le pasa los datos de registro (email, password) al repositorio para que orqueste la operación.
        4.  `RegisterLocalRepository ..> HashService`, `EmailService`, `"create-user.model"`: El repositorio **usa** múltiples servicios y DAOs para cumplir su tarea: hashear la contraseña, crear el usuario en la BD y enviar el email.

* **Asociación (`--`)**: La línea sólida sin flecha entre `User` y `RefreshToken` indica una **relación estructural** a largo plazo.
    * **Significado**: Un objeto `User` está conectado o "asociado" con objetos `RefreshToken`. La multiplicidad (`1` y `0..*`) especifica que **un** `User` puede tener **cero o muchos** `RefreshToken`. Esto se traduce directamente en una relación de clave primaria y foránea en la base de datos.
    
* **Implementación (`..|>`)**: La flecha punteada con un triángulo hueco, como la que va de `"create-user.model"` a `ICreateUser`, indica que una clase **implementa** una interfaz. Esto significa que la clase se compromete a proporcionar una implementación concreta para todos los miembros definidos en la interfaz, asegurando un "contrato" de estructura y funcionalidad.